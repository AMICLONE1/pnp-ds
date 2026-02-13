"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TooltipItem,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Zap,
  Sun,
  Gauge,
  Leaf,
  TreePine,
  Home,
  Activity,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  MapPin,
  CloudSun,
  Droplets,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ─── Mock Data ──────────────────────────────────────────────────────────────

const PLANTS = [
  { id: "1", name: "Vedvyas Solar Park", location: "Cuttack, Odisha", capacityKw: 500, efficiency: 93.2, prRatio: 82.1, availability: 98.5, avgDailyGen: 1875, peakGen: 2340, color: "#0D2818" },
  { id: "2", name: "Sunrise Energy Hub", location: "Bhubaneswar, Odisha", capacityKw: 600, efficiency: 91.8, prRatio: 79.6, availability: 97.2, avgDailyGen: 1520, peakGen: 2180, color: "#1B5E3E" },
  { id: "3", name: "Green Valley Plant", location: "Rourkela, Odisha", capacityKw: 400, efficiency: 88.4, prRatio: 76.3, availability: 94.8, avgDailyGen: 855, peakGen: 1420, color: "#FFB800" },
];

const KPI_DATA = {
  totalGeneration: 127515,
  avgEfficiency: 91.1,
  performanceRatio: 79.3,
  carbonOffset: 127.5,
  genTrend: 8.2,
  effTrend: 1.4,
  prTrend: -0.8,
  co2Trend: 12.3,
};

// 30 days of generation data (actual vs expected)
const DAILY_GENERATION = Array.from({ length: 30 }, (_, i) => {
  const base = 3800 + Math.sin(i * 0.2) * 400;
  const weather = Math.random() * 600 - 200;
  const actual = Math.max(2800, base + weather);
  const expected = 4200 + Math.sin(i * 0.15) * 200;
  return { day: i + 1, actual: Math.round(actual), expected: Math.round(expected) };
});

const WEEKLY_PATTERN = [
  { day: "Mon", avg: 4120 },
  { day: "Tue", avg: 4350 },
  { day: "Wed", avg: 4480 },
  { day: "Thu", avg: 4290 },
  { day: "Fri", avg: 4510 },
  { day: "Sat", avg: 4180 },
  { day: "Sun", avg: 3950 },
];

const MONTHLY_BREAKDOWN = [
  { month: "Sep", actual: 118200, expected: 126000 },
  { month: "Oct", actual: 125400, expected: 130000 },
  { month: "Nov", actual: 121800, expected: 128000 },
  { month: "Dec", actual: 134500, expected: 132000 },
  { month: "Jan", actual: 130200, expected: 131000 },
  { month: "Feb", actual: 127515, expected: 129000 },
];

const IRRADIANCE_DATA = Array.from({ length: 24 }, (_, i) => {
  const irradiance = i < 6 || i > 18 ? 0 : Math.sin(((i - 6) / 12) * Math.PI) * 950 + Math.random() * 80;
  const generation = irradiance > 50 ? irradiance * 0.42 + Math.random() * 30 - 15 : 0;
  return { hour: `${i.toString().padStart(2, "0")}:00`, irradiance: Math.round(Math.max(0, irradiance)), generation: Math.round(Math.max(0, generation)) };
});

const ENV_IMPACT = {
  co2Tons: 127.5,
  treesEquivalent: 5842,
  homesPowered: 312,
};

