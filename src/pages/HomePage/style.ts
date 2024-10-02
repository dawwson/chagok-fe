import { styled } from "styled-components";

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

export const AddButton = styled.button`
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
