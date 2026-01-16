"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { TrendingUp, Leaf, DollarSign, Sparkles, PartyPopper } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { formatNumber } from "@/lib/utils";
import { SparkleBurst } from "@/components/ui/ConfettiCelebration";

interface InlineCalculatorProps {
  onCalculate?: (savings: number) => void;
}

export function InlineCalculator({ onCalculate }: InlineCalculatorProps) {
  const [billAmount, setBillAmount] = useState("2000");
  const [mounted, setMounted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);
  const savingsPercent = 75; // Default 75% savings
  const animationRef = useRef<number | null>(null);

  // Calculate initial values to prevent hydration mismatch
  const initialBill = parseFloat("2000") || 0;
  const initialSavings = (initialBill * savingsPercent) / 100;
  
  const [savings, setSavings] = useState(initialSavings);
  const [displaySavings, setDisplaySavings] = useState(Math.round(initialSavings));
  const [progressWidth, setProgressWidth] = useState(initialBill > 0 ? (initialSavings / initialBill) * 100 : 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const bill = parseFloat(billAmount) || 0;
    const calculatedSavings = (bill * savingsPercent) / 100;
    setSavings(calculatedSavings);
    
    // Trigger celebration when savings exceed threshold
    if (calculatedSavings >= 1500 && !celebrationShown && mounted) {
      setShowCelebration(true);
      setCelebrationShown(true);
      setTimeout(() => setShowCelebration(false), 1500);
    } else if (calculatedSavings < 1500) {
      setCelebrationShown(false);
    }
    
    if (onCalculate) {
      onCalculate(calculatedSavings);
    }
  }, [billAmount, onCalculate, celebrationShown, mounted]);

  // Animate savings counter and progress bar
  useEffect(() => {
    if (!mounted) return;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const target = Math.round(savings);
    const bill = parseFloat(billAmount) || 0;
    const targetProgress = bill > 0 ? (savings / bill) * 100 : 0;
    const duration = 1000;
    const startTime = Date.now();
    const startValue = displaySavings;
    const startProgress = progressWidth;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * easeOut);
      const currentProgress = startProgress + (targetProgress - startProgress) * easeOut;
      
      setDisplaySavings(current);
      setProgressWidth(currentProgress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplaySavings(target);
        setProgressWidth(targetProgress);
      }
    };

    if (target !== displaySavings || targetProgress !== progressWidth) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted, savings, billAmount, progressWidth, displaySavings]);

  const bill = parseFloat(billAmount) || 0;
  const remaining = bill - savings;
  const annualSavings = savings * 12;
  const co2Offset = (savings / 100) * 0.4; // Rough estimate: 0.4 tons CO2 per ₹100 saved

  return (
    <div className="w-full max-w-3xl mx-auto">
      <GlassCard className="p-6 md:p-8" delay={800}>
        <div className="space-y-6">
          {/* Input Section */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label 
                htmlFor="bill-input"
                className="block text-sm font-medium text-black/90 mb-2"
              >
                Enter your monthly bill (₹)
              </label>
              <Input
                id="bill-input"
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="2000"
                min="0"
                className="text-lg bg-white/20 border-white/30 text-black placeholder:text-black/60 focus:bg-white/30 focus:border-white/50 focus-visible-ring"
                aria-label="Monthly electricity bill amount"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-black/90 mb-2">
                You&apos;ll save
              </label>
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: savings > 0 ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 0.3 }}
                className="relative text-3xl md:text-4xl font-bold text-gold flex items-center gap-2 bg-white/10 rounded-lg px-4 py-3 border border-gold/30"
              >
                <SparkleBurst trigger={showCelebration} />
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8" />
                <span>₹{formatNumber(displaySavings)}</span>
                <span className="text-xl md:text-2xl">/month</span>
                <AnimatePresence>
                  {savings >= 1500 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Great!
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Celebration Message */}
          <AnimatePresence>
            {savings >= 2000 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 bg-gradient-to-r from-gold/20 to-white/20 rounded-xl p-4 border border-gold/30">
                  <PartyPopper className="w-6 h-6 text-gold flex-shrink-0" />
                  <div>
                    <p className="text-black font-semibold">
                      🎉 That&apos;s like getting {Math.round(annualSavings / (bill * 12) * 12)} months of FREE power every year!
                    </p>
                    <p className="text-black/70 text-sm">You&apos;re in the top 10% of savers</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Visual Progress Bar */}
          {bill > 0 && (
            <div className="space-y-2">
              <div className="relative h-8 bg-white/10 rounded-lg overflow-hidden border border-white/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-gold-light flex items-center justify-end pr-2"
                >
                  {progressWidth > 15 && (
                    <span className="text-sm font-semibold text-black">
                      Saved: ₹{displaySavings}
                    </span>
                  )}
                </motion.div>
                {progressWidth < 85 && (
                  <div className="absolute inset-y-0 right-0 flex items-center pl-2">
                    <span className="text-sm font-medium text-black/70">
                      Remaining: ₹{Math.round(remaining)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Metrics */}
          {bill > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/20 rounded-lg">
                  <DollarSign className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs text-black/70">Annual Savings</p>
                  <p className="text-lg font-bold text-black">
                    ₹{formatNumber(annualSavings)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/20 rounded-lg">
                  <Leaf className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-black/70">CO₂ Offset</p>
                  <p className="text-lg font-bold text-black">
                    {co2Offset.toFixed(1)} tons/year
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-energy-blue/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-[#00BCD4]" />
                </div>
                <div>
                  <p className="text-xs text-black/70">Savings Rate</p>
                  <p className="text-lg font-bold text-black">{savingsPercent}%</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-black/80 text-center pt-2">
            *Based on {savingsPercent}% savings with Digital Solar
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

