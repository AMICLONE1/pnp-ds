"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Ban,
  Check,
  Zap,
  Leaf,
  Clock,
  Shield,
  AlertTriangle,
  Sparkles,
  X,
  ChevronRight
} from "lucide-react";

interface ProblemSolutionProps {
  className?: string;
}

export function ProblemSolution({ className = "" }: ProblemSolutionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeComparison, setActiveComparison] = useState<"old" | "new">("new");

  const oldWayIssues = [
    { icon: TrendingUp, text: "Bills rising 8-12% yearly", color: "text-red-400" },
    { icon: Ban, text: "No control over rates", color: "text-red-400" },
    { icon: AlertTriangle, text: "100% coal-powered", color: "text-red-400" },
    { icon: Clock, text: "Locked to single provider", color: "text-red-400" },
  ];

  const newWayBenefits = [
    { icon: Shield, text: "Locked-in rates for years", color: "text-black" },
    { icon: Zap, text: "Full transparency & control", color: "text-black" },
    { icon: Leaf, text: "100% renewable energy", color: "text-black" },
    { icon: Sparkles, text: "Portable - moves with you", color: "text-black" },
  ];

  return (
    <section
      ref={containerRef}
      className={`py-24 relative overflow-hidden ${className}`}
      aria-labelledby="problem-solution-heading"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-100 to-white" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white0/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-gradient-to-r from-red-500/20 to-gray-500/20 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Why Switch?
          </span>
          <h2
            id="problem-solution-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-black mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            The <span className="text-red-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>Old Way</span> vs The <span className="text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>New Way</span>
          </h2>
          <p className="text-xl text-black/80 max-w-2xl mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            See why 1,247 families made the switch this month
          </p>
        </motion.div>

        {/* Toggle Buttons - Mobile */}
        <div className="flex justify-center mb-8 md:hidden">
          <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-full p-1">
            <button
              onClick={() => setActiveComparison("old")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeComparison === "old"
                ? "bg-red-500 text-black shadow-lg"
                : "text-black/70 hover:text-black"
                }`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Old Way
            </button>
            <button
              onClick={() => setActiveComparison("new")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeComparison === "new"
                ? "bg-white text-black shadow-lg"
                : "text-black/70 hover:text-black"
                }`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              New Way
            </button>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* OLD WAY Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`relative ${activeComparison === "new" ? "hidden md:block" : ""}`}
          >
            <div className="relative bg-white rounded-3xl shadow-xl border-2 border-red-100 p-8 h-full overflow-hidden group hover:border-red-200 transition-colors">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, #EF4444 0px, #EF4444 1px, transparent 1px, transparent 10px)`,
                }} />
              </div>

              {/* Header */}
              <div className="relative mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>The Old Way</h3>
                    <p className="text-sm text-red-500 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Traditional Grid Power</p>
                  </div>
                </div>

                {/* Bill Animation */}
                <motion.div
                  className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-red-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>₹5,000</span>
                    <span className="text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>/month</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-500">
                    <TrendingUp className="w-4 h-4" />
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Rising 8-12% every year</span>
                  </div>
                </motion.div>
              </div>

              {/* Issues List */}
              <div className="space-y-4 relative">
                {oldWayIssues.map((issue, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100/50"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-black font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>{issue.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom decoration */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 to-orange-400" />
            </div>
          </motion.div>

          {/* VS Divider - Desktop */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
              className="relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold via-amber-500 to-gold rounded-full blur-md opacity-60 group-hover:opacity-80 transition-opacity" />
              
              {/* Main badge */}
              <div className="relative w-full h-full bg-gradient-to-br from-gold via-amber-500 to-gold rounded-full flex items-center justify-center border-2 border-white/20 shadow-[0_10px_40px_-5px_rgba(255,184,0,0.5)]">
                <span className="text-black font-bold text-lg drop-shadow-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>VS</span>
              </div>
              
              {/* Animated ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-gold/50"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>

          {/* NEW WAY Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`relative ${activeComparison === "old" ? "hidden md:block" : ""}`}
          >
            <div className="relative bg-white rounded-3xl shadow-xl border-2 border-gray-200/30 p-8 h-full overflow-hidden group hover:border-gray-200/50 transition-colors">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-[0.03] overflow-hidden">
                {/* Primary dot grid with animation */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    backgroundPosition: ['0px 0px', '20px 20px'],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #4CAF50 1.5px, transparent 1.5px)`,
                    backgroundSize: '24px 24px',
                  }}
                />
                {/* Secondary larger dots for depth */}
                <motion.div
                  className="absolute inset-0 opacity-50"
                  animate={{
                    backgroundPosition: ['0px 0px', '-40px -40px'],
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #4CAF50 2px, transparent 2px)`,
                    backgroundSize: '48px 48px',
                  }}
                />
                {/* Gradient fade at edges */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, white 70%)',
                  }}
                />
              </div>

              {/* Winner badge - ribbon style */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                className="absolute top-6 -right-2 z-10"
              >
                <div className="relative">
                  {/* Ribbon tail */}
                  <div className="absolute -bottom-2 right-0 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-amber-600" />
                  {/* Main badge */}
                  <div className="bg-gradient-to-r from-gold via-gold-light to-gold px-4 py-2 rounded-l-full shadow-lg flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    >
                      <Sparkles className="w-4 h-4 text-black" />
                    </motion.div>
                    <span className="text-black font-bold text-sm tracking-wide">WINNER</span>
                  </div>
                </div>
              </motion.div>

              {/* Header */}
              <div className="relative mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="w-14 h-14 bg-gradient-to-br from-white/20 to-gray-100 rounded-2xl flex items-center justify-center shadow-sm"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Zap className="w-7 h-7 text-black" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>The New Way</h3>
                    <p className="text-sm text-black font-semibold flex items-center gap-1.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      Digital Solar Power
                    </p>
                  </div>
                </div>

                {/* Savings Animation */}
                <motion.div
                  className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border border-gray-200/20 relative overflow-hidden"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                  <div className="flex items-baseline gap-2 mb-2 relative">
                    <motion.span
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="text-4xl font-bold text-black"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.6, type: "spring" }}
                    >
                      ₹2,500
                    </motion.span>
                    <span className="text-gray-500 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>/month</span>
                    <motion.span
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      className="ml-2 bg-gradient-to-r from-white to-gray-500 text-black text-sm font-bold px-3 py-1 rounded-full shadow-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.8 }}
                    >
                      50% OFF
                    </motion.span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black font-medium relative">
                    <Shield className="w-4 h-4" style={{ fontFamily: "'Montserrat', sans-serif" }} />
                    <span>Locked rates • No surprises</span>
                  </div>

                  {/* Comparison line */}
                  <div className="mt-3 pt-3 border-t border-gray-200/10 flex items-center justify-between text-xs">
                    <span className="text-gray-400 line-through" style={{ fontFamily: "'Montserrat', sans-serif" }}>Traditional: ₹5,000/mo</span>
                    <span className="text-black font-semibold flex items-center gap-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      <TrendingDown className="w-3.5 h-3.5" />
                      Save ₹30,000/year
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Benefits List */}
              <div className="space-y-3 relative">
                {newWayBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 4, backgroundColor: "rgba(76, 175, 80, 0.08)" }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-gray-200/10 cursor-default transition-colors"
                  >
                    <motion.div
                      className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Check className="w-4 h-4 text-black" strokeWidth={3} />
                    </motion.div>
                    <span className="text-black font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Bottom decoration - animated gradient */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-white via-gray-400 to-gray-400"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 1.2, duration: 0.8 }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-black/80 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Perfect for: <span className="font-semibold">Renters</span> • <span className="font-semibold">Apartments</span> • <span className="font-semibold">Planning to Move</span>
          </p>
          <a
            href="/reserve"
            className="inline-flex items-center gap-2 text-gold font-semibold hover:gap-3 transition-all"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            See how much you can save
            <ChevronRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
