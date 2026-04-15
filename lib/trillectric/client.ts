// ============================================
// Trillectric API Client
// ============================================

import type {
  TrillectricApiResponse,
  TrillectricInterval,
  TrillectricReading,
} from "./types";

const TRILLECTRIC_BASE_URL = "https://api.trillectric.com";
const DEFAULT_TIMEOUT_MS = 30_000;

export class TrillectricError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "TrillectricError";
  }
}

export class TrillectricClient {
  private readonly bearerToken: string;
  private readonly partnerId: string;
  private readonly baseUrl: string;
  private readonly mockMode: boolean;

  constructor(options?: {
    bearerToken?: string;
    partnerId?: string;
    baseUrl?: string;
    mockMode?: boolean;
  }) {
    this.bearerToken = options?.bearerToken ?? process.env.TRILLECTRIC_API_TOKEN ?? "";
    this.partnerId = options?.partnerId ?? process.env.TRILLECTRIC_PARTNER_ID ?? "";
    this.baseUrl = options?.baseUrl ?? TRILLECTRIC_BASE_URL;
    this.mockMode =
      options?.mockMode ?? process.env.TRILLECTRIC_USE_MOCK === "true";
  }

  /** Returns true if credentials are configured (token + partnerId) */
  isConfigured(): boolean {
    return Boolean(this.bearerToken && this.partnerId);
  }

  /** Returns true if the client is running in mock mode */
  shouldUseMock(): boolean {
    return this.mockMode || !this.isConfigured();
  }

  /**
   * Fetch inverter data for a site and interval.
   * Throws TrillectricError on failure.
   */
  async fetchData(
    siteId: string,
    interval: TrillectricInterval,
    overrideToken?: string
  ): Promise<TrillectricReading[]> {
    if (!siteId) {
      throw new TrillectricError("siteId is required");
    }

    if (this.shouldUseMock()) {
      return this.generateMockData(siteId, interval);
    }

    const url = new URL(`${this.baseUrl}/api/data`);
    url.searchParams.set("siteId", siteId);
    url.searchParams.set("interval", interval);
    url.searchParams.set("partnerId", this.partnerId);

    const token = overrideToken ?? this.bearerToken;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new TrillectricError(
          `Trillectric API returned ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const payload = (await response.json()) as TrillectricApiResponse;

      if (!payload.success) {
        throw new TrillectricError(
          payload.message || "Trillectric API returned success=false",
          payload.status
        );
      }

      return Array.isArray(payload.data) ? payload.data : [];
    } catch (err) {
      if (err instanceof TrillectricError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new TrillectricError(
          `Trillectric API request timed out after ${DEFAULT_TIMEOUT_MS}ms`,
          undefined,
          err
        );
      }
      throw new TrillectricError(
        `Trillectric API request failed: ${err instanceof Error ? err.message : String(err)}`,
        undefined,
        err
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Generate synthetic readings for dev/testing.
   * Produces one reading every 15 minutes across the interval with
   * a plausible sinusoidal power curve peaking at solar noon.
   */
  private generateMockData(
    siteId: string,
    interval: TrillectricInterval
  ): TrillectricReading[] {
    const now = new Date();
    const readings: TrillectricReading[] = [];

    // Determine start of window based on interval
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    if (interval === "yesterday") start.setDate(start.getDate() - 1);
    if (interval === "week") start.setDate(start.getDate() - 6);
    if (interval === "mtd") start.setDate(1);

    const end =
      interval === "yesterday"
        ? new Date(start.getTime() + 24 * 60 * 60 * 1000)
        : now;

    // Seeded pseudo-randomness based on siteId for deterministic output
    const siteSeed = siteId
      .split("")
      .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    const capacityKw = 100 + (siteSeed % 50); // 100-150 kW
    const peakAcPower = capacityKw * 800; // Watts, ~80% of rated

    let energyLifetime = 100000 + siteSeed * 100;
    let energyToday = 0;
    let runtimeLifetime = 2000 + (siteSeed % 200);
    let runtimeToday = 0;
    let currentDay = -1;

    const stepMs = 15 * 60 * 1000;
    for (let t = start.getTime(); t <= end.getTime(); t += stepMs) {
      const ts = new Date(t);
      const hour = ts.getHours() + ts.getMinutes() / 60;

      // Reset daily counters when day changes
      const dayIndex = Math.floor(t / (24 * 60 * 60 * 1000));
      if (dayIndex !== currentDay) {
        currentDay = dayIndex;
        energyToday = 0;
        runtimeToday = 0;
      }

      // Solar curve: zero outside 6am-6pm, sinusoidal peak at noon
      let acPower = 0;
      if (hour >= 6 && hour <= 18) {
        const phase = ((hour - 6) / 12) * Math.PI;
        acPower = Math.max(0, Math.sin(phase) * peakAcPower);
      }

      // Add gentle noise
      acPower = acPower * (0.9 + ((siteSeed + t) % 20) / 100);

      // Integrate energy (kWh = W * 0.25h / 1000)
      const kwhStep = (acPower * 0.25) / 1000;
      energyToday += kwhStep;
      energyLifetime += kwhStep;
      if (acPower > 0) {
        runtimeToday += 0.25;
        runtimeLifetime += 0.25;
      }

      readings.push({
        ReadingTimeStamp: ts.toISOString(),
        ACPower: Math.round(acPower * 100) / 100,
        EnergyToday: Math.round(energyToday * 100) / 100,
        EnergyLifeTime: Math.round(energyLifetime),
        Frequency: 49.9 + Math.random() * 0.2,
        PowerFactor: 0.98 + Math.random() * 0.02,
        InverterTemperature1: 35 + (acPower / peakAcPower) * 25,
        MPPTCurrentList: [22.5, 12.3, 33.2, 11.2, 44.1],
        MPPTVoltageList: [310.5, 305.2, 315.8, 300.1, 318.7],
        MPPTPowerList: [6990.8, 3753.0, 10486.6, 3361.1, 14043.7],
        ACCurrent: [8.2, 7.9, 8.1],
        ACVoltage: [231.0, 232.5, 230.8],
        StringVoltageList: [620.5, 618.2, 621.7, 619.0, 622.1],
        StringCurrentList: [10.2, 6.1, 9.8, 5.7, 11.1],
        StringPowerList: [6325.1, 3771.0, 6092.7, 3528.3, 6905.3],
        ApparentPower: Math.round(acPower * 1.02),
        ReactivePower: 0,
        InverterStatus: acPower > 0 ? 1 : 0,
        fault: "OK",
        RuntimeToday: Math.round(runtimeToday * 10) / 10,
        RuntimeLifetime: Math.round(runtimeLifetime * 10) / 10,
      });
    }

    return readings;
  }
}

/** Singleton instance using environment configuration */
let defaultClient: TrillectricClient | null = null;
export function getTrillectricClient(): TrillectricClient {
  if (!defaultClient) {
    defaultClient = new TrillectricClient();
  }
  return defaultClient;
}
