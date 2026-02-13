
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Zap,
  Sun,
  TrendingUp,
  TrendingDown,
  Wallet,
  Activity,
  AlertTriangle,
  Bell,
  Download,
  Eye,
  Clock,
  MapPin,
  ChevronRight,
  FileText,
  ArrowUpRight,
  Gauge,
  CalendarDays,
  IndianRupee,
  Leaf,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Register Chart.js components
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

const HOST_NAME = "Rajesh Patel";

const MOCK_STATS = {
  totalCapacityKw: 1500,
  todayGenerationKwh: 4250.5,
  monthlyRevenue: 446302.5,
  plantEfficiency: 92.5,
  activePlants: 3,
  totalPlants: 3,
  co2OffsetTons: 127.5,
  todayTrend: 12.5,
  monthlyTrend: -5.5,
  efficiencyTrend: 2.3,
};

const MOCK_GENERATION_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `Feb ${i + 1}`,
  value: 3800 + Math.random() * 1400 + Math.sin(i * 0.3) * 500,
}));

const MOCK_REVENUE_DATA = [
  { month: "Sep", amount: 412000 },
  { month: "Oct", amount: 438000 },
  { month: "Nov", amount: 425000 },
  { month: "Dec", amount: 502000 },
  { month: "Jan", amount: 485150 },
  { month: "Feb", amount: 446302 },
];

const MOCK_HOURLY_DATA = [
  { hour: "6AM", kwh: 50 },
  { hour: "7AM", kwh: 180 },
  { hour: "8AM", kwh: 320 },
  { hour: "9AM", kwh: 410 },
  { hour: "10AM", kwh: 480 },
  { hour: "11AM", kwh: 510 },
  { hour: "12PM", kwh: 520 },
  { hour: "1PM", kwh: 505 },
  { hour: "2PM", kwh: 470 },
  { hour: "3PM", kwh: 400 },
  { hour: "4PM", kwh: 290 },
  { hour: "5PM", kwh: 140 },
  { hour: "6PM", kwh: 40 },
];

const MOCK_PLANTS = [
  {
    id: "1",
    name: "Vedvyas Solar Park",
    location: "Cuttack, Odisha",
    capacityKw: 500,
    status: "ACTIVE" as const,
    todayKwh: 1875.5,
    efficiency: 93.2,
    ppaRate: 3.5,
  },
  {
    id: "2",
    name: "Sunrise Energy Hub",
    location: "Bhubaneswar, Odisha",
    capacityKw: 600,
    status: "ACTIVE" as const,
    todayKwh: 1520.0,
    efficiency: 91.8,
    ppaRate: 3.5,
  },
  {
    id: "3",
    name: "Green Valley Plant",
    location: "Rourkela, Odisha",
    capacityKw: 400,
    status: "MAINTENANCE" as const,
    todayKwh: 855.0,
    efficiency: 88.4,
    ppaRate: 3.5,
  },
];

const MOCK_ALERTS = [
  {
    id: "1",
    title: "Low generation detected",
    message: "Green Valley Plant output 30% below expected",
    severity: "WARNING" as const,
    category: "GENERATION",
    time: "2 hours ago",
  },
  {
    id: "2",
    title: "Payment due reminder",
    message: "February payment of ₹4,46,302 due on Feb 10",
    severity: "INFO" as const,
    category: "PAYMENT",
    time: "5 hours ago",
  },
  {
    id: "3",
    title: "Scheduled maintenance",
    message: "Green Valley Plant maintenance on Feb 15",
    severity: "INFO" as const,
    category: "MAINTENANCE",
    time: "1 day ago",
  },
];

const MOCK_PAYMENT_DUE = {
  month: "February 2026",
  generationKwh: 127515.0,
  ratePerKwh: 3.5,
  baseAmount: 446302.5,
  adjustments: 0,
  totalDue: 446302.5,
  dueDate: "Feb 10, 2026",
  status: "PENDING" as const,
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

function LivePulse() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
    </span>
  );
}

