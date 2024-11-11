import { useEffect, useState } from "react";

import * as S from "./style";
import Header from "../../components/organisms/Header";
import BasicButton from "../../components/atoms/BasicButton";
import LoadingScreen from "../../components/organisms/LoadingScreen";

const CONFIRMATION_PHRASE = "delete my account";

interface Profile {
  email: string;
  nickname: string;
}

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
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
  };

  const handleUpdateProfile = () => {
    // TODO: 회원 정보 변경 API 연동
  };

  // === update password ===
  const handleChangePasswordInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (name === "oldPassword") {
      setPassword({ ...password, oldPassword: value });
    } else if (name === "newPassword") {
      setPassword({ ...password, newPassword: value });
    } else if (name === "confirmNewPassword") {
      setPassword({ ...password, confirmNewPassword: value });
    } else {
      return;
    }
  };

  const handleUpdatePassword = () => {
    // TODO: 비밀번호 변경 API 연동
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

  const handleDeleteAccount = () => {
    // TODO: 회원 탈퇴 API 연동
  };

  useEffect(() => {
    const fetchData = async () => {
      // TODO: 사용자 조회 API 연동
      const user: { id: string; email: string; nickname: string } =
        await new Promise((resolve) =>
          resolve({
            id: "test",
            email: "test@email.com",
            nickname: "test_nickname",
          })
        );
      setProfile({ email: user.email, nickname: user.nickname });
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <S.Wrapper>
      <Header title="Edit Profile" description="Edit your information." />
      <S.ScrollableWrapper>
        <S.Container>
          <S.SubTitle>Profile</S.SubTitle>
          <S.Input
            type="text"
            name="profileEmail"
            value={profile.email}
            disabled
          />
          <S.Input
            type="text"
            name="nickname"
            placeholder="Nickname"
            value={profile.nickname}
            onChange={handleChangeProfileInput}
          />
          <S.ButtonWrapper>
            <BasicButton
              label="Update profile"
              size="small"
              type="confirm"
              onClick={handleUpdateProfile}
            />
          </S.ButtonWrapper>
        </S.Container>
        <S.Container>
          <S.SubTitle>Password</S.SubTitle>
          {!hidden.updatePassword && (
            <>
              <S.Input
                type="password"
                name="oldPassword"
                placeholder="Old password"
                value={password.oldPassword}
                onChange={handleChangePasswordInput}
              />
              <S.Input
                type="password"
                name="newPassword"
                placeholder="New password"
                value={password.newPassword}
                onChange={handleChangePasswordInput}
              />
              <S.Input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm new password"
                value={password.confirmNewPassword}
                onChange={handleChangePasswordInput}
              />
            </>
          )}
          <S.ButtonWrapper>
            <BasicButton
              label={hidden.updatePassword ? "Show" : "Hide"}
              size="small"
              type={hidden.updatePassword ? "confirm" : "cancel"}
              onClick={() =>
                setHidden({ ...hidden, updatePassword: !hidden.updatePassword })
              }
            />
            {!hidden.updatePassword && (
              <BasicButton
                label="Update password"
                size="small"
                type="confirm"
                onClick={handleUpdatePassword}
              />
            )}
          </S.ButtonWrapper>
        </S.Container>
        <S.Container>
          <S.SubTitle className="delete-account">Delete Account</S.SubTitle>
          <p>
            <span>Warning: Deleting your account is permanent. </span>Once your
            account is deleted, all your data will be lost and cannot be
            recovered. Please make sure you want to proceed before taking this
            action.
          </p>
          {!hidden.deleteAccount && (
            <>
              <p>
                <span>Are you sure you want to delete your account?</span>
              </p>
              <p>Your email : </p>
              <S.Input
                type="text"
                name="deleteAccountEmail"
                value={deleteAccount.email}
                placeholder="Email"
                onChange={handleDeleteAccountInput}
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
              />
            </>
          )}
          <S.ButtonWrapper>
            <BasicButton
              label={hidden.deleteAccount ? "Show" : "Hide"}
              size="small"
              type={hidden.deleteAccount ? "danger" : "cancel"}
              onClick={() =>
                setHidden({ ...hidden, deleteAccount: !hidden.deleteAccount })
              }
            />
            {!hidden.deleteAccount && (
              <BasicButton
                label="Delete your account"
                size="small"
                type="danger"
                onClick={handleDeleteAccount}
              />
            )}
          </S.ButtonWrapper>
        </S.Container>
      </S.ScrollableWrapper>
    </S.Wrapper>
  );
};

export default ProfilePage;
