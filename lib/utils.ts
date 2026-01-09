import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Consistent number formatter to prevent hydration mismatches
// Uses a simple approach that works consistently on both server and client
export function formatNumber(value: number, options?: { maximumFractionDigits?: number }): string {
  const maxFractionDigits = options?.maximumFractionDigits ?? 0;
  const rounded = maxFractionDigits > 0 
    ? Number(value.toFixed(maxFractionDigits))
    : Math.round(value);
  
  // Simple formatting: add commas for thousands
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function calculateSavings(
  capacityKw: number,
  pricePerKw: number
): number {
  // Estimated savings: 2x the monthly fee (rough estimate)
  return capacityKw * pricePerKw * 2;
}

