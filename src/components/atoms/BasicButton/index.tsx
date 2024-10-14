import * as S from "./style";

// NOTE: 감싸서 사용하기

type ButtonSize = "small" | "large";
type ButtonType = "confirm" | "cancel" | "danger";

interface Props {
  label: string;
  size: ButtonSize;
  type: ButtonType;
  onClick: () => void;
}

const BasicButton = ({ label, size, type, onClick }: Props) => {
  return (
    <S.Button size={size} type={type} onClick={onClick}>
      {label}
    </S.Button>
  );
};

export default BasicButton;
