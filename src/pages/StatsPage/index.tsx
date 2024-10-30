import styled from "styled-components";
import Header from "../../components/organisms/Header";
import BasicButton from "../../components/atoms/BasicButton";
import { useState } from "react";
import YearMonthPicker from "../../components/organisms/YearMonthPicker";
import dayjs from "dayjs";
import BarChart from "../../components/organisms/BarChart";
import { formatDate } from "./util";
import { testStats } from "./sample";
import { capitalize } from "../../utils/string";

type View = "monthly" | "yearly";

interface Date {
  year: number; // YYYY
  month: number; // M~MM
}

interface Stat {
  categoryId: number;
  categoryName: string;
  previous: number;
  current: number;
}

const StatsPage = () => {
  const [view, setView] = useState<View>("monthly");
  const [stats, setStats] = useState<Stat[]>(testStats);
  const [date, setDate] = useState<Date>({
    year: dayjs().year(),
    month: dayjs().month() + 1,
  });

  const handleChangeDate = async (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (date.month === 1) {
        setDate({ year: date.year - 1, month: 12 });
      } else {
        setDate({
          year: date.year,
          month: date.month - 1,
        });
      }
    } else if (direction === "next") {
      if (date.month === 12) {
        setDate({ year: date.year + 1, month: 1 });
      } else {
        setDate({ year: date.year, month: date.month + 1 });
      }
    }
  };

  const renderBarChart = () => {
    let leftLabel = "";
    const rightLabel = formatDate(date.year, date.month);

    if (view === "yearly") {
      // 전년도 동월로 설정
      leftLabel = formatDate(date.year - 1, date.month);
    } else {
      if (date.month === 1) {
        // 현재 1월이면 전년도 12월로 설정
        leftLabel = formatDate(date.year - 1, 12);
      } else {
        // 현재 1월이 아니면 전월로 설정
        leftLabel = formatDate(date.year, date.month - 1);
      }
    }

    return (
      <BarChart
        barLabels={stats.map((stat) => capitalize(stat.categoryName))}
        leftDataset={{
          label: leftLabel,
          data: stats.map((stat) => stat.previous),
        }}
        rightDataset={{
          label: rightLabel,
          data: stats.map((stat) => stat.current),
        }}
      />
    );
  };

  return (
    <Wrapper>
      <TopWrapper>
        <Header
          title="Statistics"
          description="Check your consumption by category."
        />
        <ButtonGroup>
          <BasicButton
            label="Monthly"
            size="small"
            type={view === "monthly" ? "confirm" : "cancel"}
            onClick={() => setView("monthly")}
          />
          <BasicButton
            label="Yearly"
            size="small"
            type={view === "yearly" ? "confirm" : "cancel"}
            onClick={() => setView("yearly")}
          />
        </ButtonGroup>
      </TopWrapper>
      <CenterWrapper>
        <YearMonthPicker
          year={date.year}
          month={date.month}
          onChange={handleChangeDate}
        />
        <ChartContainer>{renderBarChart()}</ChartContainer>
        <RecapContainer>
          <RecapTitle>Recap</RecapTitle>
          <RecapContent>
            <li>content1</li>
            <li>content2</li>
            <li>content3</li>
            <li>content1</li>
            <li>content2</li>
            <li>content3</li>
          </RecapContent>
        </RecapContainer>
      </CenterWrapper>
    </Wrapper>
  );
};

export default StatsPage;

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
