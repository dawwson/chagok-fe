import { useEffect, useState } from "react";

import * as S from "./style";
import Header from "../../components/organisms/Header";
import BasicButton from "../../components/atoms/BasicButton";
import { deleteUser } from "../../apis/auth";
import {
  getUser,
  updateUserPassword,
  updateUserProfile,
} from "../../apis/user";
import { useAuth } from "../../contexts/auth";
import Modal from "../../components/organisms/Modal";
import { useError } from "../../contexts/error";
import { ApiError } from "../../types/errorTypes";

const CONFIRMATION_PHRASE = "delete my account";

interface Profile {
  email: string;
  nickname: string;
}

const ProfilePage = () => {
  const { authenticate, deauthenticate } = useAuth();
  const { handleApiError } = useError();
  const [successModal, setSuccessModal] = useState({
    isOpen: false,
    message: "",
    onClose: () => {},
  });
  const [warningModal, setWarningModal] = useState({
    isOpen: false,
    message: "",
  });
  const [hidden, setHidden] = useState({
    updatePassword: true,
    deleteAccount: true,
  });
  const [profile, setProfile] = useState<Profile>({
    email: "",
    nickname: "",
  });
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [deleteAccount, setDeleteAccount] = useState({
    email: "",
    phrase: "",
  });
  const [errors, setErrors] = useState({
    profile: {
      email: "",
      nickname: "",
    },
    password: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    deleteAccount: {
      email: "",
      phrase: "",
    },
  });

  // === profile ===
  const handleChangeProfileInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (name === "nickname") {
      setProfile({ ...profile, nickname: value });
    } else {
      return;
    }
    // TODO: 비밀번호 규칙 설정

    setErrors({
      ...errors,
      profile: {
        ...errors.profile,
        nickname: value.length < 2 ? "닉네임은 2글자 이상이어야 합니다." : "",
      },
    });
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = await updateUserProfile({
        nickname: profile.nickname,
      });
      setSuccessModal({
        isOpen: true,
        message: "프로필이 정상적으로 수정되었습니다.",
        onClose: () =>
          setSuccessModal({ isOpen: false, message: "", onClose: () => {} }),
      });
      authenticate({ id: updatedUser.id, nickname: updatedUser.nickname });
    } catch (error) {
      if (error instanceof ApiError) {
        handleApiError(error);
      }
    }
  };

  // === update password ===
  const handleChangePasswordInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    let isMatched = false;

    if (name === "oldPassword") {
      setPassword({ ...password, oldPassword: value });
    } else if (name === "newPassword") {
      setPassword({ ...password, newPassword: value });
      isMatched = value === password.confirmNewPassword;
    } else if (name === "confirmNewPassword") {
      setPassword({ ...password, confirmNewPassword: value });
      isMatched = value === password.newPassword;
    } else {
      return;
    }

    if (name === "newPassword" || name === "confirmNewPassword") {
      setErrors({
        ...errors,
        password: {
          ...errors.password,
          confirmNewPassword: isMatched
            ? ""
            : "새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
        },
      });
    }
  };

  const handleUpdatePassword = async () => {
    const { oldPassword, newPassword, confirmNewPassword } = password;

    if (oldPassword === "" || newPassword === "" || confirmNewPassword === "") {
      return;
    }

    if (newPassword !== confirmNewPassword) {
      return;
    }

    try {
      await updateUserPassword(password.oldPassword, password.newPassword);
      setSuccessModal({
        isOpen: true,
        message: "Your password has been successfully changed.",
        onClose: () =>
          setSuccessModal({ isOpen: false, message: "", onClose: () => {} }),
      });
      setPassword({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        handleApiError(error);
      }
    }
  };

  // === delete account ===
  const handleDeleteAccountInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (name === "deleteAccountEmail") {
      setDeleteAccount({ ...deleteAccount, email: value });
    } else if (name === "confirmationPhrase") {
      setDeleteAccount({ ...deleteAccount, phrase: value });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(deleteAccount.email);

      setWarningModal({ isOpen: false, message: "" });
      setSuccessModal({
        isOpen: true,
        message:
          "계정이 정상적으로 삭제되었습니다.\n그동안 서비스를 이용해 주셔서 감사합니다!👋",
        onClose: () => deauthenticate(),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        handleApiError(error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();
      setProfile({ email: user.email, nickname: user.nickname });
    };

    fetchData();
  }, []);

  return (
    <>
      <S.Wrapper>
        <Header title="계정 관리" description="내 정보를 수정할 수 있습니다." />
        <S.ScrollableWrapper>
          {/* ⭐️ Profile ⭐️ */}
          <S.Container>
            <S.SubTitle>기본 정보</S.SubTitle>
            <S.InputWrapper>
              <S.Input
                type="text"
                name="profileEmail"
                value={profile.email}
                disabled
                $error={!!errors.profile.email}
              />
              <S.ErrorText>{errors.profile.email}</S.ErrorText>
            </S.InputWrapper>
            <S.InputWrapper>
              <S.Input
                type="text"
                name="nickname"
                placeholder="닉네임"
                value={profile.nickname}
                onChange={handleChangeProfileInput}
                $error={!!errors.profile.nickname}
              />
              <S.ErrorText>{errors.profile.nickname}</S.ErrorText>
            </S.InputWrapper>
            <S.ButtonWrapper>
              <BasicButton
                label="프로필 변경하기"
                size="small"
                type="confirm"
                onClick={handleUpdateProfile}
                disabled={profile.nickname.length < 2}
              />
            </S.ButtonWrapper>
          </S.Container>
          {/* ⭐️ Password ⭐️ */}
          <S.Container>
            <S.SubTitle>비밀번호</S.SubTitle>
            {!hidden.updatePassword && (
              <>
                <S.InputWrapper>
                  <S.Input
                    type="password"
                    name="oldPassword"
                    placeholder="현재 비밀번호"
                    value={password.oldPassword}
                    onChange={handleChangePasswordInput}
                    $error={!!errors.password.oldPassword}
                  />

                  <S.ErrorText>{errors.password.oldPassword}</S.ErrorText>
                </S.InputWrapper>
                <S.InputWrapper>
                  <S.Input
                    type="password"
                    name="newPassword"
                    placeholder="새로운 비밀번호"
                    value={password.newPassword}
                    onChange={handleChangePasswordInput}
                    $error={!!errors.password.newPassword}
                  />

                  <S.ErrorText>{errors.password.newPassword}</S.ErrorText>
                </S.InputWrapper>
                <S.InputWrapper>
                  <S.Input
                    type="password"
                    name="confirmNewPassword"
                    placeholder="새로운 비밀번호 확인"
                    value={password.confirmNewPassword}
                    onChange={handleChangePasswordInput}
                    $error={!!errors.password.confirmNewPassword}
                  />

                  <S.ErrorText>
                    {errors.password.confirmNewPassword}
                  </S.ErrorText>
                </S.InputWrapper>
              </>
            )}
            <S.ButtonWrapper>
              <BasicButton
                label={hidden.updatePassword ? "펼치기" : "접기"}
                size="small"
                type={hidden.updatePassword ? "confirm" : "default"}
                onClick={() =>
                  setHidden({
                    ...hidden,
                    updatePassword: !hidden.updatePassword,
                  })
                }
              />
              {!hidden.updatePassword && (
                <BasicButton
                  label="비밀번호 변경하기"
                  size="small"
                  type="confirm"
                  disabled={
                    password.oldPassword === "" ||
                    password.newPassword === "" ||
                    password.confirmNewPassword === "" ||
                    password.newPassword !== password.confirmNewPassword
                  }
                  onClick={handleUpdatePassword}
                />
              )}
            </S.ButtonWrapper>
          </S.Container>
          {/* ⭐️ Delete Account ⭐️ */}
          <S.Container>
            <S.SubTitle className="delete-account">회원 탈퇴</S.SubTitle>
            <p>
              <span>
                ⚠️ 경고: 모든 데이터가 영구적으로 삭제됩니다. 계정을 삭제하면
                복구할 수 없습니다. 신중하게 결정해 주세요.
              </span>
            </p>
            {!hidden.deleteAccount && (
              <>
                <p>이메일을 입력해주세요 : </p>
                <S.Input
                  type="text"
                  name="deleteAccountEmail"
                  value={deleteAccount.email}
                  placeholder="이메일"
                  onChange={handleDeleteAccountInput}
                  $error={!!errors.deleteAccount.email}
                />
                <p>
                  <span>
                    확인을 위해, 아래에
                    <i>"{CONFIRMATION_PHRASE}"</i>를 입력해 주세요 :
                  </span>
                </p>
                <S.Input
                  type="text"
                  name="confirmationPhrase"
                  value={deleteAccount.phrase}
                  placeholder="확인문구"
                  onChange={handleDeleteAccountInput}
                  $error={!!errors.deleteAccount.email}
                />
                {errors.deleteAccount.phrase && (
                  <S.ErrorText>{errors.deleteAccount.phrase}</S.ErrorText>
                )}
                <p>정말로 진행하시겠습니까?</p>
              </>
            )}
            <S.ButtonWrapper>
              <BasicButton
                label={hidden.deleteAccount ? "펼치기" : "접기"}
                size="small"
                type={hidden.deleteAccount ? "danger" : "default"}
                onClick={() =>
                  setHidden({ ...hidden, deleteAccount: !hidden.deleteAccount })
                }
              />
              {!hidden.deleteAccount && (
                <BasicButton
                  label="탈퇴하기"
                  size="small"
                  type="danger"
                  onClick={() =>
                    setWarningModal({
                      isOpen: true,
                      message:
                        "계정은 영구 삭제 전까지 7일 동안 보관됩니다.\n복구를 원하신다면 이 기간 내에\n관리자에게 이메일로 문의해주세요.",
                    })
                  }
                  disabled={
                    deleteAccount.email === "" ||
                    deleteAccount.phrase !== CONFIRMATION_PHRASE
                  }
                />
              )}
            </S.ButtonWrapper>
          </S.Container>
        </S.ScrollableWrapper>
      </S.Wrapper>
      {successModal.isOpen && (
        <Modal
          type="success"
          buttons={[
            {
              label: "확인",
              location: "center",
              onClick: successModal.onClose,
            },
          ]}
        >
          <p style={{ lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
            {successModal.message}
          </p>
        </Modal>
      )}
      {warningModal.isOpen && (
        <Modal
          type="warn"
          buttons={[
            {
              label: "닫기",
              location: "left",
              onClick: () => setWarningModal({ isOpen: false, message: "" }),
            },
            {
              label: "탈퇴 진행하기",
              location: "right",
              onClick: handleDeleteAccount,
            },
          ]}
        >
          <p style={{ lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
            {warningModal.message}
          </p>
        </Modal>
      )}
    </>
  );
};

export default ProfilePage;
