import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.background.white};
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 100px;
  color: ${({ theme }) => theme.text.primary};
`;

export const Subtitle = styled.h2`
  font-size: 36px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 16px;
`;

export const Description = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.text.secondary};
  margin-bottom: 40px;
`;

export const Button = styled.button`
  background-color: ${({ theme }) => theme.button.primary};
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    opacity: 0.9;
  }
`;
