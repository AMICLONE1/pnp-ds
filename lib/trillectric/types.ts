// ============================================
// Trillectric API Types
// ============================================

/** Raw reading from Trillectric API response */
export interface TrillectricReading {
  ReadingTimeStamp: string;
  ACPower: number;
  EnergyToday: number;
  EnergyLifeTime: number;
  Frequency: number;
  PowerFactor: number;
  InverterTemperature1: number;
  MPPTCurrentList: number[];
  MPPTVoltageList: number[];
  MPPTPowerList: number[];
  ACCurrent: number[];
  ACVoltage: number[];
  StringVoltageList: number[];
  StringCurrentList: number[];
  StringPowerList: number[];
  ApparentPower: number;
  ReactivePower: number;
  InverterStatus: number;
  fault: string;
  RuntimeToday: number;
  RuntimeLifetime: number;
}

/** Trillectric API response wrapper */
export interface TrillectricApiResponse {
  success: boolean;
  message: string;
  status: number;
  data: TrillectricReading[];
}

/** Valid interval values for the Trillectric API */
export type TrillectricInterval = "today" | "yesterday" | "week" | "mtd";

/** Row to insert into inverter_readings table */
export interface InverterReadingInsert {
  project_id: string;
  reading_timestamp: string;
  ac_power: number | null;
  energy_today: number | null;
  energy_lifetime: number | null;
  frequency: number | null;
  power_factor: number | null;
  apparent_power: number | null;
  reactive_power: number | null;
  inverter_temperature: number | null;
  mppt_currents: number[] | null;
  mppt_voltages: number[] | null;
  mppt_powers: number[] | null;
  ac_currents: number[] | null;
  ac_voltages: number[] | null;
  string_voltages: number[] | null;
  string_currents: number[] | null;
  string_powers: number[] | null;
  inverter_status: string | null;
  fault: string | null;
  runtime_today: number | null;
  runtime_lifetime: number | null;
  raw_payload: Record<string, unknown>;
}

/** Row to upsert into daily_generations table */
export interface DailyGenerationUpsert {
  project_id: string;
  date: string;
  kwh: number;
  peak_power_w: number | null;
  avg_temperature: number | null;
  reading_count: number;
  source: string;
}

/** Result from a single project sync */
export interface ProjectSyncResult {
  projectId: string;
  projectName: string;
  siteId: string;
  status: "SUCCESS" | "FAILED" | "SKIPPED";
  readingsFetched: number;
  readingsInserted: number;
  dailyKwh: number | null;
  monthlyKwh: number | null;
  creditsDistributed: number;
  error?: string;
}
