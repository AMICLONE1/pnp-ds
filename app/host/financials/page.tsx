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
import { Line, Bar, Doughnut, Chart } from "react-chartjs-2";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Receipt,
  Clock,
  Calendar,
  Download,
  Filter,
  ChevronRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowDownToLine,
  Zap,
  BarChart3,
  CreditCard,
  Percent,
  Building2,
  CalendarDays,
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

const REVENUE_12M = [
  { month: "Mar '25", revenue: 398200, generation: 113771 },
  { month: "Apr '25", revenue: 421500, generation: 120429 },
  { month: "May '25", revenue: 445800, generation: 127371 },
  { month: "Jun '25", revenue: 412000, generation: 117714 },
  { month: "Jul '25", revenue: 385600, generation: 110171 },
  { month: "Aug '25", revenue: 402300, generation: 114943 },
  { month: "Sep '25", revenue: 418700, generation: 119629 },
  { month: "Oct '25", revenue: 438200, generation: 125200 },
  { month: "Nov '25", revenue: 425100, generation: 121457 },
  { month: "Dec '25", revenue: 502000, generation: 143429 },
  { month: "Jan '26", revenue: 485150, generation: 138614 },
  { month: "Feb '26", revenue: 446303, generation: 127515 },
];

const BILLING_HISTORY = [
  { month: "February 2026", generation: 127515, rate: 3.5, baseAmount: 446302.5, adjustments: 0, cgst: 40167.23, sgst: 40167.23, tds: 8926.05, netPayable: 517710.91, status: "PENDING" as const },
  { month: "January 2026", generation: 138614, rate: 3.5, baseAmount: 485149.0, adjustments: -1200, cgst: 43555.41, sgst: 43555.41, tds: 9682.98, netPayable: 561376.84, status: "PAID" as const },
  { month: "December 2025", generation: 143429, rate: 3.5, baseAmount: 502001.5, adjustments: 0, cgst: 45180.14, sgst: 45180.14, tds: 10040.03, netPayable: 582321.75, status: "PAID" as const },
  { month: "November 2025", generation: 121457, rate: 3.5, baseAmount: 425099.5, adjustments: -800, cgst: 38186.96, sgst: 38186.96, tds: 8485.99, netPayable: 492187.43, status: "PAID" as const },
  { month: "October 2025", generation: 125200, rate: 3.5, baseAmount: 438200.0, adjustments: 0, cgst: 39438.0, sgst: 39438.0, tds: 8764.0, netPayable: 508312.0, status: "PAID" as const },
  { month: "September 2025", generation: 119629, rate: 3.5, baseAmount: 418701.5, adjustments: -500, cgst: 37638.14, sgst: 37638.14, tds: 8365.03, netPayable: 485112.75, status: "OVERDUE" as const },
];

const PAYMENT_TRANSACTIONS = [
  { date: "Feb 5, 2026", description: "January billing payment received", amount: 561376.84, type: "credit" as const },
  { date: "Jan 12, 2026", description: "December billing payment received", amount: 582321.75, type: "credit" as const },
  { date: "Jan 5, 2026", description: "Late payment fee - September", amount: -2500, type: "debit" as const },
  { date: "Dec 8, 2025", description: "November billing payment received", amount: 492187.43, type: "credit" as const },
  { date: "Nov 10, 2025", description: "October billing payment received", amount: 508312.0, type: "credit" as const },
];

const PLANT_REVENUE = [
  { name: "Vedvyas Solar", dec: 167334, jan: 161717, feb: 148768 },
  { name: "Sunrise Energy", dec: 200800, jan: 194060, feb: 178521 },
  { name: "Green Valley", dec: 133867, jan: 129372, feb: 119014 },
];

const FINANCIAL_SUMMARY = {
  totalUnits: 1520243,
  totalRevenue: 5380850,
  avgMonthlyRevenue: 448404,
  highestMonthlyRevenue: 502000,
  ppaRate: 3.5,
  contractStart: "April 1, 2023",
};

