import axiosInstance from "./axiosInstance";

const API_URL = "/txs";

type TxType = "income" | "expense";
type TxMethod = "cash" | "debit card" | "credit card" | "bank transfer";

interface CreateTxResponse {
  id: number;
  txType: TxType;
  txMethod: TxMethod;
  amount: number;
  categoryId: number;
  date: string;
  description: string;
  isExcluded: boolean;
  createdAt: string;
}

interface UpdateTxResponse {
  id: number;
  categoryId: number;
  txType: TxType;
  txMethod: TxMethod;
  amount: number;
  date: string;
  description: string;
  isExcluded: boolean;
  updatedAt: string;
}

interface GetTxSumResponse {
  totalIncome: number;
  totalExpense: number;
}

interface GetTxsResponse {
  id: number;
  categoryName: string;
  txType: TxType;
  txMethod: TxMethod;
  amount: number;
  date: string;
}

interface GetTxDetailResponse {
  id: number;
  categoryId: number;
  txType: TxType;
  txMethod: TxMethod;
  amount: number;
  date: string;
  description: string;
  isExcluded: boolean;
}

/**
 * 내역 생성
 */
export const createTx = async (tx: {
  txType: TxType;
  txMethod: TxMethod;
  amount: number;
  categoryId: number;
  date: string;
  description: string;
  isExcluded: boolean;
}) => {
  const response = await axiosInstance.post(`${API_URL}`, tx);

  return response as unknown as CreateTxResponse;
};

/*
 * 내역 수정
 */
export const updateTx = async (tx: {
  id: number;
  txType: TxType;
  txMethod: TxMethod;
  categoryId: number;
  amount: number;
  description: string;
  isExcluded: boolean;
}) => {
  const { id, ...body } = tx;
  const response = await axiosInstance.put(`${API_URL}/${id}`, body);

  return response as unknown as UpdateTxResponse;
};

/**
 * 내역 합계 조회
 */
export const getTxSum = async (startDate: string, endDate: string) => {
  const response = await axiosInstance.get(`${API_URL}/sum`, {
    params: { startDate, endDate },
  });

  return response as unknown as GetTxSumResponse;
};

/**
 * 내역 목록 조회
 */
export const getTxs = async (startDate: string, endDate: string) => {
  const response = await axiosInstance.get(`${API_URL}`, {
    params: { startDate, endDate },
  });

  return response as unknown as GetTxsResponse[];
};

/**
 * 내역 상세 조회
 */
export const getTxDetail = async (txId: number) => {
  const response = await axiosInstance.get(`${API_URL}/${txId}`);
  return response as unknown as GetTxDetailResponse;
};
