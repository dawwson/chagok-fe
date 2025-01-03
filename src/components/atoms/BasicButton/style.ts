import { styled } from "styled-components";

export const Button = styled.button<{
  size: "small" | "large";
  type: "default" | "confirm" | "cancel" | "danger";
}>`
  display: flex; /* Flexbox 사용 */
  justify-content: center; /* 수평 중앙 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  min-width: 90px;
  height: ${({ size }) => (size === "small" ? "30px" : "40px")};
  font-size: ${({ size }) => (size === "small" ? "14px" : "18px")};
  font-weight: 600;
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
    if (type === "default") {
      return theme.button.tertiary;
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

  &:disabled {
    opacity: 0.6;
  }
`;
