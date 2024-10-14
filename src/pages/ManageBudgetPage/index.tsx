import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";

import { useError } from "../../contexts/error";
import BasicButton from "../../components/atoms/BasicButton";
import Header from "../../components/organisms/Header";
import LoadingScreen from "../../components/organisms/LoadingScreen";
import { ApiError } from "../../types/errorTypes";
import { capitalize } from "../../utils/string";
import { testBudgets } from "./sample";

const MAX_AMOUNT = 1000000000; // 10억

interface Budget {
  categoryId: number;
  categoryName: string;
  amount: number;
}

const ManageBudgetPage = () => {
  const navigate = useNavigate();
  const { handleApiError } = useError();

  const [isLoading, setIsLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>(testBudgets);

  const handleCancel = () => {};

  const handleSave = () => {};

  const handleRecommend = () => {};

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            <ButtonGroup>
              <BasicButton
                label="Cancel"
                size="large"
                type="cancel"
                onClick={handleCancel}
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
            <RecommendButton onClick={handleRecommend}>
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
                  onChange={handleChangeInput}
                />
              </ListItem>
            ))}
          </ListItemContainer>
        </RightWrapper>
      </Wrapper>
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
    border: 1px solid ${({ theme }) => theme.button.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.text.tertiary};
    opacity: 0.7;
  }
`;
