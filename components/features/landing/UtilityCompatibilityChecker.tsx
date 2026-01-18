"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Zap, 
  Building2, 
  ChevronRight,
  Sparkles,
  Search,
  Shield,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DISCOM_DATA: Record<string, { name: string; supported: boolean; coverage: string }[]> = {
  "Delhi": [
    { name: "BSES Rajdhani", supported: true, coverage: "South & West Delhi" },
    { name: "BSES Yamuna", supported: true, coverage: "East & Central Delhi" },
    { name: "Tata Power Delhi", supported: true, coverage: "North Delhi" },
    { name: "NDMC", supported: false, coverage: "New Delhi Municipal Area" },
  ],
  "Maharashtra": [
    { name: "Adani Electricity", supported: true, coverage: "Mumbai" },
    { name: "BEST", supported: true, coverage: "Mumbai Island City" },
    { name: "MSEDCL", supported: true, coverage: "Rest of Maharashtra" },
    { name: "Tata Power Mumbai", supported: true, coverage: "Mumbai Suburbs" },
  ],
  "Karnataka": [
    { name: "BESCOM", supported: true, coverage: "Bangalore & Surrounding" },
    { name: "MESCOM", supported: true, coverage: "Mangalore Region" },
    { name: "HESCOM", supported: false, coverage: "Hubli Region" },
    { name: "GESCOM", supported: false, coverage: "Gulbarga Region" },
  ],
  "Tamil Nadu": [
    { name: "TANGEDCO", supported: true, coverage: "All Tamil Nadu" },
  ],
  "Kerala": [
    { name: "KSEB", supported: true, coverage: "All Kerala" },
  ],
  "Gujarat": [
    { name: "Torrent Power", supported: true, coverage: "Ahmedabad & Surat" },
    { name: "UGVCL", supported: true, coverage: "North Gujarat" },
    { name: "PGVCL", supported: false, coverage: "Saurashtra" },
    { name: "MGVCL", supported: false, coverage: "Central Gujarat" },
  ],
  "Telangana": [
    { name: "TSSPDCL", supported: true, coverage: "South Telangana" },
    { name: "TSNPDCL", supported: false, coverage: "North Telangana" },
  ],
  "Rajasthan": [
    { name: "JVVNL", supported: true, coverage: "Jaipur Zone" },
    { name: "AVVNL", supported: false, coverage: "Ajmer Zone" },
    { name: "JdVVNL", supported: false, coverage: "Jodhpur Zone" },
  ],
  "Uttar Pradesh": [
    { name: "UPPCL", supported: true, coverage: "Urban Areas" },
    { name: "PVVNL", supported: false, coverage: "Meerut Zone" },
    { name: "DVVNL", supported: false, coverage: "Agra Zone" },
  ],
  "Punjab": [
    { name: "PSPCL", supported: true, coverage: "All Punjab" },
  ],
  "Haryana": [
    { name: "UHBVN", supported: true, coverage: "North Haryana" },
    { name: "DHBVN", supported: false, coverage: "South Haryana" },
  ],
  "West Bengal": [
    { name: "CESC", supported: true, coverage: "Kolkata & Suburbs" },
    { name: "WBSEDCL", supported: false, coverage: "Rest of West Bengal" },
  ],
  "Odisha": [
    { name: "TPCODL", supported: true, coverage: "Central Odisha" },
    { name: "TPNODL", supported: false, coverage: "North Odisha" },
    { name: "TPSODL", supported: false, coverage: "South Odisha" },
  ],
  "Madhya Pradesh": [
    { name: "MPMKVVCL", supported: false, coverage: "All Madhya Pradesh" },
  ],
};

const STATES = Object.keys(DISCOM_DATA);

const SUPPORTED_COUNT = Object.values(DISCOM_DATA)
  .flat()
  .filter(d => d.supported).length;

