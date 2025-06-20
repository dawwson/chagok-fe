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
import { getCategoryLabel } from "../../utils/string";

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
  const [spents, setSpents] = useState<Map<number, number>>(new Map());
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
        setSuccessMessage("예산이 수정되었습니다.");
      } else {
        await createBudget(budget.year, budget.month, budget.budgets);
        setSuccessMessage("예산이 등록되었습니다.");
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
          "예산 추천을 위해서는\n최근 6개월 간의 예산 설정 이력이 필요해요.\n먼저 예산을 설정하면 다음부터 맞춤 추천을\n받아보실 수 있어요!"
        );
      } else {
        setSuccessMessage(
          "추천 예산이 생성되었습니다!\n내용을 확인하고 필요에 따라 조정해 보세요.\n변경 내용을 저장해야 적용됩니다."
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
          예산이&nbsp;
          <S.SavingsSpan $isNegative={false}>
            {totalSavings.toLocaleString()}원
          </S.SavingsSpan>
          &nbsp;남았습니다.
          <br />
          남은 금액도 알차게 활용해 보세요!
        </>
      );
    } else {
      return (
        <>
          예산보다&nbsp;
          <S.SavingsSpan $isNegative={true}>
            {Math.abs(totalSavings).toLocaleString()}
          </S.SavingsSpan>
          원이 더 사용되었어요!
          <br />
          필요하다면 조정해 보세요.
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
            spentMap.set(tx.categoryId, tx.amount);
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
            title={"예산 관리하기"}
            description="카테고리별로 월 예산을 설정해 보세요."
          />
          <S.ResultContainer>
            <YearMonthPicker
              year={budget.year}
              month={budget.month}
              onChange={handleChangeDate}
            />
            <S.ResultSubtitle>총 예산</S.ResultSubtitle>
            <S.ResultAmount>
              {calculateTotalAmount().toLocaleString()}원
            </S.ResultAmount>
            <S.ResultDescription>{renderTotalSavings()}</S.ResultDescription>
            <S.ButtonGroup>
              <BasicButton
                label="취소하기"
                size="large"
                type="cancel"
                // TODO: 이전 값으로 되돌리기로 기능 변경
                onClick={() => navigate("/", { replace: true })}
              />
              <BasicButton
                label="저장하기"
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
              예산 추천
            </S.RecommendButton>
          </S.ButtonContainer>
          <S.ListItemContainer>
            {budget.budgets.map((b) => (
              <S.ListItem key={b.categoryId}>
                <S.ListItemTitle>
                  {getCategoryLabel(b.categoryId)}
                </S.ListItemTitle>
                <S.ListItemSubtitle>
                  <p>
                    남은 예산 :&nbsp;
                    <S.SavingsSpan
                      $isNegative={
                        b.amount - (spents.get(b.categoryId) ?? 0) < 0
                      }
                    >
                      {(
                        b.amount - (spents.get(b.categoryId) ?? 0)
                      ).toLocaleString()}
                      원
                    </S.SavingsSpan>
                  </p>
                  <p>
                    사용 금액 :&nbsp;
                    <span>
                      {spents.get(b.categoryId)?.toLocaleString() ?? 0}원
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
              label: "닫기",
              location: "left",
              onClick: () => setIsRecommendModalOpen(false),
            },
            {
              label: "제출",
              location: "right",
              onClick: handleRecommend,
            },
          ]}
        >
          <p style={{ lineHeight: "1.5", marginBottom: "20px" }}>
            지난 6개월간의 예산을 기반으로
            <br />
            카테고리별 예산을 추천해드릴게요.
          </p>
          <S.ModalInput
            name="targetAmount"
            value={targetAmount === 0 ? "" : targetAmount.toLocaleString()}
            placeholder="월 예산을 입력하세요."
            onChange={handleChangeModalInput}
          />
        </Modal>
      )}
      {isSuccessModalOpen && (
        <Modal
          type="success"
          buttons={[
            {
              label: "확인",
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
