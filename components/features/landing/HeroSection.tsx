"use client";

import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo, memo, useCallback } from "react";
import Link from "next/link";
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
import { SOLAR_CONSTANTS, calculateSetupCost } from "@/lib/solar-constants";
import React from "react";

// Stats data
const heroStats = [
  // { icon: Users, value: "1,247+", label: "Families Saving", color: "text-gold" },
  // { icon: TrendingUp, value: "₹1.8Cr", label: "Saved This Month", color: "text-black" },
  { icon: Leaf, value: "Environment", label: "Friendly", color: "text-emerald-600" },
  { icon: Shield, value: "75%", label: "Savings", color: "text-gold" },
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
function PulseRing({ className, color = "#FFB800" }: { className?: string; color?: string }) {
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
    background: "linear-gradient(90deg, #FFB800, #FFA500, #00BCD4, #FFB800)",
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
      <div className="relative bg-white rounded-2xl">
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
        backgroundImage: "linear-gradient(90deg, #FFB800 0%, #FFDB4D 50%, #FFB800 100%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "#FFB800", // Fallback color
      }}
      animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
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
    <ul className="space-y-4">
      {items.map((item, i) => (
        <motion.li
          key={item}
          className="flex items-center gap-3 text-black text-base md:text-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + i * 0.15, duration: 0.4 }}
          style={{ fontFamily: "'Open Sans', sans-serif" }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + i * 0.15 + 0.2, type: "spring" }}
          >
            <CheckCircle2 className="w-6 h-6 text-black" />
          </motion.div>
          <span className="font-medium">{item}</span>
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
    background: "radial-gradient(circle, rgba(255,184,0,0.08) 0%, transparent 60%)",
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
    if (typeof window === "undefined") return;
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

  const cardRef = useRef<HTMLDivElement>(null);

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

    // Solar capacity needed (in kW)
    // 1kW generates 4.5 units per day = 135 units per month
    const monthlyGenerationPerKw = SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth; // 135 kWh/month per kW
    const capacityNeededKw = energyNeededKwh / monthlyGenerationPerKw;
    const capacityNeededWatts = Math.round(capacityNeededKw * 1000);

    // Annual and lifetime savings
    const annualSavings = monthlySavings * 12;
    const lifetimeSavings = annualSavings * SOLAR_CONSTANTS.projectLifespan;

    // One-time setup cost with bulk discount (₹35,000 per kW base, with discounts for larger capacity)
    const reservationFee = calculateSetupCost(capacityNeededKw);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
      className="relative max-w-sm mx-auto"
    >
      {/* Subtle glow */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-40 pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,184,0,0.3) 0%, rgba(76,175,80,0.3) 100%)",
          filter: "blur(20px)",
        }}
      />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX * 0.3}deg) rotateY(${rotateY * 0.3}deg)`,
        }}
        className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-5 overflow-hidden transition-transform duration-150"
      >
        {/* Card shine effect */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + rotateY * 3}% ${50 - rotateX * 3}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
        />

        {/* Project Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Sun className="w-5 h-5 text-black" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-white rounded-full border-2 border-gray-200-dark" />
            </div>
            <div>
              <p className="text-black font-bold text-sm">Vedvyas</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gold font-medium">100 kW</span>
                <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/20 text-black font-medium">LIVE</span>
              </div>
            </div>
          </div>
          <div className="text-right bg-white/5 rounded-lg px-2.5 py-1.5">
            <p className="text-[8px] text-black/40 uppercase tracking-wide">Credit Rate</p>
            <p className="text-gold font-bold text-sm">₹7<span className="text-[9px] text-black/40">/unit</span></p>
          </div>
        </div>

        {/* Enhanced Inputs */}
        <div className="space-y-4 mb-4">
          {/* Bill Input - Enhanced */}
          <div>
            <label className="text-[10px] text-black/60 font-medium mb-1.5 flex items-center gap-1.5">
              <CircleDollarSign className="w-3 h-3" />
              Monthly Electricity Bill
            </label>
            <div className={cn(
              "relative flex items-center rounded-xl border-2 transition-all duration-200 overflow-hidden",
              isBillFocused
                ? "border-gold/60 bg-gradient-to-r from-gold/10 to-transparent shadow-lg shadow-gold/10"
                : "border-white/15 bg-white/5 hover:border-white/25"
            )}>
              <div className="pl-3.5 pr-1 py-3 flex items-center">
                <span className="text-gold font-bold text-lg">₹</span>
              </div>
              <input
                type="number"
                value={avgBill}
                onChange={(e) => setAvgBill(Math.max(0, Math.min(100000, Number(e.target.value) || 0)))}
                onFocus={() => setIsBillFocused(true)}
                onBlur={() => setIsBillFocused(false)}
                placeholder="2500"
                className="flex-1 bg-transparent text-black font-bold text-xl py-2.5 outline-none 
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="pr-3 text-black/30 text-[10px]">/month</div>
            </div>
            {/* Quick presets */}
            <div className="flex gap-1.5 mt-2">
              {[1000, 2500, 5000, 10000].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAvgBill(preset)}
                  className={cn(
                    "flex-1 py-1 px-2 text-[10px] font-medium rounded-md transition-all",
                    avgBill === preset
                      ? "bg-gold/20 text-gold border border-gold/30"
                      : "bg-white/5 text-black/50 hover:bg-white/10 hover:text-black/70"
                  )}
                >
                  ₹{(preset / 1000).toFixed(preset >= 1000 ? 0 : 1)}k
                </button>
              ))}
            </div>
          </div>

          {/* Savings Slider - Enhanced */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] text-black/60 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" />
                Target Savings
              </label>
              <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1">
                <span className="text-black font-bold text-sm">{savingsPercent}%</span>
              </div>
            </div>
            <div className="relative pt-1 pb-2">
              {/* Track background with gradient */}
              <div className="absolute top-1 left-0 right-0 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white via-energy-blue to-gold rounded-full transition-all duration-150"
                  style={{ width: `${((savingsPercent - 10) / 90) * 100}%` }}
                />
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={savingsPercent}
                onChange={(e) => setSavingsPercent(Number(e.target.value))}
                className="relative w-full h-2 bg-transparent rounded-full appearance-none cursor-pointer z-10
                           [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                           [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                           [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-gray-200/40
                           [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2
                           [&::-webkit-slider-thumb]:border-gray-200 [&::-webkit-slider-thumb]:transition-transform
                           [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95"
              />
              {/* Tick marks */}
              <div className="flex justify-between mt-1 px-0.5">
                {[10, 25, 50, 75, 100].map((tick) => (
                  <span
                    key={tick}
                    className={cn(
                      "text-[8px] transition-colors",
                      savingsPercent >= tick ? "text-black" : "text-black/30"
                    )}
                  >
                    {tick}%
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Savings - Prominent */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-gray-100/60 to-white/40 border border-gold/20 mb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-3.5 h-3.5 text-gold" />
            <span className="text-black/60 text-[10px]">Monthly Savings</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-heading font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              {formatCurrency(calculations.monthlySavings)}
            </span>
          </div>
          <p className="text-black text-[10px] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {formatCurrency(calculations.annualSavings)}/year
          </p>
        </div>

        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="p-2 rounded-lg bg-white/5 text-center">
            <Sun className="w-3 h-3 text-gold mx-auto mb-0.5" />
            <p className="text-black font-bold text-xs">{(calculations.reservedSolarWatts / 1000).toFixed(1)}kW</p>
            <p className="text-black/40 text-[9px]">Solar</p>
          </div>
          <div className="p-2 rounded-lg bg-white/5 text-center">
            <Bolt className="w-3 h-3 text-energy-blue mx-auto mb-0.5" />
            <p className="text-black font-bold text-xs">{calculations.energyProducedKwh.toFixed(0)}</p>
            <p className="text-black/40 text-[9px]">kWh/mo</p>
          </div>
          <div className="p-2 rounded-lg bg-white/5 text-center">
            <Leaf className="w-3 h-3 text-black mx-auto mb-0.5" />
            <p className="text-black font-bold text-xs">{calculations.co2OffsetTonnes.toFixed(1)}T</p>
            <p className="text-black/40 text-[9px]">CO₂/yr</p>
          </div>
        </div>

        {/* Reservation Fee & CTA - Compact */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-gray-100/60 to-white/40 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-black/50 text-[9px]">One-time Fee</p>
              <p className="text-black font-bold text-sm">{formatCurrency(calculations.reservationFee)}</p>
            </div>
            <div className="text-right">
              <p className="text-black/50 text-[9px]">Payback</p>
              <p className="text-black font-bold text-sm">{calculations.roiYears}y</p>
            </div>
          </div>
          <Link href={`/reserve?capacity=${calculations.reservedSolarKw}&project=vedvyas`} className="block">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-white to-white/90 text-black font-bold text-sm rounded-lg
                         shadow-md shadow-gray-200/20 flex items-center justify-center gap-1.5 group"
            >
              Get Started Free
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 backdrop-blur-md border border-gray-200 rounded-full hover:bg-gray-200 hover:border-gray-300 transition-all cursor-default">
        <Icon className={cn("w-4 h-4", color)} />
        <span className="font-semibold text-black text-sm">{value}</span>
        <span className="text-black text-sm hidden sm:inline">{label}</span>
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
      className="relative min-h-screen bg-white text-black flex items-center justify-center overflow-hidden"
    >
      {/* Mouse spotlight */}
      <MouseSpotlight />

      {/* Ambient glow background (gold / green, no blue) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute bottom-[-25%] left-1/2 -translate-x-1/2 w-[1400px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,184,0,0.32),rgba(34,197,94,0.2),transparent_65%)] blur-3xl opacity-80" />
        <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white via-white to-transparent" />
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-4 lg:px-8 py-12 md:py-16"
      >
        <div className="max-w-7xl mx-auto">
          {/* Centered Content */}
          <div className="text-black max-w-5xl mx-auto text-center flex flex-col items-center">

            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-black mb-6 mt-8 md:mt-12 shadow-sm"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <span className="text-xs font-semibold text-gold">2026</span>
              <span className="text-sm font-semibold">Next-Gen Digital Solar</span>
            </motion.div>

            {/* Main Headline with Enhanced Animations - Single Line */}
            <h1
              className="text-balance text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] font-heading font-bold leading-tight tracking-tight mb-6 overflow-visible whitespace-nowrap flex gap-4 items-center justify-center px-8 py-4 bg-white/90 rounded-3xl shadow-xl"
              style={{ fontFamily: "'Oswald', sans-serif", boxShadow: '0 6px 32px 0 rgba(255,184,0,0.10)' }}
            >
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-black"
              >
                Stop Paying
              </motion.span>
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                <ShimmeringText text="Full Price" className="font-bold" />
              </motion.span>
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-black"
              >
                for Electricity
              </motion.span>
            </h1>

            {/* Dynamic Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-xl md:text-2xl lg:text-[28px] text-black mb-4 max-w-3xl leading-relaxed"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Go Solar in <span className="text-gold font-bold">60 Seconds</span>.
              {" "}
              No Roof Required. No Installation.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-lg md:text-xl text-gray-700 mb-5 max-w-2xl"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              The average family saves{" "}
              <span className="text-gold font-bold text-xl md:text-2xl">
                ₹<NumberTicker value={24000} className="text-gold font-bold" />
              </span>{" "}
              per year with Digital Solar.
            </motion.p>

            {/* Animated Benefits Checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mb-8"
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
              className="flex flex-wrap justify-center gap-3 mb-5"
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
              className="flex flex-col sm:flex-row gap-3 justify-center"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <Link href="/reserve">
                <Button
                  variant="secondary"
                  size="lg"
                  className="relative w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-bold shadow-2xl shadow-gold/30 group overflow-hidden"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {/* Button shine effect */}
                  <span className="relative z-10 flex items-center">
                    Start Saving Today
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>

              <Link href="/#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-gray-300 text-black hover:bg-gray-100 backdrop-blur-sm font-semibold group"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  See How It Works
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator with Pulse Ring (no text) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pb-8"
      >
        <motion.button
          onClick={() => {
            if (typeof document === "undefined") return;
            const element = document.getElementById('stats-section');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative flex flex-col items-center gap-2 text-black hover:text-gold transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <PulseRing className="w-10 h-10 absolute -top-2" color="rgba(255,184,0,0.5)" />
          <ChevronDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}