import axiosInstance from "./axiosInstance";

const API_URL = "/txs";

// 내역 합계 조회
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

// 내역 목록 조회
type TxType = "income" | "expense";
type TxMethod = "cash" | "debit card" | "credit card" | "bank transfer";

interface GetTxsResponse {
  id: number;
  categoryName: string;
  txType: TxType;
  txMethod: TxMethod;
  amount: number;
  date: string;
}

export const getTxs = async (startDate: string, endDate: string) => {
  const response = await axiosInstance.get(`${API_URL}`, {
    params: { startDate, endDate },
  });

  return response as unknown as GetTxsResponse[];
};
