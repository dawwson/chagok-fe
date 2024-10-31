import { useEffect, useState } from "react";
import dayjs from "dayjs";

import * as S from "./style";
import { formatDate } from "./util";

import { getExpenseStat } from "../../apis/stat";
import { useError } from "../../contexts/error";
import BasicButton from "../../components/atoms/BasicButton";
import BarChart from "../../components/organisms/BarChart";
import Header from "../../components/organisms/Header";
import YearMonthPicker from "../../components/organisms/YearMonthPicker";
import { ApiError } from "../../types/errorTypes";
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
  const { handleApiError } = useError();

  const [view, setView] = useState<View>("monthly");
  const [stats, setStats] = useState<Stat[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getExpenseStat({
          year: date.year,
          month: date.month,
          view,
        });
        setStats(stats);
      } catch (error) {
        if (error instanceof ApiError) {
          handleApiError(error);
        }
      }
    };

    fetchData();
  }, [date, view]);

  return (
    <S.Wrapper>
      <S.TopWrapper>
        <Header
          title="Statistics"
          description="Check your consumption by category."
        />
        <S.ButtonGroup>
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
        </S.ButtonGroup>
      </S.TopWrapper>
      <S.CenterWrapper>
        <YearMonthPicker
          year={date.year}
          month={date.month}
          onChange={handleChangeDate}
        />
        <S.ChartContainer>{renderBarChart()}</S.ChartContainer>
        <S.RecapContainer>
          <S.RecapTitle>Recap</S.RecapTitle>
          <S.RecapContent>
            <li>content1</li>
            <li>content2</li>
            <li>content3</li>
            <li>content1</li>
            <li>content2</li>
            <li>content3</li>
          </S.RecapContent>
        </S.RecapContainer>
      </S.CenterWrapper>
    </S.Wrapper>
  );
};

export default StatsPage;
