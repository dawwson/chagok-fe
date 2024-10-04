import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { styled } from "styled-components";

import { getCategories } from "../../apis/category";
import { getTxDetail } from "../../apis/tx";

import BasicButton from "../../components/atoms/BasicButton";
import ChipButton from "../../components/atoms/ChipButton";
import StyledCheckbox from "../../components/atoms/StyledCheckbox";
import Header from "../../components/organisms/Header";
import LoadingScreen from "../../components/organisms/LoadingScreen";

import { capitalize } from "../../utils/string";
import { localize } from "../../utils/date";

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
    <Wrapper>
      <LeftWrapper>
        <Header
          title={isEditPage ? "Edit a transaction" : "Add a transaction"}
          description="Enter your income or expenses."
        />
        <TransactionContainer>
          <Date>{renderDate()}</Date>
          <Type>{capitalize(tx.txType)}</Type>
          <Amount>₩{tx.amount.toLocaleString()}</Amount>
          <Category>
            {capitalize(
              categories.find(({ id }) => id === tx.categoryId)?.name ?? ""
            )}
          </Category>
          <Description>
            {`${capitalize(tx.txMethod)}${
              tx.description ? ` - ${tx.description}` : ""
            }`}
          </Description>
          <ButtonGroup>
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
              onClick={() => console.log("등록")}
            />
          </ButtonGroup>
        </TransactionContainer>
      </LeftWrapper>
      <RightWrapper>
        <SelectorWrapper>
          <SubTitle>Type</SubTitle>
          <ChipGroup>
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
          </ChipGroup>
        </SelectorWrapper>
        <SelectorWrapper>
          <SubTitle>Transaction Method</SubTitle>
          <ChipGroup>
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
          </ChipGroup>
        </SelectorWrapper>
        <SelectorWrapper>
          <SubTitle>Category</SubTitle>
          <ChipGroup>{renderCategoryChips()}</ChipGroup>
        </SelectorWrapper>
        <SelectorWrapper>
          <SubTitle>Amount</SubTitle>
          <Input
            name="amount"
            value={tx.amount.toLocaleString()}
            onChange={handleChangeAmount}
          />
        </SelectorWrapper>
        <SelectorWrapper>
          <SubTitle>Description</SubTitle>
          <Input
            name="description"
            value={tx.description}
            placeholder="This field is optional."
            onChange={handleChangeDescription}
          />
        </SelectorWrapper>
        <SelectorWrapper>
          <StyledCheckbox
            label="Exclude from transaction sum"
            isChecked={tx.isExcluded}
            onChange={handleChangeCheckbox}
          />
        </SelectorWrapper>
        {isEditPage && (
          <DeleteButtonWrapper>
            <BasicButton
              label="Delete"
              type="danger"
              size="large"
              onClick={handleClickDelete}
            />
          </DeleteButtonWrapper>
        )}
      </RightWrapper>
    </Wrapper>
  );
};

export default ManageTransactionPage;

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

export const TransactionContainer = styled.div`
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

export const Date = styled.h1`
  color: ${({ theme }) => theme.text.secondary};
  margin-top: 20px;
  margin-bottom: 80px;
`;

export const Type = styled.h1`
  color: ${({ theme }) => theme.text.accent};
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 500;
`;

export const Amount = styled.h1`
  color: ${({ theme }) => theme.text.primary};
  font-size: 50px;
  margin-bottom: 50px;
`;

export const Category = styled.h1`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 30px;
  margin-bottom: 20px;
`;

export const Description = styled.h1`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 18px;
  margin-bottom: 100px;
  max-width: 100%;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

export const RightWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding-right: 20px;
`;

export const SelectorWrapper = styled.div`
  margin-bottom: 30px;
`;

export const SubTitle = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.accent};
  margin-bottom: 10px;
  margin: 0px 0px 10px 4px;
`;

export const ChipGroup = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border-radius: 50px;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.text.primary};
  outline: none;
  font-size: 16px;

  &:focus {
    border: 1px solid ${({ theme }) => theme.button.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary}; /* 원하는 색상으로 변경 */
    opacity: 0.7; /* 투명도 조절 (선택적) */
  }

  /* type="number"일 때 스피너 숨기기 */
  &[type="number"]&::-webkit-outer-spin-button,
  &[type="number"]&::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const DeleteButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;
