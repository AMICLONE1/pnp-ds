"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Leaf, ArrowRight } from "lucide-react";
import { useScrollAnimation, useStaggerAnimation } from "@/hooks/useScrollAnimation";
import { GlassCard } from "./GlassCard";

const steps = [
  {
    number: 1,
    icon: Zap,
    title: "Reserve Solar",
    description: "Reserve solar capacity from community solar projects. Choose your preferred capacity (1-100 kW) and start earning credits immediately.",
    color: "from-white to-gray-50",
  },
  {
    number: 2,
    icon: TrendingUp,
    title: "Connect Utility",
    description: "Link your electricity provider account. We support all major DISCOMs across India. Setup takes less than 2 minutes.",
    color: "from-gold to-gold-light",
  },
  {
    number: 3,
    icon: Leaf,
    title: "Offset Bills",
    description: "Watch your savings grow! Solar credits are automatically applied to your monthly bills. Track everything in real-time.",
    color: "from-success to-gray-600",
  },
];

export function ProcessVisualization() {
  const { ref: headerRef, controls: headerControls } = useScrollAnimation({ direction: "fade" });
  const { ref: stepsRef, containerVariants, itemVariants } = useStaggerAnimation(steps.length);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-white relative" aria-label="How it works">
      <div className="container mx-auto px-4">
        <motion.div
          ref={headerRef}
          animate={headerControls}
          initial="hidden"
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-black">
            How PowerNetPro Works
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            A simple three-step process to start saving on your electricity bills
          </p>
        </motion.div>

        <motion.div
          ref={stepsRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto relative"
        >
          {/* Connecting Line - Desktop Only */}
          <div className="hidden md:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-white via-gold to-success opacity-20" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="relative group"
            >
              {/* Arrow between steps - Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 -right-6 z-10">
                  <ArrowRight className="h-6 w-6 text-gray-300" aria-hidden="true" />
                </div>
              )}

              <GlassCard className="p-8 h-full" hover>
                {/* Step Number */}
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg`}>
                  <span className="text-3xl font-bold text-black">{step.number}</span>
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <step.icon className={`h-10 w-10 ${step.color.includes("forest") ? "text-black" : step.color.includes("gold") ? "text-gold" : "text-success"}`} aria-hidden="true" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold mb-4 text-center text-black">
                  {step.title}
                </h3>
                <p className="text-black text-center leading-relaxed">
                  {step.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
