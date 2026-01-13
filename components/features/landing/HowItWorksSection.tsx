"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
    color: "energy-green",
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
    color: "forest",
    details: [
      "Automatic bill credits",
      "No manual work required",
      "Transparent tracking"
    ]
  },
];

// Step component
function StepCard({
  step,
  index,
  isActive,
  progress
}: {
  step: typeof steps[0];
  index: number;
  isActive: boolean;
  progress: number;
}) {
  const colors = {
    gold: {
      bg: "bg-gold",
      bgLight: "bg-gold/10",
      text: "text-gold",
      border: "border-gold",
      gradient: "from-gold to-amber-600"
    },
    "energy-green": {
      bg: "bg-energy-green",
      bgLight: "bg-energy-green/10",
      text: "text-energy-green",
      border: "border-energy-green",
      gradient: "from-energy-green to-green-600"
    },
    "energy-blue": {
      bg: "bg-energy-blue",
      bgLight: "bg-energy-blue/10",
      text: "text-energy-blue",
      border: "border-energy-blue",
      gradient: "from-energy-blue to-blue-600"
    },
    forest: {
      bg: "bg-forest",
      bgLight: "bg-forest/10",
      text: "text-forest",
      border: "border-forest",
      gradient: "from-forest to-forest-light"
    }
  };

  const colorScheme = colors[step.color as keyof typeof colors];

  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={cn(
        "relative",
        index % 2 === 0 ? "md:pr-12 lg:pr-16" : "md:pl-12 lg:pl-16"
      )}
    >
      {/* Card */}
      <div className={cn(
        "relative p-6 md:p-8 rounded-2xl transition-all duration-500",
        isActive
          ? "bg-white shadow-2xl shadow-black/10"
          : "bg-white/70 hover:bg-white hover:shadow-lg"
      )}>
        {/* Number badge */}
        <div className={cn(
          "absolute -top-4 w-16 h-16 rounded-2xl flex items-center justify-center font-heading font-bold text-2xl text-white shadow-lg transition-transform duration-300",
          `bg-gradient-to-br ${colorScheme.gradient}`,
          index % 2 === 0 ? "-right-4" : "-left-4",
          isActive && "scale-110"
        )}>
          {step.number}
        </div>

        {/* Icon */}
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300",
          isActive ? colorScheme.bg : colorScheme.bgLight
        )}>
          <step.icon className={cn(
            "w-7 h-7 transition-colors duration-300",
            isActive ? "text-white" : colorScheme.text
          )} />
        </div>

        {/* Content */}
        <h3 className="text-xl md:text-2xl font-heading font-bold text-charcoal mb-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {step.title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {step.description}
        </p>

        {/* Details */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: isActive ? "auto" : 0,
            opacity: isActive ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 border-t border-gray-100 space-y-2">
            {step.details.map((detail, i) => (
              <motion.div
                key={detail}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <CheckCircle className={cn("w-4 h-4", colorScheme.text)} />
                <span className="text-gray-600">{detail}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Timeline line component
function TimelineLine({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
      {/* Background line */}
      <div className="absolute inset-0 bg-gray-200" />

      {/* Progress line */}
      <motion.div
        className="absolute top-0 left-0 w-full bg-gradient-to-b from-gold via-energy-green to-forest"
        initial={{ height: "0%" }}
        animate={{ height: `${((activeIndex + 1) / steps.length) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Step dots */}
      {steps.map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            "absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white transition-colors duration-300",
            index <= activeIndex ? "bg-gold" : "bg-gray-300"
          )}
          style={{ top: `${(index / (steps.length - 1)) * 100}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.2 }}
        />
      ))}
    </div>
  );
}

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });

  // Update active step based on scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      const stepIndex = Math.min(
        Math.floor(value * steps.length * 1.5),
        steps.length - 1
      );
      setActiveStep(Math.max(0, stepIndex));
    });
    return unsubscribe;
  }, [scrollYProgress]);

  return (
    <section
      id="how-it-works"
      ref={containerRef}
      className="relative py-24 md:py-32 bg-gradient-to-b from-white to-offwhite overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-energy-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-gold/10 text-gold rounded-full text-sm font-semibold mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Simple Process
          </motion.span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-charcoal mb-4"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            How It Works
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            From sign-up to savings in just 4 simple steps. No technical knowledge required.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          <TimelineLine activeIndex={activeStep} />

          <div className="grid md:grid-cols-2 gap-12 md:gap-y-24">
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
                  isActive={activeStep >= index}
                  progress={scrollYProgress.get()}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/reserve">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-gold hover:bg-gold-light text-charcoal font-semibold px-8 py-6 text-lg group"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>

            <span className="text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>or</span>

            <button className="flex items-center gap-2 text-forest hover:text-forest-light transition-colors group">
              <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center group-hover:bg-forest/20 transition-colors">
                <Play className="w-4 h-4" />
              </div>
              <span className="font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Watch video explainer</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
