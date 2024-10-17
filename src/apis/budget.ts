import axios from "./axiosInstance";

const API_URL = "/budgets";

interface CreateBudgetResponse {
  id: number;
  year: number;
  month: number;
  totalAmount: number;
  budgets: Array<{
    categoryId: number;
    categoryName: string;
    amount: number;
  }>;
}

interface SetBudgetResponse {}

interface GetBudgetResponse {
  id: number | null;
  year: number;
  month: number;
  budgets: Array<{
    categoryId: number;
    categoryName: string;
    amount: number;
  }>;
}

interface GetBudgetRecommendationResponse {
  categoryId: number;
  categoryName: string;
  amount: number;
}

/**
 * 예산 생성
 */
export const createBudget = async () => {
  const response = await axios.post(`${API_URL}`, {});

  return response as unknown as CreateBudgetResponse;
};

/**
 * 🚧 예산 수정
 */
export const setBudget = async () => {
  const response = await axios.put(`${API_URL}`);

  return response as unknown as SetBudgetResponse;
};

/**
 * 예산 조회
 */
export const getBudget = async (year: number, month: number) => {
  const response = await axios.get(`${API_URL}/${year}/${month}`);

  return response as unknown as GetBudgetResponse;
};

/**
 * 🚧 예산 추천
 */
export const getBudgetRecommendation = async () => {
  const response = await axios.get(`${API_URL}/recommendation`);

  return response as unknown as GetBudgetRecommendationResponse[];
};
