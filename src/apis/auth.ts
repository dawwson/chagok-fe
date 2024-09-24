import axios from "axios";
import { ApiError } from "../types/errorTypes";
import axiosInstance from "./axiosInstance";

const API_URL = "/auth";

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
    throw new Error(`Error: ${API_URL}/sign-in`);
  }
};

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  nickname: string
) => {
  try {
    const response = await axiosInstance.post(
      `${API_URL}/sign-up`,
      { email, password, nickname },
      { withCredentials: true }
    );

    const { data } = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { path, errorCode, detail, timestamp } = error.response.data;
      throw new ApiError(path, errorCode, detail, timestamp);
    }
    throw new Error(`Error: ${API_URL}/sign-up`);
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
*/
