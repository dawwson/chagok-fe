import axios from "axios";
import { ApiError } from "../types/errorTypes";
import axiosInstance from "./axiosInstance";

const API_URL = "/auth";

// 로그인 API 요청
export const signInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/sign-in`,
      { email, password },
      { withCredentials: true }
    );

    const { data } = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { path, errorCode, detail, timestamp } = error.response.data;
      throw new ApiError(path, errorCode, detail, timestamp);
    }
    throw new Error(`An unknown error occurred - ${API_URL}/sign-in`);
  }
};

/*
// 로그아웃 API 요청
export const logout = async () => {
  const response = await axiosInstance.post(
    `${API_URL}/logout`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

// 회원가입 API 요청
export const register = async (email: string, password: string) => {
  const response = await axiosInstance.post(`${API_URL}/register`, {
    email,
    password,
  });
  return response.data;
};
*/
