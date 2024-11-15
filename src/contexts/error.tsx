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
        setErrorMessage(
          "Please enter a category amount less than or equal to 2 billion."
        );
        break;
      case "BUDGET_TOTAL_AMOUNT_OUT_OF_RANGE":
        setErrorMessage(
          "The total budget exceeds the allowed limit of 10 billion. Please adjust your amounts accordingly."
        );
        break;
      case "BUDGET_YEAR_OUT_OF_RANGE":
        setErrorMessage(
          "You have reached the limit for budget creation in the selected year and month."
        );
        break;
      // tx
      case "TX_AMOUNT_OUT_OF_RANGE":
        setErrorMessage("Please enter the amount.");
        break;
      // user

      // ===== 401 =====
      case "AUTH_INVALID_TOKEN":
        deauthenticate();
        navigateFn?.("/login", { replace: true });
        break;
      case "USER_EMAIL_DO_NOT_EXIST":
        setErrorMessage(
          "The email address you entered doesn't match any account."
        );
        break;
      case "USER_PASSWORD_IS_WRONG":
        setErrorMessage(
          "The password you entered is incorrect.\nPlease try again."
        );
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
        setErrorMessage("Invalid category.");
        break;

      // ===== 409 =====
      case "USER_EMAIL_IS_DUPLICATED":
        setErrorMessage(
          "This email address cannot be used.\nPlease try a different one."
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
          <p style={{ lineHeight: "1.5" }}>{errorMessage}</p>
        </Modal>
      )}
    </ErrorContext.Provider>
  );
};
