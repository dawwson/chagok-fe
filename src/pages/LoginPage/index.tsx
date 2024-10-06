import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as S from "./style";
import { signInWithEmailAndPassword } from "../../apis/auth";
import { ApiError } from "../../types/errorTypes";
import { useAuth } from "../../contexts/auth";
import { useError } from "../../contexts/error";

const LoginPage = () => {
  const navigate = useNavigate();
  const { authenticate, currentUser } = useAuth();
  const { handleApiError } = useError();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      authenticate(userInfo);
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        handleApiError(error);
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
      <S.Switcher>
        Don't have an account? <Link to="/join">Join &rarr;</Link>
      </S.Switcher>
    </S.Wrapper>
  );
};

export default LoginPage;
