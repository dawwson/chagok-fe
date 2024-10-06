import axios from "./axiosInstance";

const API_URL = "/categories";

interface GetCategoriesResponse {
  id: number;
  name: string;
  type: "income" | "expense";
}

/**
 * 카테고리 목록 조회
 */
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}`);

  return response as unknown as GetCategoriesResponse[];
};
