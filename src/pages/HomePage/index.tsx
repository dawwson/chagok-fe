import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";

import * as S from "./style";
import { getSelectedDate, saveSelectedDate } from "./util";

import { getTxs, getTxSum } from "../../apis/tx";
import Calendar from "../../components/organisms/Calendar";
import Header from "../../components/organisms/Header";
import { useAuth } from "../../contexts/auth";
import { capitalize } from "../../utils/string";
import { ApiError } from "../../types/errorTypes";

type TxType = "income" | "expense";
type TxMethod = "cash" | "debit card" | "credit card" | "bank transfer";

interface Sum {
  totalIncome: number;
  totalExpense: number;
}

interface Tx {
  id: number;
  categoryName: string;
  txType: TxType;
  txMethod: TxMethod;
  amount: number;
  date: string; // ISO string
}

const HomePage = () => {
  const navigate = useNavigate();
  const { currentUser, deauthenticate } = useAuth();

  const initialDate = getSelectedDate();
  const [selectedDate, setSelectedDate] = useState(
    dayjs(initialDate ?? undefined)
  );
  const [sum, setSum] = useState<Sum | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);

  const handleOnClickAdd = () => {
    navigate("/add-transaction");
  };

  const handleOnChangeDate = async (date: Dayjs) => {
    const startDate = date.startOf("day").toISOString();
    const endDate = date.endOf("day").toISOString();

    try {
      const txs = await getTxs(startDate, endDate);

      setTxs(txs);
      setSelectedDate(date);
      saveSelectedDate(date.toISOString());
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.errorCode === "AUTH_INVALID_TOKEN") {
          deauthenticate();
          navigate("/login", { replace: true });
        }
      }
    }
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchSum = async () => {
      const startDate = selectedDate.startOf("month").toISOString();
      const endDate = selectedDate.endOf("month").toISOString();

      try {
        const { totalIncome, totalExpense } = await getTxSum(
          startDate,
          endDate
        );
        setSum({ totalIncome, totalExpense });
      } catch (error) {
        if (error instanceof ApiError) {
          if (error.errorCode === "AUTH_INVALID_TOKEN") {
            deauthenticate();
            navigate("/login", { replace: true });
          }
        }
      }
    };

    fetchSum();
  }, [selectedDate, deauthenticate, navigate]);

  return (
    <S.Wrapper>
      <S.LeftWrapper>
        <Header
          title={`Welcome to Chagok, ${currentUser?.nickname}!`}
          description={`🔖 Income : ${"\u00A0"}₩${
            sum?.totalIncome.toLocaleString() ?? 0
          }${"\u00A0\u00A0\u00A0"}Expense : ₩${
            sum?.totalExpense.toLocaleString() ?? 0
          }`}
        />
        <S.CalendarContainer>
          <Calendar selectedDate={selectedDate} onChange={handleOnChangeDate} />
        </S.CalendarContainer>
      </S.LeftWrapper>
      <S.RightWrapper>
        <S.ButtonContainer>
          <S.AddButton onClick={handleOnClickAdd}>
            Add a transaction
          </S.AddButton>
        </S.ButtonContainer>
        <S.ListItemContainer>
          {txs.length === 0 ? (
            <S.Empty>Try to add a new transaction!</S.Empty>
          ) : (
            txs.map((tx) => (
              <S.ListItem key={tx.id}>
                <S.Category>{capitalize(tx.categoryName)}</S.Category>
                <S.PaymentMethod>{capitalize(tx.txMethod)}</S.PaymentMethod>
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
