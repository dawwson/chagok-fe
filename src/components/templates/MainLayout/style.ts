import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  height: 100vh;
  padding: 50px;
`;

export const LeftWrapper = styled.div`
  flex: 1;
`;

export const RightWrapper = styled.div`
  flex: 12;
`;

export const Menu = styled.div`
  width: 100%;
  height: 100%;
  min-height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  padding: 20px;
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
