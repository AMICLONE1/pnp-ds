// Shared Solar Calculation Constants
// Used across Hero Section, Reserve Page, and all savings calculators

export const SOLAR_CONSTANTS = {
  // Credit rate per kWh (discount on power bill) - ₹7 per unit
  creditRatePerUnit: 7,
  
  // Average solar generation per kW per day (in kWh) - varies by region
  avgGenerationPerKwPerDay: 4.5,
  
  // Days in a month
  daysPerMonth: 30,
  
  // Reservation fee per watt (one-time) - ₹48.5 per watt
  reservationFeePerWatt: 48.5,
  
  // Project lifespan in years
  projectLifespan: 12.3,
  
  // Secured generation guarantee (75%)
  securedGeneration: 0.75,
  
  // CO2 offset per kWh (in kg)
  co2PerKwh: 0.9,
  
  // Trees equivalent per ton of CO2
  treesPerTonCO2: 45,
};

// Project data - matching database structure
export const SOLAR_PROJECTS = {
  vedvyas: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    spvId: 'SPV-PNP-001',
    name: 'Vedvyas Solar Park',
    totalKw: 100,
    ratePerKwh: 7,
    location: 'Cuttack, Odisha',
    state: 'Odisha',
    description: 'A 100kW community solar project located in Vedvyas, Cuttack. This project provides reliable solar energy generation with 75% secured generation guarantee. Perfect for residential users looking to offset their electricity bills.',
  },
  parshuram: {
    id: '550e8400-e29b-41d4-a716-446655440002',
    spvId: 'SPV-PNP-002',
    name: 'Parshuram Solar Plant',
    totalKw: 250,
    ratePerKwh: 7,
    location: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    description: 'A 250kW solar power plant in Mumbai offering higher capacity for urban energy needs. This project is ideal for users with larger electricity consumption. Features real-time monitoring and 75% guaranteed generation coverage.',
  },
};

// Calculate savings based on capacity in kW
export function calculateSolarSavings(capacityKw: number) {
  const monthlyGenerationKwh = capacityKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth;
  const monthlySavings = monthlyGenerationKwh * SOLAR_CONSTANTS.creditRatePerUnit;
  const annualSavings = monthlySavings * 12;
  const lifetimeSavings = annualSavings * SOLAR_CONSTANTS.projectLifespan;
  
  // CO2 offset calculations
  const annualEnergyKwh = monthlyGenerationKwh * 12;
  const co2OffsetKg = annualEnergyKwh * SOLAR_CONSTANTS.co2PerKwh;
  const co2OffsetTonnes = co2OffsetKg / 1000;
  const treesEquivalent = Math.round(co2OffsetTonnes * SOLAR_CONSTANTS.treesPerTonCO2);
  
  // One-time reservation fee
  const reservationFee = capacityKw * 1000 * SOLAR_CONSTANTS.reservationFeePerWatt;
  
  // ROI calculation
  const roiYears = reservationFee / annualSavings;
  
  return {
    monthlyGenerationKwh: Math.round(monthlyGenerationKwh * 100) / 100,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    annualSavings: Math.round(annualSavings * 100) / 100,
    lifetimeSavings: Math.round(lifetimeSavings * 100) / 100,
    reservationFee: Math.round(reservationFee * 100) / 100,
    co2OffsetTonnes: Math.round(co2OffsetTonnes * 100) / 100,
    treesEquivalent,
    roiYears: Math.round(roiYears * 10) / 10,
  };
}

// Calculate capacity needed for target monthly savings
export function calculateCapacityForSavings(monthlySavings: number) {
  const energyNeededKwh = monthlySavings / SOLAR_CONSTANTS.creditRatePerUnit;
  const monthlyGenerationPerKw = SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth;
  const capacityNeededKw = energyNeededKwh / monthlyGenerationPerKw;
  const capacityNeededWatts = Math.round(capacityNeededKw * 1000);
  
  return {
    capacityKw: Math.round(capacityNeededKw * 100) / 100,
    capacityWatts: capacityNeededWatts,
    energyKwh: Math.round(energyNeededKwh * 100) / 100,
  };
}

// Format currency in Indian Rupees
export function formatINR(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
