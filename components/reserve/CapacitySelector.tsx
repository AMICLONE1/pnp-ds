import { type Project } from "@/components/reserve/ProjectCard";
import {
  TrendingUp,
  Sun,
  Shield,
  Leaf,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Battery,
  BadgeCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SOLAR_CONSTANTS, calculateSolarSavings, formatINR } from "@/lib/solar-constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CapacitySelectorProps {
    selectedProject: Project | null;
    capacity: number;
    setCapacity: (val: number) => void;
    monthlyFee: number;
    estimatedSavings: number;
    onReserve: () => void;
    isLoggedIn: boolean;
}

export default function CapacitySelector({ selectedProject,capacity,setCapacity,monthlyFee,estimatedSavings,onReserve,isLoggedIn,} : CapacitySelectorProps){
    const maxCapacity = selectedProject
        ? Math.min(100, Math.floor(selectedProject.available_capacity_kw || 100))
        : 100;
    
      const presetCapacities = [5, 10, 25, 50];
    
      // Use shared solar constants for calculations
      const savings = calculateSolarSavings(capacity);
      const annualSavings = savings.annualSavings;
      const co2Offset = savings.co2OffsetTonnes / 12; // Convert to monthly
      const treesEquivalent = Math.round(savings.treesEquivalent / 12);
      const reservationFee = savings.reservationFee;
      const roiYears = savings.roiYears;
    return(
        <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="sticky top-24"
    >
      <div className=" bg-white rounded-3xl border-2 border-gray-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-gold/10 via-amber-50/30 to-gold/5 px-5 py-4 text-black border-b border-gold/20">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5 opacity-50" />
          <div className="relative flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100 flex items-center justify-center border border-gold/30 shadow-md"
              whileHover={{ rotate: 10, scale: 1.1 }}
            >
              <Battery className="w-5 h-5 text-gold" />
            </motion.div>
            <div>
              <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-heading font-bold">Reserve Capacity</h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-gray-600 font-medium">Choose your solar allocation</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {selectedProject ? (
            <>
              {/* Selected project indicator */}
              <motion.div
                className="flex items-center gap-2.5 px-3 py-2.5 bg-gradient-to-r from-gold/10 via-amber-50/20 to-gold/10 rounded-xl mb-4 border border-gold/20 shadow-sm"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-amber-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm font-bold text-black block">{selectedProject.name}</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] font-semibold text-amber-600">Currently not operational (Coming Soon)</span>
                </div>
              </motion.div>

              {/* Enhanced Capacity display */}
              <div className="text-center mb-5">
                <motion.div
                  className="text-5xl font-bold mb-1"
                  key={capacity}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <span className="bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent">
                    {capacity}
                  </span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl text-gray-400 ml-2">kW</span>
                </motion.div>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-gray-600 font-medium">Selected capacity</p>
              </div>

              {/* Enhanced Preset buttons */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {presetCapacities.map((preset) => (
                  <motion.button
                    key={preset}
                    onClick={() => setCapacity(Math.min(preset, maxCapacity))}
                    className={cn(
                      "py-2.5 px-2 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm",
                      capacity === preset
                        ? "bg-gradient-to-br from-gold to-amber-500 text-white shadow-lg shadow-gold/30 scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    )}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={preset > maxCapacity}
                  >
                    {preset} kW
                  </motion.button>
                ))}
              </div>

              {/* Enhanced Slider */}
              <div className="mb-6">
                <div className="relative h-6 flex items-center">
                  {/* Track background */}
                  <div className="absolute left-0 right-0 h-2 rounded-full bg-gray-200" />
                  {/* Track fill */}
                  <div
                    className="absolute left-0 h-2 rounded-full bg-gradient-to-r from-gold to-amber-500"
                    style={{ width: `${((capacity - 1) / (maxCapacity - 1)) * 100}%` }}
                  />
                  {/* Native input */}
                  <input
                    type="range"
                    min="1"
                    max={maxCapacity}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="reserve-slider absolute w-full h-6 appearance-none bg-transparent cursor-pointer z-10"
                    aria-label="Select solar capacity"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }}>1 kW</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }}>{maxCapacity} kW</span>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="space-y-3 py-4 border-y border-gray-100">
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-gradient-to-r from-gold/5 to-amber-50/30 border border-gold/20">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-black font-semibold">One-time Reservation</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-lg font-bold text-gold">
                    {formatINR(reservationFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-black font-semibold flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Est. Monthly Savings
                  </span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-lg font-bold text-green-600">
                    {formatINR(savings.monthlySavings)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs px-2.5">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-600 font-medium">Annual Savings</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-bold text-green-600">
                    {formatINR(annualSavings)}/year
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs px-2.5">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-600 font-medium">ROI Period</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-bold text-black">
                    ~{roiYears.toFixed(1)} years
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs px-2.5">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-600 font-medium">Credit Rate</span>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-bold text-gold">
                    ₹{SOLAR_CONSTANTS.creditRatePerUnit}/unit
                  </span>
                </div>
              </div>

              {/* Environmental impact */}
              <div className="mt-4 p-3.5 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-sm">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm font-bold text-emerald-800">Environmental Impact</span>
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-emerald-900 leading-relaxed">
                  You&apos;ll offset <span className="font-bold text-emerald-800">{savings.co2OffsetTonnes.toFixed(1)} tons</span> of CO₂/year,
                  equivalent to planting <span className="font-bold text-emerald-800">{savings.treesEquivalent} trees</span>
                </p>
              </div>

              {/* CTA */}
              <div className="mt-5">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    variant="primary"
                    size="lg"
                    className="w-full bg-gradient-to-r from-gold via-amber-500 to-gold hover:from-amber-500 hover:via-gold hover:to-amber-500 text-black font-bold py-4 text-base group shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/40 transition-all duration-300"
                    onClick={onReserve}
                  >
                    <Sparkles className="mr-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
                    {isLoggedIn ? "Reserve Now" : "Sign Up to Reserve"}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                {!isLoggedIn && (
                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-center text-xs text-gray-600 mt-3 font-medium">
                    Already have an account?{" "}
                    <Link style={{ fontFamily: "'Montserrat', sans-serif" }} href="/login?redirect=/reserve" className="text-gold hover:underline font-semibold">
                      Log in
                    </Link>
                  </p>
                )}
              </div>

              {/* Trust badges */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <Shield className="w-3.5 h-3.5 text-gold" />
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] text-gray-700 font-semibold">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <BadgeCheck className="w-3.5 h-3.5 text-gold" />
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] text-gray-700 font-semibold">Verified Project</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Sun style={{ fontFamily: "'Montserrat', sans-serif" }} className="w-8 h-8 text-gray-400" />
              </div>
              <h4 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-lg font-semibold text-black mb-2">
                Select a Project
              </h4>
              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-500">
                Choose a solar project from the list to configure your capacity
              </p>
            </div>
          )}
        </div>
      </div>
        </motion.div>
    )   
}