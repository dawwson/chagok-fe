import axiosInstance from "./axiosInstance";

const API_URL = "/auth";

interface SignUpResponse {
  id: string;
  email: string;
  nickname: string;
}

// 회원가입
export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  nickname: string
) => {
  const response = (await axiosInstance.post(`${API_URL}/sign-up`, {
    email,
    password,
    nickname,
  })) as unknown as SignUpResponse;

  return response;
};

interface SignInResponse {
  id: string;
  nickname: string;
}

// 로그인
export const signInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const response = (await axiosInstance.post(`${API_URL}/sign-in`, {
    email,
    password,
  })) as unknown as SignInResponse;

  return response;
};

// 로그아웃
export const signOut = async () => {
  await axiosInstance.post(`${API_URL}/sign-out`);
};

// TODO: 회원 탈퇴
