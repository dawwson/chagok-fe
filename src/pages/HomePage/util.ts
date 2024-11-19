const INITIAL_DATE_KEY = "initialDate";

export const getSelectedDate = () => {
  return sessionStorage.getItem(INITIAL_DATE_KEY);
};

export const saveSelectedDate = (date: string) => {
  sessionStorage.setItem(INITIAL_DATE_KEY, date);
};

export const removeSelectedDate = () => {
  sessionStorage.removeItem(INITIAL_DATE_KEY);
};
