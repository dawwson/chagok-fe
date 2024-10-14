import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px); /* 모달이 위에서 내려오는 효과 */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0; /* 초기값 */
  animation: ${fadeIn} 0.3s ease forwards; /* 서서히 나타나는 애니메이션 */
`;

export const ModalContainer = styled.div`
  width: 400px;
  max-width: 90%;
  background-color: ${({ theme }) => theme.background.white};
  border-radius: 15px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  padding: 40px 20px;
  z-index: 1001;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeaderIcon = styled.div`
  width: 16%;
  height: 16%;
  color: ${({ theme }) => theme.text.primary};
`;

export const Content = styled.div`
  padding: 30px 20px;
  font-size: 1rem;
  color: ${({ theme }) => theme.text.primary};
  text-align: center;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 10px;

  & > button {
    margin: 0 30px;
  }
`;
