  import { motion } from "framer-motion";
  import {
    Chart as ChartJS,
    TooltipItem,
  } from "chart.js";
  import { Line } from "react-chartjs-2";
  import {
    CloudSun,
    Droplets,
  } from "lucide-react";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { IRRADIANCE_DATA } from "@/lib/utils/host/analytics/data";

export function IrradianceCorrelationChart(){
  const chartData = {
    labels: IRRADIANCE_DATA.map((d) => d.hour),
    datasets: [
      {
        label: "Solar Irradiance (W/m²)",
        data: IRRADIANCE_DATA.map((d) => d.irradiance),
        borderColor: "#FFB800",
        backgroundColor: "rgba(255, 184, 0, 0.08)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: "#FFB800",
        pointHoverBackgroundColor: "#FFB800",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        yAxisID: "y",
      },
      {
        label: "Generation (kWh)",
        data: IRRADIANCE_DATA.map((d) => d.generation),
        borderColor: "#0D2818",
        backgroundColor: "rgba(13, 40, 24, 0.08)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointBackgroundColor: "#0D2818",
        pointHoverBackgroundColor: "#0D2818",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
        yAxisID: "y1",
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
          padding: 20,
          font: { size: 12, family: "Inter" },
          color: "#6B7280",
        },
      },
      tooltip: {
        backgroundColor: "#0D2818",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const unit = context.datasetIndex === 0 ? "W/m²" : "kWh";
            return ` ${context.dataset.label}: ${(context.parsed.y ?? 0).toLocaleString("en-IN")} ${unit}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 10, family: "Inter" }, maxTicksLimit: 12 },
      },
      y: {
        type: "linear" as const,
        position: "left" as const,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#FFB800",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `${value}`,
        },
        title: {
          display: true,
          text: "Irradiance (W/m²)",
          color: "#FFB800",
          font: { size: 11, family: "Inter" },
        },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        grid: { drawOnChartArea: false },
        ticks: {
          color: "#0D2818",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `${value}`,
        },
        title: {
          display: true,
          text: "Generation (kWh)",
          color: "#0D2818",
          font: { size: 11, family: "Inter" },
        },
      },
    },
    interaction: { intersect: false, mode: "index" as const },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CloudSun className="w-5 h-5 text-gold" />
            Irradiance vs Generation Correlation
          </CardTitle>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
            <Droplets className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-medium text-green-700">
              0.94 Correlation
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Line data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}