export function UtilityCompatibilityChecker() {
  const [state, setState] = useState("");
  const [discom, setDiscom] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    compatible: boolean;
    discomName: string;
    coverage: string;
  } | null>(null);

  const discoms = state ? DISCOM_DATA[state] || [] : [];

  const handleCheck = async () => {
    if (!discom || !state) return;

    setChecking(true);
    setResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const selectedDiscom = discoms.find(d => d.name === discom);
    
    if (selectedDiscom) {
      setResult({
        compatible: selectedDiscom.supported,
        discomName: selectedDiscom.name,
        coverage: selectedDiscom.coverage,
      });
    }

    setChecking(false);
  };

  const handleStateChange = (newState: string) => {
    setState(newState);
    setDiscom("");
    setResult(null);
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2.5 rounded-full text-sm font-semibold mb-4 shadow-sm"
        >
          <MapPin className="w-4 h-4" />
          Coverage Check
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-black mb-3"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Is Digital Solar Available in Your Area?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-black/70 max-w-2xl mx-auto"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Check if your electricity provider is supported in our network
        </motion.p>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-5 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Side - Stats & Info */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              whileHover={{ y: -4, shadow: "0 12px 24px -6px rgba(0,0,0,0.1)" }}
              className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl text-black border border-gray-100 shadow-md"
            >
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>{SUPPORTED_COUNT}+</div>
              <div className="text-sm text-black/70" style={{ fontFamily: "'Montserrat', sans-serif" }}>DISCOMs Supported</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -4, shadow: "0 12px 24px -6px rgba(255,184,0,0.2)" }}
              className="bg-gradient-to-br from-gold to-amber-400 p-5 rounded-2xl text-black border border-gold/30 shadow-md"
            >
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>{STATES.length}</div>
              <div className="text-sm text-black/70" style={{ fontFamily: "'Montserrat', sans-serif" }}>States Covered</div>
            </motion.div>
          </div>

          {/* Benefits List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
            className="bg-white/60 backdrop-blur-md rounded-2xl p-6 space-y-4 border border-white/40 shadow-lg"
          >
            <h3 className="font-semibold text-black flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <Sparkles className="w-5 h-5 text-gold" />
              Why Check Compatibility?
            </h3>
            {[
              { icon: Shield, text: "Ensure seamless bill credits", color: "text-gold" },
              { icon: Zap, text: "Instant activation after signup", color: "text-energy-blue" },
              { icon: Clock, text: "Real-time generation tracking", color: "text-gold" },
            ].map((item, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-3"
              >
                <motion.div 
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/10 shadow-sm flex items-center justify-center ${item.color}`}
                  whileHover={{ scale: 1.1 }}
                >
                  <item.icon className="w-4 h-4" />
                </motion.div>
                <span className="text-sm text-black/80" style={{ fontFamily: "'Montserrat', sans-serif" }}>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Expanding Notice */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-energy-blue/15 border border-energy-blue/40 rounded-2xl p-5 backdrop-blur-sm shadow-md"
          >
            <p className="text-sm text-energy-blue" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              <strong>Expanding Soon:</strong> We're adding 15+ new DISCOMs this quarter. 
              Not seeing yours? Sign up for notifications.
            </p>
          </motion.div>
        </motion.div>

        {/* Right Side - Checker Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] border border-gray-100/80 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-white via-gray-50 to-white p-6 text-black border-b border-gray-100/50">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-3 mb-2"
              >
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-gold/20 to-gold/10 rounded-xl flex items-center justify-center shadow-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Search className="w-5 h-5 text-gold" />
                </motion.div>
                <h3 className="text-xl font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Compatibility Checker</h3>
              </motion.div>
              <p className="text-black/70 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Select your state and DISCOM to check availability
              </p>
            </div>

            {/* Form Content */}
            <div className="p-7 space-y-6">
              {/* State Select */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <MapPin className="w-4 h-4 text-gold" />
                  Select Your State
                </label>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 bg-white text-black font-medium focus:outline-none focus:border-gold focus:bg-white/95 focus:shadow-[0_0_0_4px_rgba(255,184,0,0.1)] transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300"
                  >
                    <option value="">Choose a state...</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    animate={{ rotate: state ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </motion.div>
                </div>
              </motion.div>

              {/* DISCOM Select */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.55 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <Building2 className="w-4 h-4 text-gold" />
                  Select Your DISCOM
                </label>
                <div className="relative">
                  <select
                    value={discom}
                    onChange={(e) => { setDiscom(e.target.value); setResult(null); }}
                    disabled={!state}
                    className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 bg-white text-black font-medium focus:outline-none focus:border-gold focus:bg-white/95 focus:shadow-[0_0_0_4px_rgba(255,184,0,0.1)] transition-all duration-300 appearance-none cursor-pointer hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:border-gray-200"
                  >
                    <option value="">{state ? "Choose your DISCOM..." : "Select a state first"}</option>
                    {discoms.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} {d.supported ? "✓" : ""}
                      </option>
                    ))}
                  </select>
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    animate={{ rotate: discom ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </motion.div>
                </div>
                {state && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs text-gray-500 mt-2.5" style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {discoms.filter(d => d.supported).length} of {discoms.length} DISCOMs supported in {state}
                  </motion.p>
                )}
              </motion.div>

              {/* Check Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold text-black hover:text-black transition-all shadow-lg shadow-gold/20 hover:shadow-gold/30"
                  onClick={handleCheck}
                  disabled={checking || !discom || !state}
                >
                  {checking ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Check Availability</span>
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>

              {/* Result */}
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`p-6 rounded-2xl border-2 shadow-md transition-all ${
                        result.compatible
                          ? "bg-gradient-to-br from-white to-green-50 border-green-200"
                          : "bg-gradient-to-br from-white to-amber-50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div 
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                            result.compatible ? "bg-green-100" : "bg-amber-100"
                          }`}
                        >
                          {result.compatible ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                          )}
                        </motion.div>
                        <div className="flex-1">
                          <motion.h4 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className={`font-semibold mb-1 ${
                              result.compatible ? "text-green-800" : "text-amber-800"
                            }`}
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            {result.compatible ? "🎉 Great News! You're Covered" : "⏰ Coming Soon"}
                          </motion.h4>
                          <motion.p 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`text-sm leading-relaxed ${
                              result.compatible ? "text-green-700" : "text-amber-700"
                            }`}
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            {result.compatible 
                              ? `${result.discomName} (${result.coverage}) is fully supported. Start saving on your electricity bills today!`
                              : `${result.discomName} is not yet available. We're expanding rapidly—get notified when it's live.`
                            }
                          </motion.p>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="mt-4"
                          >
                            {result.compatible && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md"
                              >
                                Get Started Now
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            )}
                            {!result.compatible && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-amber-300 text-amber-700 hover:bg-amber-100 font-semibold"
                              >
                                Notify Me When Available
                              </Button>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Supported DISCOMs Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65 }}
              className="bg-gradient-to-r from-gray-50 via-white to-gray-50 p-6 border-t border-gray-100/60"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-black" style={{ fontFamily: "'Montserrat', sans-serif" }}>Popular Supported DISCOMs</p>
                <span className="text-xs font-medium text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>{SUPPORTED_COUNT}+ total</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["BSES Rajdhani", "Tata Power", "BESCOM", "TANGEDCO", "KSEB", "Adani Electricity"].map((name, idx) => (
                  <motion.span
                    key={name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + idx * 0.05 }}
                    whileHover={{ y: -2, shadow: "0 4px 12px -2px rgba(0,0,0,0.08)" }}
                    className="px-3 py-1.5 bg-white border border-gray-200 text-black text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {name}
                  </motion.span>
                ))}
                <motion.span 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.82 }}
                  className="px-3 py-1.5 bg-gold/10 text-gold text-xs font-medium rounded-full border border-gold/20"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  +{SUPPORTED_COUNT - 6} more
                </motion.span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

