import dayjs from "dayjs";

export const formatDate = (year: number, month: number) => {
  return dayjs(new Date(year, month - 1)).format("MMM YYYY");
};
