import { useEffect, useState } from "react";
import dayjs from "dayjs";

import * as S from "./style";
import {
  formatDate,
  getCategoryChangeRates,
  getOverallChangeRate,
} from "./util";

import { getExpenseStat } from "../../apis/stat";
import { useError } from "../../contexts/error";
import BasicButton from "../../components/atoms/BasicButton";
import BarChart from "../../components/organisms/BarChart";
import Header from "../../components/organisms/Header";
import LoadingScreen from "../../components/organisms/LoadingScreen";
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
    if (stats.length === 0) {
      return <LoadingScreen />;
    }

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

  const renderRecapContent = () => {
    const { totalPrevious, totalCurrent, totalChange } =
      getOverallChangeRate(stats);

    let totalChangeMessage = "";

    if (view === "monthly") {
      if (totalChange === Infinity) {
        totalChangeMessage = `Total spending started from 0 won and has newly increased to ${totalCurrent.toLocaleString()} won compared to last year.`;
      } else if (totalChange > 0) {
        totalChangeMessage = `Total spending increased from ${totalPrevious.toLocaleString()} won to ${totalCurrent.toLocaleString()} won, showing a ${totalChange}% increase compared to last month.`;
      } else if (totalChange < 0) {
        totalChangeMessage = `Total spending decreased from ${totalPrevious.toLocaleString()} won to ${totalCurrent.toLocaleString()} won, showing a ${Math.abs(
          totalChange
        )}% decrease compared to last month.`;
      } else {
        totalChangeMessage = `Total spending remains the same at ${totalPrevious.toLocaleString()} won compared to last month.`;
      }
    } else {
      if (totalChange === Infinity) {
        totalChangeMessage = `Total spending started from 0 won and has newly increased to ${totalCurrent.toLocaleString()} won compared to the same month last year.`;
      } else if (totalChange > 0) {
        totalChangeMessage = `Total spending increased from ${totalPrevious.toLocaleString()} won to ${totalCurrent.toLocaleString()} won, showing a ${totalChange}% increase compared to the same month last year.`;
      } else if (totalChange < 0) {
        totalChangeMessage = `Total spending decreased from ${totalPrevious.toLocaleString()} won to ${totalCurrent.toLocaleString()} won, showing a ${Math.abs(
          totalChange
        )}% decrease compared to the same month last year.`;
      } else {
        totalChangeMessage = `Total spending remains the same at ${totalPrevious.toLocaleString()} won compared to the same month last year.`;
      }
    }

    const { newlyCreated, mostIncreased, mostDecreased } =
      getCategoryChangeRates(stats);

    const isDisplayed =
      newlyCreated.length > 0 ||
      mostIncreased.categoryNames.length > 0 ||
      mostDecreased.categoryNames.length > 0;

    return (
      <ul>
        ✓ Changes in Total Expenses
        <br />
        <br />
        <li>{totalChangeMessage}</li>
        <br />
        <br />
        {isDisplayed && "✓ Changes by Category"}
        <br />
        <br />
        {newlyCreated.length > 0 && (
          <li>
            Spending has newly occurred in the following categories:{" "}
            {newlyCreated
              .map((categoryName, index) => {
                const isLast = index > 0 && index === newlyCreated.length - 1;

                if (isLast) {
                  return `and ${capitalize(categoryName)}`;
                } else {
                  return capitalize(categoryName);
                }
              })
              .join(", ")}
            .
          </li>
        )}
        {mostIncreased.categoryNames.length > 0 && (
          <li>
            The categories with the highest increase
            {mostIncreased.categoryNames.length === 1 ? " is " : " are "}
            {mostIncreased.categoryNames
              .map((categoryName, index) => {
                const isLast =
                  index > 0 && index === mostIncreased.categoryNames.length - 1;

                if (isLast) {
                  return `and ${capitalize(categoryName)}`;
                } else {
                  return capitalize(categoryName);
                }
              })
              .join(", ")}
            , with an increase of {mostIncreased.change}% compared to
            {view === "monthly" ? " last month." : " the same month last year."}
          </li>
        )}
        {mostDecreased.categoryNames.length > 0 && (
          <li>
            The categories with the highest decrease
            {mostDecreased.categoryNames.length === 1 ? " is " : " are "}
            {mostDecreased.categoryNames
              .map((categoryName, index) => {
                const isLast =
                  index > 0 && index === mostDecreased.categoryNames.length - 1;

                if (isLast) {
                  return `and ${capitalize(categoryName)}`;
                } else {
                  return capitalize(categoryName);
                }
              })
              .join(", ")}
            , with a decrease of {mostIncreased.change}% compared to
            {view === "monthly" ? " last month." : " the same month last year."}
          </li>
        )}
      </ul>
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
          <S.RecapContent>{renderRecapContent()}</S.RecapContent>
        </S.RecapContainer>
      </S.CenterWrapper>
    </S.Wrapper>
  );
};

export default StatsPage;
