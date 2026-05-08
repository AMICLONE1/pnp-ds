import { SOLAR_CONSTANTS, calculateSetupCost } from "@/lib/solar-constants";

/**
 * Server-side source of truth for what a user pays to reserve `capacityKw`
 * of solar capacity. Mirrors the breakdown the signup UI displays:
 *   base = capacityKw × baseCostPerKw
 *   bulk discount (built into calculateSetupCost)
 *   + platform fee
 *   + 18% GST on (subtotal + platform fee)
 *
 * Always re-compute this on the server in /api/payments/create-order — never
 * trust an amount sent from the client.
 */
// TEMPORARY: smoke-test mode. Set to false to restore production pricing.
const SMOKE_TEST_MODE = true;

export function calculateAllocationPrice(capacityKw: number) {
  const subtotal = calculateSetupCost(capacityKw); // setup cost with bulk discount

  if (SMOKE_TEST_MODE) {
    return {
      subtotal,
      platformFee: 0,
      gst: 0,
      total: subtotal,
    };
  }

  const platformFee = SOLAR_CONSTANTS.platformFee;
  const preGst = subtotal + platformFee;
  const gst = Math.round(preGst * SOLAR_CONSTANTS.gstRate);
  const total = preGst + gst;
  return {
    subtotal,
    platformFee,
    gst,
    total,
  };
}
