import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import dayjs from "dayjs";

import {
  createBudget,
  getBudget,
  getBudgetRecommendation,
  updateBudget,
} from "../../apis/budget";
import { getTxs } from "../../apis/tx";
import { useError } from "../../contexts/error";
import BasicButton from "../../components/atoms/BasicButton";
import Header from "../../components/organisms/Header";
import Modal from "../../components/organisms/Modal";
import YearMonthPicker from "../../components/organisms/YearMonthPicker";
import { ApiError } from "../../types/errorTypes";
import { capitalize } from "../../utils/string";

const MAX_AMOUNT = 1000000000; // 10억

interface Budget {
  id: number | null;
  year: number; // YYYY
  month: number; // M-MM
  budgets: Array<{
    categoryId: number;
    categoryName: string;
    amount: number;
  }>;
}

const ManageBudgetPage = () => {
  const navigate = useNavigate();
  const { handleApiError } = useError();

  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [targetAmount, setTargetAmount] = useState(0); // 예산 추천시 입력하는 값
  const [spents, setSpents] = useState<Map<string, number>>(new Map());
  const [budget, setBudget] = useState<Budget>({
    id: null,
    year: dayjs().year(),
    month: dayjs().month() + 1,
    budgets: [],
  });

  const handleChangeDate = async (direction: "prev" | "next") => {
    let year: number, month: number;

    if (direction === "prev") {
      if (budget.month === 1) {
        year = budget.year - 1;
        month = 12;
      } else {
        year = budget.year;
        month = budget.month - 1;
      }
    } else if (direction === "next") {
      if (budget.month === 12) {
        year = budget.year + 1;
        month = 1;
      } else {
        year = budget.year;
        month = budget.month + 1;
      }
    } else {
      return;
    }

    try {
      const find = await getBudget(year, month);
      setBudget(find);
    } catch (error) {
      if (error instanceof ApiError) {
        handleApiError(error, navigate);
      }
    }
  };

  const handleSave = async () => {
    try {
      if (budget.id) {
        await updateBudget(budget.id, budget.budgets);
        setSuccessMessage("The budget has been updated.");
      } else {
        await createBudget(budget.year, budget.month, budget.budgets);
        setSuccessMessage("The budget has been created.");
      }
      setIsSuccessModalOpen(true);

      const find = await getBudget(budget.year, budget.month);
      setBudget(find);
    } catch (error) {
      if (error instanceof ApiError) {
        handleApiError(error, navigate);
      }
    }
  };

  const handleRecommend = async () => {
    const recommended = await getBudgetRecommendation(
      budget.year,
      budget.month,
      targetAmount
    );

    if (recommended.budgets.length === 0) {
      setSuccessMessage(
        "No recent budget data found.\nPlease set up your budget to start tracking your expenses!"
      );
    } else {
      setSuccessMessage(
        "Your budget recommendations have been generated!\nCheck them out and adjust as needed."
      );
      setBudget({ id: null, ...recommended });
    }
    setIsRecommendModalOpen(false);
    setIsSuccessModalOpen(true);
    setTargetAmount(0);
  };

  const handleChangeBudgetInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    const categoryId = Number(name);
    const newAmount = Number(value.replace(/[,]/g, ""));

    if (isNaN(newAmount)) {
      return;
    }

    setBudget((prevBudget) => ({
      ...prevBudget,
      budgets: prevBudget.budgets.map((b) =>
        b.categoryId === categoryId
          ? { ...b, amount: newAmount > MAX_AMOUNT ? MAX_AMOUNT : newAmount }
          : b
      ),
    }));
  };

  const handleChangeModalInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    const amount = Number(value.replace(/[,]/g, ""));

    if (isNaN(amount)) {
      return;
    }
    setTargetAmount(amount < MAX_AMOUNT ? amount : MAX_AMOUNT);
  };

  const calculateTotalAmount = () => {
    return budget.budgets.reduce((acc, b) => (acc += b.amount), 0);
  };

  const calcuateTotalSpents = () => {
    return [...spents.values()].reduce((acc, spent) => (acc += spent), 0);
  };

  const renderTotalSavings = () => {
    const totalSavings = calculateTotalAmount() - calcuateTotalSpents();

    if (totalSavings >= 0) {
      return (
        <>
          You have{" "}
          <SavingsSpan $isNegative={false}>
            {totalSavings.toLocaleString()}₩{" "}
          </SavingsSpan>
          remaining from your total budget.
        </>
      );
    } else {
      return (
        <>
          You have exceeded your budget by{" "}
          <SavingsSpan $isNegative={true}>
            {Math.abs(totalSavings).toLocaleString()}₩
          </SavingsSpan>
          .
        </>
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const find = await getBudget(budget.year, budget.month);
        setBudget(find);

        const startOfMonth = dayjs(`${budget.year}-${budget.month}`)
          .startOf("month")
          .toISOString();
        const endOfMonth = dayjs(`${budget.year}-${budget.month}`)
          .endOf("month")
          .toISOString();

        const txs = await getTxs(startOfMonth, endOfMonth);
        const spentMap = new Map();
        txs.forEach((tx) => {
          if (tx.txType === "expense") {
            spentMap.set(tx.categoryName, tx.amount);
          }
        });
        setSpents(spentMap);
      } catch (error) {
        if (error instanceof ApiError) {
          handleApiError(error, navigate);
        }
      }
    };

    fetchData();
  }, [budget.year, budget.month]);

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
              year={budget.year}
              month={budget.month}
              onChange={handleChangeDate}
            />
            <ResultSubtitle>Total</ResultSubtitle>
            <ResultAmount>
              {calculateTotalAmount().toLocaleString()}₩
            </ResultAmount>
            <ResultDescription>{renderTotalSavings()}</ResultDescription>
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
            <RecommendButton onClick={() => setIsRecommendModalOpen(true)}>
              Recommend Budget
            </RecommendButton>
          </ButtonContainer>
          <ListItemContainer>
            {budget.budgets.map((b) => (
              <ListItem key={b.categoryId}>
                <ListItemTitle>{capitalize(b.categoryName)}</ListItemTitle>
                <ListItemSubtitle>
                  <p>
                    Potential savings :{" "}
                    <SavingsSpan
                      $isNegative={
                        b.amount - (spents.get(b.categoryName) ?? 0) < 0
                      }
                    >
                      {(
                        b.amount - (spents.get(b.categoryName) ?? 0)
                      ).toLocaleString()}
                      ₩
                    </SavingsSpan>
                  </p>
                  <p>
                    Spent :{" "}
                    <span>
                      {spents.get(b.categoryName)?.toLocaleString() ?? 0}₩
                    </span>
                  </p>
                </ListItemSubtitle>
                <ListItemInput
                  name={b.categoryId.toString()}
                  value={b.amount.toLocaleString()}
                  onChange={handleChangeBudgetInput}
                />
              </ListItem>
            ))}
          </ListItemContainer>
        </RightWrapper>
      </Wrapper>
      {isRecommendModalOpen && (
        <Modal
          type="info"
          buttons={[
            {
              label: "Cancel",
              location: "left",
              onClick: () => setIsRecommendModalOpen(false),
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
            name="targetAmount"
            value={targetAmount === 0 ? "" : targetAmount.toLocaleString()}
            placeholder="Enter your montly budget"
            onChange={handleChangeModalInput}
          />
        </Modal>
      )}
      {isSuccessModalOpen && (
        <Modal
          type="success"
          buttons={[
            {
              label: "Confirm",
              location: "center",
              onClick: () => setIsSuccessModalOpen(false),
            },
          ]}
        >
          <p style={{ lineHeight: 1.5 }}>
            {successMessage.split("\n").map((line, index) => (
              <span>
                {line}
                <br />
              </span>
            ))}
          </p>
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

export const SavingsSpan = styled.span<{ $isNegative: boolean }>`
  color: ${({ $isNegative, theme }) =>
    $isNegative ? theme.text.danger : theme.text.accent};
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

    &::placeholder {
      opacity: 0; /* 포커스 시 placeholder 숨김 */
    }
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
  }
`;
