type PlantStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

interface PlantData {
  id: string;
  name: string;
  location: string;
  state: string;
  capacityKw: number;
  status: PlantStatus;
  todayKwh: number;
  monthlyKwh: number;
  lifetimeKwh: number;
  efficiency: number;
  ppaRate: number;
  commissionedDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  panelCount: number;
  inverterCount: number;
  panelType: string;
  tiltAngle: number;
  areaAcres: number;
  co2OffsetTons: number;
  todayTrend: number;
  monthlyRevenue: number;
  weather: {
    temp: number;
    condition: string;
    irradiance: number;
    humidity: number;
    windSpeed: number;
  };
  dailyGeneration: { hour: string; kwh: number }[];
  monthlyGeneration: { month: string; kwh: number; expected: number }[];
  alerts: { id: string; title: string; severity: "CRITICAL" | "WARNING" | "INFO"; time: string }[];
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

export const MOCK_PLANTS: PlantData[] = [
  {
    id: "1",
    name: "Vedvyas Solar Park",
    location: "Cuttack, Odisha",
    state: "Odisha",
    capacityKw: 500,
    status: "ACTIVE",
    todayKwh: 1875.5,
    monthlyKwh: 52340,
    lifetimeKwh: 2456000,
    efficiency: 93.2,
    ppaRate: 3.5,
    commissionedDate: "2024-03-15",
    lastMaintenanceDate: "2026-01-10",
    nextMaintenanceDate: "2026-04-10",
    panelCount: 1200,
    inverterCount: 8,
    panelType: "Monocrystalline 440W",
    tiltAngle: 22,
    areaAcres: 3.2,
    co2OffsetTons: 52.3,
    todayTrend: 12.5,
    monthlyRevenue: 183190,
    weather: { temp: 32, condition: "Sunny", irradiance: 5.8, humidity: 45, windSpeed: 12 },
    dailyGeneration: [
      { hour: "6AM", kwh: 25 }, { hour: "7AM", kwh: 95 }, { hour: "8AM", kwh: 165 },
      { hour: "9AM", kwh: 210 }, { hour: "10AM", kwh: 245 }, { hour: "11AM", kwh: 260 },
      { hour: "12PM", kwh: 268 }, { hour: "1PM", kwh: 255 }, { hour: "2PM", kwh: 235 },
      { hour: "3PM", kwh: 195 }, { hour: "4PM", kwh: 140 }, { hour: "5PM", kwh: 65 },
      { hour: "6PM", kwh: 17 },
    ],
    monthlyGeneration: [
      { month: "Sep", kwh: 48200, expected: 50000 }, { month: "Oct", kwh: 51300, expected: 50000 },
      { month: "Nov", kwh: 47800, expected: 48000 }, { month: "Dec", kwh: 45600, expected: 46000 },
      { month: "Jan", kwh: 49200, expected: 48000 }, { month: "Feb", kwh: 52340, expected: 50000 },
    ],
    alerts: [
      { id: "a1", title: "Inverter #3 temperature high", severity: "WARNING", time: "4h ago" },
    ],
  },
  {
    id: "2",
    name: "Sunrise Energy Hub",
    location: "Bhubaneswar, Odisha",
    state: "Odisha",
    capacityKw: 600,
    status: "ACTIVE",
    todayKwh: 1520.0,
    monthlyKwh: 61080,
    lifetimeKwh: 3120000,
    efficiency: 91.8,
    ppaRate: 3.5,
    commissionedDate: "2023-09-20",
    lastMaintenanceDate: "2025-12-05",
    nextMaintenanceDate: "2026-03-05",
    panelCount: 1450,
    inverterCount: 10,
    panelType: "Bifacial 550W",
    tiltAngle: 20,
    areaAcres: 4.1,
    co2OffsetTons: 48.9,
    todayTrend: -3.2,
    monthlyRevenue: 213780,
    weather: { temp: 34, condition: "Partly Cloudy", irradiance: 4.9, humidity: 52, windSpeed: 8 },
    dailyGeneration: [
      { hour: "6AM", kwh: 30 }, { hour: "7AM", kwh: 85 }, { hour: "8AM", kwh: 150 },
      { hour: "9AM", kwh: 195 }, { hour: "10AM", kwh: 220 }, { hour: "11AM", kwh: 230 },
      { hour: "12PM", kwh: 238 }, { hour: "1PM", kwh: 225 }, { hour: "2PM", kwh: 200 },
      { hour: "3PM", kwh: 170 }, { hour: "4PM", kwh: 120 }, { hour: "5PM", kwh: 45 },
      { hour: "6PM", kwh: 12 },
    ],
    monthlyGeneration: [
      { month: "Sep", kwh: 56400, expected: 58000 }, { month: "Oct", kwh: 59800, expected: 60000 },
      { month: "Nov", kwh: 55200, expected: 56000 }, { month: "Dec", kwh: 53900, expected: 55000 },
      { month: "Jan", kwh: 58100, expected: 58000 }, { month: "Feb", kwh: 61080, expected: 60000 },
    ],
    alerts: [],
  },
  {
    id: "3",
    name: "Green Valley Plant",
    location: "Rourkela, Odisha",
    state: "Odisha",
    capacityKw: 400,
    status: "MAINTENANCE",
    todayKwh: 855.0,
    monthlyKwh: 28500,
    lifetimeKwh: 1840000,
    efficiency: 88.4,
    ppaRate: 3.5,
    commissionedDate: "2024-06-01",
    lastMaintenanceDate: "2026-02-08",
    nextMaintenanceDate: "2026-02-15",
    panelCount: 960,
    inverterCount: 6,
    panelType: "Polycrystalline 420W",
    tiltAngle: 25,
    areaAcres: 2.5,
    co2OffsetTons: 26.3,
    todayTrend: -28.5,
    monthlyRevenue: 99750,
    weather: { temp: 29, condition: "Overcast", irradiance: 3.4, humidity: 68, windSpeed: 15 },
    dailyGeneration: [
      { hour: "6AM", kwh: 12 }, { hour: "7AM", kwh: 48 }, { hour: "8AM", kwh: 88 },
      { hour: "9AM", kwh: 115 }, { hour: "10AM", kwh: 128 }, { hour: "11AM", kwh: 132 },
      { hour: "12PM", kwh: 130 }, { hour: "1PM", kwh: 120 }, { hour: "2PM", kwh: 105 },
      { hour: "3PM", kwh: 80 }, { hour: "4PM", kwh: 55 }, { hour: "5PM", kwh: 30 },
      { hour: "6PM", kwh: 12 },
    ],
    monthlyGeneration: [
      { month: "Sep", kwh: 38200, expected: 40000 }, { month: "Oct", kwh: 39800, expected: 40000 },
      { month: "Nov", kwh: 36500, expected: 38000 }, { month: "Dec", kwh: 35200, expected: 37000 },
      { month: "Jan", kwh: 37800, expected: 38000 }, { month: "Feb", kwh: 28500, expected: 38000 },
    ],
    alerts: [
      { id: "a2", title: "Scheduled maintenance in progress", severity: "INFO", time: "2d ago" },
      { id: "a3", title: "Generation 30% below expected", severity: "CRITICAL", time: "6h ago" },
    ],
  },
];