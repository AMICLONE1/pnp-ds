"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TrendingUp, Zap, DollarSign, Leaf, ArrowRight } from "lucide-react";
import { ScrollAnimation } from "@/components/features/landing/ScrollAnimation";
import { GlassCard } from "./GlassCard";

export function QuickSavingsDemo() {
  const [billAmount, setBillAmount] = useState("2000");
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const savingsPercent = 75;

  const bill = parseFloat(billAmount) || 0;
  const savings = (bill * savingsPercent) / 100;
  const remaining = bill - savings;
  const annualSavings = savings * 12;
  const co2Offset = (savings / 100) * 0.4; // Rough estimate: 0.4 tons CO2 per ₹100 saved
  const solarCapacity = ((bill * 0.75) / 6.05).toFixed(1);
  
  // Initialize display values to match initial savings to prevent hydration mismatch
  const [displaySavings, setDisplaySavings] = useState(Math.round(savings));
  const [progressWidth, setProgressWidth] = useState(bill > 0 ? (savings / bill) * 100 : 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const target = Math.round(savings);
    const targetProgress = bill > 0 ? (savings / bill) * 100 : 0;
    const duration = 800;
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
  }, [mounted, savings, bill, progressWidth, displaySavings]);

  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-success/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ScrollAnimation direction="fade">
          <div className="text-center mb-12">
            <p className="text-sm text-black/70 mb-4">Drag the slider to see instant savings calculation</p>
          </div>
        </ScrollAnimation>

        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12 bg-white/90 backdrop-blur-xl border-gray-200-light/30">
            <div className="space-y-8">
              {/* Slider Input */}
              <div>
                <label className="block text-xl font-bold text-black mb-6 text-center">
                  My monthly bill is ₹{billAmount}
                </label>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="100"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full h-4 bg-white/20 rounded-lg appearance-none cursor-pointer slider-custom"
                  style={{
                    background: `linear-gradient(to right, #FFB800 0%, #FFB800 ${((parseFloat(billAmount) - 500) / 9500) * 100}%, rgba(255,255,255,0.2) ${((parseFloat(billAmount) - 500) / 9500) * 100}%, rgba(255,255,255,0.2) 100%)`
                  }}
                  aria-label="Monthly bill amount slider"
                />
                <div className="flex justify-between text-sm text-black/70 mt-3">
                  <span>₹500</span>
                  <span>₹10,000</span>
                </div>
              </div>

              {/* Savings Display - Dark Green Card Style */}
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: savings > 0 ? [1, 1.05, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block bg-gradient-to-br from-gray-100 to-white text-black rounded-2xl p-8 shadow-2xl border border-gray-200-light/30"
                >
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <TrendingUp className="h-6 w-6 text-gold" />
                    <span className="text-base font-medium text-black/90">You&apos;ll save</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-bold mb-2 text-gold">
                    ₹{displaySavings.toLocaleString("en-IN")}
                  </div>
                  <div className="text-xl text-black/90">per month</div>
                </motion.div>
              </div>

              {/* Visual Progress Bar */}
              {bill > 0 && (
                <div className="space-y-2">
                  <div className="relative h-10 bg-white/10 rounded-lg overflow-hidden border border-white/20">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressWidth}%` }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold to-gold-light flex items-center justify-end pr-3"
                    >
                      {progressWidth > 15 && (
                        <span className="text-sm font-semibold text-black">
                          Saved: ₹{displaySavings}
                        </span>
                      )}
                    </motion.div>
                    {progressWidth < 85 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pl-3">
                        <span className="text-sm font-medium text-black/70">
                          Remaining: ₹{Math.round(remaining)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Three Metrics - Dark Green Style */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/20">
                <div className="flex items-center gap-3 p-4 bg-gold/20 rounded-xl border border-gold/30">
                  <div className="p-2 bg-gold/30 rounded-lg">
                    <DollarSign className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-black/70 mb-1">Annual Savings</p>
                    <p className="text-2xl font-bold text-black">
                      ₹{annualSavings.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-success/20 rounded-xl border border-success/30">
                  <div className="p-2 bg-success/30 rounded-lg">
                    <Leaf className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-black/70 mb-1">CO₂ Offset</p>
                    <p className="text-2xl font-bold text-black">
                      {co2Offset.toFixed(1)} tons/year
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-energy-blue/20 rounded-xl border border-[#00BCD4]/30">
                  <div className="p-2 bg-[#00BCD4]/30 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-[#00BCD4]" />
                  </div>
                  <div>
                    <p className="text-xs text-black/70 mb-1">Savings Rate</p>
                    <p className="text-2xl font-bold text-black">{savingsPercent}%</p>
                  </div>
                </div>
              </div>

              {/* Solar Capacity Info */}
              <div className="grid md:grid-cols-2 gap-4 pt-4">
                <div className="text-center p-4 bg-white/10 rounded-xl border border-white/20">
                  <Zap className="h-6 w-6 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-black">
                    {solarCapacity} kW
                  </div>
                  <div className="text-sm text-black/70">Solar Capacity Needed</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl border border-white/20">
                  <TrendingUp className="h-6 w-6 text-gold mx-auto mb-2" />
                  <div className="text-2xl font-bold text-black">
                    ₹{annualSavings.toLocaleString("en-IN")}
                  </div>
                  <div className="text-sm text-black/70">Annual Savings</div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full text-lg py-6 group bg-gold hover:bg-gold-light text-black font-bold glow-button"
                  onClick={() => {
                    window.location.href = `/reserve?capacity=${Math.ceil(parseFloat(solarCapacity))}`;
                  }}
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              {/* Social Proof */}
              <div className="text-center pt-4">
                <p className="text-sm text-black/80">
                  Join <span className="font-semibold text-gold">1,234 users</span> who saved{" "}
                  <span className="font-semibold text-gold">₹50,000+</span> this year
                </p>
              </div>

              {/* Disclaimer */}
              <div className="text-center pt-2">
                <p className="text-xs text-black/60">
                  *Based on {savingsPercent}% savings with Digital Solar
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

