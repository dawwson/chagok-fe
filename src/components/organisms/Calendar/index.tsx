import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

interface Props {
  selectedDate: Dayjs;
  onChange: (date: Dayjs) => void;
}

const Calendar = ({ selectedDate, onChange }: Props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={dayjs()}
        value={selectedDate}
        onChange={onChange}
        sx={{
          width: "100%",
          height: "100%",
          overflow: "visible",
          // 헤더
          "& .MuiPickersCalendarHeader-root": {
            paddingLeft: "40px",
            paddingRight: "28px",
            marginBottom: "20px",
          },
          // 요일
          "& .MuiDayCalendar-header": {
            height: "50px",
            justifyContent: "center",
            gap: "12px",
            "& span": {
              fontSize: "14px",
            },
          },
          // 날짜 영역
          "& .MuiPickersSlideTransition-root": {
            width: "100%",
            minHeight: "300px",
            marginTop: "10px",
          },
          // 날짜 셀
          "& .MuiPickersDay-root": {
            minHeight: "48px",
            minWidth: "48px",
            fontSize: "18px",
            "&.Mui-selected": {
              backgroundColor: "#0D99FF",
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default Calendar;