function SeverityBadge({ severity }: { severity: "CRITICAL" | "WARNING" | "INFO" }) {
  const styles = {
    CRITICAL: "bg-red-100 text-red-700 border-red-200",
    WARNING: "bg-amber-50 text-amber-700 border-amber-200",
    INFO: "bg-blue-50 text-blue-700 border-blue-200",
  };
  const icons = {
    CRITICAL: AlertTriangle,
    WARNING: AlertTriangle,
    INFO: Info,
  };
  const Icon = icons[severity];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[severity]}`}
    >
      <Icon className="w-3 h-3" />
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: "ACTIVE" | "MAINTENANCE" | "INACTIVE" }) {
  const styles = {
    ACTIVE: "bg-green-50 text-green-700 border-green-200",
    MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200",
    INACTIVE: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {status === "ACTIVE" && <LivePulse />}
      {status}
    </span>
  );
}

function EfficiencyRing({ value, size = 48 }: { value: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color =
    value >= 90 ? "#22C55E" : value >= 70 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={4}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-800">{value}%</span>
      </div>
    </div>
  );
}

// ─── Section Components ─────────────────────────────────────────────────────

function WelcomeBanner() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gold/5 to-amber-50/30 border border-gold/15 p-6 sm:p-8"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none">
        <div className="absolute top-4 right-4 w-48 h-48 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-2xl" />
        <motion.div
          className="absolute top-6 right-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sun className="w-20 h-20 text-gold/15" strokeWidth={1} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
              <LivePulse />
              <span className="text-xs font-medium text-green-700">
                System Online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full w-fit">
            <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium text-blue-700">{today}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-black font-heading mt-4">
          Welcome back,{" "}
          <span className="gradient-text">{HOST_NAME}</span>
        </h1>
        <p className="text-gray-600 mt-1.5 text-sm sm:text-base">
          Your solar plants generated{" "}
          <span className="font-semibold text-forest">
            {MOCK_STATS.todayGenerationKwh.toLocaleString("en-IN")} kWh
          </span>{" "}
          today across {MOCK_STATS.activePlants} active installations.
        </p>
      </div>
    </motion.div>
  );
}

function StatCards() {
  const stats = [
    {
      icon: Zap,
      label: "Total Capacity",
      value: MOCK_STATS.totalCapacityKw,
      suffix: " kW",
      color: "text-gold-dark",
      bgColor: "bg-gold/10",
      trend: null,
    },
    {
      icon: Sun,
      label: "Today's Generation",
      value: MOCK_STATS.todayGenerationKwh,
      suffix: " kWh",
      color: "text-forest",
      bgColor: "bg-forest/10",
      trend: MOCK_STATS.todayTrend,
      trendLabel: "vs yesterday",
      decimals: 1,
    },
    {
      icon: IndianRupee,
      label: "Monthly Due",
      value: MOCK_STATS.monthlyRevenue,
      prefix: "₹",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      trend: MOCK_STATS.monthlyTrend,
      trendLabel: "vs last month",
    },
    {
      icon: Gauge,
      label: "Plant Efficiency",
      value: MOCK_STATS.plantEfficiency,
      suffix: "%",
      color: "text-green-600",
      bgColor: "bg-green-100",
      trend: MOCK_STATS.efficiencyTrend,
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
            transition={{
              delay: 0.1 + i * 0.1,
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div
                className={`p-2.5 rounded-xl ${stat.bgColor} transition-transform group-hover:scale-110`}
              >
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
                  prefix={stat.prefix || ""}
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

function GenerationChart() {
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");

  const chartData = {
    labels: MOCK_GENERATION_DATA.map((d) => d.date),
    datasets: [
      {
        label: "Generation (kWh)",
        data: MOCK_GENERATION_DATA.map((d) => d.value),
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
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
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
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0D2818",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            return `${(context.parsed.y ?? 0).toLocaleString("en-IN")} kWh`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: false,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-forest" />
            Generation Trend
          </CardTitle>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
            {(["day", "week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p
                    ? "bg-white text-forest shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
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

function PaymentDueCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5 text-gold" />
            Payment Due
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount */}
          <div className="bg-forest/5 rounded-xl p-4 border border-forest/10">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              Amount Due for {MOCK_PAYMENT_DUE.month}
            </p>
            <p className="text-3xl font-bold text-forest font-heading">
              <AnimatedNumber
                value={MOCK_PAYMENT_DUE.totalDue}
                prefix="₹"
              />
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs text-amber-700 font-medium">
                Due: {MOCK_PAYMENT_DUE.dueDate}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Generation</span>
              <span className="font-medium text-black">
                {MOCK_PAYMENT_DUE.generationKwh.toLocaleString("en-IN")} kWh
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">PPA Rate</span>
              <span className="font-medium text-black">
                ₹{MOCK_PAYMENT_DUE.ratePerKwh}/kWh
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Adjustments</span>
              <span className="font-medium text-black">
                ₹{MOCK_PAYMENT_DUE.adjustments}
              </span>
            </div>
            <div className="border-t pt-2.5 flex justify-between items-center">
              <span className="text-sm font-semibold text-black">Total</span>
              <span className="text-lg font-bold text-forest">
                ₹{MOCK_PAYMENT_DUE.totalDue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Action */}
          <button className="w-full flex items-center justify-center gap-2 bg-gold text-forest font-semibold py-2.5 px-4 rounded-xl hover:bg-gold-dark transition-colors text-sm">
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function HourlyDistributionChart() {
  const chartData = {
    labels: MOCK_HOURLY_DATA.map((d) => d.hour),
    datasets: [
      {
        label: "Avg kWh",
        data: MOCK_HOURLY_DATA.map((d) => d.kwh),
        backgroundColor: MOCK_HOURLY_DATA.map((d) =>
          d.kwh > 450
            ? "#0D2818"
            : d.kwh > 300
            ? "rgba(13, 40, 24, 0.7)"
            : d.kwh > 150
            ? "rgba(13, 40, 24, 0.4)"
            : "rgba(13, 40, 24, 0.2)"
        ),
        borderRadius: 6,
        barThickness: 18,
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
        ticks: { color: "#6B7280", font: { size: 10, family: "Inter" } },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `${value}`,
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
            <Sun className="w-5 h-5 text-gold" />
            Peak Hours Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <Bar data={chartData} options={options} />
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-forest" />
              <span>Peak (&gt;450 kWh)</span>
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

function RevenueOverview() {
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

function PlantOverviewCards() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-black font-heading flex items-center gap-2">
          <Zap className="w-5 h-5 text-forest" />
          My Solar Plants
        </h2>
        <button className="flex items-center gap-1 text-sm text-forest font-medium hover:text-forest-light transition-colors">
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MOCK_PLANTS.map((plant, i) => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-black text-sm group-hover:text-forest transition-colors">
                  {plant.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <MapPin className="w-3 h-3" />
                  {plant.location}
                </div>
              </div>
              <StatusBadge status={plant.status} />
            </div>

            <div className="flex items-center gap-4 mt-4">
              <EfficiencyRing value={plant.efficiency} />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Today</span>
                  <span className="font-semibold text-black">
                    {plant.todayKwh.toLocaleString("en-IN")} kWh
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-semibold text-black">
                    {plant.capacityKw} kW
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">PPA Rate</span>
                  <span className="font-semibold text-black">
                    ₹{plant.ppaRate}/kWh
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Efficiency: {plant.efficiency}%
              </span>
              <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-forest transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function AlertsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-amber-500" />
            Recent Alerts
          </CardTitle>
          <button className="text-xs text-forest font-medium hover:text-forest-light transition-colors flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_ALERTS.map((alert, i) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors cursor-pointer group"
              >
                <div className="mt-0.5 shrink-0">
                  <SeverityBadge severity={alert.severity} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black truncate">
                    {alert.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {alert.message}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                  {alert.time}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickActions() {
  const actions = [
    {
      icon: Download,
      label: "Download Invoice",
      description: "Feb 2026 invoice",
      color: "text-forest",
      bg: "bg-forest/10 hover:bg-forest/15",
    },
    {
      icon: Eye,
      label: "View All Plants",
      description: `${MOCK_STATS.totalPlants} plants`,
      color: "text-blue-600",
      bg: "bg-blue-50 hover:bg-blue-100",
    },
    {
      icon: FileText,
      label: "Payment History",
      description: "24 payments",
      color: "text-purple-600",
      bg: "bg-purple-50 hover:bg-purple-100",
    },
    {
      icon: Leaf,
      label: "Environmental Impact",
      description: `${MOCK_STATS.co2OffsetTons} tons CO₂ saved`,
      color: "text-green-600",
      bg: "bg-green-50 hover:bg-green-100",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
    >
      <h2 className="text-lg font-bold text-black font-heading mb-4 flex items-center gap-2">
        <ArrowUpRight className="w-5 h-5 text-forest" />
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.05 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all text-center`}
            >
              <div className={`p-2.5 rounded-xl ${action.bg} transition-colors`}>
                <Icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <span className="text-xs font-semibold text-black">
                {action.label}
              </span>
              <span className="text-[10px] text-gray-400">
                {action.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard Page ────────────────────────────────────────────────────

export default function HostDashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Stat Cards */}
      <StatCards />

      {/* Charts Row: Generation + Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <GenerationChart />
        </div>
        <div>
          <PaymentDueCard />
        </div>
      </div>

      {/* Plant Overview */}
      <PlantOverviewCards />

      {/* Charts Row 2: Hourly + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <HourlyDistributionChart />
        <RevenueOverview />
      </div>

      {/* Alerts + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AlertsPanel />
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
