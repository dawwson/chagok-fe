import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/auth";
import { useEffect, useState } from "react";
import LoadingScreen from "../../organisms/LoadingScreen";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  return currentUser ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
