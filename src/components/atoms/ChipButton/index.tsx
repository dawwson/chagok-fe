import * as S from "./style";

// NOTE: 감싸서 사용하기

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const ChipButton = ({ label, selected, onClick }: Props) => {
  return (
    <S.Button selected={selected} onClick={onClick}>
      {label}
    </S.Button>
  );
};

export default ChipButton;
