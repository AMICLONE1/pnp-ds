export const HOST_NAME = "Rajesh Patel";

export const MOCK_STATS = {
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

export const MOCK_GENERATION_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `Feb ${i + 1}`,
  value: 3800 + Math.random() * 1400 + Math.sin(i * 0.3) * 500,
}));

export const MOCK_REVENUE_DATA = [
  { month: "Sep", amount: 412000 },
  { month: "Oct", amount: 438000 },
  { month: "Nov", amount: 425000 },
  { month: "Dec", amount: 502000 },
  { month: "Jan", amount: 485150 },
  { month: "Feb", amount: 446302 },
];

export const MOCK_HOURLY_DATA = [
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

export const MOCK_PLANTS = [
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

export const MOCK_ALERTS = [
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

export const MOCK_PAYMENT_DUE = {
  month: "February 2026",
  generationKwh: 127515.0,
  ratePerKwh: 3.5,
  baseAmount: 446302.5,
  adjustments: 0,
  totalDue: 446302.5,
  dueDate: "Feb 10, 2026",
  status: "PENDING" as const,
};