import styled from "styled-components";

export const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ArrowButton = styled.div`
  width: 20px;
  height: 20px;
  background-color: transparent;
  transition: box-shadow 0.3s ease;
  border-radius: 50%;
  cursor: pointer;

  svg {
    fill: none;
    stroke: ${({ theme }) => theme.text.secondary};
  }

  &:hover {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  }
`;

export const DateDisplay = styled.div`
  width: 150px;
  margin: 0 15px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text.secondary};
  text-align: center;
`;
