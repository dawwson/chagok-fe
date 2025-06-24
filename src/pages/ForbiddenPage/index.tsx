import { useNavigate } from "react-router-dom";

import * as S from "./style";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <S.Container>
      <S.Title>403</S.Title>
      <S.Subtitle>Forbidden</S.Subtitle>
      <S.Description>
        접근 권한이 없습니다. 관리자에게 문의해 주세요.
      </S.Description>
      <S.Button onClick={handleGoHome}>홈 화면으로 이동</S.Button>
    </S.Container>
  );
};

export default ForbiddenPage;
