import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import * as S from "./style";
import { createTx, deleteTx, getTxDetail, updateTx } from "../../apis/tx";

import { useError } from "../../contexts/error";

import BasicButton from "../../components/atoms/BasicButton";
import ChipButton from "../../components/atoms/ChipButton";
import StyledCheckbox from "../../components/atoms/StyledCheckbox";
import Header from "../../components/organisms/Header";
import LoadingScreen from "../../components/organisms/LoadingScreen";
import Modal from "../../components/organisms/Modal";

import { ApiError } from "../../types/errorTypes";
import { localize } from "../../utils/date";
import {
  getCategories,
  getCategoryLabel,
  getTxMethodLabel,
  getTxTypeLabel,
} from "../../utils/string";

const DEFAULT_INCOME_CATEGORY_ID = 1;
const DEFAULT_EXPENSE_CATEGORY_ID = 5;
const MAX_AMOUNT = 1000000000; // 10억
const MAX_DESCRIPTION_LENGTH = 100;

type TxType = "income" | "expense";
type TxMethod = "cash" | "debit card" | "credit card" | "bank transfer";

interface Tx {
  id?: number;
  txType: TxType;
  txMethod: TxMethod;
  categoryId: number;
  amount: number;
  description: string;
  date: string;
  isExcluded: boolean;
}

interface HomeState {
  txId?: number;
  selectedDate?: string;
}

