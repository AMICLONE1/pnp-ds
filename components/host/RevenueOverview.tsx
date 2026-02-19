import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_REVENUE_DATA } from "@/lib/utils/host/data";

export function RevenueOverview(){
  const chartData = {
    labels: MOCK_REVENUE_DATA.map((d) => d.month),
    datasets: [
      {
        label: "Revenue (₹)",
        data: MOCK_REVENUE_DATA.map((d) => d.amount),
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
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0D2818",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<"line">) =>
            `₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 11, family: "Inter" } },
      },
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) =>
            `₹${(Number(value) / 1000).toFixed(0)}K`,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <IndianRupee className="w-5 h-5 text-gold" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <Line data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}