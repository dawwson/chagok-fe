import { useEffect, useState } from "react";
import { styled } from "styled-components";

import Header from "../../components/organisms/Header";
import BasicButton from "../../components/atoms/BasicButton";
import LoadingScreen from "../../components/organisms/LoadingScreen";

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

  // === profile ===
  const handleChangeProfileInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    if (name === "email") {
      setProfile({ ...profile, email: value });
    } else if (name === "nickname") {
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
    <Wrapper>
      <Header title="Edit Profile" description="Edit your information." />
      <ScrollableWrapper>
        <Container>
          <SubTitle>Profile</SubTitle>
          <Input type="text" name="email" value={profile.email} disabled />
          <Input
            type="text"
            name="nickname"
            placeholder="Nickname"
            value={profile.nickname}
            onChange={handleChangeProfileInput}
          />
          <ButtonWrapper>
            <BasicButton
              label="Update profile"
              size="small"
              type="confirm"
              onClick={handleUpdateProfile}
            />
          </ButtonWrapper>
        </Container>
        <Container>
          <SubTitle>Password</SubTitle>
          {!hidden.updatePassword && (
            <>
              <Input
                type="password"
                name="oldPassword"
                placeholder="Old password"
                value={password.oldPassword}
                onChange={handleChangePasswordInput}
              />
              <Input
                type="password"
                name="newPassword"
                placeholder="New password"
                value={password.newPassword}
                onChange={handleChangePasswordInput}
              />
              <Input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm new password"
                value={password.confirmNewPassword}
                onChange={handleChangePasswordInput}
              />
            </>
          )}
          <ButtonWrapper>
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
          </ButtonWrapper>
        </Container>
        <Container>
          <SubTitle className="delete-account">Delete Account</SubTitle>
          <DeleteAccountDescription>
            <span>Warning: Deleting your account is permanent. </span>Once your
            account is deleted, all your data will be lost and cannot be
            recovered. Please make sure you want to proceed before taking this
            action.
          </DeleteAccountDescription>
          {!hidden.deleteAccount && (
            <>
              <p>test</p>
            </>
          )}
          <ButtonWrapper>
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
          </ButtonWrapper>
        </Container>
      </ScrollableWrapper>
    </Wrapper>
  );
};

export default ProfilePage;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
`;

export const ScrollableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const Container = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 40px;
`;

export const SubTitle = styled.label`
  display: inline-block;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.accent};

  &.delete-account {
    color: ${({ theme }) => theme.text.danger};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border-radius: 50px;
  border: 2px solid ${({ theme }) => theme.button.secondary};
  outline: none;
  font-size: 16px;

  &:focus {
    border: 2px solid ${({ theme }) => theme.button.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.button.secondary};
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
`;

export const DeleteAccountDescription = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.2;

  span {
    font-weight: 600;
  }
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.text.tertiary};
  outline: none;
  font-size: 16px;
  text-align: center;

  &:focus {
    border-bottom: 2px solid ${({ theme }) => theme.text.accent};

    &::placeholder {
      opacity: 0; /* 포커스 시 placeholder 숨김 */
    }
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;
