"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertCircle,
  MapPin,
  Zap,
  Building2,
  ChevronRight,
  Sparkles,
  Search,
  Shield,
  Clock,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DISCOM_DATA: Record<
  string,
  { name: string; supported: boolean; coverage: string }[]
> = {
  Delhi: [
    { name: "BSES Rajdhani", supported: true, coverage: "South & West Delhi" },
    { name: "BSES Yamuna", supported: true, coverage: "East & Central Delhi" },
    { name: "Tata Power Delhi", supported: true, coverage: "North Delhi" },
    { name: "NDMC", supported: false, coverage: "New Delhi Municipal Area" },
  ],
  Maharashtra: [
    { name: "Adani Electricity", supported: true, coverage: "Mumbai" },
    { name: "BEST", supported: true, coverage: "Mumbai Island City" },
    { name: "MSEDCL", supported: true, coverage: "Rest of Maharashtra" },
    { name: "Tata Power Mumbai", supported: true, coverage: "Mumbai Suburbs" },
  ],
  Karnataka: [
    { name: "BESCOM", supported: true, coverage: "Bangalore & Surrounding" },
    { name: "MESCOM", supported: true, coverage: "Mangalore Region" },
    { name: "HESCOM", supported: false, coverage: "Hubli Region" },
    { name: "GESCOM", supported: false, coverage: "Gulbarga Region" },
  ],
  "Tamil Nadu": [
    { name: "TANGEDCO", supported: true, coverage: "All Tamil Nadu" },
  ],
  Kerala: [{ name: "KSEB", supported: true, coverage: "All Kerala" }],
  Gujarat: [
    { name: "Torrent Power", supported: true, coverage: "Ahmedabad & Surat" },
    { name: "UGVCL", supported: true, coverage: "North Gujarat" },
    { name: "PGVCL", supported: false, coverage: "Saurashtra" },
    { name: "MGVCL", supported: false, coverage: "Central Gujarat" },
  ],
  Telangana: [
    { name: "TSSPDCL", supported: true, coverage: "South Telangana" },
    { name: "TSNPDCL", supported: false, coverage: "North Telangana" },
  ],
  Rajasthan: [
    { name: "JVVNL", supported: true, coverage: "Jaipur Zone" },
    { name: "AVVNL", supported: false, coverage: "Ajmer Zone" },
    { name: "JdVVNL", supported: false, coverage: "Jodhpur Zone" },
  ],
  "Uttar Pradesh": [
    { name: "UPPCL", supported: true, coverage: "Urban Areas" },
    { name: "PVVNL", supported: false, coverage: "Meerut Zone" },
    { name: "DVVNL", supported: false, coverage: "Agra Zone" },
  ],
  Punjab: [{ name: "PSPCL", supported: true, coverage: "All Punjab" }],
  Haryana: [
    { name: "UHBVN", supported: true, coverage: "North Haryana" },
    { name: "DHBVN", supported: false, coverage: "South Haryana" },
  ],
  "West Bengal": [
    { name: "CESC", supported: true, coverage: "Kolkata & Suburbs" },
    { name: "WBSEDCL", supported: false, coverage: "Rest of West Bengal" },
  ],
  Odisha: [
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
  .filter((d) => d.supported).length;

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
    await new Promise((resolve) => setTimeout(resolve, 600));
    const selected = discoms.find((d) => d.name === discom);
    if (selected) {
      setResult({
        compatible: selected.supported,
        discomName: selected.name,
        coverage: selected.coverage,
      });
    }
    setChecking(false);
  };

  return (
    <div className="relative">
      {/* Header */}
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 bg-forest/10 text-forest px-4 py-2 rounded-full text-sm font-semibold mb-4"
        >
          <Globe className="w-4 h-4" />
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
          className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Check if your electricity provider is supported in our network
        </motion.p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left — stats + info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-sm">
                <p
                  className="text-3xl font-bold text-black"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {SUPPORTED_COUNT}+
                </p>
                <p
                  className="text-sm text-gray-500 mt-1"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  DISCOMs Supported
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-forest to-forest-light p-5 shadow-sm">
                <p
                  className="text-3xl font-bold text-white"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {STATES.length}
                </p>
                <p
                  className="text-sm text-white/70 mt-1"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  States Covered
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 p-6 space-y-4 shadow-sm">
              <h3
                className="font-semibold text-black flex items-center gap-2"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <Sparkles className="w-5 h-5 text-gold" />
                Why Check Compatibility?
              </h3>
              {[
                {
                  icon: Shield,
                  text: "Ensure seamless bill credits",
                  color: "text-forest",
                  bg: "bg-forest/10",
                },
                {
                  icon: Zap,
                  text: "Instant activation after signup",
                  color: "text-gold",
                  bg: "bg-gold/10",
                },
                {
                  icon: Clock,
                  text: "Real-time generation tracking",
                  color: "text-forest",
                  bg: "bg-forest/10",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span
                    className="text-sm text-gray-700"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-gold/10 border border-gold/20 p-5">
              <p
                className="text-sm text-gray-700"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <strong className="text-black">Expanding Soon:</strong>{" "}
                We&apos;re adding 15+ new DISCOMs this quarter. Not seeing
                yours? Sign up for notifications.
              </p>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
              <div className="border-b border-gray-100 p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-forest/10 rounded-xl flex items-center justify-center">
                  <Search className="w-5 h-5 text-forest" />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold text-black"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Compatibility Checker
                  </h3>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Select your state and DISCOM to check availability
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* State */}
                <div>
                  <label
                    className="flex items-center gap-2 text-sm font-semibold text-black mb-2"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <MapPin className="w-4 h-4 text-forest" />
                    Select Your State
                  </label>
                  <div className="relative">
                    <select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setDiscom("");
                        setResult(null);
                      }}
                      className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 bg-white text-black font-medium focus:outline-none focus:border-forest focus:shadow-[0_0_0_3px_rgba(13,40,24,0.08)] transition-all appearance-none cursor-pointer hover:border-gray-300"
                    >
                      <option value="">Choose a state...</option>
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* DISCOM */}
                <div>
                  <label
                    className="flex items-center gap-2 text-sm font-semibold text-black mb-2"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <Building2 className="w-4 h-4 text-forest" />
                    Select Your DISCOM
                  </label>
                  <div className="relative">
                    <select
                      value={discom}
                      onChange={(e) => {
                        setDiscom(e.target.value);
                        setResult(null);
                      }}
                      disabled={!state}
                      className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-gray-200 bg-white text-black font-medium focus:outline-none focus:border-forest focus:shadow-[0_0_0_3px_rgba(13,40,24,0.08)] transition-all appearance-none cursor-pointer hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
                    >
                      <option value="">
                        {state ? "Choose your DISCOM..." : "Select a state first"}
                      </option>
                      {discoms.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                {/* Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full h-13 text-base font-semibold rounded-xl bg-gradient-to-r from-forest to-forest-light hover:from-forest-light hover:to-forest text-white transition-all shadow-md"
                  onClick={handleCheck}
                  disabled={checking || !discom || !state}
                >
                  {checking ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Check Availability
                      </span>
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Result */}
                <AnimatePresence mode="wait">
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    >
                      <div
                        className={`p-5 rounded-2xl border-2 ${
                          result.compatible
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-amber-50 border-amber-200"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                              result.compatible ? "bg-emerald-100" : "bg-amber-100"
                            }`}
                          >
                            {result.compatible ? (
                              <CheckCircle className="w-6 h-6 text-emerald-600" />
                            ) : (
                              <AlertCircle className="w-6 h-6 text-amber-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`font-semibold mb-1 ${
                                result.compatible
                                  ? "text-emerald-800"
                                  : "text-amber-800"
                              }`}
                              style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                              {result.compatible
                                ? "Great News! You're Covered"
                                : "Coming Soon"}
                            </h4>
                            <p
                              className={`text-sm ${
                                result.compatible
                                  ? "text-emerald-700"
                                  : "text-amber-700"
                              }`}
                              style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                              {result.compatible
                                ? `${result.discomName} (${result.coverage}) is fully supported. Start saving on your electricity bills today!`
                                : `${result.discomName} is not yet available. We're expanding rapidly — get notified when it's live.`}
                            </p>
                            <div className="mt-3">
                              {result.compatible ? (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  className="bg-forest hover:bg-forest-light text-white font-semibold"
                                >
                                  Get Started Now
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-amber-300 text-amber-700 hover:bg-amber-100 font-semibold"
                                >
                                  Notify Me When Available
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer chips */}
              <div className="bg-gray-50 p-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p
                    className="text-sm font-semibold text-black"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Popular Supported DISCOMs
                  </p>
                  <span
                    className="text-xs font-medium text-gray-500"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {SUPPORTED_COUNT}+ total
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "BSES Rajdhani",
                    "Tata Power",
                    "BESCOM",
                    "TANGEDCO",
                    "KSEB",
                    "Adani",
                  ].map((name) => (
                    <span
                      key={name}
                      className="px-3 py-1.5 bg-white border border-gray-200 text-black text-xs font-medium rounded-full flex items-center gap-1.5"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                      {name}
                    </span>
                  ))}
                  <span
                    className="px-3 py-1.5 bg-forest/10 text-forest text-xs font-medium rounded-full border border-forest/20"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    +{SUPPORTED_COUNT - 6} more
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
