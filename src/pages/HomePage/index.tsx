import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dayjs, { Dayjs } from "dayjs";

import { getTxs, getTxSum } from "../../apis/tx";
import Calendar from "../../components/organisms/Calendar";
import { useAuth } from "../../contexts/auth";
import { capitalize } from "../../utils/string";

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
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [sum, setSum] = useState<Sum | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);

  const handleOnClickAdd = () => {
    navigate("/add-transaction");
  };

  const handleOnChangeDate = async (date: Dayjs) => {
    const startDate = date.startOf("day").toISOString();
    const endDate = date.endOf("day").toISOString();

    const txs = await getTxs(startDate, endDate);
    setTxs(txs);
    setSelectedDate(date);
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

      const { totalIncome, totalExpense } = await getTxSum(startDate, endDate);
      setSum({ totalIncome, totalExpense });
    };

    fetchSum();
  }, [selectedDate]);

  return (
    <Wrapper>
      <LeftWrapper>
        <Title>Welcome to Chagok, {currentUser?.nickname}!</Title>
        <Description>
          🔖 Income : &nbsp;₩{sum?.totalIncome.toLocaleString() ?? 0} &nbsp;
          Expense : ₩{sum?.totalExpense.toLocaleString() ?? 0}
        </Description>
        <CalendarContainer>
          <Calendar selectedDate={selectedDate} onChange={handleOnChangeDate} />
        </CalendarContainer>
      </LeftWrapper>
      <RightWrapper>
        <ButtonContainer>
          <Button onClick={handleOnClickAdd}>Add a transaction</Button>
        </ButtonContainer>
        <ListItemContainer>
          {txs.length === 0 ? (
            <Empty>Try to add a new transaction!</Empty>
          ) : (
            txs.map((tx) => (
              <ListItem key={tx.id}>
                <Category>{capitalize(tx.categoryName)}</Category>
                <PaymentMethod>{capitalize(tx.txMethod)}</PaymentMethod>
                <Amount type={tx.txType}>
                  {tx.txType === "income" ? "+" : "-"} ₩
                  {tx.amount.toLocaleString()}
                </Amount>
              </ListItem>
            ))
          )}
        </ListItemContainer>
      </RightWrapper>
    </Wrapper>
  );
};

export default HomePage;

// TODO: 스타일 파일로 이동
export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 30px;
  display: flex;
  gap: 30px;
`;

export const LeftWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 20px;
`;

export const Title = styled.h1`
  color: ${({ theme }) => theme.text.accent};
  font-size: 28px;
  font-weight: 600;
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 16px;
  font-weight: 400;
`;

export const CalendarContainer = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.background.white};
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

export const RightWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const ButtonContainer = styled.div`
  height: 40px;
  background-color: ${({ theme }) => theme.background.light_blue};
  margin-bottom: 44px;
`;

export const Button = styled.button`
  width: 100%;
  height: 40px;
  color: ${({ theme }) => theme.buttonText.primary};
  font-size: 16px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.button.primary};
  border-radius: 50px;
  border: none;
  margin-bottom: 44px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const ListItemContainer = styled.div`
  overflow-y: auto;
`;

export const ListItem = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.background.white};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 0 20px;
  font-size: 14px;
`;

export const Category = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.text.primary};
`;

export const PaymentMethod = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.text.secondary};
`;

export const Amount = styled.div<{ type: "income" | "expense" }>`
  flex: 1;
  color: ${({ type, theme }) =>
    type === "income" ? theme.text.accent : theme.text.danger};
  text-align: right;
`;

export const Empty = styled.div`
  text-align: center;
  margin-top: 180px;
  color: ${({ theme }) => theme.text.secondary};
`;
