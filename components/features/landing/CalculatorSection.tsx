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
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export function CalculatorSection() {
  const [avgBill, setAvgBill] = useState(2500);
  const [savingsPercent, setSavingsPercent] = useState(75);
  const [isBillFocused, setIsBillFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculations
  const calculations = {
    monthlySavings: (avgBill * savingsPercent) / 100,
    annualSavings: ((avgBill * savingsPercent) / 100) * 12,
    reservedSolarWatts: ((avgBill * savingsPercent) / 100 / SOLAR_CONSTANTS.creditRatePerUnit) * 1000,
    get reservedSolarKw() { return this.reservedSolarWatts / 1000; },
    get energyProducedKwh() { return this.reservedSolarKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth; },
    get co2OffsetTonnes() { return this.energyProducedKwh * 12 * SOLAR_CONSTANTS.co2PerKwh / 1000; },
    get reservationFee() { return this.reservedSolarWatts * SOLAR_CONSTANTS.reservationFeePerWatt; },
    get roiYears() { return this.reservationFee && this.annualSavings > 0 ? (this.reservationFee / this.annualSavings).toFixed(1) : '0'; },
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
                        type="number"
                        value={avgBill}
                        onChange={(e) => setAvgBill(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))}
                        onFocus={() => setIsBillFocused(true)}
                        onBlur={() => setIsBillFocused(false)}
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
                          onClick={() => setAvgBill(preset)}
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
                    <div className="relative pt-2 pb-3">
                      {/* Track background with gradient */}
                      <div className="absolute top-2 left-0 right-0 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-gold rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${((savingsPercent - 10) / 90) * 100}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={savingsPercent}
                        onChange={(e) => setSavingsPercent(Number(e.target.value))}
                        className="relative w-full h-3 bg-transparent rounded-full appearance-none cursor-pointer z-10
                                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                                   [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-gray-400/50
                                   [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-3
                                   [&::-webkit-slider-thumb]:border-gold [&::-webkit-slider-thumb]:transition-transform
                                   [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:active:scale-110"
                      />
                      {/* Tick marks */}
                      <div className="flex justify-between mt-2 px-1">
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
                    No installation required • Start saving in 60 seconds
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
