"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface GenerationChartProps {
  data: Array<{ month: string; year: number; value: number }>;
}

export function GenerationChart({ data }: GenerationChartProps) {
  const chartData = {
    labels: data.map((d) => `${d.month} ${d.year}`),
    datasets: [
      {
        label: "Energy Generated",
        data: data.map((d) => d.value),
        backgroundColor: "rgba(0, 188, 212, 0.7)",
        borderColor: "#00BCD4",
        borderWidth: 1,
        borderRadius: 6,
        hoverBackgroundColor: "#00BCD4",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#0D2818",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: (context: { parsed: { y: number } }) => {
            return `${context.parsed.y.toLocaleString()} kWh`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: { size: 11 },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
        ticks: {
          color: "#6B7280",
          font: { size: 11 },
          callback: (value: number | string) => `${Number(value).toLocaleString()} kWh`,
        },
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Bar data={chartData} options={options} />
    </div>
  );
}
