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

interface PaymentRevenueChartProps {
    data: Array<{ month: string; year: number; value: number }>;
}

export function PaymentRevenueChart({ data }: PaymentRevenueChartProps) {
    const chartData = {
        labels: data.map((d) => `${d.month} ${d.year}`),
        datasets: [
            {
                label: "Revenue",
                data: data.map((d) => d.value),
                borderColor: "#FFB800",
                backgroundColor: "rgba(255, 184, 0, 0.08)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#FFB800",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7,
                borderWidth: 2.5,
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
                borderColor: "rgba(255,184,0,0.3)",
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: (context: TooltipItem<"line">) => {
                        const value = context.parsed.y ?? 0;
                        return `₹${value.toLocaleString("en-IN")}`;
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
                    color: "rgba(0,0,0,0.04)",
                },
                ticks: {
                    color: "#6B7280",
                    font: { size: 11 },
                    callback: (value: number | string) =>
                        `₹${(Number(value) / 1000).toFixed(0)}k`,
                },
            },
        },
        interaction: {
            intersect: false,
            mode: "index" as const,
        },
    };

    return (
        <div className="h-[300px]">
            <Line data={chartData} options={options} />
        </div>
    );
}
