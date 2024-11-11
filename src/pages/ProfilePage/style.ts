import { styled } from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
`;

export const ScrollableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const Container = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 40px 0px 60px 0px;

  p {
    line-height: 1.2;
    color: ${({ theme }) => theme.text.secondary};
  }

  span {
    font-weight: 600;
  }

  i {
    font-style: italic;
  }
`;

export const SubTitle = styled.h1`
  display: inline-block;
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.text.accent};

  &.delete-account {
    color: ${({ theme }) => theme.text.danger};
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border-radius: 50px;
  border: 2px solid ${({ theme }) => theme.button.secondary};
  outline: none;
  font-size: 16px;

  &:focus {
    border: 2px solid ${({ theme }) => theme.button.primary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.button.secondary};
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
`;

export const DeleteAccountDescription = styled.p`
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.2;

  span {
    font-weight: 600;
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
