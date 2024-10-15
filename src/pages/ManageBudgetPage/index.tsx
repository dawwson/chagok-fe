import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import dayjs from "dayjs";

import { useError } from "../../contexts/error";
import BasicButton from "../../components/atoms/BasicButton";
import Header from "../../components/organisms/Header";
import Modal from "../../components/organisms/Modal";
import LoadingScreen from "../../components/organisms/LoadingScreen";
import { ApiError } from "../../types/errorTypes";
import { capitalize } from "../../utils/string";
import { testBudgets } from "./sample";
import YearMonthPicker from "../../components/organisms/YearMonthPicker";

const MAX_AMOUNT = 1000000000; // 10억

interface Budget {
  categoryId: number;
  categoryName: string;
  amount: number;
}

interface Date {
  year: number; // yyyy
  month: number; // m-mm
}

const ManageBudgetPage = () => {
  const navigate = useNavigate();
  const { handleApiError } = useError();

  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>(testBudgets);
  const [totalBudget, setTotalBudget] = useState<number>();
  const [date, setDate] = useState<Date>({
    year: dayjs().year(),
    month: dayjs().month() + 1,
  });

  const handleChangeDate = (direction: "prev" | "next") => {
    const { year, month } = date;

    if (direction === "prev") {
      if (month === 1) {
        setDate({ year: year - 1, month: 12 });
      } else {
        setDate({ ...date, month: month - 1 });
      }
    }
    if (direction === "next") {
      if (month === 12) {
        setDate({ year: year + 1, month: 1 });
      } else {
        setDate({ ...date, month: month + 1 });
      }
    }
  };

  const handleSave = () => {
    // TODO: 예산 설정 API 연동
  };

  const handleRecommend = () => {
    // TODO: 예산 추천 API 연동
  };

  const handleChangeBudgetInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    const categoryId = Number(name);
    const amount = Number(value.replace(/[,]/g, ""));

    if (isNaN(amount)) {
      return;
    }

    setBudgets((prev) =>
      prev.map((budget) => {
        if (budget.categoryId === categoryId) {
          return {
            ...budget,
            amount: amount > MAX_AMOUNT ? MAX_AMOUNT : amount,
          };
        }
        return budget;
      })
    );
  };

  const handleChangeModalInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const totalAmount = Number(value.replace(/[,]/g, ""));

    if (isNaN(totalAmount)) {
      return;
    }
    setTotalBudget(totalAmount < MAX_AMOUNT ? totalAmount : MAX_AMOUNT);
  };

  const caculateTotalAmount = () => {
    return budgets.reduce((acc, budget) => (acc += budget.amount), 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: API 연동
        // setBudgets([]);
      } catch (error) {
        if (error instanceof ApiError) {
          handleApiError(error, navigate);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    fetchData();

    return () => clearTimeout(timeoutId);
  }, []);

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  return (
    <>
      <Wrapper>
        <LeftWrapper>
          <Header
            title={"Manage a Monthly Budget"}
            description="Set a monthly budget for each category."
          />
          <ResultContainer>
            <YearMonthPicker
              year={date.year}
              month={date.month}
              onChange={handleChangeDate}
            />
            <ResultSubtitle>Total</ResultSubtitle>
            <ResultAmount>
              ₩{caculateTotalAmount().toLocaleString()}
            </ResultAmount>
            <ResultDescription>
              You have <span>₩{caculateTotalAmount().toLocaleString()} </span>
              remaining from your total budget.
            </ResultDescription>
            <ButtonGroup>
              <BasicButton
                label="Cancel"
                size="large"
                type="cancel"
                onClick={() => navigate("/", { replace: true })}
              />
              <BasicButton
                label="Save"
                size="large"
                type="confirm"
                onClick={handleSave}
              />
            </ButtonGroup>
          </ResultContainer>
        </LeftWrapper>
        <RightWrapper>
          <ButtonContainer>
            <RecommendButton onClick={() => setIsOpen(true)}>
              Recommend Budget
            </RecommendButton>
          </ButtonContainer>
          <ListItemContainer>
            {budgets.map((budget) => (
              <ListItem key={budget.categoryId}>
                <ListItemTitle>{capitalize(budget.categoryName)}</ListItemTitle>
                <ListItemSubtitle>
                  Potential savings : ₩{}
                  <br />
                  Spent : ₩{}
                </ListItemSubtitle>
                <ListItemInput
                  name={budget.categoryId.toString()}
                  value={budget.amount.toLocaleString()}
                  onChange={handleChangeBudgetInput}
                />
              </ListItem>
            ))}
          </ListItemContainer>
        </RightWrapper>
      </Wrapper>
      {isOpen && (
        <Modal
          type="info"
          buttons={[
            {
              label: "Cancel",
              location: "left",
              onClick: () => setIsOpen(false),
            },
            {
              label: "Submit",
              location: "right",
              onClick: handleRecommend,
            },
          ]}
        >
          <p style={{ lineHeight: "1.5", marginBottom: "20px" }}>
            Based on your past spending,
            <br />
            we recommend setting your budget.
          </p>
          <ModalInput
            name="totalAmount"
            value={totalBudget?.toLocaleString()}
            placeholder="Enter your montly budget"
            onChange={handleChangeModalInput}
          />
        </Modal>
      )}
    </>
  );
};

export default ManageBudgetPage;

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

export const ResultContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background.white};
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  overflow-y: auto;
`;

export const ResultSubtitle = styled.h1`
  color: ${({ theme }) => theme.text.accent};
  margin: 80px 0px 20px 0px;
  font-size: 20px;
  font-weight: 500;
`;

export const ResultAmount = styled.h1`
  color: ${({ theme }) => theme.text.primary};
  font-size: 50px;
  margin-bottom: 50px;
`;

export const ResultDescription = styled.h1`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 18px;
  margin-bottom: 100px;
  max-width: 100%;

  & span {
    font-weight: bold;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
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
  padding-right: 20px;
`;

export const RecommendButton = styled.button`
  width: 100%;
  height: 40px;
  color: ${({ theme }) => theme.buttonText.primary};
  font-size: 16px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.button.primary};
  border-radius: 50px;
  border: none;
  margin: 0px 0px 44px 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const ListItemContainer = styled.div`
  overflow-y: auto;
  padding-right: 20px;
`;

export const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0px 0px 20px 4px;
`;

export const ListItemTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.accent};
`;

export const ListItemSubtitle = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.5;
`;

export const ListItemInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  border-radius: 50px;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.text.primary};
  outline: none;
  font-size: 16px;

  &:focus {
    border: 1px solid ${({ theme }) => theme.text.accent};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
    opacity: 0.7;
  }
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 8px 0;
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.text.tertiary};
  outline: none;
  font-size: 16px;
  text-align: center;

  &:focus {
    border-bottom: 2px solid ${({ theme }) => theme.text.accent};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;
