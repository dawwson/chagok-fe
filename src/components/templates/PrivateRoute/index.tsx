import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
