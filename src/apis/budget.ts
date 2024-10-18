import axios from "./axiosInstance";

const API_URL = "/budgets";

interface CreateBudgetResponse {
  id: number;
  year: number;
  month: number;
  totalAmount: number;
  budgets: Array<{
    categoryId: number;
    amount: number;
  }>;
}

interface UpdateBudgetResponse {
  id: number;
  year: number;
  month: number;
  totalAmount: number;
  budgets: Array<{
    categoryId: number;
    amount: number;
  }>;
  updatedAt: string;
}

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
export const createBudget = async (
  year: number,
  month: number,
  budgets: Array<{ categoryId: number; amount: number }>
) => {
  const response = await axios.post(`${API_URL}`, {
    year,
    month,
    budgets,
  });

  return response as unknown as CreateBudgetResponse;
};

/**
 * 예산 수정
 */
export const updateBudget = async (
  budgetId: number,
  budgets: Array<{ categoryId: number; amount: number }>
) => {
  const response = await axios.put(`${API_URL}/${budgetId}`, { budgets });

  return response as unknown as UpdateBudgetResponse;
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
