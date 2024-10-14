import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
