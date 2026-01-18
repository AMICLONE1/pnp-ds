"use client";

import { motion, useScroll, useTransform, useInView, useMotionValueEvent } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Sun,
  CreditCard,
  Zap,
  CheckCircle,
  ArrowRight,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Choose Your Capacity",
    description: "Select how much solar capacity you want - from 1kW to 10kW. Our intelligent calculator recommends the perfect size based on your monthly electricity consumption.",
    icon: Sun,
    color: "gold",
    details: [
      "Flexible options from 1kW to 10kW",
      "Personalized recommendations",
      "No minimum commitment"
    ]
  },
  {
    number: "02",
    title: "Make Secure Payment",
    description: "Complete a secure one-time payment via UPI, cards, or net banking. Your capacity is reserved instantly and you start generating credits from day one.",
    icon: CreditCard,
    color: "gray",
    details: [
      "Multiple payment options",
      "Bank-grade security",
      "Instant confirmation"
    ]
  },
  {
    number: "03",
    title: "Solar Generates Energy",
    description: "Your reserved capacity in our solar projects generates clean energy every day. Track real-time generation through your personalized dashboard.",
    icon: Zap,
    color: "energy-blue",
    details: [
      "Real-time tracking",
      "Live dashboard updates",
      "24/7 monitoring"
    ]
  },
  {
    number: "04",
    title: "Credits Applied Automatically",
    description: "Every month, your generated solar credits are automatically applied to your electricity bill. Watch your savings grow without lifting a finger.",
    icon: CheckCircle,
    color: "dark",
    details: [
      "Automatic bill credits",
      "No manual work required",
      "Transparent tracking"
    ]
  },
];

