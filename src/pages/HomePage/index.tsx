import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

import * as S from "./style";
import { getSelectedDate, saveSelectedDate } from "./util";

import { getTxs, getTxSum } from "../../apis/tx";
import { useAuth } from "../../contexts/auth";
import { useError } from "../../contexts/error";
import Calendar from "../../components/organisms/Calendar";
import Header from "../../components/organisms/Header";
import { ApiError } from "../../types/errorTypes";
import { getCategoryLabel, getTxMethodLabel } from "../../utils/string";

type TxType = "income" | "expense";
type TxMethod = "cash" | "debit card" | "credit card" | "bank transfer";

interface Sum {
  totalIncome: number;
  totalExpense: number;
}

interface Tx {
  id: number;
  categoryId: number;
  txType: TxType;
  txMethod: TxMethod;
  amount: number;
  date: string; // ISO string
}

const HomePage = () => {
  const initialDate = getSelectedDate();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { handleApiError } = useError();

  const [selectedDate, setSelectedDate] = useState(
    dayjs(initialDate ?? undefined)
  );
  const [sum, setSum] = useState<Sum | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);

  const fetchData = useCallback(async (date: Dayjs) => {
    const startOfMonth = date.startOf("month").toISOString();
    const endOfMonth = date.endOf("month").toISOString();
    const startOfDay = date.startOf("day").toISOString();
    const endOfDay = date.endOf("day").toISOString();

    try {
      const [sum, txs] = await Promise.all([
        getTxSum(startOfMonth, endOfMonth),
        getTxs(startOfDay, endOfDay),
      ]);
      setSelectedDate(date);
      setSum(sum);
      setTxs(txs);
    } catch (error) {
      if (error instanceof ApiError) {
        handleApiError(error, navigate);
      }
    }
  }, []);

  const handleChangeDate = async (date: Dayjs) => {
    fetchData(date);
    saveSelectedDate(date.toISOString());
  };

  const handleClickAdd = () => {
    navigate("/manage-transaction", {
      state: { selectedDate: selectedDate.toISOString() },
      replace: true,
    });
  };

  const handleClickListItem = (txId: number) => {
    navigate("/manage-transaction", { state: { txId }, replace: true });
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [fetchData]);

  return (
    <S.Wrapper>
      <S.LeftWrapper>
        <Header
          title={`차곡차곡, ${currentUser?.nickname}님의 ${
            selectedDate.get("M") + 1
          }월 가계부`}
          description={` 🔵 수입 ‣ ${
            sum?.totalIncome.toLocaleString() ?? 0
          }원\n\n 🔴 지출 ‣ ${sum?.totalExpense.toLocaleString() ?? 0}원`}
        />
        <S.CalendarContainer>
          <Calendar selectedDate={selectedDate} onChange={handleChangeDate} />
        </S.CalendarContainer>
      </S.LeftWrapper>
      <S.RightWrapper>
        <S.ButtonContainer>
          <S.AddButton onClick={handleClickAdd}>내역 추가하기</S.AddButton>
        </S.ButtonContainer>
        <S.ListItemContainer>
          {txs.length === 0 ? (
            <S.Empty>
              이 날짜에는 내역이 없어요. 새로운 내역을 추가해보세요.
            </S.Empty>
          ) : (
            txs.map((tx) => (
              <S.ListItem
                key={tx.id}
                onClick={() => handleClickListItem(tx.id)}
              >
                <S.Category>{getCategoryLabel(tx.categoryId)}</S.Category>
                <S.PaymentMethod>
                  {getTxMethodLabel(tx.txMethod)}
                </S.PaymentMethod>
                <S.Amount type={tx.txType}>
                  {tx.txType === "income" ? "+" : "-"} ₩
                  {tx.amount.toLocaleString()}
                </S.Amount>
              </S.ListItem>
            ))
          )}
        </S.ListItemContainer>
      </S.RightWrapper>
    </S.Wrapper>
  );
};

export default HomePage;
