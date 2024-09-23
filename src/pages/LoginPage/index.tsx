import { useState } from "react";
import { Link } from "react-router-dom";
import * as S from "./style";

const LoginPage = () => {
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

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading || email === "" || password === "") {
      return;
    }
  };

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
