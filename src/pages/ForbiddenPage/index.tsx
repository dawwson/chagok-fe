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
        Sorry, you don’t have permission to access this resource.
      </S.Description>
      <S.Button onClick={handleGoHome}>Go Home</S.Button>
    </S.Container>
  );
};

export default ForbiddenPage;
