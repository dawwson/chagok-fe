import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as S from "./style";
import { signInWithEmailAndPassword } from "../../apis/auth";
import { ApiError } from "../../types/errorTypes";
import { useAuth } from "../../contexts/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, currentUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || email === "" || password === "") {
      return;
    }

    try {
      setIsLoading(true);
      const userInfo = await signInWithEmailAndPassword(email, password);
      signIn(userInfo);
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errorCode === "USER_EMAIL_DO_NOT_EXIST") {
          setError("The email address you entered doesn't match any account.");
        }
        if (error.errorCode === "USER_PASSWORD_IS_WRONG") {
          setError("The password you entered is incorrect. Please try again.");
        }
        if (error.errorCode === "USER_EMAIL_IS_DUPLICATED") {
          setError(
            "This email address cannot be used. Please try a different one."
          );
        }
      } else {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <S.Wrapper>
      <S.Title>Log in to Chagok 💰</S.Title>
      <S.Form onSubmit={handleOnSubmit}>
        <S.Input
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          onChange={handleOnChange}
          required
        />
        <S.Input
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          onChange={handleOnChange}
          required
        />
        <S.Input
          type="submit"
          value={isLoading ? "Loading..." : "Sign in with Email"}
        />
      </S.Form>
      {/* 에러메세지 나중에 모달로 변경 */}
      <span>{error}</span>
      <S.Switcher>
        Don't have an account? <Link to="/join">Join &rarr;</Link>
      </S.Switcher>
    </S.Wrapper>
  );
};

export default LoginPage;
