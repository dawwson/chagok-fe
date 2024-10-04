import axiosInstance from "./axiosInstance";

const API_URL = "/categories";

interface GetCategoriesResponse {
  id: number;
  name: string;
  type: "income" | "expense";
}

// 회원가입
export const getCategories = async () => {
  const response = await axiosInstance.get(`${API_URL}`);

  return response as unknown as GetCategoriesResponse[];
};
