import dayjs from "dayjs";
import * as S from "./style";

interface Props {
  year: number;
  month: number;
  onChange: (direction: "prev" | "next") => void;
}

const YearMonthPicker = ({ year, month, onChange }: Props) => {
  return (
    <S.DatePickerContainer>
      <S.ArrowButton onClick={() => onChange("prev")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </S.ArrowButton>
      <S.DateDisplay>
        {dayjs(new Date(year, month - 1)).format("MMM YYYY")}
      </S.DateDisplay>
      <S.ArrowButton onClick={() => onChange("next")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </S.ArrowButton>
    </S.DatePickerContainer>
  );
};

export default YearMonthPicker;