const KPI_DATA = {
  totalRevenue: 5380850,
  currentBilling: 446302.5,
  pendingPayments: 517710.91 + 485112.75,
  avgPpaRate: 3.5,
  revTrend: 5.8,
  billTrend: -8.0,
  pendTrend: 12.4,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function StatusBadge({ status }: { status: "PAID" | "PENDING" | "OVERDUE" }) {
  const config = {
    PAID: { bg: "bg-green-50 border-green-200", text: "text-green-700", Icon: CheckCircle2 },
    PENDING: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", Icon: Clock },
    OVERDUE: { bg: "bg-red-50 border-red-200", text: "text-red-600", Icon: AlertCircle },
  };
  const { bg, text, Icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

// ─── Section Components ─────────────────────────────────────────────────────

function FinancialsHeader({
  period,
  onPeriodChange,
}: {
  period: string;
  onPeriodChange: (p: string) => void;
}) {
  const periods = ["This Month", "3 Months", "6 Months", "This Year"];

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
          <Wallet className="w-20 h-20 text-gold/15" strokeWidth={1} />
        </motion.div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-forest/5 border border-forest/15 rounded-full">
                <IndianRupee className="w-3.5 h-3.5 text-forest" />
                <span className="text-xs font-medium text-forest">Revenue Tracking</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                <CalendarDays className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">FY 2025-26</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-black font-heading">
              <span className="gradient-text">Financials</span>
            </h1>
            <p className="text-gray-600 mt-1.5 text-sm sm:text-base">
              Complete financial overview of your{" "}
              <span className="font-semibold text-forest">₹53.8L</span> solar portfolio earnings.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => onPeriodChange(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
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

function FinancialKPIs() {
  const stats = [
    {
      icon: IndianRupee,
      label: "Total Revenue Earned",
      value: KPI_DATA.totalRevenue,
      prefix: "₹",
      color: "text-forest",
      bgColor: "bg-forest/10",
      trend: KPI_DATA.revTrend,
      trendLabel: "vs last year",
    },
    {
      icon: Receipt,
      label: "Current Month Billing",
      value: KPI_DATA.currentBilling,
      prefix: "₹",
      color: "text-gold-dark",
      bgColor: "bg-gold/10",
      trend: KPI_DATA.billTrend,
      trendLabel: "vs last month",
    },
    {
      icon: Clock,
      label: "Pending Payments",
      value: KPI_DATA.pendingPayments,
      prefix: "₹",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      trend: KPI_DATA.pendTrend,
      trendLabel: "overdue included",
    },
    {
      icon: Zap,
      label: "PPA Rate",
      value: KPI_DATA.avgPpaRate,
      prefix: "₹",
      suffix: "/kWh",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: null,
      trendLabel: "contract rate",
      decimals: 2,
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

function RevenueTrendChart() {
  const avgRevenue = REVENUE_12M.reduce((a, d) => a + d.revenue, 0) / REVENUE_12M.length;

  const chartData = {
    labels: REVENUE_12M.map((d) => d.month),
    datasets: [
      {
        label: "Revenue (₹)",
        data: REVENUE_12M.map((d) => d.revenue),
        borderColor: "#FFB800",
        backgroundColor: (context: { chart: { ctx: CanvasRenderingContext2D; chartArea: { top: number; bottom: number } } }) => {
          const ctx = context.chart.ctx;
          const area = context.chart.chartArea;
          if (!area) return "rgba(255, 184, 0, 0.1)";
          const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
          gradient.addColorStop(0, "rgba(255, 184, 0, 0.18)");
          gradient.addColorStop(1, "rgba(255, 184, 0, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: "#FFB800",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: "#FFB800",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 3,
      },
      {
        label: "Average",
        data: REVENUE_12M.map(() => avgRevenue),
        borderColor: "rgba(107, 114, 128, 0.4)",
        borderWidth: 1.5,
        borderDash: [6, 4],
        pointRadius: 0,
        pointHoverRadius: 0,
        fill: false,
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
        callbacks: {
          label: (context: TooltipItem<"line">) =>
            ` ${context.dataset.label}: ₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}`,
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
          callback: (value: number | string) => `₹${(Number(value) / 100000).toFixed(1)}L`,
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
            <TrendingUp className="w-5 h-5 text-gold" />
            Revenue Trend (12 Months)
          </CardTitle>
          <span className="text-xs text-gray-400">
            Avg: ₹{Math.round(avgRevenue).toLocaleString("en-IN")}/mo
          </span>
        </CardHeader>
        <CardContent>
          <div className="h-[320px]">
            <Line data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function BillingHistoryTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-forest" />
            Billing History
          </CardTitle>
          <button className="text-xs text-forest font-medium hover:text-forest-light transition-colors flex items-center gap-1">
            Export CSV <Download className="w-3.5 h-3.5" />
          </button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Generation</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Base Amt</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax (GST)</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">TDS</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Payable</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {BILLING_HISTORY.map((bill, i) => (
                  <motion.tr
                    key={bill.month}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + i * 0.06 }}
                    className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-6">
                      <span className="font-medium text-black">{bill.month}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-black">
                      {bill.generation.toLocaleString("en-IN")} <span className="text-gray-400 text-xs">kWh</span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-black">
                      ₹{bill.rate.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-black">
                      ₹{bill.baseAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-right text-black">
                      ₹{(bill.cgst + bill.sgst).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3.5 px-4 text-right text-red-500 text-xs font-medium">
                      -₹{bill.tds.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-forest">
                      ₹{bill.netPayable.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={bill.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-forest hover:bg-forest/5 transition-all">
                        <ArrowDownToLine className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PaymentStatusOverview() {
  const paidTotal = BILLING_HISTORY.filter((b) => b.status === "PAID").reduce((a, b) => a + b.netPayable, 0);
  const pendingTotal = BILLING_HISTORY.filter((b) => b.status === "PENDING").reduce((a, b) => a + b.netPayable, 0);
  const overdueTotal = BILLING_HISTORY.filter((b) => b.status === "OVERDUE").reduce((a, b) => a + b.netPayable, 0);

  const doughnutData = {
    labels: ["Paid", "Pending", "Overdue"],
    datasets: [
      {
        data: [paidTotal, pendingTotal, overdueTotal],
        backgroundColor: ["#0D2818", "#FFB800", "#EF4444"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const total = paidTotal + pendingTotal + overdueTotal;
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
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
            const pct = ((context.parsed / total) * 100).toFixed(1);
            return ` ₹${context.parsed.toLocaleString("en-IN", { maximumFractionDigits: 0 })} (${pct}%)`;
          },
        },
      },
    },
  };

  const legend = [
    { label: "Paid", color: "#0D2818", amount: paidTotal },
    { label: "Pending", color: "#FFB800", amount: pendingTotal },
    { label: "Overdue", color: "#EF4444", amount: overdueTotal },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-forest" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-[200px] w-[200px] shrink-0 relative">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-400">Total</span>
                  <span className="text-sm font-bold text-black">₹{(total / 100000).toFixed(1)}L</span>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                {legend.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{item.label}</p>
                      <p className="text-xs text-gray-500">
                        ₹{item.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {((item.amount / total) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <Card className="shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="w-5 h-5 text-gold" />
              Recent Transactions
            </CardTitle>
            <button className="text-xs text-forest font-medium hover:text-forest-light transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {PAYMENT_TRANSACTIONS.map((tx, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className={`p-2 rounded-lg shrink-0 ${tx.type === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                    {tx.type === "credit" ? (
                      <ArrowDownToLine className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{tx.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-bold whitespace-nowrap ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                    {tx.type === "credit" ? "+" : ""}₹{Math.abs(tx.amount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function PlantRevenueBreakdown() {
  const chartData = {
    labels: PLANT_REVENUE.map((p) => p.name),
    datasets: [
      {
        label: "Dec '25",
        data: PLANT_REVENUE.map((p) => p.dec),
        backgroundColor: "#0D2818",
        borderRadius: 6,
        barThickness: 18,
      },
      {
        label: "Jan '26",
        data: PLANT_REVENUE.map((p) => p.jan),
        backgroundColor: "#1B5E3E",
        borderRadius: 6,
        barThickness: 18,
      },
      {
        label: "Feb '26",
        data: PLANT_REVENUE.map((p) => p.feb),
        backgroundColor: "#FFB800",
        borderRadius: 6,
        barThickness: 18,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
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
          padding: 16,
          font: { size: 11, family: "Inter" },
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
            ` ${context.dataset.label}: ₹${(context.parsed.x ?? 0).toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#6B7280",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `₹${(Number(value) / 1000).toFixed(0)}K`,
        },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#374151", font: { size: 12, family: "Inter", weight: "bold" as const } },
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
            <Building2 className="w-5 h-5 text-forest" />
            Plant-wise Revenue (Last 3 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <Bar data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RevenueGenerationCorrelation() {
  const data6m = REVENUE_12M.slice(-6);

  const chartData = {
    labels: data6m.map((d) => d.month),
    datasets: [
      {
        type: "bar" as const,
        label: "Generation (kWh)",
        data: data6m.map((d) => d.generation),
        backgroundColor: "rgba(13, 40, 24, 0.75)",
        borderRadius: 6,
        barThickness: 28,
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: "Revenue (₹)",
        data: data6m.map((d) => d.revenue),
        borderColor: "#FFB800",
        backgroundColor: "rgba(255, 184, 0, 0.08)",
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#FFB800",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        fill: false,
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
          label: (context: TooltipItem<"bar">) => {
            if (context.datasetIndex === 0) {
              return ` Generation: ${(context.parsed.y ?? 0).toLocaleString("en-IN")} kWh`;
            }
            return ` Revenue: ₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 11, family: "Inter" } },
      },
      y: {
        type: "linear" as const,
        position: "left" as const,
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          color: "#0D2818",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `${(Number(value) / 1000).toFixed(0)}K`,
        },
        title: { display: true, text: "Generation (kWh)", color: "#0D2818", font: { size: 11, family: "Inter" } },
      },
      y1: {
        type: "linear" as const,
        position: "right" as const,
        grid: { drawOnChartArea: false },
        ticks: {
          color: "#FFB800",
          font: { size: 11, family: "Inter" },
          callback: (value: number | string) => `₹${(Number(value) / 100000).toFixed(1)}L`,
        },
        title: { display: true, text: "Revenue (₹)", color: "#FFB800", font: { size: 11, family: "Inter" } },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="w-5 h-5 text-gold" />
            Revenue vs Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Chart type="bar" data={chartData as never} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FinancialSummaryCard() {
  const metrics = [
    { label: "Total Units Generated", value: `${FINANCIAL_SUMMARY.totalUnits.toLocaleString("en-IN")} kWh`, icon: Zap, color: "text-forest" },
    { label: "Total Revenue Earned", value: `₹${FINANCIAL_SUMMARY.totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee, color: "text-gold-dark" },
    { label: "Average Monthly Revenue", value: `₹${FINANCIAL_SUMMARY.avgMonthlyRevenue.toLocaleString("en-IN")}`, icon: Calendar, color: "text-blue-600" },
    { label: "Highest Monthly Revenue", value: `₹${FINANCIAL_SUMMARY.highestMonthlyRevenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-green-600" },
    { label: "PPA Contract Rate", value: `₹${FINANCIAL_SUMMARY.ppaRate.toFixed(2)}/kWh`, icon: FileText, color: "text-purple-600" },
    { label: "Contract Start Date", value: FINANCIAL_SUMMARY.contractStart, icon: CalendarDays, color: "text-gray-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5 text-forest" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((m, i) => {
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.95 + i * 0.05 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-white border border-gray-200 shrink-0`}>
                    <Icon className={`w-4 h-4 ${m.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">{m.label}</p>
                    <p className="text-sm font-bold text-black mt-0.5 truncate">{m.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TaxDeductionsCard() {
  const currentBill = BILLING_HISTORY[0];
  const totalTax = currentBill.cgst + currentBill.sgst;
  const grossAmount = currentBill.baseAmount + totalTax;
  const netAfterTds = grossAmount - currentBill.tds;

  const deductions = [
    { label: "CGST (9%)", amount: currentBill.cgst, type: "tax" as const, pct: 9 },
    { label: "SGST (9%)", amount: currentBill.sgst, type: "tax" as const, pct: 9 },
    { label: "TDS (2%)", amount: currentBill.tds, type: "deduction" as const, pct: 2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.95 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Percent className="w-5 h-5 text-gold" />
            Tax & Deductions (Current Month)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Base amount */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Base Amount (Generation × PPA Rate)</span>
            <span className="text-sm font-semibold text-black">
              ₹{currentBill.baseAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Deduction bars */}
          <div className="space-y-4">
            {deductions.map((d) => {
              const barColor = d.type === "tax" ? "bg-forest" : "bg-red-400";
              const barWidth = d.type === "tax" ? "18%" : "4%";
              return (
                <div key={d.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{d.label}</span>
                    <span className={`text-sm font-semibold ${d.type === "deduction" ? "text-red-500" : "text-black"}`}>
                      {d.type === "deduction" ? "-" : "+"}₹{d.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: barWidth }}
                      transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Gross Amount (Base + GST)</span>
              <span className="text-sm font-medium text-black">
                ₹{grossAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Less: TDS Deducted</span>
              <span className="text-sm font-medium text-red-500">
                -₹{currentBill.tds.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-base font-bold text-black">Net Payable</span>
              <span className="text-xl font-bold text-forest">
                ₹{netAfterTds.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function HostFinancialsPage() {
  const [period, setPeriod] = useState("This Year");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <FinancialsHeader period={period} onPeriodChange={setPeriod} />

      {/* KPI Cards */}
      <FinancialKPIs />

      {/* Revenue Trend */}
      <RevenueTrendChart />

      {/* Billing History Table */}
      <BillingHistoryTable />

      {/* Payment Status + Transactions */}
      <PaymentStatusOverview />

      {/* Plant Revenue + Revenue vs Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PlantRevenueBreakdown />
        <RevenueGenerationCorrelation />
      </div>

      {/* Financial Summary + Tax */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <FinancialSummaryCard />
        <TaxDeductionsCard />
      </div>
    </div>
  );
}
