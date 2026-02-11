// Shared Solar Calculation Constants
// Used across Hero Section, Reserve Page, and all savings calculators

export const SOLAR_CONSTANTS = {
  // Credit rate per kWh (discount on power bill) - ₹7 per unit
  creditRatePerUnit: 7,
  
  // Average solar generation per kW per day (in kWh) - 1kW generates 4.5 units per day
  avgGenerationPerKwPerDay: 4.5,
  
  // Days in a month
  daysPerMonth: 30,
  
  // Base setup cost per kW - ₹35,000 per kW
  baseCostPerKw: 35000,
  
  // Bulk discount tiers (cost reduction as capacity increases)
  // Format: [minKw, discountPercentage]
  bulkDiscountTiers: [
    { minKw: 0, discount: 0 },      // 0-4.99 kW: No discount
    { minKw: 5, discount: 5 },     // 5-9.99 kW: 5% discount
    { minKw: 10, discount: 10 },   // 10-24.99 kW: 10% discount
    { minKw: 25, discount: 15 },   // 25-49.99 kW: 15% discount
    { minKw: 50, discount: 20 },   // 50+ kW: 20% discount
  ],
  
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
  surya: {
    id: '550e8400-e29b-41d4-a716-446655440003',
    spvId: 'SPV-PNP-003',
    name: 'Surya Solar Farm',
    totalKw: 500,
    ratePerKwh: 7,
    location: 'Ahmedabad, Gujarat',
    state: 'Gujarat',
    description: 'A large-scale 500kW solar farm in Gujarat, one of India\'s sunniest states. Ideal for commercial and industrial users seeking significant electricity bill reductions with maximum solar generation potential.',
  },
  thar: {
    id: '550e8400-e29b-41d4-a716-446655440004',
    spvId: 'SPV-PNP-004',
    name: 'Thar Desert Solar',
    totalKw: 750,
    ratePerKwh: 7,
    location: 'Jodhpur, Rajasthan',
    state: 'Rajasthan',
    description: 'A 750kW solar installation in the Thar Desert region, leveraging Rajasthan\'s exceptional solar irradiance. Perfect for large-scale energy needs with optimal sun exposure year-round.',
  },
  kaveri: {
    id: '550e8400-e29b-41d4-a716-446655440005',
    spvId: 'SPV-PNP-005',
    name: 'Kaveri Solar Hub',
    totalKw: 200,
    ratePerKwh: 7,
    location: 'Bangalore, Karnataka',
    state: 'Karnataka',
    description: 'A 200kW solar hub serving the tech capital of India. Designed for IT professionals and startups looking to reduce operational costs while supporting renewable energy adoption.',
  },
  marina: {
    id: '550e8400-e29b-41d4-a716-446655440006',
    spvId: 'SPV-PNP-006',
    name: 'Marina Solar Station',
    totalKw: 300,
    ratePerKwh: 7,
    location: 'Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    description: 'A 300kW coastal solar station near Chennai. Engineered for the tropical climate with corrosion-resistant panels. Ideal for residential and commercial users in South India.',
  },
  ganga: {
    id: '550e8400-e29b-41d4-a716-446655440007',
    spvId: 'SPV-PNP-007',
    name: 'Ganga Plains Solar',
    totalKw: 400,
    ratePerKwh: 7,
    location: 'Lucknow, Uttar Pradesh',
    state: 'Uttar Pradesh',
    description: 'A 400kW solar project serving the populous Ganga plains region. Affordable solar energy for millions of households in North India with reliable generation and easy accessibility.',
  },
};

// Array of all projects for easy iteration
export const SOLAR_PROJECTS_LIST = Object.values(SOLAR_PROJECTS);

// Get a featured project (first one by default, or random)
export function getFeaturedProject(random = false) {
  if (random) {
    const index = Math.floor(Math.random() * SOLAR_PROJECTS_LIST.length);
    return SOLAR_PROJECTS_LIST[index];
  }
  return SOLAR_PROJECTS.vedvyas;
}

// Calculate setup cost with bulk discount
export function calculateSetupCost(capacityKw: number): number {
  // Find applicable discount tier
  let applicableDiscount = 0;
  for (let i = SOLAR_CONSTANTS.bulkDiscountTiers.length - 1; i >= 0; i--) {
    if (capacityKw >= SOLAR_CONSTANTS.bulkDiscountTiers[i].minKw) {
      applicableDiscount = SOLAR_CONSTANTS.bulkDiscountTiers[i].discount;
      break;
    }
  }
  
  // Calculate base cost
  const baseCost = capacityKw * SOLAR_CONSTANTS.baseCostPerKw;
  
  // Apply discount
  const discountAmount = baseCost * (applicableDiscount / 100);
  const finalCost = baseCost - discountAmount;
  
  return Math.round(finalCost);
}

// Calculate savings based on capacity in kW
export function calculateSolarSavings(capacityKw: number) {
  // 1kW generates 4.5 units per day
  const dailyGenerationKwh = capacityKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay;
  const monthlyGenerationKwh = dailyGenerationKwh * SOLAR_CONSTANTS.daysPerMonth;
  const monthlySavings = monthlyGenerationKwh * SOLAR_CONSTANTS.creditRatePerUnit;
  const annualSavings = monthlySavings * 12;
  const lifetimeSavings = annualSavings * SOLAR_CONSTANTS.projectLifespan;
  
  // CO2 offset calculations
  const annualEnergyKwh = monthlyGenerationKwh * 12;
  const co2OffsetKg = annualEnergyKwh * SOLAR_CONSTANTS.co2PerKwh;
  const co2OffsetTonnes = co2OffsetKg / 1000;
  const treesEquivalent = Math.round(co2OffsetTonnes * SOLAR_CONSTANTS.treesPerTonCO2);
  
  // One-time setup cost with bulk discount
  const setupCost = calculateSetupCost(capacityKw);
  
  // ROI calculation
  const roiYears = annualSavings > 0 ? setupCost / annualSavings : 0;
  
  return {
    monthlyGenerationKwh: Math.round(monthlyGenerationKwh * 100) / 100,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    annualSavings: Math.round(annualSavings * 100) / 100,
    lifetimeSavings: Math.round(lifetimeSavings * 100) / 100,
    reservationFee: setupCost,
    setupCost: setupCost,
    co2OffsetTonnes: Math.round(co2OffsetTonnes * 100) / 100,
    treesEquivalent,
    roiYears: Math.round(roiYears * 10) / 10,
  };
}

// Calculate capacity needed for target monthly savings
export function calculateCapacityForSavings(monthlySavings: number) {
  // Energy needed per month (kWh) to achieve target savings
  const energyNeededKwh = monthlySavings / SOLAR_CONSTANTS.creditRatePerUnit;
  
  // 1kW generates 4.5 units per day = 135 units per month
  const monthlyGenerationPerKw = SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth; // 135 kWh/month per kW
  const capacityNeededKw = energyNeededKwh / monthlyGenerationPerKw;
  const capacityNeededWatts = Math.round(capacityNeededKw * 1000);
  
  // Calculate setup cost with bulk discount
  const setupCost = calculateSetupCost(capacityNeededKw);
  
  return {
    capacityKw: Math.round(capacityNeededKw * 100) / 100,
    capacityWatts: capacityNeededWatts,
    energyKwh: Math.round(energyNeededKwh * 100) / 100,
    setupCost: setupCost,
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
