/**
 * Solar Calculation Utilities
 * 
 * Provides utility functions for calculating solar savings,
 * CO2 offset, payback periods, and formatting values.
 */

import { SOLAR_CONSTANTS } from "./solar-constants";

/**
 * Calculate monthly savings based on reserved solar capacity
 * @param capacityKw - The solar capacity in kilowatts (kW)
 * @param creditRatePerUnit - Optional custom credit rate (default from constants)
 * @returns The estimated monthly savings in INR
 * 
 * @example
 * ```ts
 * const savings = calculateMonthlySavings(5); // ~₹5,400
 * ```
 */
export function calculateMonthlySavings(
  capacityKw: number,
  creditRatePerUnit: number = SOLAR_CONSTANTS.creditRatePerUnit
): number {
  if (capacityKw <= 0) return 0;
  
  const dailyGeneration = capacityKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay;
  const monthlyGeneration = dailyGeneration * SOLAR_CONSTANTS.daysPerMonth;
  return Math.round(monthlyGeneration * creditRatePerUnit);
}

/**
 * Calculate yearly savings based on reserved solar capacity
 * @param capacityKw - The solar capacity in kilowatts (kW)
 * @returns The estimated yearly savings in INR
 */
export function calculateYearlySavings(capacityKw: number): number {
  return calculateMonthlySavings(capacityKw) * 12;
}

/**
 * Calculate lifetime savings based on reserved solar capacity
 * @param capacityKw - The solar capacity in kilowatts (kW)
 * @returns The estimated lifetime savings in INR
 */
export function calculateLifetimeSavings(capacityKw: number): number {
  return calculateYearlySavings(capacityKw) * SOLAR_CONSTANTS.projectLifespan;
}

/**
 * Calculate CO2 offset in kg per year based on capacity
 * @param capacityKw - The solar capacity in kilowatts (kW)
 * @returns The estimated yearly CO2 offset in kg
 */
export function calculateCO2Offset(capacityKw: number): number {
  if (capacityKw <= 0) return 0;
  
  const dailyGeneration = capacityKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay;
  const yearlyGeneration = dailyGeneration * 365;
  return Math.round(yearlyGeneration * SOLAR_CONSTANTS.co2PerKwh);
}

/**
 * Calculate monthly CO2 offset in kg based on capacity
 * @param capacityKw - The solar capacity in kilowatts (kW)
 * @returns The estimated monthly CO2 offset in kg
 */
export function calculateMonthlyCO2Offset(capacityKw: number): number {
  if (capacityKw <= 0) return 0;
  
  const dailyGeneration = capacityKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay;
  const monthlyGeneration = dailyGeneration * SOLAR_CONSTANTS.daysPerMonth;
  return Math.round(monthlyGeneration * SOLAR_CONSTANTS.co2PerKwh);
}

/**
 * Calculate equivalent trees planted based on CO2 offset
 * @param co2OffsetKg - CO2 offset in kg
 * @returns Equivalent number of trees
 */
export function calculateTreesEquivalent(co2OffsetKg: number): number {
  const co2Tons = co2OffsetKg / 1000;
  return Math.round(co2Tons * SOLAR_CONSTANTS.treesPerTonCO2);
}

/**
 * Calculate payback period in years
 * @param capacityKw - The solar capacity in kilowatts (kW)
 * @param investmentAmount - Total investment amount in INR
 * @returns Payback period in years
 */
export function calculatePaybackPeriod(
  capacityKw: number,
  investmentAmount: number
): number {
  if (investmentAmount <= 0) return 0;
  
  const yearlySavings = calculateYearlySavings(capacityKw);
  if (yearlySavings <= 0) return Infinity;
  
  return Number((investmentAmount / yearlySavings).toFixed(2));
}

/**
 * Calculate total investment for a given capacity
 * @param capacityKw - The solar capacity in kilowatts (kW)
 * @returns Total investment amount in INR
 */
export function calculateInvestment(capacityKw: number): number {
  const watts = capacityKw * 1000;
  return Math.round(watts * SOLAR_CONSTANTS.reservationFeePerWatt);
}

/**
 * Calculate ROI metrics for a solar investment
 * @param capacityKw - The solar capacity in kilowatts (kW)
 * @returns ROI metrics object
 */
export function calculateROI(capacityKw: number): {
  investment: number;
  monthlySavings: number;
  yearlySavings: number;
  lifetimeSavings: number;
  paybackYears: number;
  roi: number;
} {
  const investment = calculateInvestment(capacityKw);
  const monthlySavings = calculateMonthlySavings(capacityKw);
  const yearlySavings = calculateYearlySavings(capacityKw);
  const lifetimeSavings = calculateLifetimeSavings(capacityKw);
  const paybackYears = calculatePaybackPeriod(capacityKw, investment);
  const roi = investment > 0 ? ((lifetimeSavings - investment) / investment) * 100 : 0;
  
  return {
    investment,
    monthlySavings,
    yearlySavings,
    lifetimeSavings,
    paybackYears,
    roi: Math.round(roi),
  };
}

/**
 * Calculate daily energy generation
 * @param capacityKw - The solar capacity in kilowatts (kW)
 * @returns Daily generation in kWh
 */
export function calculateDailyGeneration(capacityKw: number): number {
  return capacityKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay;
}

/**
 * Calculate monthly energy generation
 * @param capacityKw - The solar capacity in kilowatts (kW)
 * @returns Monthly generation in kWh
 */
export function calculateMonthlyGeneration(capacityKw: number): number {
  return calculateDailyGeneration(capacityKw) * SOLAR_CONSTANTS.daysPerMonth;
}

// ============================================
// FORMATTING UTILITIES
// ============================================

/**
 * Format amount as Indian Rupees
 * @param amount - Amount to format
 * @param showDecimals - Whether to show decimal places
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, showDecimals: boolean = false): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return formatter.format(amount);
}

/**
 * Format capacity with kW unit
 * @param capacityKw - Capacity in kilowatts
 * @returns Formatted capacity string
 */
export function formatCapacity(capacityKw: number): string {
  const formatter = new Intl.NumberFormat("en-IN");
  return `${formatter.format(capacityKw)} kW`;
}

/**
 * Format energy with kWh unit
 * @param energyKwh - Energy in kilowatt-hours
 * @returns Formatted energy string
 */
export function formatEnergy(energyKwh: number): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
  });
  return `${formatter.format(energyKwh)} kWh`;
}

/**
 * Format CO2 offset with appropriate unit (kg or tons)
 * @param co2Kg - CO2 in kilograms
 * @returns Formatted CO2 string
 */
export function formatCO2(co2Kg: number): string {
  if (co2Kg >= 1000) {
    const tons = co2Kg / 1000;
    return `${tons.toFixed(1)} tons`;
  }
  return `${Math.round(co2Kg)} kg`;
}

/**
 * Format number in compact form (e.g., 1.2L, 50K)
 * @param num - Number to format
 * @returns Compact formatted string
 */
export function formatCompact(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(1)}Cr`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(1)}L`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
