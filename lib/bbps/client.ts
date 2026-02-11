/**
 * BBPS (Bharat Bill Payment System) API Client
 * 
 * This client handles communication with BBPS API for fetching electricity bills
 * 
 * BBPS API Documentation: https://www.npci.org.in/what-we-do/bbps/overview
 */

interface BBPSBillRequest {
  consumerNumber: string;
  discom: string;
  state: string;
}

interface BBPSBillResponse {
  success: boolean;
  data?: {
    bill_number: string;
    amount: number;
    due_date: string;
    bill_month: number;
    bill_year: number;
    discom: string;
    consumer_number: string;
    billing_period?: string;
    units_consumed?: number;
    previous_reading?: number;
    current_reading?: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export class BBPSClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.BBPS_API_KEY || "";
    this.apiSecret = process.env.BBPS_API_SECRET || "";
    this.baseUrl = process.env.BBPS_BASE_URL || "https://api.bbps.com/v1";
  }

  /**
   * Check if BBPS is configured
   */
  isConfigured(): boolean {
    return !!(this.apiKey && this.apiSecret && this.baseUrl);
  }

  /**
   * Check if we should use mock mode
   */
  shouldUseMock(): boolean {
    return process.env.BBPS_USE_MOCK === "true" || !this.isConfigured();
  }

  /**
   * Generate authentication token for BBPS API
   */
  private async getAuthToken(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          api_secret: this.apiSecret,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to authenticate with BBPS API");
      }

      const data = await response.json();
      return data.token || data.access_token;
    } catch (error: any) {
      console.error("BBPS Auth Error:", error);
      throw new Error("BBPS authentication failed");
    }
  }

  /**
   * Mock bill generation for development/testing
   */
  private async generateMockBill(request: BBPSBillRequest): Promise<BBPSBillResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Generate realistic mock bill data
    const now = new Date();
    const billMonth = now.getMonth() + 1;
    const billYear = now.getFullYear();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + 15); // Due in 15 days

    // Generate random but realistic bill amount (₹500 - ₹5000)
    const baseAmount = 500 + Math.random() * 4500;
    const billAmount = Math.round(baseAmount * 100) / 100;

    // Generate bill number
    const billNumber = `${request.discom.substring(0, 3).toUpperCase()}-${billYear}${String(billMonth).padStart(2, "0")}-${Math.floor(Math.random() * 100000)}`;

    return {
      success: true,
      data: {
        bill_number: billNumber,
        amount: billAmount,
        due_date: dueDate.toISOString(),
        bill_month: billMonth,
        bill_year: billYear,
        discom: request.discom,
        consumer_number: request.consumerNumber,
        billing_period: `${now.toLocaleDateString("en-IN", { month: "short" })} ${billYear}`,
        units_consumed: Math.floor(100 + Math.random() * 400), // 100-500 units
        previous_reading: Math.floor(1000 + Math.random() * 5000),
        current_reading: Math.floor(1500 + Math.random() * 6000),
      },
    };
  }

  /**
   * Fetch bill from BBPS
   */
  async fetchBill(request: BBPSBillRequest): Promise<BBPSBillResponse> {
    // Use mock mode if configured or if BBPS is not configured
    if (this.shouldUseMock()) {
      console.log("Using mock BBPS mode for development");
      return this.generateMockBill(request);
    }

    if (!this.isConfigured()) {
      return {
        success: false,
        error: {
          code: "BBPS_NOT_CONFIGURED",
          message: "BBPS API credentials not configured",
        },
      };
    }

    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${this.baseUrl}/bills/fetch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          consumer_number: request.consumerNumber,
          discom: request.discom,
          state: request.state,
          bill_category: "ELECTRICITY",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: {
            code: `BBPS_${response.status}`,
            message: errorData.message || `BBPS API returned status ${response.status}`,
          },
        };
      }

      const data = await response.json();

      // Transform BBPS response to our format
      return {
        success: true,
        data: {
          bill_number: data.bill_number || data.billNumber || `BBPS-${Date.now()}`,
          amount: parseFloat(data.amount || data.bill_amount || "0"),
          due_date: data.due_date || data.dueDate || new Date().toISOString(),
          bill_month: data.bill_month || data.billingMonth || new Date().getMonth() + 1,
          bill_year: data.bill_year || data.billingYear || new Date().getFullYear(),
          discom: request.discom,
          consumer_number: request.consumerNumber,
          billing_period: data.billing_period || data.billingPeriod,
          units_consumed: data.units_consumed || data.unitsConsumed,
          previous_reading: data.previous_reading || data.previousReading,
          current_reading: data.current_reading || data.currentReading,
        },
      };
    } catch (error: any) {
      console.error("BBPS Fetch Error:", error);
      return {
        success: false,
        error: {
          code: "BBPS_FETCH_ERROR",
          message: error.message || "Failed to fetch bill from BBPS",
        },
      };
    }
  }

  /**
   * Validate consumer number format for a given DISCOM
   */
  validateConsumerNumber(consumerNumber: string, discom: string): boolean {
    // Basic validation - can be enhanced with DISCOM-specific rules
    if (!consumerNumber || consumerNumber.length < 8) {
      return false;
    }

    // DISCOM-specific validation patterns
    const patterns: Record<string, RegExp> = {
      "BSES Rajdhani": /^[0-9]{10,12}$/,
      "BSES Yamuna": /^[0-9]{10,12}$/,
      "Tata Power": /^[0-9]{10,12}$/,
      "Adani Electricity": /^[0-9]{10,12}$/,
      "BEST": /^[0-9]{8,12}$/,
      // Add more DISCOM patterns as needed
    };

    const pattern = patterns[discom];
    if (pattern) {
      return pattern.test(consumerNumber);
    }

    // Default: alphanumeric, 8-15 characters
    return /^[A-Z0-9]{8,15}$/i.test(consumerNumber);
  }
}

export const bbpsClient = new BBPSClient();

