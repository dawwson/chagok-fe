import dayjs from "dayjs";

dayjs.locale("ko");

export const localize = (date: string) => {
  return dayjs(date).format("YYYY년 MM월 DD일 (ddd)");
};
