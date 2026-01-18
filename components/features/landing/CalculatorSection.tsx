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
import { SOLAR_CONSTANTS, calculateSetupCost } from "@/lib/solar-constants";

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
  const roiYears = annualSavings > 0 ? (setupCost / annualSavings).toFixed(1) : '0';
  
  const calculations = {
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    annualSavings: Math.round(annualSavings * 100) / 100,
    reservedSolarKw: Math.round(reservedSolarKw * 100) / 100,
    reservedSolarWatts: Math.round(reservedSolarWatts),
    energyProducedKwh: Math.round(energyProducedKwh * 100) / 100,
    co2OffsetTonnes: Math.round(co2OffsetTonnes * 100) / 100,
    reservationFee: setupCost,
    setupCost: setupCost,
    roiYears: roiYears,
  };

  return (
    <section className="relative py-14 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-4">
            <Calculator className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Calculate Your Savings
            </span>
          </div>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-black mb-4" 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            See How Much You Can{" "}
            <span className="text-gold">Save</span>
          </h2>
          <p 
            className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto" 
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
          <div className="absolute -inset-1 rounded-3xl opacity-30 pointer-events-none blur-2xl bg-gradient-to-r from-gold/30 via-blue-500/20 to-gold/30" />

          <div className="relative bg-white rounded-3xl border-2 border-gray-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
            {/* Top Project Header Bar */}
            <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border-b border-gray-200 px-6 md:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <Sun className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <p className="text-black font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Vedvyas Solar Park
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gold font-semibold">100 kW Capacity</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-700 font-medium border border-green-500/30">
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right bg-white rounded-xl px-4 py-2.5 border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Credit Rate
                  </p>
                  <p className="text-gold font-bold text-xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    ₹7<span className="text-sm text-gray-500">/unit</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content - Horizontal Layout */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-10 p-6 md:p-8">
              {/* LEFT: Input Controls */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {/* Bill Input */}
                  <div>
                    <label 
                      className="text-sm text-gray-600 font-semibold mb-3 flex items-center gap-2" 
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <CircleDollarSign className="w-5 h-5 text-gold" />
                      Monthly Electricity Bill
                    </label>
                    <div className={cn(
                      "relative flex items-center rounded-2xl border-2 transition-all duration-300",
                      isBillFocused
                        ? "border-gold bg-gold/5 shadow-[0_0_0_4px_rgba(255,184,0,0.1)]"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    )}>
                      <div className="pl-6 pr-2 py-5 flex items-center">
                        <span className="text-gold font-bold text-2xl">₹</span>
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
                        className="flex-1 bg-transparent text-black font-bold text-3xl py-4 outline-none 
                                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      />
                      <div className="pr-6 text-gray-400 text-sm font-medium">/month</div>
                    </div>

                    {/* Quick presets */}
                    <div className="flex gap-2 mt-3">
                      {[1000, 2500, 5000, 10000].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => {
                            setAvgBill(preset);
                            setBillInput(preset.toString());
                          }}
                          className={cn(
                            "flex-1 py-2.5 px-3 text-sm font-semibold rounded-xl transition-all",
                            avgBill === preset
                              ? "bg-gold text-black shadow-md scale-105"
                              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                          )}
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          ₹{(preset / 1000)}k
                        </button>
                      ))}
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
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label 
                        className="text-sm text-gray-600 font-semibold flex items-center gap-2" 
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <TrendingUp className="w-5 h-5 text-gold" />
                        Target Savings
                      </label>
                      <div className="flex items-center gap-2 bg-gold/10 rounded-full px-4 py-2 border border-gold/20">
                        <Sparkles className="w-4 h-4 text-gold" />
                        <span className="text-black font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {savingsPercent}%
                        </span>
                      </div>
                    </div>
                    <div className="relative py-6">
                      {/* Track background with gradient - Behind the thumb */}
                      <div className="absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 bg-gray-200 rounded-full overflow-visible z-[5]">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-gold rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${((savingsPercent - 10) / 90) * 100}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      {/* Range input - Thumb on top */}
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={savingsPercent}
                        onChange={(e) => setSavingsPercent(Number(e.target.value))}
                        className="relative w-full bg-transparent rounded-full appearance-none cursor-pointer z-[15] slider-thumb-centered
                                   [&::-webkit-slider-runnable-track]:h-3
                                   [&::-webkit-slider-runnable-track]:bg-transparent
                                   [&::-webkit-slider-runnable-track]:rounded-full
                                   [&::-webkit-slider-thumb]:appearance-none 
                                   [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-10
                                   [&::-webkit-slider-thumb]:rounded-md 
                                   [&::-webkit-slider-thumb]:bg-white
                                   [&::-webkit-slider-thumb]:shadow-xl 
                                   [&::-webkit-slider-thumb]:shadow-gold/40
                                   [&::-webkit-slider-thumb]:border-[3px] 
                                   [&::-webkit-slider-thumb]:border-gold
                                   [&::-webkit-slider-thumb]:cursor-pointer 
                                   [&::-webkit-slider-thumb]:transition-all
                                   [&::-webkit-slider-thumb]:duration-200
                                   [&::-webkit-slider-thumb]:hover:scale-110
                                   [&::-webkit-slider-thumb]:hover:shadow-2xl
                                   [&::-webkit-slider-thumb]:hover:shadow-gold/60
                                   [&::-webkit-slider-thumb]:active:scale-105
                                   [&::-moz-range-track]:h-3
                                   [&::-moz-range-track]:bg-transparent
                                   [&::-moz-range-track]:border-none
                                   [&::-moz-range-track]:rounded-full
                                   [&::-moz-range-thumb]:appearance-none
                                   [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-10
                                   [&::-moz-range-thumb]:rounded-md
                                   [&::-moz-range-thumb]:bg-white
                                   [&::-moz-range-thumb]:border-[3px]
                                   [&::-moz-range-thumb]:border-gold
                                   [&::-moz-range-thumb]:cursor-pointer
                                   [&::-moz-range-thumb]:shadow-xl
                                   [&::-moz-range-thumb]:shadow-gold/40
                                   [&::-moz-range-thumb]:transition-all
                                   [&::-moz-range-thumb]:duration-200
                                   [&::-moz-range-thumb]:hover:scale-110
                                   [&::-moz-range-thumb]:hover:shadow-2xl
                                   [&::-moz-range-thumb]:hover:shadow-gold/60
                                   [&::-ms-track]:h-3
                                   [&::-ms-track]:bg-transparent
                                   [&::-ms-track]:border-none
                                   [&::-ms-track]:rounded-full
                                   [&::-ms-thumb]:appearance-none
                                   [&::-ms-thumb]:w-4 [&::-ms-thumb]:h-10
                                   [&::-ms-thumb]:rounded-md
                                   [&::-ms-thumb]:bg-white
                                   [&::-ms-thumb]:border-[3px]
                                   [&::-ms-thumb]:border-gold
                                   [&::-ms-thumb]:cursor-pointer
                                   [&::-ms-thumb]:shadow-xl
                                   [&::-ms-thumb]:shadow-gold/40"
                        style={{
                          background: 'transparent',
                          height: '40px',
                          margin: 0,
                          padding: 0,
                        }}
                      />
                      {/* Tick marks */}
                      <div className="flex justify-between mt-5 px-1">
                        {[10, 25, 50, 75, 100].map((tick) => (
                          <span
                            key={tick}
                            className={cn(
                              "text-xs font-medium transition-colors",
                              savingsPercent >= tick ? "text-black" : "text-gray-400"
                            )}
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            {tick}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Stats Grid - Compact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="grid grid-cols-3 gap-3"
                >
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-center">
                    <Sun className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                    <p className="text-black font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {(calculations.reservedSolarWatts / 1000).toFixed(1)}kW
                    </p>
                    <p className="text-gray-600 text-xs font-medium">Solar</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 text-center">
                    <Bolt className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                    <p className="text-black font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {calculations.energyProducedKwh.toFixed(0)}
                    </p>
                    <p className="text-gray-600 text-xs font-medium">kWh/mo</p>
                  </div>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 text-center">
                    <Leaf className="w-5 h-5 text-green-600 mx-auto mb-2" />
                    <p className="text-black font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {calculations.co2OffsetTonnes.toFixed(1)}T
                    </p>
                    <p className="text-gray-600 text-xs font-medium">CO₂/yr</p>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT: Results & CTA */}
              <div className="flex flex-col justify-between space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="space-y-4"
                >
                  {/* Main Savings Display */}
                  <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gold/10 via-amber-50/50 to-gold/5 border-2 border-gold/30 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-6 h-6 text-gold" />
                      <span className="text-gray-700 text-sm font-semibold uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Monthly Savings
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3 mb-2">
                      <motion.span
                        key={calculations.monthlySavings}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {formatCurrency(calculations.monthlySavings)}
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <p className="text-lg font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {formatCurrency(calculations.annualSavings)}/year
                      </p>
                    </div>
                  </div>

                  {/* Investment Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
                      <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">One-time Fee</p>
                      <p className="text-black font-bold text-2xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {formatCurrency(calculations.reservationFee)}
                      </p>
                    </div>
                    <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
                      <p className="text-gray-500 text-xs font-medium mb-1 uppercase tracking-wide">Payback Period</p>
                      <p className="text-black font-bold text-2xl" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {calculations.roiYears} years
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Link href={`/reserve?capacity=${calculations.reservedSolarKw}&project=vedvyas`} className="block">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-5 px-6 bg-gradient-to-r from-gold to-amber-500 text-black font-bold text-lg rounded-2xl
                                 shadow-[0_10px_30px_-5px_rgba(255,184,0,0.4)] hover:shadow-[0_15px_40px_-5px_rgba(255,184,0,0.5)] 
                                 flex items-center justify-center gap-3 group transition-all duration-300"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Get Started Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <p className="text-center text-gray-500 text-xs mt-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    No installation required • Start saving in 5 mins
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
