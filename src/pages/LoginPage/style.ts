import styled from "styled-components";

export const Wrapper = styled.div`
  width: 420px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 42px;
  color: ${({ theme }) => theme.text.primary};
`;

export const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border-radius: 50px;
  border: 2px solid ${({ theme }) => theme.button.secondary};
  outline: none;
  font-size: 16px;

  &[type="submit"] {
    background-color: ${({ theme }) => theme.button.primary};
    color: white;
    font-weight: 600;
    border: none;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  &:focus {
    border: 2px solid ${({ theme }) => theme.button.primary};
  }
`;

export const Switcher = styled.span`
  margin-top: 20px;

  a {
    color: ${({ theme }) => theme.text.accent};
  }
`;
