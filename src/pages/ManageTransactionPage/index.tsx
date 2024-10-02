import { useLocation } from "react-router-dom";
import Header from "../../components/organisms/Header";
import { styled } from "styled-components";
import ChipButton from "../../components/atoms/ChipButton";
import { useState } from "react";
import { capitalize } from "../../utils/string";
import StyledCheckbox from "../../components/atoms/StyledCheckbox";
import BasicButton from "../../components/atoms/BasicButton";

// TODO: input 컴포넌트 분리
// TODO: API 연동

type TxType = "income" | "expense";
type TxMethod = "cash" | "debit card" | "credit card" | "bank transfer";

interface Category {
  id: number;
  name: string;
  type: TxType;
}

const ManageTransactionPage = () => {
  const location = useLocation();
  const { txId, date } = location.state || {};

  const [tx, setTx] = useState({
    txType: "income",
    txMethod: "cash",
    categoryId: 1,
    amount: 0,
    description: "",
    date,
    isExcluded: false,
  });
  const [cagegories, setCategories] = useState<Category[]>([
    { id: 1, name: "salary", type: "income" },
    { id: 2, name: "business", type: "income" },
    { id: 3, name: "investment", type: "income" },
    { id: 4, name: "other income", type: "income" },
    { id: 5, name: "food", type: "expense" },
    { id: 6, name: "housing", type: "expense" },
    { id: 7, name: "transportation", type: "expense" },
    { id: 8, name: "healthcare", type: "expense" },
    { id: 9, name: "communication", type: "expense" },
    { id: 10, name: "education", type: "expense" },
    { id: 11, name: "entertainment", type: "expense" },
    { id: 12, name: "shopping", type: "expense" },
    { id: 13, name: "household", type: "expense" },
    { id: 14, name: "insurance", type: "expense" },
    { id: 15, name: "tax", type: "expense" },
    { id: 16, name: "pet", type: "expense" },
    { id: 17, name: "subscription", type: "expense" },
    { id: 18, name: "donation", type: "expense" },
    { id: 19, name: "other expense", type: "expense" },
  ]);

  const handleSelectTxType = (txType: TxType) => {
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
    // 1000 단위로 끊은 문자열을 number로 변환
    setTx({ ...tx, amount: Number(value.replace(/[,]/g, "")) });
  };

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setTx({ ...tx, description: value });
  };

  const handleChangeCheckbox = () => {
    setTx({ ...tx, isExcluded: !tx.isExcluded });
  };

  const handleClickDelete = () => {
    console.log("delete");
  };

  const renderCategories = () => {
    return cagegories.map((category) => {
      if (category.type === tx.txType) {
        return (
          <ChipButton
            key={category.id}
            label={capitalize(category.name)}
            selected={tx.categoryId === category.id}
            onClick={() => handleSelectCategory(category.id)}
          />
        );
      }
    });
  };

  return (
    <Wrapper>
      <LeftWrapper>
        <Header
          title={txId ? "Edit a transaction" : "Add a transaction"}
          description="Enter your income or expenses."
        />
        <ResultContainer></ResultContainer>
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
              label="Dedit Card"
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
          <ChipGroup>{renderCategories()}</ChipGroup>
        </SelectorWrapper>
        <SelectorWrapper>
          <SubTitle>Amount</SubTitle>
          <Input
            name="amount"
            value={tx.amount.toLocaleString()}
            placeholder="Please enter numbers only."
            onChange={handleChangeAmount}
          />
        </SelectorWrapper>
        <SelectorWrapper>
          <SubTitle>Description</SubTitle>
          <Input
            name="description"
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
        <DeleteButtonWrapper>
          <BasicButton
            label="Delete"
            type="danger"
            size="large"
            onClick={handleClickDelete}
          />
        </DeleteButtonWrapper>
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

export const ResultContainer = styled.div`
  height: 100%;
  min-height: fit-content;
  background-color: ${({ theme }) => theme.background.white};
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
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
