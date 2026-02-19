export const PLANTS = [
  { id: "1", name: "Vedvyas Solar Park", location: "Cuttack, Odisha", capacityKw: 500, efficiency: 93.2, prRatio: 82.1, availability: 98.5, avgDailyGen: 1875, peakGen: 2340, color: "#0D2818" },
  { id: "2", name: "Sunrise Energy Hub", location: "Bhubaneswar, Odisha", capacityKw: 600, efficiency: 91.8, prRatio: 79.6, availability: 97.2, avgDailyGen: 1520, peakGen: 2180, color: "#1B5E3E" },
  { id: "3", name: "Green Valley Plant", location: "Rourkela, Odisha", capacityKw: 400, efficiency: 88.4, prRatio: 76.3, availability: 94.8, avgDailyGen: 855, peakGen: 1420, color: "#FFB800" },
];
 
export const KPI_DATA = {
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
export const DAILY_GENERATION = Array.from({ length: 30 }, (_, i) => {
  const base = 3800 + Math.sin(i * 0.2) * 400;
  const weather = Math.random() * 600 - 200;
  const actual = Math.max(2800, base + weather);
  const expected = 4200 + Math.sin(i * 0.15) * 200;
  return { day: i + 1, actual: Math.round(actual), expected: Math.round(expected) };
});
 
export const WEEKLY_PATTERN = [
  { day: "Mon", avg: 4120 },
  { day: "Tue", avg: 4350 },
  { day: "Wed", avg: 4480 },
  { day: "Thu", avg: 4290 },
  { day: "Fri", avg: 4510 },
  { day: "Sat", avg: 4180 },
  { day: "Sun", avg: 3950 },
];
 
export const MONTHLY_BREAKDOWN = [
  { month: "Sep", actual: 118200, expected: 126000 },
  { month: "Oct", actual: 125400, expected: 130000 },
  { month: "Nov", actual: 121800, expected: 128000 },
  { month: "Dec", actual: 134500, expected: 132000 },
  { month: "Jan", actual: 130200, expected: 131000 },
  { month: "Feb", actual: 127515, expected: 129000 },
];

export const IRRADIANCE_DATA = Array.from({ length: 24 }, (_, i) => {
  const irradiance = i < 6 || i > 18 ? 0 : Math.sin(((i - 6) / 12) * Math.PI) * 950 + Math.random() * 80;
  const generation = irradiance > 50 ? irradiance * 0.42 + Math.random() * 30 - 15 : 0;
  return { hour: `${i.toString().padStart(2, "0")}:00`, irradiance: Math.round(Math.max(0, irradiance)), generation: Math.round(Math.max(0, generation)) };
});
 
export const ENV_IMPACT = {
  co2Tons: 127.5,
  treesEquivalent: 5842,
  homesPowered: 312,
};