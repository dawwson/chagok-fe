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
          minHeight: "fit-content",
          overflow: "scroll",

          // 헤더
          "& .MuiPickersCalendarHeader-root": {
            minWidth: "4vw",
            padding: "0px",
            marginBottom: "20px",

            // 연도/월
            "& .MuiPickersCalendarHeader-labelContainer": {
              marginLeft: "5vw",
              fontSize: "20px",
            },

            // 좌우 화살표
            "& .MuiPickersArrowSwitcher-root": {
              marginRight: "4vw",
            },
          },

          // 요일&날짜 영역
          "& .MuiDayCalendar-root": {},

          // 요일
          "& .MuiDayCalendar-header": {
            marginTop: "2vh",

            "& span": {
              minWidth: "4vw",
              minHeight: "4vh",
              fontSize: "14px",
            },
          },

          // 날짜 영역
          "& .MuiPickersSlideTransition-root": {
            minHeight: "44vh",
            marginTop: "2vh",
          },

          // 날짜 셀
          "& .MuiPickersDay-root": {
            minWidth: "4vw",
            minHeight: "4vw",
            fontSize: "18px",

            "&:hover": {
              backgroundColor: "#E6E6E6",
            },

            // 선택된 날짜 셀
            "&.Mui-selected": {
              backgroundColor: "#0D99FF",

              "&:focus": {
                backgroundColor: "#0D99FF",
              },
            },
          },

          // 연도 선택 영역
          "& .MuiYearCalendar-root": {
            // backgroundColor: "pink",
            width: "100%",
            maxHeight: "50vh",

            // 연도 버튼
            "& .MuiPickersYear-yearButton": {
              "&:hover": {
                backgroundColor: "#E6E6E6",
              },

              // 선택된 연도
              "&.Mui-selected": {
                backgroundColor: "#0D99FF",

                "&:focus": {
                  backgroundColor: "#0D99FF",
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default Calendar;
