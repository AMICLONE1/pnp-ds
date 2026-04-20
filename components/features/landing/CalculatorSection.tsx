"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Zap,
  Leaf,
  TrendingUp,
  IndianRupee,
  ArrowRight,
  Calculator,
  Info,
} from "lucide-react";
import {
  SOLAR_CONSTANTS,
  calculateSetupCost,
  SOLAR_PROJECTS,
} from "@/lib/solar-constants";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function CalculatorSection() {
  const [avgBill, setAvgBill] = useState(2500);
  const [billInput, setBillInput] = useState("2500");
  const [savingsPercent, setSavingsPercent] = useState(75);
  const [isBillFocused, setIsBillFocused] = useState(false);

  const monthlySavings = (avgBill * savingsPercent) / 100;
  const energyNeededKwhPerMonth =
    monthlySavings / SOLAR_CONSTANTS.creditRatePerUnit;
  const monthlyGenerationPerKw =
    SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth;
  const reservedSolarKw = energyNeededKwhPerMonth / monthlyGenerationPerKw;
  const reservedSolarWatts = reservedSolarKw * 1000;
  const energyProducedKwh =
    reservedSolarKw *
    SOLAR_CONSTANTS.avgGenerationPerKwPerDay *
    SOLAR_CONSTANTS.daysPerMonth;
  const annualSavings = monthlySavings * 12;
  const fifteenYearSavings = annualSavings * 15;
  const setupCost = calculateSetupCost(reservedSolarKw);

  const calc = {
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    annualSavings: Math.round(annualSavings * 100) / 100,
    fifteenYearSavings: Math.round(fifteenYearSavings * 100) / 100,
    reservedSolarKw: Math.round(reservedSolarKw * 100) / 100,
    reservedSolarWatts: Math.round(reservedSolarWatts),
    energyProducedKwh: Math.round(energyProducedKwh * 100) / 100,
    reservationFee: setupCost,
  };

  const sliderPct = ((savingsPercent - 10) / 90) * 100;

  return (
    <section className="relative py-10 sm:py-14 bg-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-4">
            <Calculator className="w-4 h-4 text-gold" />
            <span
              className="text-sm font-semibold text-black"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Calculate Your Savings
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-black mb-3"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            See How Much You Can <span className="text-gold">Save</span>
          </h2>
          <p
            className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Customize your plan and discover your potential savings with our
            interactive calculator
          </p>
        </motion.div>

        {/* Calculator card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="relative bg-white rounded-3xl border border-gray-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
            {/* Plant badge */}
            <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Sun className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p
                      className="text-black font-bold text-lg"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {SOLAR_PROJECTS.vedvyas.name}
                    </p>
                    <p className="text-xs text-gold font-semibold">
                      {SOLAR_PROJECTS.vedvyas.totalKw} kW Capacity
                    </p>
                  </div>
                </div>
                <div className="relative group">
                  <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-help">
                    <Info className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-56 p-3 bg-forest text-white text-xs rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                    <p className="font-medium mb-1">Example plant</p>
                    <p className="text-white/80 leading-relaxed">
                      This is a sample plant used to demonstrate savings calculations. Your actual plant details may vary.
                    </p>
                    <div className="absolute -top-1.5 right-4 w-3 h-3 bg-forest rotate-45" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 p-5 sm:p-6 lg:p-8">
              {/* LEFT: Inputs */}
              <div className="space-y-5">
                <p
                  className="text-base sm:text-lg font-semibold text-black"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  1 unit of energy generated = ₹7 discount on your power bill
                </p>

                {/* Bill input */}
                <div>
                  <label
                    className="text-sm text-gray-600 font-semibold flex items-center gap-2 mb-2"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <IndianRupee className="w-4 h-4 text-gold" />
                    Monthly Electricity Bill
                  </label>
                  <div
                    className={`relative flex items-center rounded-2xl border-2 transition-all overflow-hidden ${
                      isBillFocused
                        ? "border-gold bg-gold/5 shadow-[0_0_0_4px_rgba(255,184,0,0.1)]"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    <div className="pl-5 pr-1 py-3 flex items-center">
                      <span className="text-gold font-bold text-2xl">₹</span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={billInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || value === "0") {
                          setBillInput(value);
                          setAvgBill(0);
                        } else if (/^\d+$/.test(value)) {
                          const num = parseInt(value, 10);
                          if (num >= 0 && num <= 100000) {
                            setBillInput(value);
                            setAvgBill(num);
                          }
                        }
                      }}
                      onFocus={() => {
                        setIsBillFocused(true);
                        if (billInput === "2500" || billInput === "0") setBillInput("");
                      }}
                      onBlur={() => {
                        setIsBillFocused(false);
                        if (billInput === "" || billInput === "0") {
                          setBillInput("2500");
                          setAvgBill(2500);
                        }
                      }}
                      placeholder="2500"
                      className="flex-1 bg-transparent text-black font-bold text-2xl sm:text-3xl py-2.5 outline-none min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1.5 px-1">
                    <span>₹500</span>
                    <span>₹25,000</span>
                  </div>
                </div>

                {/* Slider */}
                <div>
                  <label
                    className="text-sm text-gray-600 font-semibold flex items-center gap-2 mb-2"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Choose Savings Range (%)
                  </label>
                  <div className="relative h-3">
                    <div className="absolute top-0 left-0 right-0 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full"
                        animate={{ width: `${sliderPct}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      />
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={savingsPercent}
                      onChange={(e) => setSavingsPercent(Number(e.target.value))}
                      className="absolute top-0 left-0 right-0 w-full h-3 bg-transparent appearance-none cursor-pointer z-10
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                        [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:cursor-pointer"
                    />
                  </div>
                  <div className="text-center mt-2">
                    <span
                      className="text-lg font-bold text-gold"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {savingsPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT: Results */}
              <div className="space-y-3 flex flex-col justify-between">
                {/* Recommended Capacity + Monthly + Annual */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-gold/10 border border-gold/20 p-4 text-center">
                    <p
                      className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Book Capacity
                    </p>
                    <motion.p
                      key={calc.reservedSolarKw}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl sm:text-3xl font-bold text-gold"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {calc.reservedSolarKw}
                    </motion.p>
                    <p className="text-[10px] text-gray-500 font-medium mt-0.5">kW</p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
                    <p
                      className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Monthly Savings
                    </p>
                    <motion.p
                      key={calc.monthlySavings}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl sm:text-3xl font-bold text-black"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {formatCurrency(calc.monthlySavings)}
                    </motion.p>
                  </div>
                  <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-center">
                    <p
                      className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Annual Savings
                    </p>
                    <motion.p
                      key={calc.annualSavings}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-2xl sm:text-3xl font-bold text-black"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {formatCurrency(calc.annualSavings)}
                    </motion.p>
                  </div>
                </div>

                {/* 15 year banner */}
                <motion.div
                  key={calc.fifteenYearSavings}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="rounded-2xl bg-gradient-to-r from-forest to-forest-light p-5 text-center"
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold mb-1"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    15 Years Savings
                  </p>
                  <p
                    className="text-3xl sm:text-4xl font-bold text-white"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {formatCurrency(calc.fifteenYearSavings)}
                  </p>
                </motion.div>

                {/* Reservation fee + CTA */}
                <div className="text-center space-y-3">
                  <div>
                    <p
                      className="text-xs text-gray-500 uppercase tracking-wider font-medium"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Reservation Fee
                    </p>
                    <p
                      className="text-2xl font-bold text-black mt-0.5"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {formatCurrency(calc.reservationFee)}
                    </p>
                  </div>

                  <Link
                    href={`/reserve?capacity=${calc.reservedSolarKw}&project=vedvyas`}
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 bg-gradient-to-r from-forest to-forest-light text-white font-bold text-base rounded-full shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group transition-all"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature strip */}
            <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
              <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-gold" />
                  <span
                    className="text-xs font-medium text-gray-600"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Lower Bills — Save up to 100%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  <span
                    className="text-xs font-medium text-gray-600"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    100% Clean Energy
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span
                    className="text-xs font-medium text-gray-600"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Real-time Monitoring
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div
                className="mt-6 rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs leading-relaxed text-gray-600"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <span className="font-semibold text-gray-800">Disclaimer:</span>{" "}
                Savings shown above are estimates based on current DISCOM tariff rates and average solar generation data. Actual savings may vary depending on weather conditions, DISCOM tariff changes, seasonal variations, and your actual electricity consumption. These projections are illustrative and do not constitute a financial guarantee. Past performance of solar generation is not indicative of future results. Please review our Terms of Service for complete details.
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
