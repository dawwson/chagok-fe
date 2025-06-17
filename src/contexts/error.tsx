import { createContext, useState, useContext } from "react";
import { NavigateFunction } from "react-router-dom";

import { useAuth } from "./auth";
import Modal from "../components/organisms/Modal";
import { ApiError } from "../types/errorTypes";

interface Context {
  handleApiError: (error: ApiError, navigateFn?: NavigateFunction) => void;
}

interface Props {
  children: React.ReactNode;
}

const ErrorContext = createContext<Context>({
  handleApiError: () => {},
});

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { deauthenticate } = useAuth();

  const handleApiError = (error: ApiError, navigateFn?: NavigateFunction) => {
    const { errorCode } = error;

    switch (errorCode) {
      // ===== 400 =====
      // budget
      case "BUDGET_AMOUNT_OUT_OF_RANGE":
        setErrorMessage("카테고리 금액은 20억 이하로 입력해 주세요.");
        break;
      case "BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE":
        setErrorMessage(
          "총 예산이 허용 한도인 100억을 초과했습니다. 금액을 조정해 주세요."
        );
        break;
      case "BUDGET_YEAR_OUT_OF_RANGE":
        setErrorMessage(
          "선택한 년도와 월에는 더 이상 예산을 생성할 수 없습니다."
        );
        break;
      // tx
      case "TX_AMOUNT_OUT_OF_RANGE":
        setErrorMessage("금액을 입력해 주세요.");
        break;
      // user

      // ===== 401 =====
      case "AUTH_INVALID_TOKEN":
        deauthenticate();
        navigateFn?.("/login", { replace: true });
        break;
      case "USER_EMAIL_DO_NOT_EXIST":
        setErrorMessage("입력하신 이메일 주소와\n일치하는 계정이 없습니다.");
        break;
      case "USER_PASSWORD_IS_WRONG":
        setErrorMessage("비밀번호가 일치하지 않습니다.");
        break;

      // ===== 403 =====
      case "BUDGET_FORBIDDEN":
        navigateFn?.("/403");
        break;
      case "TX_FORBIDDEN":
        navigateFn?.("/403");
        break;

      // ===== 404 =====
      case "CATEGORY_NOT_FOUND":
        setErrorMessage("유효하지 않은 카테고리입니다.");
        break;

      // ===== 409 =====
      case "USER_EMAIL_IS_DUPLICATED":
        setErrorMessage(
          "이미 사용 중인 이메일입니다.\n다른 이메일을 입력해 주세요."
        );
        break;
      default:
        setErrorMessage(error.detail);
        break;
    }
  };

  return (
    <ErrorContext.Provider value={{ handleApiError }}>
      {children}
      {errorMessage && (
        <Modal
          type="error"
          buttons={[
            {
              label: "Close",
              location: "center",
              onClick: () => setErrorMessage(null),
            },
          ]}
        >
          <p style={{ lineHeight: "1.5", whiteSpace: "pre-wrap" }}>
            {errorMessage}
          </p>
        </Modal>
      )}
    </ErrorContext.Provider>
  );
};
