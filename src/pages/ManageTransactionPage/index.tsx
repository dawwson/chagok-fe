import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import * as S from "./style";
import { getCategories } from "../../apis/category";
import { createTx, getTxDetail, updateTx } from "../../apis/tx";

import BasicButton from "../../components/atoms/BasicButton";
import ChipButton from "../../components/atoms/ChipButton";
import StyledCheckbox from "../../components/atoms/StyledCheckbox";
import Header from "../../components/organisms/Header";
import LoadingScreen from "../../components/organisms/LoadingScreen";

import { capitalize } from "../../utils/string";
import { localize } from "../../utils/date";
import { ApiError } from "../../types/errorTypes";

const DEFAULT_INCOME_CATEGORY_ID = 1;
const DEFAULT_EXPENSE_CATEGORY_ID = 5;
const MAT_AMOUNT = 20000000000;
const MAX_DESCRIPTION_LENGTH = 100;

type TxType = "income" | "expense";
type TxMethod = "cash" | "debit card" | "credit card" | "bank transfer";

interface Category {
  id: number;
  name: string;
  type: TxType;
}

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
  const location = useLocation();
  const { txId, selectedDate } = (location.state as HomeState) || {};

  const isEditPage = !!txId;
  const isAddPage = !!selectedDate;

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
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

    if (formatted > MAT_AMOUNT) {
      setTx({ ...tx, amount: MAT_AMOUNT });
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

  const handleClickCancel = () => {
    // TODO: 모달로 변경
  };

  const handleClickAddOrUpdate = async () => {
    try {
      if (isAddPage) {
        await createTx(tx);
      }
      if (isEditPage) {
        await updateTx({ id: txId, ...tx });
      }
    } catch (error) {
      if (error instanceof ApiError) {
        // TODO: 모달로 변경
        if (error.errorCode === "CATEGORY_NOT_FOUND") {
          console.log(error.detail);
        }
        if (error.errorCode === "TX_FORBIDDEN") {
          console.log(error.detail);
        }
      }
    } finally {
      navigate("/", { replace: true });
    }
  };

  const handleClickDelete = () => {
    console.log("delete");
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
    return categories.map((category) => {
      if (category.type === tx.txType) {
        return (
          <ChipButton
            key={category.id}
            label={capitalize(category.name)}
            selected={category.id === tx.categoryId}
            onClick={() => handleSelectCategory(category.id)}
          />
        );
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getCategories();
      setCategories(categories);

      if (isEditPage) {
        const txDetail = await getTxDetail(txId);
        setTx(txDetail);
      }
    };

    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    fetchData();

    return () => clearTimeout(timeoutId);
  }, []);

  if (isEditPage && isLoading) {
    return <LoadingScreen />;
  }

  return (
    <S.Wrapper>
      <S.LeftWrapper>
        <Header
          title={isEditPage ? "Edit a transaction" : "Add a transaction"}
          description="Enter your income or expenses."
        />
        <S.TransactionContainer>
          <S.Date>{renderDate()}</S.Date>
          <S.Type>{capitalize(tx.txType)}</S.Type>
          <S.Amount>₩{tx.amount.toLocaleString()}</S.Amount>
          <S.Category>
            {capitalize(
              categories.find(({ id }) => id === tx.categoryId)?.name ?? ""
            )}
          </S.Category>
          <S.Description>
            {`${capitalize(tx.txMethod)}${
              tx.description ? ` - ${tx.description}` : ""
            }`}
          </S.Description>
          <S.ButtonGroup>
            <BasicButton
              label="Cancel"
              size="large"
              type="cancel"
              onClick={() => console.log("취소")}
            />
            <BasicButton
              label={isAddPage ? "Add" : "Update"}
              size="large"
              type="confirm"
              onClick={handleClickAddOrUpdate}
            />
          </S.ButtonGroup>
        </S.TransactionContainer>
      </S.LeftWrapper>
      <S.RightWrapper>
        <S.SelectorWrapper>
          <S.SubTitle>Type</S.SubTitle>
          <S.ChipGroup>
            <ChipButton
              label="Income"
              selected={tx.txType === "income"}
              onClick={() => handleSelectTxType("income")}
            />
            <ChipButton
              label="Expense"
              selected={tx.txType === "expense"}
              onClick={() => handleSelectTxType("expense")}
            />
          </S.ChipGroup>
        </S.SelectorWrapper>
        <S.SelectorWrapper>
          <S.SubTitle>Transaction Method</S.SubTitle>
          <S.ChipGroup>
            <ChipButton
              label="Cash"
              selected={tx.txMethod === "cash"}
              onClick={() => handleSelectTxMethod("cash")}
            />
            <ChipButton
              label="Debit Card"
              selected={tx.txMethod === "debit card"}
              onClick={() => handleSelectTxMethod("debit card")}
            />
            <ChipButton
              label="Credit Card"
              selected={tx.txMethod === "credit card"}
              onClick={() => handleSelectTxMethod("credit card")}
            />
            <ChipButton
              label="Bank Transfer"
              selected={tx.txMethod === "bank transfer"}
              onClick={() => handleSelectTxMethod("bank transfer")}
            />
          </S.ChipGroup>
        </S.SelectorWrapper>
        <S.SelectorWrapper>
          <S.SubTitle>Category</S.SubTitle>
          <S.ChipGroup>{renderCategoryChips()}</S.ChipGroup>
        </S.SelectorWrapper>
        <S.SelectorWrapper>
          <S.SubTitle>Amount</S.SubTitle>
          <S.Input
            name="amount"
            value={tx.amount.toLocaleString()}
            onChange={handleChangeAmount}
          />
        </S.SelectorWrapper>
        <S.SelectorWrapper>
          <S.SubTitle>Description</S.SubTitle>
          <S.Input
            name="description"
            value={tx.description}
            placeholder="This field is optional."
            onChange={handleChangeDescription}
          />
        </S.SelectorWrapper>
        <S.SelectorWrapper>
          <StyledCheckbox
            label="Exclude from transaction sum"
            isChecked={tx.isExcluded}
            onChange={handleChangeCheckbox}
          />
        </S.SelectorWrapper>
        {isEditPage && (
          <S.DeleteButtonWrapper>
            <BasicButton
              label="Delete"
              type="danger"
              size="large"
              onClick={handleClickDelete}
            />
          </S.DeleteButtonWrapper>
        )}
      </S.RightWrapper>
    </S.Wrapper>
  );
};

export default ManageTransactionPage;
