export const REVENUE_12M = [
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

export const BILLING_HISTORY = [
  { month: "February 2026", generation: 127515, rate: 3.5, baseAmount: 446302.5, adjustments: 0, cgst: 40167.23, sgst: 40167.23, tds: 8926.05, netPayable: 517710.91, status: "PENDING" as const },
  { month: "January 2026", generation: 138614, rate: 3.5, baseAmount: 485149.0, adjustments: -1200, cgst: 43555.41, sgst: 43555.41, tds: 9682.98, netPayable: 561376.84, status: "PAID" as const },
  { month: "December 2025", generation: 143429, rate: 3.5, baseAmount: 502001.5, adjustments: 0, cgst: 45180.14, sgst: 45180.14, tds: 10040.03, netPayable: 582321.75, status: "PAID" as const },
  { month: "November 2025", generation: 121457, rate: 3.5, baseAmount: 425099.5, adjustments: -800, cgst: 38186.96, sgst: 38186.96, tds: 8485.99, netPayable: 492187.43, status: "PAID" as const },
  { month: "October 2025", generation: 125200, rate: 3.5, baseAmount: 438200.0, adjustments: 0, cgst: 39438.0, sgst: 39438.0, tds: 8764.0, netPayable: 508312.0, status: "PAID" as const },
  { month: "September 2025", generation: 119629, rate: 3.5, baseAmount: 418701.5, adjustments: -500, cgst: 37638.14, sgst: 37638.14, tds: 8365.03, netPayable: 485112.75, status: "OVERDUE" as const },
];

export const PAYMENT_TRANSACTIONS = [
  { date: "Feb 5, 2026", description: "January billing payment received", amount: 561376.84, type: "credit" as const },
  { date: "Jan 12, 2026", description: "December billing payment received", amount: 582321.75, type: "credit" as const },
  { date: "Jan 5, 2026", description: "Late payment fee - September", amount: -2500, type: "debit" as const },
  { date: "Dec 8, 2025", description: "November billing payment received", amount: 492187.43, type: "credit" as const },
  { date: "Nov 10, 2025", description: "October billing payment received", amount: 508312.0, type: "credit" as const },
];

export const PLANT_REVENUE = [
  { name: "Vedvyas Solar", dec: 167334, jan: 161717, feb: 148768 },
  { name: "Sunrise Energy", dec: 200800, jan: 194060, feb: 178521 },
  { name: "Green Valley", dec: 133867, jan: 129372, feb: 119014 },
];

export const FINANCIAL_SUMMARY = {
  totalUnits: 1520243,
  totalRevenue: 5380850,
  avgMonthlyRevenue: 448404,
  highestMonthlyRevenue: 502000,
  ppaRate: 3.5,
  contractStart: "April 1, 2023",
};

export const KPI_DATA = {
  totalRevenue: 5380850,
  currentBilling: 446302.5,
  pendingPayments: 517710.91 + 485112.75,
  avgPpaRate: 3.5,
  revTrend: 5.8,
  billTrend: -8.0,
  pendTrend: 12.4,
};
