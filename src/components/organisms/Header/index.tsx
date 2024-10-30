import * as S from "./style";

interface Props {
  title: string;
  description: string;
}

const Header = ({ title, description }: Props) => {
  return (
    <S.Wrapper>
      <S.Title>{title}</S.Title>
      <S.Description>{description}</S.Description>
    </S.Wrapper>
  );
};

export default Header;
