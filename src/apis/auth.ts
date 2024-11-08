import axios from "./axiosInstance";

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
  const response = await axios.post(`${API_URL}/sign-up`, {
    email,
    password,
    nickname,
  });

  return response as unknown as SignUpResponse;
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
  const response = await axios.post(`${API_URL}/sign-in`, {
    email,
    password,
  });

  return response as unknown as SignInResponse;
};

// 로그아웃
export const signOut = async () => {
  await axios.post(`${API_URL}/sign-out`);
};

// 회원 탈퇴
export const deleteUser = async () => {
  await axios.delete(`${API_URL}/account`);
};
