import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100vh;
  padding: 30px;
`;

export const LeftWrapper = styled.div`
  flex: 1;
`;

export const RightWrapper = styled.div`
  flex: 10;
  /* background-color: #f090ff; // NOTE: 임시 배경색. 나중에 삭제하기 */
`;

export const Menu = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  background-color: ${({ theme }) => theme.background.white};
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  a:first-child > div {
    margin-top: 30px;
  }
`;

export const MenuItem = styled.div`
  cursor: pointer;

  svg {
    width: 36px;
    fill: ${({ theme }) => theme.background.white};
    stroke: ${({ theme }) => theme.buttonText.secondary};
  }

  &.logout {
    svg {
      stroke: ${({ theme }) => theme.button.danger};
    }
  }

  &.more-info {
    margin-top: auto;
    margin-bottom: 30px;
  }
`;
