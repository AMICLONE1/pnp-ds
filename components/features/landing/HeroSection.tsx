"use client";

import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo, memo, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Leaf,
  Shield,
  ChevronDown,
  Zap,
  Sun,
  Bolt,
  CircleDollarSign,
  CheckCircle2,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SOLAR_CONSTANTS } from "@/lib/solar-constants";
import React from "react";

// Dynamically import Enhanced Three.js canvas with 3D solar visualization
// Using EnhancedHero3DScene with solar panels, energy particles, houses, and network nodes
const Hero3DScene = dynamic(() => import("./EnhancedHero3DScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-soft to-primary-deep" />
});

// Stats data
const heroStats = [
  // { icon: Users, value: "1,247+", label: "Families Saving", color: "text-solar" },
  // { icon: TrendingUp, value: "₹1.8Cr", label: "Saved This Month", color: "text-eco" },
  { icon: Leaf, value: "Environment", label: "Friendly", color: "text-eco" },
  { icon: Shield, value: "75%", label: "Savings", color: "text-primary" },
];


// ============================================
// ANIMATED NUMBER TICKER
// ============================================
function NumberTicker({
  value,
  direction = "up",
  className,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const motionValue = useMotionValue(direction === "up" ? 0 : value);
  const spring = useSpring(motionValue, {
    stiffness: 120,
    damping: 25,
    mass: 0.8,
  });

  useEffect(() => {
    if (!isInView) return;
    motionValue.set(direction === "up" ? value : 0);
  }, [isInView, value, direction, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toLocaleString();
      }
    });
    return unsubscribe;
  }, [spring]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}

// ============================================
// MAGNETIC BUTTON
// ============================================
const MagneticButton = memo(function MagneticButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const bounds = useRef<DOMRect | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (ref.current) {
      bounds.current = ref.current.getBoundingClientRect();
    }
  }, []);

  const handleMove = (e: React.PointerEvent) => {
    if (!bounds.current) return;
    const { left, top, width, height } = bounds.current;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    x.set((e.clientX - centerX) * 0.15);
    y.set((e.clientY - centerY) * 0.15);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, willChange: "transform" }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
    >
      {children}
    </motion.div>
  );
});