// Step component with scroll-triggered animations
function StepCard({
  step,
  index,
  isRevealed,
  isActive,
}: {
  step: typeof steps[0];
  index: number;
  isRevealed: boolean;
  isActive: boolean;
}) {
  const cardRef = useRef(null);
  
  const colors = {
    gold: {
      bg: "bg-gradient-to-br from-gold to-amber-500",
      bgLight: "bg-gold/10",
      text: "text-gold",
      border: "border-gold/30",
      glow: "shadow-[0_0_30px_rgba(255,184,0,0.3)]"
    },
    gray: {
      bg: "bg-gradient-to-br from-gray-700 to-gray-900",
      bgLight: "bg-gray-100",
      text: "text-gray-700",
      border: "border-gray-300",
      glow: "shadow-[0_0_30px_rgba(100,100,100,0.2)]"
    },
    "energy-blue": {
      bg: "bg-gradient-to-br from-cyan-400 to-cyan-600",
      bgLight: "bg-cyan-50",
      text: "text-cyan-600",
      border: "border-cyan-300",
      glow: "shadow-[0_0_30px_rgba(0,200,255,0.3)]"
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-800 to-black",
      bgLight: "bg-gray-100",
      text: "text-gray-800",
      border: "border-gray-400",
      glow: "shadow-[0_0_30px_rgba(0,0,0,0.2)]"
    }
  };

  const colorScheme = colors[step.color as keyof typeof colors];

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={isRevealed ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
      } : { opacity: 0, y: 60, scale: 0.9 }}
      transition={{ 
        duration: 0.7, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 0.1
      }}
      className="relative"
    >
      {/* Card with enhanced styling */}
      <motion.div 
        className={cn(
          "relative p-7 md:p-8 rounded-2xl transition-all duration-500 bg-gradient-to-br from-white to-gray-50/80 border-2 backdrop-blur-sm overflow-hidden",
          isActive 
            ? `${colorScheme.border} shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)]` 
            : "border-gray-100/80 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)]"
        )}
        whileHover={{ 
          y: -8,
          transition: { duration: 0.3, type: "spring", stiffness: 200 }
        }}
      >
        {/* Enhanced background shine effect */}
        <motion.div 
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: isActive ? 0.5 : 0.3 }}
          transition={{ duration: 0.4 }}
        />

        {/* Animated border glow on active */}
        {isActive && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-2xl pointer-events-none",
              "bg-gradient-to-br p-[2px]",
              colorScheme.bg
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          >
            <div className="absolute inset-0 rounded-2xl bg-white" />
          </motion.div>
        )}

        {/* Number badge - positioned inside card, consistently on top-right */}
        <motion.div 
          className={cn(
            "absolute top-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg text-white shadow-lg z-10",
            colorScheme.bg
          )}
          initial={{ scale: 0, rotate: -180 }}
          animate={isRevealed ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {step.number}
        </motion.div>

        {/* Icon with animation and hover effect */}
        <motion.div 
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center mb-5 shadow-[0_4px_16px_-2px_rgba(0,0,0,0.1)]",
            colorScheme.bgLight
          )}
          initial={{ scale: 0, rotate: -180 }}
          animate={isRevealed ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 180 }}
          whileHover={{ 
            scale: 1.15,
            rotate: 8,
            boxShadow: "0 8px 24px -4px rgba(0,0,0,0.15)"
          }}
        >
          <step.icon className={cn("w-7 h-7", colorScheme.text)} />
        </motion.div>

        {/* Content wrapper */}
        <div className="relative z-10">
          {/* Title with staggered animation */}
          <motion.h3 
            className="text-xl md:text-2xl font-heading font-bold text-gray-900 mb-3" 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            initial={{ opacity: 0, x: -20 }}
            animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {step.title}
          </motion.h3>

          {/* Description with staggered animation */}
          <motion.p 
            className="text-gray-600 leading-relaxed mb-5 text-sm md:text-base" 
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            initial={{ opacity: 0, x: -20 }}
            animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {step.description}
          </motion.p>

          {/* Details with staggered reveal */}
          <motion.div
            className="pt-5 border-t border-gray-200/60 space-y-3"
            initial={{ opacity: 0 }}
            animate={isRevealed ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {step.details.map((detail, i) => (
              <motion.div
                key={detail}
                initial={{ opacity: 0, x: -15 }}
                animate={isRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <motion.div 
                  className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm", colorScheme.bgLight)}
                  whileHover={{ scale: 1.2 }}
                >
                  <CheckCircle className={cn("w-3.5 h-3.5", colorScheme.text)} />
                </motion.div>
                <span className="text-gray-700 flex-1">{detail}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Animated Timeline with scroll-based progression
function AnimatedTimeline({ 
  progress, 
  activeIndex,
  revealedSteps 
}: { 
  progress: number;
  activeIndex: number;
  revealedSteps: boolean[];
}) {
  return (
    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2">
      {/* Background track */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 rounded-full" />
      
      {/* Animated progress line */}
      <motion.div
        className="absolute top-0 left-0 w-full rounded-full overflow-hidden"
        style={{ height: `${progress * 100}%` }}
      >
        {/* Main gradient line */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold via-amber-400 to-gold" />
        
        {/* Animated glow effect */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-20 bg-gradient-to-t from-gold via-white to-transparent blur-md"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Particle effects */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_5px_rgba(255,184,0,0.8)]"
          animate={{
            y: [0, -10, 0],
            opacity: [1, 0.5, 1],
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </motion.div>

      {/* Step nodes */}
      {steps.map((step, index) => {
        const isRevealed = revealedSteps[index];
        const colors = {
          gold: "from-gold to-amber-500",
          gray: "from-gray-600 to-gray-800",
          "energy-blue": "from-cyan-400 to-cyan-600",
          dark: "from-gray-700 to-black"
        };
        
        return (
          <motion.div
            key={index}
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: `${(index / (steps.length - 1)) * 100}%` }}
          >
            {/* Outer ring with pulse */}
            <motion.div
              className={cn(
                "absolute -inset-3 rounded-full",
                isRevealed ? "bg-gold/20" : "bg-transparent"
              )}
              animate={isRevealed ? {
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Main node */}
            <motion.div
              className={cn(
                "relative w-5 h-5 rounded-full border-4 transition-all duration-500",
                isRevealed 
                  ? `bg-gradient-to-br ${colors[step.color as keyof typeof colors]} border-white shadow-[0_0_20px_rgba(255,184,0,0.5)]`
                  : "bg-white border-gray-300"
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              {/* Inner glow */}
              {isRevealed && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/50"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 0] }}
                  transition={{ duration: 0.6 }}
                />
              )}
            </motion.div>

            {/* Connection dots (between nodes) */}
            {index < steps.length - 1 && isRevealed && (
              <>
                {[1, 2, 3].map((dot) => (
                  <motion.div
                    key={dot}
                    className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gold/60 rounded-full"
                    style={{ top: `${dot * 25}%` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{ 
                      delay: dot * 0.15, 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// Mobile Timeline
function MobileTimeline({ activeIndex, revealedSteps }: { activeIndex: number; revealedSteps: boolean[] }) {
  return (
    <div className="md:hidden flex justify-center gap-3 mb-10">
      {steps.map((step, index) => {
        const isRevealed = revealedSteps[index];
        return (
          <motion.div
            key={index}
            className="flex items-center"
          >
            <motion.div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500",
                isRevealed 
                  ? "bg-gradient-to-br from-gold to-amber-500 text-white shadow-lg"
                  : "bg-gray-100 text-gray-400"
              )}
              animate={isRevealed ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {step.number}
            </motion.div>
            {index < steps.length - 1 && (
              <motion.div
                className={cn(
                  "w-8 h-0.5 mx-1 transition-all duration-500",
                  isRevealed ? "bg-gold" : "bg-gray-200"
                )}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isRevealed ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// Scroll progress indicator
function ScrollProgressIndicator({ progress }: { progress: number }) {
  const percentage = Math.round(progress * 100);
  
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 hidden md:flex items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: progress > 0 && progress < 1 ? 1 : 0, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-gray-200 flex items-center gap-3">
        <span className="text-xs font-medium text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Scroll to explore
        </span>
        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-gold to-amber-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs font-bold text-gold">{percentage}%</span>
      </div>
    </motion.div>
  );
}

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const [revealedSteps, setRevealedSteps] = useState<boolean[]>([false, false, false, false]);
  const [lineProgress, setLineProgress] = useState(0);

  // Use scroll progress relative to the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track scroll progress and reveal steps sequentially
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Calculate line progress (0 to 1)
    setLineProgress(Math.min(latest * 1.1, 1));
    
    // Calculate which step should be active based on scroll
    // Spread the reveals across the scroll: 15%, 40%, 65%, 90%
    const thresholds = [0.15, 0.40, 0.65, 0.90];
    
    const newRevealedSteps = thresholds.map((threshold) => latest >= threshold);
    setRevealedSteps(newRevealedSteps);
    
    // Set active step (the most recently revealed one)
    const newActiveStep = newRevealedSteps.filter(Boolean).length - 1;
    setActiveStep(newActiveStep);
  });

  return (
    <>
      {/* This is the scroll container - it's tall to allow for scrolling while content is sticky */}
      <div
        ref={containerRef}
        className="relative"
        style={{ height: "300vh" }} // Tall container for scroll distance
      >
        {/* Sticky wrapper - stays fixed while user scrolls through the container */}
        <div
          ref={stickyRef}
          className="sticky top-0 min-h-screen flex items-center overflow-hidden"
        >
          <section
            id="how-it-works"
            className="relative w-full py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/30 to-white"
          >
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div 
                className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-gold/10 to-amber-200/5 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              <motion.div 
                className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-gradient-to-tl from-gray-200/20 to-gray-100/10 rounded-full blur-3xl"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 12, repeat: Infinity }}
              />
              {/* Subtle grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8 relative z-10">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-16"
              >
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold/20 to-amber-100/30 text-gold rounded-full text-sm font-semibold mb-5 shadow-sm"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                  Simple Process
                </motion.span>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-5"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  How It Works
                </h2>

                <p className="text-lg text-gray-600 max-w-2xl mx-auto"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  From sign-up to savings in just 4 simple steps. No technical knowledge required.
                </p>

                {/* Scroll hint */}
                <motion.div
                  className="mt-6 flex flex-col items-center gap-2"
                  animate={{ opacity: lineProgress < 0.1 ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-xs text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {/* Scroll to explore each step */}
                  </span>
                  <motion.div
                    className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1"
                    animate={{ borderColor: ["#d1d5db", "#FFB800", "#d1d5db"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      className="w-1.5 h-2.5 bg-gold rounded-full"
                      animate={{ y: [0, 12, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Mobile Timeline */}
              <MobileTimeline activeIndex={activeStep} revealedSteps={revealedSteps} />

              {/* Steps with Timeline */}
              <div className="relative max-w-5xl mx-auto">
                {/* Animated Timeline (desktop) */}
                <AnimatedTimeline 
                  progress={lineProgress} 
                  activeIndex={activeStep}
                  revealedSteps={revealedSteps}
                />

                {/* Step Cards */}
                <div className="grid md:grid-cols-2 gap-8 md:gap-y-20 lg:gap-y-24">
                  {steps.map((step, index) => (
                    <div
                      key={step.number}
                      className={cn(
                        index % 2 === 1 && "md:col-start-2",
                        index % 2 === 0 && "md:col-start-1"
                      )}
                    >
                      <StepCard
                        step={step}
                        index={index}
                        isRevealed={revealedSteps[index]}
                        isActive={activeStep === index}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom CTA - only shows when all steps revealed */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: revealedSteps.every(Boolean) ? 1 : 0, 
                  y: revealedSteps.every(Boolean) ? 0 : 30 
                }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-16 md:mt-20 text-center"
              >
                <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
                  <Link href="/reserve">
                    <motion.div 
                      whileHover={{ scale: 1.03, y: -2 }} 
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="secondary"
                        size="lg"
                        className="relative overflow-hidden bg-gradient-to-r from-gold via-amber-500 to-gold hover:from-amber-500 hover:via-gold hover:to-amber-500 text-black font-semibold px-10 py-7 text-lg group shadow-[0_10px_40px_-10px_rgba(255,184,0,0.4)] rounded-xl"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10 flex items-center gap-2">
                          Get Started Now
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </motion.div>
                  </Link>

                  <span className="text-gray-400 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>or</span>

                  <motion.button 
                    className="flex items-center gap-3 text-gold hover:text-amber-600 transition-colors group"
                    whileHover={{ x: 3 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/20 to-amber-100/30 flex items-center justify-center group-hover:from-gold/30 group-hover:to-amber-200/40 transition-all shadow-sm">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                    <span className="font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Watch video explainer</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <ScrollProgressIndicator progress={lineProgress} />
    </>
  );
}
