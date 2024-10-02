import { styled } from "styled-components";

export const Title = styled.h1`
  color: ${({ theme }) => theme.text.accent};
  font-size: 28px;
  font-weight: 600;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 16px;
  font-weight: 400;
`;