// ============================================
// PULSE RING ANIMATION
// ============================================
function PulseRing({ className, color = "#2F80ED" }: { className?: string; color?: string }) {
  // Memoize the animation variants to prevent recalculation
  const variants = useMemo(() => ({
    initial: { scale: 1, opacity: 0.5 },
    animate: { scale: 2, opacity: 0 }
  }), []);

  return (
    <div className={`relative ${className || ''}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            border: `2px solid ${color}`,
            willChange: 'transform, opacity' // Hint to browser for optimization
          }}
          variants={variants}
          initial="initial"
          animate="animate"
          transition={{
            duration: 2,
            delay: i * 0.6,
            repeat: Infinity,
            ease: "easeOut",
            repeatType: "loop"
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// OPTIMIZED GRADIENT BORDER
// ============================================
function GradientBorder({ children, className }: { children: React.ReactNode; className?: string }) {
  // Memoize gradient style
  const gradientStyle = useMemo(() => ({
    background: "linear-gradient(90deg, #2F80ED, #27AE60, #F2C94C, #2F80ED)",
    backgroundSize: "300% 100%",
    willChange: 'background-position' // Optimize for background animation
  }), []);

  return (
    <div className={`relative p-[2px] rounded-2xl overflow-hidden ${className || ''}`}>
      <motion.div
        className="absolute inset-0"
        style={gradientStyle}
        animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
      />
      <div className="relative bg-slate-black rounded-2xl">
        {children}
      </div>
    </div>
  );
}

// ============================================
// SHIMMERING TEXT
// ============================================
function ShimmeringText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span
      className={cn("relative inline-block bg-clip-text text-transparent", className)}
      style={{
        backgroundImage: "linear-gradient(90deg, #F2C94C 0%, #FFF 50%, #F2C94C 100%)",
        backgroundSize: "200% 100%",
      }}
      animate={{ backgroundPosition: ["100% 0%", "-100% 0%"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
    >
      {text}
    </motion.span>
  );
}

// ============================================
// ANIMATED CHECK LIST
// ============================================
function AnimatedCheckList({ items, delay = 0 }: { items: string[]; delay?: number }) {
  return (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <motion.li
          key={item}
          className="flex items-center gap-3 text-white/80"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + i * 0.15, duration: 0.4 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + i * 0.15 + 0.2, type: "spring" }}
          >
            <CheckCircle2 className="w-5 h-5 text-eco" />
          </motion.div>
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}




// Mouse follower spotlight
function MouseSpotlight() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Memoize spring config
  const springConfig = useMemo(() => ({
    stiffness: 50,
    damping: 20
  }), []);

  const spotlightX = useSpring(mouseX, springConfig);
  const spotlightY = useSpring(mouseY, springConfig);

  // Memoize spotlight style
  const spotlightStyle = useMemo(() => ({
    background: "radial-gradient(circle, rgba(47,128,237,0.08) 0%, transparent 60%)",
    filter: "blur(40px)",
  }), []);

  // Memoize motion style
  const motionStyle = useMemo(() => ({
    translateX: "-50%",
    translateY: "-50%",
  }), []);

  // Use useCallback to prevent recreating handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    setMounted(true);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-0 hidden lg:block"
      style={{
        x: spotlightX,
        y: spotlightY,
        ...motionStyle,
      }}
    >
      <div
        className="w-[500px] h-[500px] rounded-full"
        style={spotlightStyle}
      />
    </motion.div>
  );
}


// Interactive savings calculator card with SundayGrids-style calculation
function InteractiveSavingsCard() {
  const [avgBill, setAvgBill] = useState(2500);
  const [savingsPercent, setSavingsPercent] = useState(75);
  const [isBillFocused, setIsBillFocused] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [billInputValue, setBillInputValue] = useState("2500");

  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize currency formatter (expensive to create)
  const currencyFormatter = useMemo(() =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }), []
  );

  // Memoized format function
  const formatCurrency = useCallback((value: number) => {
    return currencyFormatter.format(value);
  }, [currencyFormatter]);

  // Calculate all values based on bill and savings percentage
  const calculations = useMemo(() => {
    // Monthly savings target
    const monthlySavings = (avgBill * savingsPercent) / 100;

    // Energy needed to generate these savings (kWh)
    const energyNeededKwh = monthlySavings / SOLAR_CONSTANTS.creditRatePerUnit;

    // Solar capacity needed (in Watts)
    const monthlyGenerationPerKw = SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth;
    const capacityNeededKw = energyNeededKwh / monthlyGenerationPerKw;
    const capacityNeededWatts = Math.round(capacityNeededKw * 1000);

    // Annual and lifetime savings
    const annualSavings = monthlySavings * 12;
    const lifetimeSavings = annualSavings * SOLAR_CONSTANTS.projectLifespan;

    // One-time reservation fee
    const reservationFee = capacityNeededWatts * SOLAR_CONSTANTS.reservationFeePerWatt;

    // CO2 offset per year (in tonnes)
    const annualEnergyKwh = energyNeededKwh * 12;
    const co2OffsetKg = annualEnergyKwh * SOLAR_CONSTANTS.co2PerKwh;
    const co2OffsetTonnes = co2OffsetKg / 1000;

    // Return on Investment (years to recover reservation fee)
    const roiYears = reservationFee / annualSavings;

    return {
      monthlySavings: Math.round(monthlySavings * 100) / 100,
      energyProducedKwh: Math.round(energyNeededKwh * 100) / 100,
      reservedSolarWatts: capacityNeededWatts,
      reservedSolarKw: Math.round(capacityNeededKw * 100) / 100,
      annualSavings: Math.round(annualSavings * 100) / 100,
      lifetimeSavings: Math.round(lifetimeSavings * 100) / 100,
      reservationFee: Math.round(reservationFee * 100) / 100,
      co2OffsetTonnes: Math.round(co2OffsetTonnes * 100) / 100,
      roiYears: Math.round(roiYears * 10) / 10,
    };
  }, [avgBill, savingsPercent]);

  // Memoize mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX((y - centerY) / 25);
    setRotateY((centerX - x) / 25);
  }, []);

  // Memoize mouse leave handler
  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  // Handle bill input change - fix the "0100" issue
  const handleBillChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string for better UX
    if (value === "") {
      setBillInputValue("");
      setAvgBill(0);
      return;
    }
    
    // Remove leading zeros and parse
    const numValue = parseInt(value.replace(/^0+/, "") || "0", 10);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100000) {
      setBillInputValue(numValue.toString());
      setAvgBill(numValue);
    }
  }, []);

  // Handle bill input blur - ensure valid value
  const handleBillBlur = useCallback(() => {
    setIsBillFocused(false);
    if (avgBill === 0 || billInputValue === "") {
      setBillInputValue("2500");
      setAvgBill(2500);
    }
  }, [avgBill, billInputValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-[420px]"
    >
      {/* Premium dark glow effect */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-60 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(242,201,76,0.2) 0%, rgba(39,174,96,0.2) 50%, rgba(47,128,237,0.2) 100%)",
          filter: "blur(20px)",
        }}
      />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX * 0.1}deg) rotateY(${rotateY * 0.1}deg)`,
        }}
        className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 overflow-hidden transition-all duration-300 shadow-2xl"
      >
        {/* Premium dark card shine effect */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${50 + rotateY * 2}% ${50 - rotateX * 2}%, rgba(242,201,76,0.15) 0%, transparent 70%)`,
          }}
        />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-energy-green/10 pointer-events-none" />

        {/* Premium Dark Project Header */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700/50 relative z-10">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold via-gold-light to-amber-500 flex items-center justify-center shadow-lg shadow-gold/40">
                <Sun className="w-4.5 h-4.5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-energy-green rounded-full border-2 border-slate-900 shadow-md" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Vedvyas</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-gold font-semibold">100 kW</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-energy-green/30 text-energy-green font-medium border border-energy-green/40">LIVE</span>
              </div>
            </div>
          </div>
          <div className="text-right bg-slate-800/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-slate-700/50">
            <p className="text-[8px] text-slate-400 uppercase tracking-wider font-medium mb-0.5">Credit Rate</p>
            <p className="text-gold font-bold text-sm">₹7<span className="text-[10px] text-slate-400 font-normal">/unit</span></p>
          </div>
        </div>

        {/* Premium Dark Enhanced Inputs */}
        <div className="space-y-3.5 mb-3.5 relative z-10">
          {/* Bill Input - Dark Premium Design */}
          <div>
            <label className="text-[10px] text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
              <CircleDollarSign className="w-3.5 h-3.5 text-gold" />
              Monthly Electricity Bill
            </label>
            <div className={cn(
              "relative flex items-center rounded-xl border transition-all duration-300 overflow-hidden backdrop-blur-sm",
              isBillFocused
                ? "border-gold/60 bg-gradient-to-r from-gold/20 via-gold/15 to-slate-800/50 shadow-lg shadow-gold/30"
                : "border-slate-700/50 bg-slate-800/50 hover:border-slate-600/50 hover:bg-slate-800/70"
            )}>
              <div className="pl-3 pr-1.5 py-2.5 flex items-center">
                <span className="text-gold font-bold text-lg">₹</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={billInputValue}
                onChange={handleBillChange}
                onFocus={() => {
                  setIsBillFocused(true);
                  if (inputRef.current) {
                    inputRef.current.select();
                  }
                }}
                onBlur={handleBillBlur}
                placeholder="2500"
                className="flex-1 bg-transparent text-white font-bold text-xl py-2 outline-none 
                           placeholder:text-slate-500"
              />
              <div className="pr-3 text-slate-400 text-[10px] font-medium">/month</div>
            </div>
            {/* Dark Quick presets */}
            <div className="flex gap-1.5 mt-2">
              {[1000, 2500, 5000, 10000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setAvgBill(preset);
                    setBillInputValue(preset.toString());
                  }}
                  className={cn(
                    "flex-1 py-1.5 px-2 text-[10px] font-semibold rounded-lg transition-all duration-200",
                    avgBill === preset
                      ? "bg-gold/30 text-gold border border-gold/50 shadow-md shadow-gold/30"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300 border border-slate-700/50 hover:border-slate-600/50"
                  )}
                >
                  ₹{(preset / 1000).toFixed(preset >= 1000 ? 0 : 1)}k
                </button>
              ))}
            </div>
          </div>

          {/* Dark Premium Savings Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] text-slate-300 font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-energy-green" />
                Target Savings
              </label>
              <div className="flex items-center gap-1.5 bg-energy-green/25 backdrop-blur-sm rounded-full px-2.5 py-1 border border-energy-green/40">
                <span className="text-energy-green font-bold text-sm">{savingsPercent}%</span>
              </div>
            </div>
            <div className="relative pt-1.5 pb-3">
              {/* Dark Track background */}
              <div className="absolute top-1.5 left-0 right-0 h-2.5 bg-slate-800/80 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-energy-green via-primary to-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((savingsPercent - 10) / 90) * 100}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              
              {/* Dark Premium Slider */}
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={savingsPercent}
                onChange={(e) => setSavingsPercent(Number(e.target.value))}
                className="relative w-full h-2.5 bg-transparent rounded-full appearance-none cursor-pointer z-10
                           [&::-webkit-slider-thumb]:appearance-none 
                           [&::-webkit-slider-thumb]:w-5 
                           [&::-webkit-slider-thumb]:h-5
                           [&::-webkit-slider-thumb]:rounded-full 
                           [&::-webkit-slider-thumb]:bg-white
                           [&::-webkit-slider-thumb]:shadow-xl 
                           [&::-webkit-slider-thumb]:shadow-energy-green/60
                           [&::-webkit-slider-thumb]:cursor-pointer 
                           [&::-webkit-slider-thumb]:border-2
                           [&::-webkit-slider-thumb]:border-energy-green
                           [&::-webkit-slider-thumb]:transition-all
                           [&::-webkit-slider-thumb]:duration-200
                           [&::-webkit-slider-thumb]:hover:scale-110
                           [&::-webkit-slider-thumb]:hover:shadow-energy-green/80
                           [&::-webkit-slider-thumb]:active:scale-105
                           [&::-moz-range-thumb]:w-5
                           [&::-moz-range-thumb]:h-5
                           [&::-moz-range-thumb]:rounded-full
                           [&::-moz-range-thumb]:bg-white
                           [&::-moz-range-thumb]:border-2
                           [&::-moz-range-thumb]:border-energy-green
                           [&::-moz-range-thumb]:cursor-pointer
                           [&::-moz-range-thumb]:shadow-xl
                           [&::-moz-range-thumb]:shadow-energy-green/60
                           [&::-moz-range-thumb]:transition-all"
              />
              
              {/* Dark Tick marks */}
              <div className="flex justify-between mt-1.5 px-0.5">
                {[10, 25, 50, 75, 100].map((tick) => (
                  <motion.span
                    key={tick}
                    className={cn(
                      "text-[8px] font-medium transition-all duration-200",
                      savingsPercent >= tick ? "text-energy-green" : "text-slate-500"
                    )}
                    animate={{
                      scale: savingsPercent >= tick ? 1.15 : 1,
                    }}
                  >
                    {tick}%
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dark Premium Main Savings Display */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-gold/20 via-gold/15 to-slate-800/50 border border-gold/40 mb-3 backdrop-blur-sm relative z-10 shadow-lg shadow-gold/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gold/30 flex items-center justify-center border border-gold/40">
              <Zap className="w-4 h-4 text-gold" />
            </div>
            <span className="text-slate-200 text-[10px] font-semibold uppercase tracking-wider">Monthly Savings</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className="text-3xl font-heading font-bold text-gold">
              {formatCurrency(calculations.monthlySavings)}
            </span>
          </div>
          <p className="text-energy-green text-xs flex items-center gap-1.5 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            {formatCurrency(calculations.annualSavings)}/year
          </p>
        </div>

        {/* Dark Premium Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3 relative z-10">
          <div className="p-2.5 rounded-lg bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 text-center hover:bg-slate-700/60 hover:border-gold/30 transition-all duration-200">
            <Sun className="w-4 h-4 text-gold mx-auto mb-1" />
            <p className="text-white font-bold text-xs mb-0.5">{(calculations.reservedSolarWatts / 1000).toFixed(1)}kW</p>
            <p className="text-slate-400 text-[9px] font-medium">Solar</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 text-center hover:bg-slate-700/60 hover:border-primary/30 transition-all duration-200">
            <Bolt className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-white font-bold text-xs mb-0.5">{calculations.energyProducedKwh.toFixed(0)}</p>
            <p className="text-slate-400 text-[9px] font-medium">kWh/mo</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 text-center hover:bg-slate-700/60 hover:border-energy-green/30 transition-all duration-200">
            <Leaf className="w-4 h-4 text-energy-green mx-auto mb-1" />
            <p className="text-white font-bold text-xs mb-0.5">{calculations.co2OffsetTonnes.toFixed(1)}T</p>
            <p className="text-slate-400 text-[9px] font-medium">CO₂/yr</p>
          </div>
        </div>

        {/* Dark Premium Reservation Fee & CTA */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/40 backdrop-blur-sm border border-slate-700/50 relative z-10">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-700/50">
            <div>
              <p className="text-slate-400 text-[10px] font-medium mb-0.5">One-time Investment</p>
              <p className="text-white font-bold text-sm">{formatCurrency(calculations.reservationFee)}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-[10px] font-medium mb-0.5">ROI Period</p>
              <p className="text-energy-green font-bold text-sm">{calculations.roiYears.toFixed(1)}y</p>
            </div>
          </div>
          <Link href={`/reserve?capacity=${calculations.reservedSolarKw}&project=vedvyas`} className="block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r from-energy-green via-energy-green to-emerald-500 hover:from-emerald-500 hover:via-energy-green hover:to-energy-green text-white font-bold text-xs rounded-lg
                         shadow-lg shadow-energy-green/40 flex items-center justify-center gap-2 group transition-all duration-300"
            >
              Reserve Your Capacity
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// Stat pill with animation
function StatPill({
  icon: Icon,
  value,
  label,
  color,
  delay
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      whileHover={{ scale: 1.05, y: -3 }}
      className="group"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/15 hover:border-white/30 transition-all cursor-default">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="font-semibold text-white text-sm">{value}</span>
        <span className="text-white/60 text-sm hidden sm:inline">{label}</span>
      </div>
    </motion.div>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotating words for dynamic headline
  const benefitWords = ["cleaner", "cheaper", "smarter", "better"];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-primary via-primary-deep to-slate-black text-white flex items-center justify-center overflow-hidden"
    >
      {/* Mouse spotlight */}
      <MouseSpotlight />

      <motion.div
        className="relative z-10 container mx-auto px-4 lg:px-8 py-24"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-white">

            {/* Main Headline with Enhanced Animations */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-[1.05] tracking-tight mb-6" style={{ fontFamily: "'Oswald', sans-serif" }}>
              <div>
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  Stop Paying
                </motion.div>
              </div>
              <div className="mt-3">
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  <ShimmeringText text="Full Price" className="font-bold" />
                </motion.div>
              </div>
              <div className="mt-1">
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  for Electricity
                </motion.div>
              </div>
            </h1>

            {/* Dynamic Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-300 mb-4 max-w-lg"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Go Solar in <span className="text-solar font-semibold">60 Seconds</span>.
              <br className="hidden md:block" />
              No Roof Required. No Installation.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-base text-gray-400 mb-4 max-w-lg"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              The average family saves{" "}
              <span className="text-solar font-medium">
                ₹<NumberTicker value={24000} className="text-solar font-medium" />
              </span>{" "}
              per year with Digital Solar.
            </motion.p>

            {/* Animated Benefits Checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mb-7"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <AnimatedCheckList
                items={[
                  "No rooftop required",
                  "Zero maintenance costs",
                  "Upto 75% savings"
                ]}
                delay={1.5}
              />
            </motion.div>

            {/* Stats with Gradient Border */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex flex-wrap gap-3 mb-5"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              {heroStats.map((stat, index) => (
                <StatPill
                  key={stat.label}
                  {...stat}
                  delay={1.9 + index * 0.1}
                />
              ))}
            </motion.div>

            {/* CTAs with Magnetic Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <MagneticButton>
                <Link href="/reserve">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="relative w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-solar to-solar-soft hover:from-solar-soft hover:to-solar text-slate-black font-bold shadow-2xl shadow-solar/30 group overflow-hidden"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      {/* Button shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      />
                      <span className="relative z-10 flex items-center">
                        Start Saving Today
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </motion.div>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link href="/#how-it-works">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold group"
                      style={{ fontFamily: "'Open Sans', sans-serif" }}
                    >
                      <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      See How It Works
                    </Button>
                  </motion.div>
                </Link>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right Content - Interactive Card with Gradient Border */}
          <div className="hidden lg:block">
            <GradientBorder className="max-w-sm mx-auto">
              <div className="p-1">
                <InteractiveSavingsCard />
              </div>
            </GradientBorder>
          </div>
        </div>

        {/* Mobile Calculator Card */}
        <div className="lg:hidden mt-8">
          <GradientBorder>
            <div className="p-1">
              <InteractiveSavingsCard />
            </div>
          </GradientBorder>
        </div>
      </motion.div>

      {/* Scroll Indicator with Pulse Ring */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.button
          onClick={() => {
            const element = document.getElementById('stats-section');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <PulseRing className="w-10 h-10 absolute -top-2" color="rgba(47,128,237,0.5)" />
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}