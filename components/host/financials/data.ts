// Demo KPI data - replace with real API data
export const KPI_DATA = {
  totalRevenue: 125000,
  revTrend: 12.5,
  currentBilling: 15000,
  billTrend: 8.2,
  avgRevenueMonth: 10416,
  revenueGrowth: 15.3,
  paymentDueNow: 5000,
  paymentTrendPercentage: -5.2,
  pendingPayments: 5000,
  pendTrend: -3.5,
  avgPpaRate: 7.0,
};

// Demo financial summary - replace with real API data
export const FINANCIAL_SUMMARY = {
  totalUnits: 125000,
  totalRevenue: 875000,
  avgMonthlyRevenue: 72917,
  highestMonthlyRevenue: 95000,
  ppaRate: 7.0,
  costSavings: 125000,
  co2Offset: 156,
  contractStart: "Jan 2024",
  contractEnd: "Dec 2035",
};

// Demo payment transactions - replace with real API data
export const PAYMENT_TRANSACTIONS = [
  { id: "1", date: "2026-02-10", amount: 15000, status: "PENDING", type: "debit", description: "Monthly billing" },
  { id: "2", date: "2026-01-10", amount: 14500, status: "PAID", type: "debit", description: "Monthly billing" },
  { id: "3", date: "2025-12-10", amount: 14000, status: "PAID", type: "debit", description: "Monthly billing" },
];

// Demo plant revenue breakdown - replace with real API data
export const PLANT_REVENUE = [
  { name: "Plant A", dec: 28000, jan: 32000, feb: 35000 },
  { name: "Plant B", dec: 25000, jan: 28000, feb: 30000 },
  { name: "Plant C", dec: 19917, jan: 12917, feb: 7917 },
];

// Demo 12-month revenue and generation correlation - replace with real API data
export const REVENUE_12M = [
  { month: "May '25", generation: 9800, revenue: 68600 },
  { month: "Jun '25", generation: 10200, revenue: 71400 },
  { month: "Jul '25", generation: 10500, revenue: 73500 },
  { month: "Aug '25", generation: 10100, revenue: 70700 },
  { month: "Sep '25", generation: 9900, revenue: 69300 },
  { month: "Oct '25", generation: 10300, revenue: 72100 },
  { month: "Nov '25", generation: 11200, revenue: 78400 },
  { month: "Dec '25", generation: 11760, revenue: 82320 },
  { month: "Jan '26", generation: 11890, revenue: 83230 },
  { month: "Feb '26", generation: 12150, revenue: 85050 },
  { month: "Mar '26", generation: 12400, revenue: 86800 },
  { month: "Apr '26", generation: 12600, revenue: 88200 },
];

// BILLING_HISTORY is kept for fallback use in /api/host/billing/current
// when no active PPA or payment data exists
export const BILLING_HISTORY = [
  { month: "February 2026", generation: 12150, rate: 3.5, adjustments: 0, status: "PENDING" as const },
  { month: "January 2026", generation: 11890, rate: 3.5, adjustments: -300, status: "PAID" as const },
  { month: "December 2025", generation: 11760, rate: 3.5, adjustments: 0, status: "PAID" as const },
  { month: "November 2025", generation: 11630, rate: 3.5, adjustments: -200, status: "PAID" as const },
  { month: "October 2025", generation: 11580, rate: 3.5, adjustments: 0, status: "PAID" as const },
  { month: "September 2025", generation: 11480, rate: 3.5, adjustments: 0, status: "OVERDUE" as const },
];
