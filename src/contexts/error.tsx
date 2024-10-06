import { createContext, useState, useContext } from "react";
import { NavigateFunction } from "react-router-dom";

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

  const handleApiError = (
    error: ApiError,
    navigateFn?: (to: string) => void
  ) => {
    const { errorCode } = error;

    switch (errorCode) {
      // 400
      case "TX_AMOUNT_OUT_OF_RANGE":
        setErrorMessage("Please enter the amount.");
        break;
      // 401
      case "USER_EMAIL_DO_NOT_EXIST":
        setErrorMessage(
          "The email address you entered doesn't match any account."
        );
        break;
      case "USER_PASSWORD_IS_WRONG":
        setErrorMessage(
          "The password you entered is incorrect. Please try again."
        );
        break;
      // 404
      case "CATEGORY_NOT_FOUND":
        setErrorMessage("Invalid category.");
        break;
      // 403
      case "TX_FORBIDDEN":
        navigateFn?.("/403");
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
