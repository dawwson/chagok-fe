import axios from "./axiosInstance";

const API_URL = "/users";

interface GetUserResponse {
  id: string;
  email: string;
  nickname: string;
}

/**
 * 사용자 조회
 */
export const getUser = async () => {
  const response = await axios.get(`${API_URL}`);

  return response as unknown as GetUserResponse;
};

/**
 * 사용자 프로필 수정
 */
export const updateUserProfile = async ({ nickname }: { nickname: string }) => {
  await axios.patch(`${API_URL}/profile`, { nickname });
};

/**
 * 사용자 비밀번호 수정
 */
export const updateUserPassword = async (
  oldPassword: string,
  newPassword: string
) => {
  await axios.patch(`${API_URL}/password`, {
    oldPassword,
    newPassword,
  });
};
