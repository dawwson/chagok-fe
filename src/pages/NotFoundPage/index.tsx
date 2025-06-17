import { useNavigate } from "react-router-dom";
import * as S from "./style";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <S.Container>
      <S.Title>404</S.Title>
      <S.Subtitle>Page Not Found</S.Subtitle>
      <S.Description>
        죄송합니다. 해당 페이지를 찾을 수 없습니다. 주소를 다시 확인해 주세요.
      </S.Description>
      <S.Button onClick={handleGoHome}>홈 화면으로 이동</S.Button>
    </S.Container>
  );
};

export default NotFoundPage;
