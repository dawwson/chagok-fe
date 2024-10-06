import { useNavigate } from "react-router-dom";
import * as S from "./style";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <S.Container>
      <S.Title>404</S.Title>
      <S.Subtitle>Page Not Found</S.Subtitle>
      <S.Description>
        Sorry, the page you are looking for doesn't exist.
      </S.Description>
      <S.Button onClick={handleGoHome}>Go Home</S.Button>
    </S.Container>
  );
};

export default NotFoundPage;
