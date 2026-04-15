// ============================================
// Trillectric → DB Row Mapper
// ============================================

import type {
  DailyGenerationUpsert,
  InverterReadingInsert,
  TrillectricReading,
} from "./types";

/** Safely coerce a value to a number, returning null for non-finite values */
function toNum(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Safely coerce a value to an array of numbers */
function toNumArray(value: unknown): number[] | null {
  if (!Array.isArray(value)) return null;
  const arr = value.map((v) => Number(v)).filter((n) => Number.isFinite(n));
  return arr.length > 0 ? arr : null;
}

/**
 * Map a raw Trillectric reading to an inverter_readings row.
 * Stores the original reading in raw_payload for future re-parsing.
 */
export function mapReadingToRow(
  reading: TrillectricReading,
  projectId: string
): InverterReadingInsert {
  return {
    project_id: projectId,
    reading_timestamp: reading.ReadingTimeStamp,
    ac_power: toNum(reading.ACPower),
    energy_today: toNum(reading.EnergyToday),
    energy_lifetime: toNum(reading.EnergyLifeTime),
    frequency: toNum(reading.Frequency),
    power_factor: toNum(reading.PowerFactor),
    apparent_power: toNum(reading.ApparentPower),
    reactive_power: toNum(reading.ReactivePower),
    inverter_temperature: toNum(reading.InverterTemperature1),
    mppt_currents: toNumArray(reading.MPPTCurrentList),
    mppt_voltages: toNumArray(reading.MPPTVoltageList),
    mppt_powers: toNumArray(reading.MPPTPowerList),
    ac_currents: toNumArray(reading.ACCurrent),
    ac_voltages: toNumArray(reading.ACVoltage),
    string_voltages: toNumArray(reading.StringVoltageList),
    string_currents: toNumArray(reading.StringCurrentList),
    string_powers: toNumArray(reading.StringPowerList),
    inverter_status:
      reading.InverterStatus !== undefined && reading.InverterStatus !== null
        ? String(reading.InverterStatus)
        : null,
    fault: reading.fault ?? null,
    runtime_today: toNum(reading.RuntimeToday),
    runtime_lifetime: toNum(reading.RuntimeLifetime),
    raw_payload: reading as unknown as Record<string, unknown>,
  };
}

/**
 * Aggregate a set of readings into daily generation rows.
 * EnergyToday is a cumulative daily counter, so the value from the
 * latest reading of each day is the authoritative total for that day.
 * Returns one upsert row per distinct day found in the readings.
 */
export function aggregateDaily(
  readings: TrillectricReading[],
  projectId: string
): DailyGenerationUpsert[] {
  if (readings.length === 0) return [];

  type Bucket = {
    date: string;
    latestTs: number;
    latestEnergyToday: number;
    peakPower: number;
    tempSum: number;
    tempCount: number;
    count: number;
  };

  const buckets = new Map<string, Bucket>();

  for (const reading of readings) {
    const ts = new Date(reading.ReadingTimeStamp);
    if (Number.isNaN(ts.getTime())) continue;

    // Use ISO date (YYYY-MM-DD) from the reading's local date
    const date = ts.toISOString().slice(0, 10);
    const tsMs = ts.getTime();

    let bucket = buckets.get(date);
    if (!bucket) {
      bucket = {
        date,
        latestTs: 0,
        latestEnergyToday: 0,
        peakPower: 0,
        tempSum: 0,
        tempCount: 0,
        count: 0,
      };
      buckets.set(date, bucket);
    }

    const energyToday = Number(reading.EnergyToday);
    if (Number.isFinite(energyToday) && tsMs >= bucket.latestTs) {
      bucket.latestTs = tsMs;
      bucket.latestEnergyToday = energyToday;
    }

    const acPower = Number(reading.ACPower);
    if (Number.isFinite(acPower) && acPower > bucket.peakPower) {
      bucket.peakPower = acPower;
    }

    const temp = Number(reading.InverterTemperature1);
    if (Number.isFinite(temp)) {
      bucket.tempSum += temp;
      bucket.tempCount += 1;
    }

    bucket.count += 1;
  }

  return Array.from(buckets.values()).map((b) => ({
    project_id: projectId,
    date: b.date,
    kwh: Math.round(b.latestEnergyToday * 100) / 100,
    peak_power_w: b.peakPower > 0 ? Math.round(b.peakPower) : null,
    avg_temperature:
      b.tempCount > 0
        ? Math.round((b.tempSum / b.tempCount) * 10) / 10
        : null,
    reading_count: b.count,
    source: "TRILLECTRIC",
  }));
}

/**
 * Determine whether a reading indicates a fault.
 * Returns null if no fault, or an object with severity and message.
 */
export function detectFault(
  reading: TrillectricReading
): { severity: "WARNING" | "CRITICAL"; message: string } | null {
  const fault = (reading.fault || "").trim();
  const status = Number(reading.InverterStatus);

  if (fault && fault.toUpperCase() !== "OK" && fault.toUpperCase() !== "NONE") {
    const critical = /OVER|SHORT|FIRE|GROUND|ISOLATION/i.test(fault);
    return {
      severity: critical ? "CRITICAL" : "WARNING",
      message: fault,
    };
  }

  // Status 0 during daytime is suspicious but not necessarily a fault.
  // Status values > 1 typically indicate error states in inverter firmware.
  if (Number.isFinite(status) && status > 1) {
    return {
      severity: "WARNING",
      message: `Inverter reported status code ${status}`,
    };
  }

  return null;
}
