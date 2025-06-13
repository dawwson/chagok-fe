import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as S from "./style";
import { signUpWithEmailAndPassword } from "../../apis/auth";
import { useError } from "../../contexts/error";
import { ApiError } from "../../types/errorTypes";

const JoinPage = () => {
  const navigate = useNavigate();
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

  return (
    <S.Wrapper>
      <S.Title>회원가입</S.Title>
      <S.Form onSubmit={handleOnSubmit}>
        <S.Input
          name="email"
          value={email}
          placeholder="이메일"
          type="email"
          onChange={handleOnChange}
          required
        />
        <S.Input
          name="password"
          value={password}
          placeholder="비밀번호"
          type="password"
          onChange={handleOnChange}
          required
        />
        <S.Input
          name="nickname"
          value={nickname}
          placeholder="닉네임"
          onChange={handleOnChange}
          required
          minLength={2}
        />
        <S.Input
          type="submit"
          value={isLoading ? "Loading..." : "이메일로 회원가입"}
        />
      </S.Form>
      <S.Switcher>
        이미 계정이 있으신가요? <Link to="/login">로그인하기 &rarr;</Link>
      </S.Switcher>
    </S.Wrapper>
  );
};

export default JoinPage;
