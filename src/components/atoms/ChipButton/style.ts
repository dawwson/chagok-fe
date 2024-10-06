import { styled } from "styled-components";

export const Button = styled.button<{ selected: boolean }>`
  display: inline-block;
  padding: 8px 16px;
  margin: 4px;
  border: none;
  border-radius: 16px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.button.primary : theme.button.tertiary};
  color: ${({ theme, selected }) =>
    selected ? theme.buttonText.primary : theme.buttonText.secondary};
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;
