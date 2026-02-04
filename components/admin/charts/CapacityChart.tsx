"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CapacityChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = [
  "#FFB800", // Gold
  "#0D2818", // Forest
  "#4CAF50", // Green
  "#00BCD4", // Cyan
  "#FF9800", // Orange
  "#9C27B0", // Purple
  "#E91E63", // Pink
  "#3F51B5", // Indigo
];

export function CapacityChart({ data }: CapacityChartProps) {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: COLORS.slice(0, data.length),
        borderColor: "#fff",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: { size: 12 },
          color: "#374151",
        },
      },
      tooltip: {
        backgroundColor: "#0D2818",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: (context: { label: string; parsed: number }) => {
            const total = data.reduce((sum, d) => sum + d.value, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed.toLocaleString()} kW (${percentage}%)`;
          },
        },
      },
    },
  };

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-400">
        No capacity data available
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
