"use client";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useRef, useState, useEffect, useMemo, memo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  Leaf,
  Shield,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    <ul className="space-y-2 sm:space-y-3 md:space-y-4">
      {items.map((item, i) => (
        <motion.li
          key={item}
          className="flex items-center gap-2 sm:gap-3 text-black text-sm sm:text-base md:text-lg"
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
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-black flex-shrink-0" />
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
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-100 backdrop-blur-md border border-gray-200 rounded-full hover:bg-gray-200 hover:border-gray-300 transition-all cursor-default">
        <Icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", color)} />
        <span className="font-semibold text-black text-xs sm:text-sm">{value}</span>
        <span className="text-black text-xs sm:text-sm hidden xs:inline">{label}</span>
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
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[-25%] left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] md:w-[800px] lg:w-[1100px] xl:w-[1400px] h-[200px] sm:h-[300px] md:h-[450px] lg:h-[550px] xl:h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,184,0,0.32),rgba(34,197,94,0.2),transparent_65%)] blur-2xl md:blur-3xl opacity-80" />
        <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white via-white to-transparent" />
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 md:py-16"
      >
        <div className="max-w-7xl mx-auto">
          {/* Centered Content */}
          <div className="text-black max-w-5xl mx-auto text-center flex flex-col items-center px-1 sm:px-0">

            {/* Top badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold/10 border border-gold/30 text-black mb-4 sm:mb-6 mt-14 sm:mt-8 md:mt-12 shadow-sm"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <span className="text-[10px] sm:text-xs font-semibold text-gold">2026</span>
              <span className="text-xs sm:text-sm font-semibold">Next-Gen Digital Solar</span>
            </motion.div>

            {/* Main Headline with Enhanced Animations - Responsive */}
            <h1
              className="text-balance text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-[3.6rem] font-heading font-bold leading-tight tracking-tight mb-6 overflow-visible flex flex-wrap gap-x-2 gap-y-1 sm:gap-x-3 md:gap-x-4 items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white/90 rounded-2xl sm:rounded-3xl shadow-xl max-w-full"
              style={{ fontFamily: "'Oswald', sans-serif", boxShadow: '0 6px 32px 0 rgba(255,184,0,0.10)' }}
            >
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-black"
              >
                What if your electricity bill was ₹0 ? 
              </motion.span>
              <motion.span
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] text-black mb-3 sm:mb-4 max-w-3xl leading-relaxed px-2 sm:px-0"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              Go Solar in <span className="text-gold font-bold">5 mins</span>.
              {" "}
              <span className="block sm:inline">No Roof Required. No Installation.</span>
            </motion.p>

            {/* <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-gray-700 mb-4 sm:mb-5 max-w-2xl px-2 sm:px-0"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              The average family saves{" "}
              <span className="text-gold font-bold text-lg sm:text-xl md:text-2xl">
                ₹<NumberTicker value={24000} className="text-gold font-bold" />
              </span>{" "}
              per year with Digital Solar.
            </motion.p> */}

            {/* Animated Benefits Checklist */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mb-6 sm:mb-8"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <AnimatedCheckList
                items={[
                  "Upto 100% Savings",
                  "Zero maintenance costs",
                  "Better Credit Rate"
                ]}
                delay={1.5}
              />
            </motion.div>

            {/* Stats with Gradient Border */}
            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-5 px-2 sm:px-0"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              {heroStats.map((stat, index) => (
                <StatPill
                  key={stat.label}
                  {...stat}
                  delay={1.9 + index * 0.1}
                />
              ))}
            </motion.div> */}

            {/* CTAs with Magnetic Effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center w-full px-4 sm:px-0 sm:w-auto"
              style={{ fontFamily: "'Open Sans', sans-serif" }}
            >
              <Link href="/waitlist" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="relative w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-bold shadow-2xl shadow-gold/30 group overflow-hidden"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  {/* Button shine effect */}
                  <span className="relative z-10 flex items-center justify-center">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>

              <Link href="/#how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 border-2 border-gray-300 text-black hover:bg-gray-100 backdrop-blur-sm font-semibold group"
                  style={{ fontFamily: "'Open Sans', sans-serif" }}
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
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
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pb-4 sm:pb-6 md:pb-8"
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
          <PulseRing className="w-8 h-8 sm:w-10 sm:h-10 absolute -top-2" color="rgba(255,184,0,0.5)" />
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}