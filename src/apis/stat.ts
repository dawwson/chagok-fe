import axios from "./axiosInstance";

const API_URL = "/stats";

interface GetExpenseStatResponse {
  categoryId: number;
  categoryName: string;
  previous: number;
  current: number;
}

/**
 * 지출 통계 조회
 */
export const getExpenseStat = async ({
  year,
  month,
  view,
}: {
  year: number;
  month: number;
  view: "monthly" | "yearly";
}) => {
  const response = await axios.get(`${API_URL}/expense/${year}/${month}`, {
    params: { view },
  });

  return response as unknown as GetExpenseStatResponse[];
};