// ─── Helper Components ──────────────────────────────────────────────────────

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();
    const startValue = hasAnimated.current ? displayValue : 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newValue = startValue + (value - startValue) * easeOutQuart;
      setDisplayValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        hasAnimated.current = true;
      }
    };
    requestAnimationFrame(animate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString("en-IN");

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

// ─── Section Components ─────────────────────────────────────────────────────

function AnalyticsHeader({
  period,
  onPeriodChange,
}: {
  period: string;
  onPeriodChange: (p: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gold/5 to-amber-50/30 border border-gold/15 p-6 sm:p-8"
    >
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none">
        <div className="absolute top-4 right-4 w-48 h-48 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-2xl" />
        <motion.div
          className="absolute top-6 right-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <BarChart3 className="w-20 h-20 text-gold/15" strokeWidth={1} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-forest/5 border border-forest/15 rounded-full">
                <Activity className="w-3.5 h-3.5 text-forest" />
                <span className="text-xs font-medium text-forest">
                  Live Analytics
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">
                  {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black font-heading">
              <span className="gradient-text">Plant Analytics</span>
            </h1>
            <p className="text-gray-600 mt-1.5 text-sm sm:text-base">
              Deep performance insights across your{" "}
              <span className="font-semibold text-forest">1,500 kW</span> solar portfolio.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {["7D", "30D", "90D", "1Y"].map((p) => (
                <button
                  key={p}
                  onClick={() => onPeriodChange(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    period === p
                      ? "bg-white text-forest shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-forest hover:border-forest/20 transition-all">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-forest hover:border-forest/20 transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function KPICards() {
  const stats = [
    {
      icon: Zap,
      label: "Total Generation",
      value: KPI_DATA.totalGeneration,
      suffix: " kWh",
      color: "text-forest",
      bgColor: "bg-forest/10",
      trend: KPI_DATA.genTrend,
      trendLabel: "vs last month",
    },
    {
      icon: Gauge,
      label: "Avg Efficiency",
      value: KPI_DATA.avgEfficiency,
      suffix: "%",
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: KPI_DATA.effTrend,
      trendLabel: "vs last month",
      decimals: 1,
    },
    {
      icon: Sun,
      label: "Performance Ratio",
      value: KPI_DATA.performanceRatio,
      suffix: "%",
      color: "text-gold-dark",
      bgColor: "bg-gold/10",
      trend: KPI_DATA.prTrend,
      trendLabel: "vs last month",
      decimals: 1,
    },
    {
      icon: Leaf,
      label: "Carbon Offset",
      value: KPI_DATA.carbonOffset,
      suffix: " tons",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: KPI_DATA.co2Trend,
      trendLabel: "vs last month",
      decimals: 1,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-xl ${stat.bgColor} transition-transform group-hover:scale-110`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {stat.trend !== null && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    stat.trend >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stat.trend >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-2xl sm:text-3xl font-bold mt-1 ${stat.color}`}>
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix || ""}
                  decimals={stat.decimals || 0}
                />
              </p>
              {stat.trendLabel && (
                <p className="text-xs text-gray-400 mt-1">{stat.trendLabel}</p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function GenerationAnalyticsChart() {
  const chartData = {
    labels: DAILY_GENERATION.map((d) => `Feb ${d.day}`),
    datasets: [
      {
        label: "Actual Generation (kWh)",
        data: DAILY_GENERATION.map((d) => d.actual),
        fill: true,
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea: { top: number; bottom: number } } }) => {
          const ctx = context.chart.ctx;
          const area = context.chart.chartArea;
          if (!area) return "rgba(13, 40, 24, 0.1)";
          const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
          gradient.addColorStop(0, "rgba(13, 40, 24, 0.15)");
          gradient.addColorStop(1, "rgba(13, 40, 24, 0)");
          return gradient;
        },
        borderColor: "#0D2818",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#FFB800",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
      {
        label: "Expected Generation (kWh)",
        data: DAILY_GENERATION.map((d) => d.expected),
        fill: false,
        borderColor: "#FFB800",
        borderWidth: 2,
        borderDash: [6, 4],
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#FFB800",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
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
          pointStyle: "line",
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
        displayColors: true,
        callbacks: {
          label: (context: TooltipItem<"line">) =>
            ` ${context.dataset.label}: ${(context.parsed.y ?? 0).toLocaleString("en-IN")} kWh`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 11, family: "Inter" }, maxTicksLimit: 10 },
      },
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `${Number(value).toLocaleString("en-IN")}`,
        },
      },
    },
    interaction: { intersect: false, mode: "index" as const },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-forest" />
            Generation vs Expected
          </CardTitle>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 bg-forest rounded" />
              <span>Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-0.5 bg-gold rounded border-dashed" style={{ borderTop: "2px dashed #FFB800", height: 0 }} />
              <span>Expected</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[340px]">
            <Line data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PlantComparison() {
  const barData = {
    labels: PLANTS.map((p) => p.name.split(" ").slice(0, 2).join(" ")),
    datasets: [
      {
        label: "Avg Daily Generation (kWh)",
        data: PLANTS.map((p) => p.avgDailyGen),
        backgroundColor: PLANTS.map((p) => p.color),
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  };

  const barOptions = {
    indexAxis: "y" as const,
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
          label: (context: TooltipItem<"bar">) =>
            `${(context.parsed.x ?? 0).toLocaleString("en-IN")} kWh/day`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `${Number(value).toLocaleString("en-IN")}`,
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#374151", font: { size: 12, family: "Inter", weight: "500" as const } },
      },
    },
  };

  const totalGen = PLANTS.reduce((a, p) => a + p.avgDailyGen, 0);
  const doughnutData = {
    labels: PLANTS.map((p) => p.name.split(" ").slice(0, 2).join(" ")),
    datasets: [
      {
        data: PLANTS.map((p) => p.avgDailyGen),
        backgroundColor: ["#0D2818", "#1B5E3E", "#FFB800"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0D2818",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => {
            const val = context.parsed;
            const pct = ((val / totalGen) * 100).toFixed(1);
            return ` ${val.toLocaleString("en-IN")} kWh (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="w-5 h-5 text-forest" />
              Plant-wise Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
      >
        <Card className="shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sun className="w-5 h-5 text-gold" />
              Generation Share
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-[200px] w-[200px] mx-auto shrink-0">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              <div className="space-y-3 flex-1">
                {PLANTS.map((plant) => {
                  const pct = ((plant.avgDailyGen / totalGen) * 100).toFixed(1);
                  return (
                    <div key={plant.id} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: plant.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-black truncate">
                          {plant.name.split(" ").slice(0, 2).join(" ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {plant.avgDailyGen.toLocaleString("en-IN")} kWh/day
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function WeeklyPatternChart() {
  const maxVal = Math.max(...WEEKLY_PATTERN.map((d) => d.avg));
  const chartData = {
    labels: WEEKLY_PATTERN.map((d) => d.day),
    datasets: [
      {
        label: "Avg Generation (kWh)",
        data: WEEKLY_PATTERN.map((d) => d.avg),
        backgroundColor: WEEKLY_PATTERN.map((d) =>
          d.avg > maxVal * 0.95
            ? "#0D2818"
            : d.avg > maxVal * 0.85
            ? "rgba(13, 40, 24, 0.7)"
            : d.avg > maxVal * 0.75
            ? "rgba(13, 40, 24, 0.4)"
            : "rgba(13, 40, 24, 0.2)"
        ),
        borderRadius: 8,
        barThickness: 36,
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
          label: (context: TooltipItem<"bar">) =>
            `${(context.parsed.y ?? 0).toLocaleString("en-IN")} kWh avg`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 12, family: "Inter" } },
      },
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `${Number(value).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-forest" />
            Weekly Generation Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <Bar data={chartData} options={options} />
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-forest" />
              <span>Peak (&gt;95%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-forest/70" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-forest/40" />
              <span>Mid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-forest/20" />
              <span>Low</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function MonthlyBreakdownChart() {
  const chartData = {
    labels: MONTHLY_BREAKDOWN.map((d) => d.month),
    datasets: [
      {
        label: "Actual (kWh)",
        data: MONTHLY_BREAKDOWN.map((d) => d.actual),
        backgroundColor: "#0D2818",
        borderRadius: 6,
        barThickness: 20,
      },
      {
        label: "Expected (kWh)",
        data: MONTHLY_BREAKDOWN.map((d) => d.expected),
        backgroundColor: "rgba(255, 184, 0, 0.7)",
        borderRadius: 6,
        barThickness: 20,
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
          pointStyle: "rectRounded",
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
          label: (context: TooltipItem<"bar">) =>
            ` ${context.dataset.label}: ${(context.parsed.y ?? 0).toLocaleString("en-IN")} kWh`,
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
          callback: (value: number | string) => `${(Number(value) / 1000).toFixed(0)}K`,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-gold" />
            Monthly Generation: Actual vs Expected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PerformanceTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Gauge className="w-5 h-5 text-forest" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plant</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Daily</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Peak Gen</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Efficiency</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">PR Ratio</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Availability</th>
                </tr>
              </thead>
              <tbody>
                {PLANTS.map((plant, i) => {
                  const effColor =
                    plant.efficiency >= 92
                      ? "text-green-600 bg-green-50"
                      : plant.efficiency >= 89
                      ? "text-amber-600 bg-amber-50"
                      : "text-red-500 bg-red-50";
                  return (
                    <motion.tr
                      key={plant.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.85 + i * 0.08 }}
                      className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-8 rounded-full shrink-0"
                            style={{ backgroundColor: plant.color }}
                          />
                          <div>
                            <p className="font-medium text-black group-hover:text-forest transition-colors">
                              {plant.name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {plant.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-black">
                        {plant.capacityKw} kW
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-black">
                        {plant.avgDailyGen.toLocaleString("en-IN")} kWh
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-black">
                        {plant.peakGen.toLocaleString("en-IN")} kWh
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${effColor}`}>
                          {plant.efficiency}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-black">
                        {plant.prRatio}%
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-medium text-black">{plant.availability}%</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-forest transition-colors" />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EnvironmentalImpact() {
  const impacts = [
    {
      icon: Leaf,
      label: "CO₂ Offset",
      value: ENV_IMPACT.co2Tons,
      suffix: " tons",
      description: "Carbon dioxide prevented",
      decimals: 1,
    },
    {
      icon: TreePine,
      label: "Trees Equivalent",
      value: ENV_IMPACT.treesEquivalent,
      suffix: "",
      description: "Trees planted equivalent",
      decimals: 0,
    },
    {
      icon: Home,
      label: "Homes Powered",
      value: ENV_IMPACT.homesPowered,
      suffix: "",
      description: "Average Indian households",
      decimals: 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85 }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest via-forest to-forest-light p-6 sm:p-8 border border-forest/20">
        <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none">
          <div className="absolute top-4 right-4 w-56 h-56 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-3xl" />
          <motion.div
            className="absolute top-8 right-8"
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Leaf className="w-24 h-24 text-white/5" strokeWidth={1} />
          </motion.div>
        </div>

        <div className="relative z-10">
          <h2 className="text-lg sm:text-xl font-bold text-white font-heading flex items-center gap-2 mb-1">
            <Leaf className="w-5 h-5 text-gold" />
            Environmental Impact
          </h2>
          <p className="text-white/60 text-sm mb-6">
            Your contribution to a sustainable future this month
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {impacts.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-all"
                >
                  <div className="p-2 rounded-lg bg-gold/20 w-fit mb-3">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-white font-heading">
                    <AnimatedNumber
                      value={item.value}
                      suffix={item.suffix}
                      decimals={item.decimals}
                    />
                  </p>
                  <p className="text-sm font-medium text-white/90 mt-1">{item.label}</p>
                  <p className="text-xs text-white/50 mt-0.5">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function IrradianceCorrelationChart() {
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

// ─── Main Analytics Page ────────────────────────────────────────────────────

export default function HostAnalyticsPage() {
  const [period, setPeriod] = useState("30D");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <AnalyticsHeader period={period} onPeriodChange={setPeriod} />

      {/* KPI Cards */}
      <KPICards />

      {/* Generation vs Expected Chart */}
      <GenerationAnalyticsChart />

      {/* Plant Comparison: Bar + Doughnut */}
      <PlantComparison />

      {/* Weekly Pattern + Monthly Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeeklyPatternChart />
        <MonthlyBreakdownChart />
      </div>

      {/* Performance Table */}
      <PerformanceTable />

      {/* Environmental Impact */}
      <EnvironmentalImpact />

      {/* Irradiance Correlation */}
      <IrradianceCorrelationChart />
    </div>
  );
}
