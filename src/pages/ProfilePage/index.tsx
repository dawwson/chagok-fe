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
        nickname:
          value.length < 2
            ? "Your nickname must be at least 2 characters long."
            : "",
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
        message: "Your profile has been successfully updated.",
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
            : "The new password and confirmation password do not match.",
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
          "Your account has been successfully deleted.\nThank you for using our service! 👋",
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
        <Header title="Edit Profile" description="Edit your information." />
        <S.ScrollableWrapper>
          {/* ⭐️ Profile ⭐️ */}
          <S.Container>
            <S.SubTitle>Profile</S.SubTitle>
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
                placeholder="Nickname"
                value={profile.nickname}
                onChange={handleChangeProfileInput}
                $error={!!errors.profile.nickname}
              />
              <S.ErrorText>{errors.profile.nickname}</S.ErrorText>
            </S.InputWrapper>
            <S.ButtonWrapper>
              <BasicButton
                label="Update profile"
                size="small"
                type="confirm"
                onClick={handleUpdateProfile}
                disabled={profile.nickname.length < 2}
              />
            </S.ButtonWrapper>
          </S.Container>
          {/* ⭐️ Password ⭐️ */}
          <S.Container>
            <S.SubTitle>Password</S.SubTitle>
            {!hidden.updatePassword && (
              <>
                <S.InputWrapper>
                  <S.Input
                    type="password"
                    name="oldPassword"
                    placeholder="Old password"
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
                    placeholder="New password"
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
                    placeholder="Confirm new password"
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
                label={hidden.updatePassword ? "Show" : "Hide"}
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
                  label="Update password"
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
            <S.SubTitle className="delete-account">Delete Account</S.SubTitle>
            <p>
              <span>Warning: Deleting your account is permanent. </span>Once
              your account is deleted, all your data will be lost and cannot be
              recovered. Please make sure you want to proceed before taking this
              action.
            </p>
            {!hidden.deleteAccount && (
              <>
                <p>
                  <span>Are you sure you want to delete your account?</span>
                </p>
                <p>Your email: </p>
                <S.Input
                  type="text"
                  name="deleteAccountEmail"
                  value={deleteAccount.email}
                  placeholder="Email"
                  onChange={handleDeleteAccountInput}
                  $error={!!errors.deleteAccount.email}
                />
                <p>
                  To verify, type{" "}
                  <span>
                    <i>"{CONFIRMATION_PHRASE}"</i>
                  </span>{" "}
                  below:
                </p>
                <S.Input
                  type="text"
                  name="confirmationPhrase"
                  value={deleteAccount.phrase}
                  placeholder="Confirmation phrase"
                  onChange={handleDeleteAccountInput}
                  $error={!!errors.deleteAccount.email}
                />
                {errors.deleteAccount.phrase && (
                  <S.ErrorText>{errors.deleteAccount.phrase}</S.ErrorText>
                )}
              </>
            )}
            <S.ButtonWrapper>
              <BasicButton
                label={hidden.deleteAccount ? "Show" : "Hide"}
                size="small"
                type={hidden.deleteAccount ? "danger" : "default"}
                onClick={() =>
                  setHidden({ ...hidden, deleteAccount: !hidden.deleteAccount })
                }
              />
              {!hidden.deleteAccount && (
                <BasicButton
                  label="Delete your account"
                  size="small"
                  type="danger"
                  onClick={() =>
                    setWarningModal({
                      isOpen: true,
                      message:
                        "Your account will be retained for 7 days before permanent deletion. If you wish to recover it, please act within this period.",
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
              label: "OK",
              location: "center",
              onClick: successModal.onClose,
            },
          ]}
        >
          <p style={{ lineHeight: "1.5" }}>{successModal.message}</p>
        </Modal>
      )}
      {warningModal.isOpen && (
        <Modal
          type="warn"
          buttons={[
            {
              label: "Cancel",
              location: "left",
              onClick: () => setWarningModal({ isOpen: false, message: "" }),
            },
            {
              label: "Proceed",
              location: "right",
              onClick: handleDeleteAccount,
            },
          ]}
        >
          <p style={{ lineHeight: "1.5" }}>{warningModal.message}</p>
        </Modal>
      )}
    </>
  );
};

export default ProfilePage;
