"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sun, 
  Zap, 
  Bolt, 
  Leaf, 
  TrendingUp, 
  CircleDollarSign, 
  ArrowRight,
  Sparkles,
  Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SOLAR_CONSTANTS, calculateSetupCost, SOLAR_PROJECTS } from "@/lib/solar-constants";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function CalculatorSection() {
  const [avgBill, setAvgBill] = useState(2500);
  const [billInput, setBillInput] = useState("2500");
  const [savingsPercent, setSavingsPercent] = useState(75);
  const [isBillFocused, setIsBillFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculations
  // Step 1: Calculate target monthly savings
  const monthlySavings = (avgBill * savingsPercent) / 100;
  
  // Step 2: Calculate energy needed (kWh/month) to achieve this savings
  // Monthly savings = Energy needed × Credit rate per unit
  const energyNeededKwhPerMonth = monthlySavings / SOLAR_CONSTANTS.creditRatePerUnit;
  
  // Step 3: Calculate capacity needed (kW)
  // 1kW generates 4.5 units per day = 4.5 × 30 = 135 units per month
  const monthlyGenerationPerKw = SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth; // 135 kWh/month per kW
  const reservedSolarKw = energyNeededKwhPerMonth / monthlyGenerationPerKw;
  const reservedSolarWatts = reservedSolarKw * 1000;
  
  // Step 4: Calculate actual energy produced
  const energyProducedKwh = reservedSolarKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth;
  
  // Step 5: Calculate CO2 offset
  const co2OffsetTonnes = (energyProducedKwh * 12 * SOLAR_CONSTANTS.co2PerKwh) / 1000;
  
  // Step 6: Calculate setup cost with bulk discount
  const setupCost = calculateSetupCost(reservedSolarKw);
  
  // Step 7: Calculate annual savings and ROI
  const annualSavings = monthlySavings * 12;
  const roiYears = annualSavings > 0 ? parseFloat((setupCost / annualSavings).toFixed(1)) : 0;
  const roiSavings = roiYears * annualSavings;

  const calculations = {
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    annualSavings: Math.round(annualSavings * 100) / 100,
    roiYears,
    roiSavings: Math.round(roiSavings * 100) / 100,
    reservedSolarKw: Math.round(reservedSolarKw * 100) / 100,
    reservedSolarWatts: Math.round(reservedSolarWatts),
    energyProducedKwh: Math.round(energyProducedKwh * 100) / 100,
    co2OffsetTonnes: Math.round(co2OffsetTonnes * 100) / 100,
    reservationFee: setupCost,
  };

  return (
    <section className="relative py-10 sm:py-14 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gold/10 border border-gold/20 rounded-full mb-3 sm:mb-4">
            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold" />
            <span className="text-xs sm:text-sm font-semibold text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Calculate Your Savings
            </span>
          </div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-black mb-3 sm:mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            See How Much You Can{" "}
            <span className="text-gold">Save</span>
          </h2>
          <p
            className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Customize your plan and discover your potential savings with our interactive calculator
          </p>
        </motion.div>

        {/* Wide Calculator Card */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto"
        >
          {/* Glow effect */}
          <div className="absolute -inset-1 rounded-2xl sm:rounded-3xl opacity-30 pointer-events-none blur-xl sm:blur-2xl bg-gradient-to-r from-gold/30 via-blue-500/20 to-gold/30" />

          <div className="relative bg-white rounded-2xl sm:rounded-3xl border-2 border-gray-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
            
            {/* Top Project Header Bar */}
            <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border-b border-gray-200 px-4 sm:px-6 md:px-8 py-7 md:py-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                
                <div className="flex items-center gap-2 sm:gap-3">
                  
                  {/* icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    {/* <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" /> */}
                  </div>

                  {/* Solar Plant Name & Capacity (kWh) */}
                  <div className="min-w-0">
                    <p className="text-black font-bold text-[1.8vw] truncate" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {SOLAR_PROJECTS.vedvyas.name}
                    </p>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="text-xs sm:text-[1vw] text-gold font-semibold">{SOLAR_PROJECTS.vedvyas.totalKw} kW Capacity</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-full bg-amber-500/20 text-amber-700 font-medium border border-amber-500/30 text-left sm:text-right py-1.5 px-3 sm:px-4 border border-gray-200 shadow-sm self-start sm:self-auto">
                  <span className="text-sm">
                        Currently Not Operational (Coming Soon)
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content - Horizontal Layout */}
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 p-3 sm:p-4 md:p-6 lg:p-8">
              {/* LEFT: Input Controls */}
              <div className="flex flex-col justify-between space-y-3 sm:space-y-4 md:space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <div>
                    <h2 className="text-xl font-semibold">1 unit of energy generated = ₹7 discount on your power bill</h2>
                  </div>
                  {/* Bill Input */}
                  <div className="mt-10">
                    <label
                      className="text-[11px] sm:text-xs md:text-sm text-gray-600 font-semibold mb-1.5 sm:mb-2 md:mb-3 flex items-center gap-1 sm:gap-1.5 md:gap-2"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <CircleDollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold flex-shrink-0" />
                      <span className="whitespace-nowrap">Monthly Electricity Bill</span>
                    </label>
                    <div className={cn(
                      "relative flex items-center rounded-xl sm:rounded-2xl border-2 transition-all duration-300 overflow-hidden",
                      isBillFocused
                        ? "border-gold bg-gold/5 shadow-[0_0_0_4px_rgba(255,184,0,0.1)]"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    )}>
                      <div className="pl-3 sm:pl-4 md:pl-6 pr-1 py-2.5 sm:py-3 md:py-5 flex items-center flex-shrink-0">
                        <span className="text-gold font-bold text-lg sm:text-xl md:text-2xl">₹</span>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={billInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Allow empty string, numbers, and prevent leading zeros
                          if (value === "" || value === "0") {
                            setBillInput(value);
                            setAvgBill(0);
                          } else if (/^\d+$/.test(value)) {
                            const numValue = parseInt(value, 10);
                            if (numValue >= 0 && numValue <= 100000) {
                              setBillInput(value);
                              setAvgBill(numValue);
                            }
                          }
                        }}
                        onFocus={() => {
                          setIsBillFocused(true);
                          // Select all text on focus for easy replacement
                          if (billInput === "2500" || billInput === "0") {
                            setBillInput("");
                          }
                        }}
                        onBlur={() => {
                          setIsBillFocused(false);
                          // If empty on blur, set to default
                          if (billInput === "" || billInput === "0") {
                            setBillInput("2500");
                            setAvgBill(2500);
                          }
                        }}
                        placeholder="2500"
                        className="flex-1 bg-transparent text-black font-bold text-xl sm:text-2xl md:text-3xl py-2.5 sm:py-3 md:py-4 outline-none min-w-0 w-full
                                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                      <div className="pr-2 sm:pr-3 md:pr-6 text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium flex-shrink-0 whitespace-nowrap">/month</div>
                    </div>
                  </div>
                </motion.div>
                
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {/* Savings Slider */}
                  <div className="flex flex-col">
                    <div className="flex flex-col">

                      <div className="flex justify-start items-center  gap-2">
                        <label
                          className="text-[11px] sm:text-xs md:text-lg text-gray-600 font-semibold flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          
                          <span className="whitespace-nowrap">Choose Savings Range</span>
                          <span className="text-black font-bold text-sm sm:text-base md:text-lg whitespace-nowrap" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            (%)
                          </span>
                        </label>
                      </div>
                      <div className="relative">
                        {/* Track background */}
                        <div className="absolute top-1/2 left-0 right-0 h-2 sm:h-2.5 md:h-3 -translate-y-1/2 bg-gray-300 rounded-full overflow-visible z-[5]">
                          {/* Filled portion */}
                          <motion.div
                            className="h-full bg-gold rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((savingsPercent - 10) / 90) * 100}%` }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </div>

                        {/* Range input */}
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={savingsPercent}
                          onChange={(e) => setSavingsPercent(Number(e.target.value))}
                          className="absolute top-8 w-full bg-transparent rounded-full appearance-none cursor-pointer z-[15]
                                    [&::-webkit-slider-runnable-track]:h-3
                                    [&::-webkit-slider-runnable-track]:bg-transparent
                                    [&::-webkit-slider-runnable-track]:rounded-full
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                                    [&::-webkit-slider-thumb]:sm:w-6 [&::-webkit-slider-thumb]:sm:h-6
                                    [&::-webkit-slider-thumb]:rounded-full
                                    [&::-webkit-slider-thumb]:bg-gold
                                    [&::-webkit-slider-thumb]:border-[3px]
                                    [&::-webkit-slider-thumb]:border-gold
                                    [&::-webkit-slider-thumb]:shadow-md
                                    [&::-webkit-slider-thumb]:cursor-pointer
                                    [&::-webkit-slider-thumb]:transition-transform
                                    [&::-webkit-slider-thumb]:duration-200
                                    [&::-webkit-slider-thumb]:hover:scale-110
                                    [&::-moz-range-track]:h-3
                                    [&::-moz-range-track]:bg-transparent
                                    [&::-moz-range-track]:border-none
                                    [&::-moz-range-track]:rounded-full
                                    [&::-moz-range-thumb]:appearance-none
                                    [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                                    [&::-moz-range-thumb]:rounded-full
                                    [&::-moz-range-thumb]:bg-gold
                                    [&::-moz-range-thumb]:border-[3px]
                                    [&::-moz-range-thumb]:border-gold
                                    [&::-moz-range-thumb]:cursor-pointer
                                    [&::-moz-range-thumb]:shadow-md"
                          style={{
                            background: 'transparent',
                            height: '12px',
                            margin: 0,
                            padding: 0,
                          }}
                        />

                        {/* Percentage label below */}
                        <div className="flex justify-center mt-6">
                          <span className="text-sm sm:text-base md:text-lg font-bold text-gold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {savingsPercent}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Digital Solar Features - hidden on small screens, shown on lg+ in left column */}
                <div className="hidden lg:flex flex-row gap-2 sm:gap-3 md:gap-4 mt-2">
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-amber-50 border border-amber-200 flex-1">
                    <CircleDollarSign className="w-5 h-5 text-gold flex-shrink-0" />
                    <div>
                      <p className="text-black font-semibold text-xs sm:text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>Lower Bills</p>
                      <p className="text-gray-500 text-[9px] sm:text-[10px]">Save up to 100% on electricity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-green-50 border border-green-200 flex-1">
                    <Leaf className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-black font-semibold text-xs sm:text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>Eco-Friendly</p>
                      <p className="text-gray-500 text-[9px] sm:text-[10px]">100% clean & sustainable energy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-blue-50 border border-blue-200 flex-1">
                    <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-black font-semibold text-xs sm:text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>Real-time Monitoring</p>
                      <p className="text-gray-500 text-[9px] sm:text-[10px]">Track your generation live</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Results & CTA */}
              <div className="flex flex-col justify-between space-y-3 sm:space-y-4 md:space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-2 sm:space-y-3 md:space-y-4"
                >
                  {/* Your Monthly Savings */}
                  <div className="p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-gold/10 via-amber-50/50 to-gold/5 border-2 border-gold/30 shadow-lg">
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 mb-1.5 sm:mb-2 md:mb-3">
                      <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gold flex-shrink-0" />
                      <span className="text-gray-700 text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Your monthly savings
                      </span>
                    </div>
                    <motion.span
                      key={calculations.monthlySavings}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className="block text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {formatCurrency(calculations.monthlySavings)}
                    </motion.span>
                  </div>

                  {/* Reserved Solar | Energy Produced */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
                    <div className="p-2 sm:p-3 md:p-4 rounded-md sm:rounded-lg md:rounded-xl bg-white border border-gray-200 shadow-sm">
                      <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs font-medium mb-0.5 uppercase tracking-wide">Reserved Solar</p>
                      <p className="text-black font-bold text-sm sm:text-lg md:text-xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {calculations.reservedSolarWatts} W
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 md:p-4 rounded-md sm:rounded-lg md:rounded-xl bg-white border border-gray-200 shadow-sm">
                      <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs font-medium mb-0.5 uppercase tracking-wide">Energy Produced /Mo</p>
                      <p className="text-black font-bold text-sm sm:text-lg md:text-xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {calculations.energyProducedKwh.toFixed(2)} kWh
                      </p>
                    </div>
                  </div>

                  {/* Annual Savings | ROI Years Savings */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3">
                    <div className="p-2 sm:p-3 md:p-4 rounded-md sm:rounded-lg md:rounded-xl bg-white border border-gray-200 shadow-sm">
                      <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs font-medium mb-0.5 uppercase tracking-wide">Annual Savings</p>
                      <p className="text-black font-bold text-sm sm:text-lg md:text-xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {formatCurrency(calculations.annualSavings)}
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 md:p-4 rounded-md sm:rounded-lg md:rounded-xl bg-white border border-gray-200 shadow-sm">
                      <p className="text-gray-500 text-[9px] sm:text-[10px] md:text-xs font-medium mb-0.5 uppercase tracking-wide">15 Years Savings</p>
                      <p className="text-black font-bold text-sm sm:text-lg md:text-xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {formatCurrency(calculations.roiSavings)}
                      </p>
                    </div>
                  </div>

                  {/* One-time Reservation Fee */}
                  <div className="w-full p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-r from-gold/10 to-amber-50 border-2 border-gold/30 shadow-sm flex flex-col items-center justify-between">
                    <div className="w-full flex items-center justify-between">
                        <p className="text-black font-bold text-sm sm:text-base md:text-[1.5vw]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          One-time Reservation Fee
                        </p>
                        <p className="text-gold font-bold text-lg sm:text-xl md:text-[1.8vw]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {formatCurrency(calculations.reservationFee)}
                        </p>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="w-full mt-8"
                    >
                      <Link href={`/reserve?capacity=${calculations.reservedSolarKw}&project=vedvyas`} className="block">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-2.5 sm:py-3.5 md:py-4 lg:py-3 bg-gradient-to-r from-gold to-amber-500 text-black font-bold text-sm sm:text-base md:text-lg md:rounded-full
                                      shadow-[0_10px_30px_-5px_rgba(255,184,0,0.4)] hover:shadow-[0_15px_40px_-5px_rgba(255,184,0,0.5)]
                                      flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3 group transition-all duration-300"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          <span className="whitespace-nowrap">Get Started</span>
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                        </motion.button>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Digital Solar Features - shown on small screens only, after results */}
            <div className="flex lg:hidden flex-col sm:flex-row gap-2 sm:gap-3 p-3 sm:p-4 pt-3">
              <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-amber-50 border border-amber-200 flex-1">
                <CircleDollarSign className="w-5 h-5 text-gold flex-shrink-0" />
                <div>
                  <p className="text-black font-semibold text-xs sm:text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>Lower Bills</p>
                  <p className="text-gray-500 text-[9px] sm:text-[10px]">Save up to 100% on electricity</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-green-50 border border-green-200 flex-1">
                <Leaf className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-black font-semibold text-xs sm:text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>Eco-Friendly</p>
                  <p className="text-gray-500 text-[9px] sm:text-[10px]">100% clean & sustainable energy</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-lg bg-blue-50 border border-blue-200 flex-1">
                <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-black font-semibold text-xs sm:text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>Real-time Monitoring</p>
                  <p className="text-gray-500 text-[9px] sm:text-[10px]">Track your generation live</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>  
    </section>
  );
}
