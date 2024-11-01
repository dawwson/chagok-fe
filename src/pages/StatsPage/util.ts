import dayjs from "dayjs";

export const formatDate = (year: number, month: number) => {
  return dayjs(new Date(year, month - 1)).format("MMM YYYY");
};

interface Stat {
  categoryId: number;
  categoryName: string;
  previous: number;
  current: number;
}

interface StatWithChange extends Stat {
  change: number;
}

/**
 * 카테고리별 지출 변화율
 * @param stats
 * @returns
 */
export const getCategoryChangeRates = (stats: Stat[]) => {
  const newlyCreated: StatWithChange[] = [];
  const increased: StatWithChange[] = [];
  const decreased: StatWithChange[] = [];

  let maxChange = 0;
  let minChange = 0;

  stats.forEach((stat) => {
    const change = Math.round(
      calulateRateOfChange(stat.previous, stat.current)
    );

    if (change === Infinity) {
      newlyCreated.push({ ...stat, change });
    } else if (change > 0) {
      increased.push({ ...stat, change });
      maxChange = change > maxChange ? change : maxChange;
    } else if (change < 0) {
      decreased.push({ ...stat, change });
      minChange = change < minChange ? change : minChange;
    }
  });

  return {
    newlyCreated,
    mostIncreased: increased.filter(({ change }) => change === maxChange),
    mostDecreased: decreased.filter(({ change }) => change === minChange),
  };
};

/**
 * 총 변화율
 * - 소수점 첫째자리에서 반올림
 */
export const getOverallChangeRate = (stats: Stat[]) => {
  const totalPrevious = stats.reduce((acc, stat) => (acc += stat.previous), 0);
  const totalCurrent = stats.reduce((acc, stat) => (acc += stat.current), 0);

  return {
    totalPrevious,
    totalCurrent,
    totalChange: Math.round(calulateRateOfChange(totalPrevious, totalCurrent)),
  };
};

const calulateRateOfChange = (previous: number, current: number) => {
  const change = ((current - previous) / previous) * 100;

  // NOTE: 0을 0으로 나누면 NaN => 변화율 0으로 처리
  //       양수를 0으로 나누면 Infinity => 그대로 Infinity로 처리
  return isNaN(change) ? 0 : change;
};
