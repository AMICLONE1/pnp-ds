import {
  calculateMonthlySavings,
  calculateYearlySavings,
  calculateCO2Offset,
  calculatePaybackPeriod,
  formatCurrency,
  formatCapacity,
} from "@/lib/solar-calculations";

describe("Solar Calculations", () => {
  describe("calculateMonthlySavings", () => {
    it("calculates correct savings for standard capacity", () => {
      // 5kW * 4.5 hrs/day * 30 days * ₹8/kWh = ₹5,400
      const savings = calculateMonthlySavings(5);
      expect(savings).toBeGreaterThan(0);
      expect(typeof savings).toBe("number");
    });

    it("handles zero capacity", () => {
      expect(calculateMonthlySavings(0)).toBe(0);
    });

    it("handles negative capacity gracefully", () => {
      const savings = calculateMonthlySavings(-5);
      expect(savings).toBeLessThanOrEqual(0);
    });

    it("handles decimal capacity", () => {
      const savings = calculateMonthlySavings(2.5);
      expect(savings).toBeGreaterThan(0);
    });

    it("increases linearly with capacity", () => {
      const savings5kW = calculateMonthlySavings(5);
      const savings10kW = calculateMonthlySavings(10);
      expect(savings10kW).toBeCloseTo(savings5kW * 2, 0);
    });
  });

  describe("calculateYearlySavings", () => {
    it("calculates yearly savings correctly", () => {
      const monthly = calculateMonthlySavings(5);
      const yearly = calculateYearlySavings(5);
      expect(yearly).toBeCloseTo(monthly * 12, 0);
    });

    it("handles zero capacity", () => {
      expect(calculateYearlySavings(0)).toBe(0);
    });
  });

  describe("calculateCO2Offset", () => {
    it("calculates CO2 offset correctly", () => {
      // 5kW should offset significant CO2
      const offset = calculateCO2Offset(5);
      expect(offset).toBeGreaterThan(0);
    });

    it("handles zero capacity", () => {
      expect(calculateCO2Offset(0)).toBe(0);
    });

    it("increases with capacity", () => {
      const offset5kW = calculateCO2Offset(5);
      const offset10kW = calculateCO2Offset(10);
      expect(offset10kW).toBeGreaterThan(offset5kW);
    });
  });

  describe("calculatePaybackPeriod", () => {
    it("calculates payback period correctly", () => {
      const period = calculatePaybackPeriod(5, 375000);
      expect(period).toBeGreaterThan(0);
      expect(period).toBeLessThan(20); // Should be reasonable
    });

    it("handles zero investment", () => {
      expect(calculatePaybackPeriod(5, 0)).toBe(0);
    });

    it("handles zero capacity", () => {
      const period = calculatePaybackPeriod(0, 100000);
      expect(period).toBe(Infinity);
    });

    it("decreases with higher savings (more capacity)", () => {
      const period5kW = calculatePaybackPeriod(5, 375000);
      const period10kW = calculatePaybackPeriod(10, 375000);
      expect(period10kW).toBeLessThan(period5kW);
    });
  });
});

describe("Formatting Utilities", () => {
  describe("formatCurrency", () => {
    it("formats INR correctly", () => {
      const formatted = formatCurrency(1234567);
      expect(formatted).toContain("₹");
      expect(formatted).toContain("12,34,567"); // Indian number format
    });

    it("handles zero", () => {
      expect(formatCurrency(0)).toContain("0");
    });

    it("handles negative values", () => {
      const formatted = formatCurrency(-1000);
      expect(formatted).toContain("-");
    });

    it("handles decimals", () => {
      const formatted = formatCurrency(1234.56);
      expect(formatted).toContain("₹");
    });
  });

  describe("formatCapacity", () => {
    it("formats kW correctly", () => {
      expect(formatCapacity(5)).toBe("5 kW");
    });

    it("formats decimal capacity", () => {
      expect(formatCapacity(2.5)).toBe("2.5 kW");
    });

    it("handles large capacity", () => {
      expect(formatCapacity(1000)).toBe("1,000 kW");
    });
  });
});
