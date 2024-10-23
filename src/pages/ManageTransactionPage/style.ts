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
    color: ${({ theme }) => theme.text.tertiary};
    opacity: 0.7;
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
