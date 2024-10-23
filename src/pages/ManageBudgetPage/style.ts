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
  margin-top: auto;
  margin-bottom: 30px;
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
