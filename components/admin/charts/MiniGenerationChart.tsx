"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler,
    TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Filler
);

interface MiniGenerationChartProps {
    labels: string[];
    values: number[];
    color?: string;
    unit?: string;
}

export function MiniGenerationChart({
    labels,
    values,
    color = "#4CAF50",
    unit = "kWh",
}: MiniGenerationChartProps) {
    const chartData = {
        labels,
        datasets: [
            {
                data: values,
                borderColor: color,
                backgroundColor: `${color}15`,
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 4,
                pointBackgroundColor: color,
                pointBorderColor: "#fff",
                pointBorderWidth: 1,
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "#0D2818",
                titleColor: "#fff",
                bodyColor: "#fff",
                padding: 8,
                cornerRadius: 6,
                callbacks: {
                    label: (context: TooltipItem<"line">) => {
                        const value = context.parsed.y ?? 0;
                        return `${value.toLocaleString("en-IN")} ${unit}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#9CA3AF", font: { size: 9 } },
            },
            y: {
                display: false,
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="h-[120px]">
            <Line data={chartData} options={options} />
        </div>
    );
}
