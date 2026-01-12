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
          className="inline-flex items-center gap-2 bg-energy-blue/10 text-energy-blue px-4 py-2 rounded-full text-sm font-semibold mb-4"
        >
          <MapPin className="w-4 h-4" />
          Coverage Check
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4"
        >
          Is Digital Solar Available in Your Area?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
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
            <div className="bg-gradient-to-br from-forest to-forest-light p-5 rounded-2xl text-white">
              <div className="text-3xl font-bold mb-1">{SUPPORTED_COUNT}+</div>
              <div className="text-sm text-white/80">DISCOMs Supported</div>
            </div>
            <div className="bg-gradient-to-br from-gold to-gold-light p-5 rounded-2xl text-charcoal">
              <div className="text-3xl font-bold mb-1">{STATES.length}</div>
              <div className="text-sm text-charcoal/70">States Covered</div>
            </div>
          </div>

          {/* Benefits List */}
          <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-charcoal flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              Why Check Compatibility?
            </h3>
            {[
              { icon: Shield, text: "Ensure seamless bill credits", color: "text-forest" },
              { icon: Zap, text: "Instant activation after signup", color: "text-energy-blue" },
              { icon: Clock, text: "Real-time generation tracking", color: "text-gold" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm text-gray-600">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Expanding Notice */}
          <div className="bg-energy-blue/5 border border-energy-blue/20 rounded-xl p-4">
            <p className="text-sm text-energy-blue">
              <strong>Expanding Soon:</strong> We're adding 15+ new DISCOMs this quarter. 
              Not seeing yours? Sign up for notifications.
            </p>
          </div>
        </motion.div>

        {/* Right Side - Checker Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-forest to-forest-light p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold">Compatibility Checker</h3>
              </div>
              <p className="text-white/80 text-sm">
                Select your state and DISCOM to check availability
              </p>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5">
              {/* State Select */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Select Your State
                </label>
                <div className="relative">
                  <select
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full h-12 px-4 pr-10 rounded-xl border-2 border-gray-200 bg-gray-50 text-charcoal font-medium focus:outline-none focus:border-forest focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Choose a state...</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* DISCOM Select */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  Select Your DISCOM
                </label>
                <div className="relative">
                  <select
                    value={discom}
                    onChange={(e) => { setDiscom(e.target.value); setResult(null); }}
                    disabled={!state}
                    className="w-full h-12 px-4 pr-10 rounded-xl border-2 border-gray-200 bg-gray-50 text-charcoal font-medium focus:outline-none focus:border-forest focus:bg-white transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">{state ? "Choose your DISCOM..." : "Select a state first"}</option>
                    {discoms.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} {d.supported ? "✓" : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none" />
                </div>
                {state && (
                  <p className="text-xs text-gray-500 mt-2">
                    {discoms.filter(d => d.supported).length} of {discoms.length} DISCOMs supported in {state}
                  </p>
                )}
              </div>

              {/* Check Button */}
              <Button
                variant="primary"
                size="lg"
                className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-forest to-forest-light hover:from-forest-light hover:to-forest transition-all shadow-lg shadow-forest/20"
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
                    Check Availability
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {/* Result */}
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`p-5 rounded-2xl border-2 ${
                        result.compatible
                          ? "bg-green-50 border-green-200"
                          : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          result.compatible ? "bg-green-100" : "bg-amber-100"
                        }`}>
                          {result.compatible ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-amber-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${
                            result.compatible ? "text-green-800" : "text-amber-800"
                          }`}>
                            {result.compatible ? "Great News! You're Covered" : "Coming Soon"}
                          </h4>
                          <p className={`text-sm ${
                            result.compatible ? "text-green-700" : "text-amber-700"
                          }`}>
                            {result.compatible 
                              ? `${result.discomName} (${result.coverage}) is fully supported. Start saving on your electricity bills today!`
                              : `${result.discomName} is not yet available. We're expanding rapidly—get notified when it's live.`
                            }
                          </p>
                          {result.compatible && (
                            <Button
                              variant="primary"
                              size="sm"
                              className="mt-3 bg-green-600 hover:bg-green-700"
                            >
                              Get Started Now
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          )}
                          {!result.compatible && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-100"
                            >
                              Notify Me When Available
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Supported DISCOMs Footer */}
            <div className="bg-gray-50 p-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-charcoal">Popular Supported DISCOMs</p>
                <span className="text-xs text-gray-500">{SUPPORTED_COUNT}+ total</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["BSES Rajdhani", "Tata Power", "BESCOM", "TANGEDCO", "KSEB", "Adani Electricity"].map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1.5 bg-white border border-gray-200 text-charcoal text-xs font-medium rounded-full flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    {name}
                  </span>
                ))}
                <span className="px-3 py-1.5 bg-forest/5 text-forest text-xs font-medium rounded-full">
                  +{SUPPORTED_COUNT - 6} more
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

