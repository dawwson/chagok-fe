import { ReactNode } from "react";
import * as S from "./style";
import BasicButton from "../../atoms/BasicButton";

interface Props {
  type: "error" | "warn" | "success";
  buttons: Array<{
    label: string;
    location: "left" | "right" | "center"; // center: 버튼이 하나일 경우
    onClick: () => void;
  }>;
  children: ReactNode;
}

const Modal = ({ type, children, buttons }: Props) => {
  const renderIcon = () => {
    if (type === "error") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      );
    }
    if (type === "warn") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
      );
    }
    if (type === "success") {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      );
    }
  };

  const renderButtons = () => {
    return buttons.map((button, index) => {
      let buttonType: "cancel" | "confirm" | "danger" = "cancel";

      if (button.location === "left") {
        buttonType = "cancel";
      } else {
        if (type === "error" || type === "warn") {
          buttonType = "danger";
        }
        if (type === "success") {
          buttonType = "confirm";
        }
      }

      return (
        <BasicButton
          key={index}
          label={button.label}
          size="small"
          type={buttonType}
          onClick={button.onClick}
        />
      );
    });
  };

  return (
    <S.ModalOverlay>
      <S.ModalContainer>
        <S.HeaderIcon>{renderIcon()}</S.HeaderIcon>
        <S.Content>{children}</S.Content>
        <S.Footer>{renderButtons()}</S.Footer>
      </S.ModalContainer>
    </S.ModalOverlay>
  );
};

export default Modal;
