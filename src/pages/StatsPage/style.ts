import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 30px;
`;

export const TopWrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-items: flex-end;
  align-items: end;
  gap: 10px;
  margin-left: auto;
`;

export const CenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.background.white};
  border-radius: 20px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  gap: 30px;
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 100%;
  position: relative;
  overflow-x: auto;
`;

export const RecapContainer = styled.div`
  display: flex;
  gap: 40px;
  color: ${({ theme }) => theme.text.secondary};
`;

export const RecapTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  font-weight: 600;
`;

export const RecapContent = styled.div`
  width: 100%;
  min-height: 50px;
  max-height: 100px;
  margin-top: auto;
  overflow-y: auto;

  li {
    font-size: 16px;
    line-height: 2;
  }
`;
