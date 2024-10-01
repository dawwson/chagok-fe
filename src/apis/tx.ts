import axiosInstance from "./axiosInstance";

const API_URL = "/txs";

interface GetTxSumResponse {
  totalIncome: number;
  totalExpense: number;
}

export const getTxSum = async (startDate: string, endDate: string) => {
  const response = await axiosInstance.get(`${API_URL}/sum`, {
    params: { startDate, endDate },
  });

  return response as unknown as GetTxSumResponse;
};

// export const signUpWithEmailAndPassword = async (
//   email: string,
//   password: string,
//   nickname: string
// ) => {
//   const response = (await axiosInstance.post(`${API_URL}/sign-up`, {
//     email,
//     password,
//     nickname,
//   })) as unknown as SignUpResponse;

//   return response;
// };