const ManageTransactionPage = () => {
  const navigate = useNavigate();
  const { handleApiError } = useError();
  const { txId, selectedDate } = (useLocation().state as HomeState) || {};

  const isEditPage = !!txId;
  const isAddPage = !!selectedDate;

  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [tx, setTx] = useState<Tx>({
    id: txId,
    txType: "income",
    txMethod: "cash",
    categoryId: 1,
    amount: 0,
    description: "",
    date: selectedDate ?? "",
    isExcluded: false,
  });

  const handleSelectTxType = (txType: TxType) => {
    if (tx.txType !== txType) {
      setTx({
        ...tx,
        txType,
        categoryId:
          txType === "income"
            ? DEFAULT_INCOME_CATEGORY_ID
            : DEFAULT_EXPENSE_CATEGORY_ID,
      });
      return;
    }
    setTx({ ...tx, txType });
  };

  const handleSelectTxMethod = (txMethod: TxMethod) => {
    setTx({ ...tx, txMethod });
  };

  const handleSelectCategory = (categoryId: number) => {
    setTx({ ...tx, categoryId });
  };

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // 숫자 문자열 -> number
    const formatted = Number(value.replace(/[,]/g, ""));
    if (isNaN(formatted)) {
      return;
    }

    if (formatted > MAX_AMOUNT) {
      setTx({ ...tx, amount: MAX_AMOUNT });
      return;
    }

    setTx({ ...tx, amount: formatted });
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    if (value.length > MAX_DESCRIPTION_LENGTH) {
      return;
    }
    setTx({ ...tx, description: value });
  };

  const handleChangeCheckbox = () => {
    setTx({ ...tx, isExcluded: !tx.isExcluded });
  };

  const handleCancel = () => {
    navigate("/");
    // TODO: 초기값 또는 서버에서 가져온 값으로 되돌리기
  };

  const handleAddOrUpdate = async () => {
    try {
      if (isAddPage) {
        await createTx(tx);
      }
      if (isEditPage) {
        await updateTx({ id: txId, ...tx });
      }
      navigate("/", { replace: true });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        handleApiError(error, navigate);
      }
    }
  };

  const handleClickDelete = async () => {
    setIsOpen(true);
  };

  const handleClickModalRightBtn = async () => {
    if (!isEditPage) {
      return;
    }

    try {
      await deleteTx(txId);
      navigate("/", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        handleApiError(error, navigate);
      }
    }
  };

  const renderDate = () => {
    if (isAddPage) {
      return localize(selectedDate);
    }
    if (isEditPage) {
      return localize(tx.date);
    }
  };

  const renderCategoryChips = () => {
    return getCategories().map((category) => {
      if (category.type === tx.txType) {
        return (
          <ChipButton
            key={category.id}
            label={category.label}
            selected={category.id === tx.categoryId}
            onClick={() => handleSelectCategory(category.id)}
          />
        );
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditPage) {
          const txDetail = await getTxDetail(txId);
          setTx(txDetail);
        }
        setIsLoading(false);
      } catch (error) {
        if (error instanceof ApiError) {
          handleApiError(error, navigate);
        }
      }
    };

    fetchData();
  }, [isEditPage, txId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <S.Wrapper>
        <S.LeftWrapper>
          <Header
            title={isEditPage ? "내역 수정하기" : "내역 작성하기"}
            description="수입/지출을 작성해보세요."
          />
          <S.TransactionContainer>
            <S.Date>{renderDate()}</S.Date>
            <S.Type>{getTxTypeLabel(tx.txType)}</S.Type>
            <S.Amount>{tx.amount.toLocaleString() + "원"}</S.Amount>
            <S.Category>{getCategoryLabel(tx.categoryId)}</S.Category>
            <S.Description>
              {`${getTxMethodLabel(tx.txMethod)}${
                tx.description ? ` - ${tx.description}` : ""
              }`}
            </S.Description>
            <S.ButtonGroup>
              <BasicButton
                label="취소"
                size="large"
                type="cancel"
                onClick={handleCancel}
              />
              <BasicButton
                label={isAddPage ? "저장하기" : "수정하기"}
                size="large"
                type="confirm"
                onClick={handleAddOrUpdate}
              />
            </S.ButtonGroup>
          </S.TransactionContainer>
        </S.LeftWrapper>
        <S.RightWrapper>
          <S.SelectorWrapper>
            <S.SubTitle>유형</S.SubTitle>
            <S.ChipGroup>
              <ChipButton
                label="수입"
                selected={tx.txType === "income"}
                onClick={() => handleSelectTxType("income")}
              />
              <ChipButton
                label="지출"
                selected={tx.txType === "expense"}
                onClick={() => handleSelectTxType("expense")}
              />
            </S.ChipGroup>
          </S.SelectorWrapper>
          <S.SelectorWrapper>
            <S.SubTitle>거래 방법</S.SubTitle>
            <S.ChipGroup>
              <ChipButton
                label="현금"
                selected={tx.txMethod === "cash"}
                onClick={() => handleSelectTxMethod("cash")}
              />
              <ChipButton
                label="체크카드"
                selected={tx.txMethod === "debit card"}
                onClick={() => handleSelectTxMethod("debit card")}
              />
              <ChipButton
                label="신용카드"
                selected={tx.txMethod === "credit card"}
                onClick={() => handleSelectTxMethod("credit card")}
              />
              <ChipButton
                label="계좌이체"
                selected={tx.txMethod === "bank transfer"}
                onClick={() => handleSelectTxMethod("bank transfer")}
              />
            </S.ChipGroup>
          </S.SelectorWrapper>
          <S.SelectorWrapper>
            <S.SubTitle>카테고리</S.SubTitle>
            <S.ChipGroup>{renderCategoryChips()}</S.ChipGroup>
          </S.SelectorWrapper>
          <S.SelectorWrapper>
            <S.SubTitle>금액</S.SubTitle>
            <S.Input
              name="amount"
              value={tx.amount.toLocaleString()}
              onChange={handleChangeAmount}
            />
          </S.SelectorWrapper>
          <S.SelectorWrapper>
            <S.SubTitle>내역 설명</S.SubTitle>
            <S.Input
              name="description"
              value={tx.description}
              placeholder="간단한 메모를 남겨보세요 (선택사항)"
              onChange={handleChangeDescription}
            />
          </S.SelectorWrapper>
          <S.SelectorWrapper>
            <StyledCheckbox
              label="합계 계산에 포함하지 않기"
              isChecked={tx.isExcluded}
              onChange={handleChangeCheckbox}
            />
          </S.SelectorWrapper>
          {isEditPage && (
            <S.DeleteButtonWrapper>
              <BasicButton
                label="삭제하기"
                type="danger"
                size="large"
                onClick={handleClickDelete}
              />
            </S.DeleteButtonWrapper>
          )}
        </S.RightWrapper>
      </S.Wrapper>
      {isOpen && (
        <Modal
          type="warn"
          buttons={[
            {
              label: "취소",
              location: "left",
              onClick: () => setIsOpen(false),
            },
            {
              label: "삭제",
              location: "right",
              onClick: handleClickModalRightBtn,
            },
          ]}
        >
          <p style={{ lineHeight: "1.5" }}>
            삭제하시겠어요?
            <br />
            삭제 후 복구할 수 없습니다.
          </p>
        </Modal>
      )}
    </>
  );
};

export default ManageTransactionPage;
