import * as S from "./style";

// NOTE: 감싸서 사용하기

type ButtonSize = "small" | "large";
type ButtonType = "default" | "confirm" | "cancel" | "danger";

interface Props {
  label: string;
  size: ButtonSize;
  type?: ButtonType /* default: "default" */;
  disabled?: boolean /* default: false */;
  onClick: () => void;
}

const BasicButton = ({ label, size, type, disabled, onClick }: Props) => {
  return (
    <S.Button
      size={size}
      type={type ?? "default"}
      onClick={onClick}
      disabled={disabled ?? false}
    >
      {label}
    </S.Button>
  );
};

export default BasicButton;
