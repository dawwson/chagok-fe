import dayjs from "dayjs";

export const localize = (date: string) => {
  return dayjs(date).format("ddd, MMM D, YYYY");
};
