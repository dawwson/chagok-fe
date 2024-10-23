import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import * as S from "./style";

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
    try {
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
        setBudget({ id: budget.id, ...recommended });
      }
      setIsRecommendModalOpen(false);
      setIsSuccessModalOpen(true);
      setTargetAmount(0);
    } catch (error) {
      if (error instanceof ApiError) {
        handleApiError(error);
      }
    }
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
          <S.SavingsSpan $isNegative={false}>
            {totalSavings.toLocaleString()}₩{" "}
          </S.SavingsSpan>
          remaining from your total budget.
        </>
      );
    } else {
      return (
        <>
          You have exceeded your budget by{" "}
          <S.SavingsSpan $isNegative={true}>
            {Math.abs(totalSavings).toLocaleString()}₩
          </S.SavingsSpan>
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
      <S.Wrapper>
        <S.LeftWrapper>
          <Header
            title={"Manage a Monthly Budget"}
            description="Set a monthly budget for each category."
          />
          <S.ResultContainer>
            <YearMonthPicker
              year={budget.year}
              month={budget.month}
              onChange={handleChangeDate}
            />
            <S.ResultSubtitle>Total</S.ResultSubtitle>
            <S.ResultAmount>
              {calculateTotalAmount().toLocaleString()}₩
            </S.ResultAmount>
            <S.ResultDescription>{renderTotalSavings()}</S.ResultDescription>
            <S.ButtonGroup>
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
            </S.ButtonGroup>
          </S.ResultContainer>
        </S.LeftWrapper>
        <S.RightWrapper>
          <S.ButtonContainer>
            <S.RecommendButton onClick={() => setIsRecommendModalOpen(true)}>
              Recommend Budget
            </S.RecommendButton>
          </S.ButtonContainer>
          <S.ListItemContainer>
            {budget.budgets.map((b) => (
              <S.ListItem key={b.categoryId}>
                <S.ListItemTitle>{capitalize(b.categoryName)}</S.ListItemTitle>
                <S.ListItemSubtitle>
                  <p>
                    Potential savings :{" "}
                    <S.SavingsSpan
                      $isNegative={
                        b.amount - (spents.get(b.categoryName) ?? 0) < 0
                      }
                    >
                      {(
                        b.amount - (spents.get(b.categoryName) ?? 0)
                      ).toLocaleString()}
                      ₩
                    </S.SavingsSpan>
                  </p>
                  <p>
                    Spent :{" "}
                    <span>
                      {spents.get(b.categoryName)?.toLocaleString() ?? 0}₩
                    </span>
                  </p>
                </S.ListItemSubtitle>
                <S.ListItemInput
                  name={b.categoryId.toString()}
                  value={b.amount.toLocaleString()}
                  onChange={handleChangeBudgetInput}
                />
              </S.ListItem>
            ))}
          </S.ListItemContainer>
        </S.RightWrapper>
      </S.Wrapper>
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
          <S.ModalInput
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
              <span key={index}>
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
