import { styled } from "styled-components";

export const Button = styled.button<{
  size: "small" | "large";
  type: "confirm" | "cancel" | "danger";
}>`
  width: ${({ size }) => (size === "small" ? "80px" : "90px")};
  height: ${({ size }) => (size === "small" ? "30px" : "40px")};
  font-size: ${({ size }) => (size === "small" ? "14px" : "18px")};
  font-weight: 600;
  display: inline-block;
  padding: 8px 16px;
  margin: 4px;
  border: none;
  border-radius: 14px;
  background-color: ${({ theme, type }) => {
    if (type === "confirm") {
      return theme.button.primary;
    }
    if (type === "cancel") {
      return theme.button.secondary;
    }
    if (type === "danger") {
      return theme.button.danger;
    }
  }};
  color: ${({ theme, type }) => {
    if (type === "confirm") {
      return theme.buttonText.primary;
    }
    if (type === "cancel") {
      return theme.buttonText.secondary;
    }
    if (type === "danger") {
      return theme.buttonText.danger;
    }
  }};

  cursor: pointer;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    opacity: 0.8;
  }
`;
