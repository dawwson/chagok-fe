import {
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styled, { useTheme } from "styled-components";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
  /* 막대 아래 표시할 텍스트 */
  barLabels: string[];
  leftDataset: {
    label: string;
    data: number[];
  };
  rightDataset: {
    label: string;
    data: number[];
  };
}

const BarChart = ({ barLabels, leftDataset, rightDataset }: Props) => {
  const theme = useTheme();

  const data: ChartData<"bar"> = {
    labels: barLabels,
    datasets: [
      {
        label: leftDataset.label,
        data: leftDataset.data,
        backgroundColor: theme.button.secondary,
        borderColor: theme.button.secondary,
        borderWidth: 0,
        borderRadius: 9,
        categoryPercentage: 0.5, // 각 카테고리의 사용 가능한 너비의 백분율
        barPercentage: 0.7, // 각 막대의 사용 가능한 너비의 백분율
      },
      {
        label: rightDataset.label,
        data: rightDataset.data, // 올해 데이터
        backgroundColor: theme.button.primary,
        borderColor: theme.button.primary,
        borderWidth: 0,
        borderRadius: 9,
        categoryPercentage: 0.5, // 각 카테고리의 사용 가능한 너비의 백분율
        barPercentage: 0.7, // 각 막대의 사용 가능한 너비의 백분율
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false, // 부모 크기에 맞춰서 canvas 크기 조정
    plugins: {
      legend: {
        // 범례를 상단에 표시
        position: "top",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          // X축 라벨이 겹치지 않도록 회전
          maxRotation: 0,
          minRotation: 0,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Wrapper>
      <Bar data={data} options={options} />
    </Wrapper>
  );
};

export default BarChart;

export const Wrapper = styled.div`
  width: 1500px;
  height: 100%;
  padding-bottom: 10px;
  position: absolute;
`;
