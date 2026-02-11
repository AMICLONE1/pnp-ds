"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface GenerationTrendChartProps {
    data: { label: string; value: number; prev: number }[];
    unit?: string;
}

export function GenerationTrendChart({ data, unit = "kWh" }: GenerationTrendChartProps) {
    const chartData = {
        labels: data.map((d) => d.label),
        datasets: [
            {
                label: "Current Period",
                data: data.map((d) => d.value),
                borderColor: "#4CAF50",
                backgroundColor: "rgba(76, 175, 80, 0.08)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#4CAF50",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 6,
                borderWidth: 2.5,
            },
            {
                label: "Previous Period",
                data: data.map((d) => d.prev),
                borderColor: "#FFB800",
                backgroundColor: "transparent",
                fill: false,
                tension: 0.4,
                pointBackgroundColor: "#FFB800",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 2,
                pointHoverRadius: 5,
                borderWidth: 1.5,
                borderDash: [5, 5],
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top" as const,
                align: "end" as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: "circle",
                    boxWidth: 6,
                    boxHeight: 6,
                    padding: 20,
                    font: { size: 11 },
                    color: "#6B7280",
                },
            },
            tooltip: {
                backgroundColor: "#0D2818",
                titleColor: "#fff",
                bodyColor: "#fff",
                padding: 12,
                cornerRadius: 8,
                borderColor: "rgba(76,175,80,0.3)",
                borderWidth: 1,
                callbacks: {
                    label: (context: TooltipItem<"line">) => {
                        const value = context.parsed.y ?? 0;
                        return `${context.dataset.label}: ${value.toLocaleString("en-IN")} ${unit}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#6B7280", font: { size: 11 } },
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(0,0,0,0.04)" },
                ticks: {
                    color: "#6B7280",
                    font: { size: 11 },
                    callback: (value: number | string) =>
                        `${Number(value).toLocaleString("en-IN")}`,
                },
            },
        },
        interaction: {
            intersect: false,
            mode: "index" as const,
        },
    };

    return (
        <div className="h-[350px]">
            <Line data={chartData} options={options} />
        </div>
    );
}
