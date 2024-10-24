import axios, { AxiosResponse, isAxiosError } from "axios";
import { ApiError } from "../types/errorTypes";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

// 2XX 응답 처리
const onSuccess = (res: AxiosResponse) => {
  const { data } = res.data;
  return data;
};

// 2XX 이외의 응답 처리
const onFail = (error: Error) => {
  if (isAxiosError(error) && error.response) {
    const { path, errorCode, detail, timestamp } = error.response.data;

    return Promise.reject(new ApiError(path, errorCode, detail, timestamp)); // 커스텀 에러 형식으로 변환
  }
  return Promise.reject(
    new ApiError(
      "UNKNOWN_ERROR",
      error.name,
      error.message,
      new Date().toISOString()
    )
  );
  // return Promise.reject(error);
};

axiosInstance.interceptors.response.use(onSuccess, onFail);

export default axiosInstance;
