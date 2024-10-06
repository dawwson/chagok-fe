import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as S from "./style";
import { signUpWithEmailAndPassword } from "../../apis/auth";
import { useAuth } from "../../contexts/auth";
import { useError } from "../../contexts/error";
import { ApiError } from "../../types/errorTypes";

const JoinPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { handleApiError } = useError();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "nickname") {
      setNickname(value);
    }
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || email === "" || password === "" || nickname === "") {
      return;
    }

    try {
      setIsLoading(true);

      await signUpWithEmailAndPassword(email, password, nickname);
      navigate("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        handleApiError(error);
      }
    } finally {
      setIsLoading(false);
      setEmail("");
      setPassword("");
      setNickname("");
    }
  };

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <S.Wrapper>
      <S.Title>Join to Chagok 💰</S.Title>
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
          name="nickname"
          value={nickname}
          placeholder="Nickname"
          onChange={handleOnChange}
          required
          minLength={2}
        />
        <S.Input
          type="submit"
          value={isLoading ? "Loading..." : "Sign up with Email"}
        />
      </S.Form>
      {/* 에러메세지 나중에 모달로 변경 */}
      {/* <span>{error}</span> */}
      <S.Switcher>
        Already have an account? <Link to="/login">Login &rarr;</Link>
      </S.Switcher>
    </S.Wrapper>
  );
};

export default JoinPage;
