"use client";

export const dynamic = "force-dynamic";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { calculateSolarSavings, calculateSetupCost, calculateCapacityForSavings, formatINR, SOLAR_CONSTANTS } from "@/lib/solar-constants";
import { calculateAllocationPrice } from "@/lib/pricing";
import { STATES, DISCOMS_BY_STATE } from "@/lib/constants";
import { type Project } from "@/components/reserve/ProjectCard";
import {
  Sun,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Shield,
  Zap,
  TrendingDown,
  MapPin,
  Building2,
  CreditCard,
  FileCheck,
  Leaf,
  IndianRupee,
  Eye,
  EyeOff,
  ChevronDown,
  Sparkles,
  Check,
  Loader2,
  TrendingUp,
} from "lucide-react";

import { launchCashfreeCheckout, loadCashfreeSdk } from "@/lib/payments/cashfreeClient";

// ─── Types ───────────────────────────────────────────────────
interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  state: string;
  discom: string;
  consumerNumber: string;
  selectedProject: Project | null;
  capacity: number;
  avgBill: number;
  savingsPercent: number;
  kycType: "pan" | "aadhaar";
  kycNumber: string;
}

const STEPS = [
  { id: 1, label: "Account", icon: User, description: "Create your account" },
  { id: 2, label: "Utility", icon: Building2, description: "Connect your DISCOM" },
  { id: 3, label: "Solar Plan", icon: Sun, description: "Choose your plan" },
  { id: 4, label: "Verify", icon: FileCheck, description: "KYC verification" },
  { id: 5, label: "Reserve", icon: CreditCard, description: "Pay & activate" },
];

// ─── Step Progress Bar ───────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Desktop */}
      <div className="hidden sm:block">
        {/* Step title */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-1">
            Step {currentStep} of {STEPS.length}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {STEPS[currentStep - 1].description}
          </h1>
        </motion.div>

        <div className="relative flex items-center justify-between px-2">
          {/* Track background */}
          <div className="absolute top-6 left-[40px] right-[40px] h-[3px] bg-gray-100 rounded-full" />
          {/* Animated progress fill */}
          <motion.div
            className="absolute top-6 left-[40px] h-[3px] rounded-full"
            style={{
              background: "linear-gradient(90deg, #F5A623, #f59e0b, #F5A623)",
              maxWidth: "calc(100% - 80px)",
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />

          {STEPS.map((step) => {
            const done = currentStep > step.id;
            const active = currentStep === step.id;
            const upcoming = currentStep < step.id;

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center" style={{ minWidth: 80 }}>
                {/* Circle */}
                <motion.div
                  layout
                  className="relative"
                  animate={{ scale: active ? 1 : 1 }}
                >
                  {/* Pulse ring for active step */}
                  {active && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-gold"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  )}

                  <motion.div
                    animate={{
                      scale: active ? 1.1 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      done
                        ? "bg-gradient-to-br from-gold to-amber-500 shadow-lg shadow-gold/30"
                        : active
                        ? "bg-gradient-to-br from-gold to-amber-400 shadow-xl shadow-gold/40 ring-4 ring-gold/15"
                        : "bg-white border-2 border-gray-200 shadow-sm"
                    }`}
                  >
                    {done ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <step.icon
                        className={`w-5 h-5 transition-colors duration-300 ${
                          active ? "text-white" : "text-gray-300"
                        }`}
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Label */}
                <motion.span
                  animate={{ color: done ? "#F5A623" : active ? "#1a1a1a" : "#9ca3af" }}
                  className={`mt-3 text-xs font-semibold whitespace-nowrap tracking-wide`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {step.label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4"
        >
          <h1 className="text-xl font-bold text-charcoal" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {STEPS[currentStep - 1].description}
          </h1>
        </motion.div>

        <div className="flex items-center gap-2 mb-1">
          {STEPS.map((step) => {
            const done = currentStep > step.id;
            const active = currentStep === step.id;
            return (
              <div key={step.id} className="flex-1">
                <motion.div
                  className={`h-1.5 rounded-full transition-colors duration-300 ${
                    done
                      ? "bg-gold"
                      : active
                      ? "bg-gradient-to-r from-gold to-amber-300"
                      : "bg-gray-100"
                  }`}
                  layoutId={`mobile-step-${step.id}`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between">
          <span className="text-[10px] font-medium text-gray-400">
            Step {currentStep}/{STEPS.length}
          </span>
          <span className="text-[10px] font-semibold text-charcoal">
            {STEPS[currentStep - 1].label}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Account ─────────────────────────────────────────
function Step1Account({
  data,
  onChange,
  onNext,
  error,
  loading,
}: {
  data: SignupData;
  onChange: (d: Partial<SignupData>) => void;
  onNext: () => void;
  error: string;
  loading: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const strength = useMemo(() => {
    const p = data.password;
    if (!p) return { level: 0, text: "", color: "" };
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    if (s <= 2) return { level: s, text: "Weak", color: "bg-red-500 text-red-600" };
    if (s <= 3) return { level: s, text: "Fair", color: "bg-amber-500 text-amber-600" };
    return { level: s, text: "Strong", color: "bg-emerald-500 text-emerald-600" };
  }, [data.password]);

  const canProceed =
    data.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    /^[6-9]\d{9}$/.test(data.phone) &&
    data.password.length >= 6 &&
    data.password === confirmPassword;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-gold/20 to-amber-100 mb-3"
        >
          <Sun className="h-7 w-7 text-gold" />
        </motion.div>
        <p className="text-gray-500 text-sm">Start your solar savings journey</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canProceed) onNext();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Enter your full name"
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="h-12 pl-10 rounded-xl border-gray-200 focus:border-gold focus:ring-gold/30"
              autoFocus
              autoComplete="name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              placeholder="you@example.com"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="h-12 pl-10 rounded-xl border-gray-200 focus:border-gold focus:ring-gold/30"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              className="h-12 pl-10 rounded-xl border-gray-200 focus:border-gold focus:ring-gold/30"
              autoComplete="tel"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Min 6 characters"
              value={data.password}
              onChange={(e) => onChange({ password: e.target.value })}
              className="h-12 pl-10 pr-10 rounded-xl border-gray-200 focus:border-gold focus:ring-gold/30"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {data.password && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= strength.level ? strength.color.split(" ")[0] : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-[11px] font-semibold ${strength.color.split(" ")[1]}`}>
                {strength.text}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 pl-10 rounded-xl border-gray-200 focus:border-gold focus:ring-gold/30"
              autoComplete="new-password"
            />
            {confirmPassword && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {data.password === confirmPassword ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            )}
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        <Button
          type="submit"
          disabled={!canProceed || loading}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-gold to-amber-400 hover:from-amber-400 hover:to-gold text-black font-semibold shadow-lg shadow-gold/20 disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        <p className="text-xs text-center text-gray-400">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-gray-600 hover:underline">Terms</Link> and{" "}
          <Link href="/privacy" className="text-gray-600 hover:underline">Privacy Policy</Link>
        </p>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-black font-semibold hover:underline">Sign in</Link>
        </p>
        <div className="text-center">
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gold-dark"
          >
            Not ready? Join the waitlist instead
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Step 2: DISCOM ──────────────────────────────────────────
function Step2Utility({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: SignupData;
  onChange: (d: Partial<SignupData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const discoms = data.state ? DISCOMS_BY_STATE[data.state] || [] : [];
  const canProceed = data.state && data.discom;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-50 mb-3"
        >
          <Building2 className="h-7 w-7 text-blue-600" />
        </motion.div>
        <p className="text-gray-500 text-sm">
          Tell us your electricity provider so we can apply credits to your bill
        </p>
      </div>

      <div className="space-y-4">
        {/* State selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={data.state}
              onChange={(e) => onChange({ state: e.target.value, discom: "" })}
              className="w-full h-12 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold"
            >
              <option value="">Select your state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* DISCOM selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Distribution Company (DISCOM)
          </label>
          <div className="relative">
            <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={data.discom}
              onChange={(e) => onChange({ discom: e.target.value })}
              disabled={!data.state}
              className="w-full h-12 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Select your DISCOM</option>
              {discoms.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Consumer number (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Consumer Number <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <Input
            type="text"
            placeholder="Enter your consumer number"
            value={data.consumerNumber}
            onChange={(e) => onChange({ consumerNumber: e.target.value })}
            className="h-12 rounded-xl border-gray-200 focus:border-gold focus:ring-gold/30"
          />
          <p className="text-xs text-gray-400 mt-1">Find this on your electricity bill</p>
        </div>

        {/* Info card */}
        <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Why do we need this?</p>
              <p className="text-xs text-blue-700 mt-1">
                Your DISCOM information helps us apply solar credits directly to your electricity bill. We never access your account.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="h-12 px-6 rounded-xl border-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-gold to-amber-400 hover:from-amber-400 hover:to-gold text-black font-semibold shadow-lg shadow-gold/20 disabled:opacity-50 disabled:shadow-none"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <button
        onClick={onNext}
        className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 text-center"
      >
        Skip for now
      </button>
    </motion.div>
  );
}

// ─── Step 3: Project + Calculator ────────────────────────────
function Step3SolarPlan({
  data,
  onChange,
  onNext,
  onBack,
  projects,
  loadingProjects,
}: {
  data: SignupData;
  onChange: (d: Partial<SignupData>) => void;
  onNext: () => void;
  onBack: () => void;
  projects: Project[];
  loadingProjects: boolean;
}) {
  const [billInput, setBillInput] = useState(String(data.avgBill));
  const [isBillFocused, setIsBillFocused] = useState(false);

  // Calculations — identical formulas to the home page CalculatorSection.
  // Capacity is fractional (e.g. 2.334 kW) — virtual booking, no rounding.
  const monthlySavings = (data.avgBill * data.savingsPercent) / 100;
  const energyNeededKwhPerMonth = monthlySavings / SOLAR_CONSTANTS.creditRatePerUnit;
  const monthlyGenPerKw = SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth;
  const reservedKw = energyNeededKwhPerMonth / monthlyGenPerKw;
  const reservedWatts = Math.round(reservedKw * 1000);
  const energyProduced = reservedKw * SOLAR_CONSTANTS.avgGenerationPerKwPerDay * SOLAR_CONSTANTS.daysPerMonth;
  const annualSavings = monthlySavings * 12;
  const fifteenYearSavings = annualSavings * 15;
  const setupCost = calculateSetupCost(reservedKw);

  // Sync capacity back to data for payment step (round to 3 decimals for stable comparisons)
  useEffect(() => {
    const rounded = Math.round(reservedKw * 1000) / 1000;
    if (rounded !== data.capacity && rounded > 0) {
      onChange({ capacity: rounded });
    }
  }, [reservedKw]);

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="w-full max-w-5xl mx-auto"
    >
      {/* Project selector — only if multiple projects */}
      {loadingProjects ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gold" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-8 mb-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Sun className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No projects available right now</p>
        </div>
      ) : (
        <>
          {/* Project cards — horizontal scroll if multiple */}
          {projects.length > 1 && (
            <div className="mb-6">
              <label className="text-sm font-semibold text-gray-600 mb-3 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Select a Project
              </label>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {projects.map((project) => {
                  const selected = data.selectedProject?.id === project.id;
                  return (
                    <motion.button
                      key={project.id}
                      type="button"
                      onClick={() => onChange({ selectedProject: project })}
                      whileTap={{ scale: 0.97 }}
                      className={`flex-shrink-0 w-64 text-left rounded-xl border-2 p-4 transition-all ${
                        selected
                          ? "border-gold bg-gold/5 shadow-md shadow-gold/10"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                          <Sun className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm text-black truncate">{project.name}</h3>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <MapPin className="w-2.5 h-2.5" />
                            {project.location}
                          </div>
                        </div>
                        {selected && <CheckCircle className="w-5 h-5 text-gold shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="text-gold font-semibold">{project.available_capacity_kw} kW</span>
                        <span>₹{project.rate_per_kwh || SOLAR_CONSTANTS.creditRatePerUnit}/kWh</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Calculator card */}
          <div className="relative bg-white rounded-2xl border-2 border-gray-200 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Project header bar */}
            {data.selectedProject && (
              <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border-b border-gray-200 px-5 sm:px-7 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <Sun className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-black font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {data.selectedProject.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-gold font-semibold">{data.selectedProject.available_capacity_kw} kW Capacity</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{data.selectedProject.location}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm font-semibold text-charcoal" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  1 unit of energy generated = ₹{data.selectedProject.rate_per_kwh || SOLAR_CONSTANTS.creditRatePerUnit} discount on your power bill
                </p>
              </div>
            )}

            {/* Main 2-column layout */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 p-5 sm:p-7">
              {/* LEFT: Bill input + Savings slider */}
              <div className="space-y-6">
                {/* Bill input */}
                <div>
                  <label className="text-xs sm:text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    <IndianRupee className="w-4 h-4 text-gold" />
                    Monthly Electricity Bill
                  </label>
                  <div className={`relative flex items-center rounded-xl border-2 transition-all duration-300 overflow-hidden ${
                    isBillFocused
                      ? "border-gold bg-gold/5 shadow-[0_0_0_4px_rgba(255,184,0,0.1)]"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}>
                    <div className="pl-4 pr-1 py-3 flex items-center">
                      <span className="text-gold font-bold text-xl">₹</span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={billInput}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || v === "0") {
                          setBillInput(v);
                          onChange({ avgBill: 0 });
                        } else if (/^\d+$/.test(v)) {
                          const n = parseInt(v, 10);
                          if (n >= 0 && n <= 100000) {
                            setBillInput(v);
                            onChange({ avgBill: n });
                          }
                        }
                      }}
                      onFocus={() => {
                        setIsBillFocused(true);
                        if (billInput === "2500" || billInput === "0") setBillInput("");
                      }}
                      onBlur={() => {
                        setIsBillFocused(false);
                        if (!billInput || billInput === "0") {
                          setBillInput("2500");
                          onChange({ avgBill: 2500 });
                        }
                      }}
                      placeholder="2500"
                      className="flex-1 bg-transparent text-black font-bold text-2xl py-3 outline-none min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    />
                    <span className="pr-4 text-gray-400 text-xs font-medium">/month</span>
                  </div>
                </div>

                {/* Savings slider */}
                <div>
                  <label className="text-xs sm:text-sm text-gray-600 font-semibold mb-2 flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Choose Savings Range
                    <span className="text-black font-bold">({data.savingsPercent}%)</span>
                  </label>
                  <div className="relative pt-1 pb-2">
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-visible">
                      <motion.div
                        className="h-full bg-gold rounded-full"
                        animate={{ width: `${((data.savingsPercent - 10) / 90) * 100}%` }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="5"
                      value={data.savingsPercent}
                      onChange={(e) => onChange({ savingsPercent: Number(e.target.value) })}
                      className="absolute top-0 w-full h-5 bg-transparent appearance-none cursor-pointer z-10
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                        [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:border-[3px]
                        [&::-webkit-slider-thumb]:border-gold [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                        [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform
                        [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                        [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gold [&::-moz-range-thumb]:border-[3px]
                        [&::-moz-range-thumb]:border-gold [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
                      style={{ background: "transparent", height: "12px", margin: 0, padding: 0 }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>10%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Feature badges — desktop only */}
                <div className="hidden lg:flex gap-3 mt-2">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex-1">
                    <IndianRupee className="w-4 h-4 text-gold shrink-0" />
                    <div>
                      <p className="text-black font-semibold text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>Lower Bills</p>
                      <p className="text-gray-500 text-[9px]">Save up to 100%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-50 border border-green-200 flex-1">
                    <Leaf className="w-4 h-4 text-green-600 shrink-0" />
                    <div>
                      <p className="text-black font-semibold text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>Eco-Friendly</p>
                      <p className="text-gray-500 text-[9px]">Clean energy</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex-1">
                    <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-black font-semibold text-xs" style={{ fontFamily: "'Montserrat', sans-serif" }}>Real-time</p>
                      <p className="text-gray-500 text-[9px]">Track live</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Results panel */}
              <div className="space-y-3">
                {/* Monthly savings highlight */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-gold/10 via-amber-50/50 to-gold/5 border-2 border-gold/30 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-gold" />
                    <span className="text-gray-700 text-xs font-semibold uppercase tracking-wide" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Your monthly savings
                    </span>
                  </div>
                  <motion.span
                    key={Math.round(monthlySavings)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="block text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {fmt(monthlySavings)}
                  </motion.span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-[10px] font-medium uppercase tracking-wide">Reserved Solar</p>
                    <p className="text-black font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {reservedWatts} W
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-[10px] font-medium uppercase tracking-wide">Energy /Month</p>
                    <p className="text-black font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {energyProduced.toFixed(1)} kWh
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-[10px] font-medium uppercase tracking-wide">Annual Savings</p>
                    <p className="text-black font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {fmt(annualSavings)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <p className="text-gray-500 text-[10px] font-medium uppercase tracking-wide">15 Year Savings</p>
                    <p className="text-black font-bold text-lg" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {fmt(fifteenYearSavings)}
                    </p>
                  </div>
                </div>

                {/* Reservation fee */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-gold/10 to-amber-50 border-2 border-gold/30">
                  <div className="flex items-center justify-between">
                    <p className="text-black font-bold text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      One-time Reservation Fee
                    </p>
                    <motion.p
                      key={setupCost}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-gold font-bold text-xl"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {fmt(setupCost)}
                    </motion.p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile feature badges */}
            <div className="flex lg:hidden gap-2 p-4 pt-0">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200 flex-1">
                <IndianRupee className="w-4 h-4 text-gold shrink-0" />
                <p className="text-black font-semibold text-[10px]">Lower Bills</p>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-green-50 border border-green-200 flex-1">
                <Leaf className="w-4 h-4 text-green-600 shrink-0" />
                <p className="text-black font-semibold text-[10px]">Eco-Friendly</p>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-blue-50 border border-blue-200 flex-1">
                <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-black font-semibold text-[10px]">Real-time</p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex gap-3 mt-8">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="h-12 px-6 rounded-xl border-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!data.selectedProject}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-gold to-amber-400 hover:from-amber-400 hover:to-gold text-black font-semibold shadow-lg shadow-gold/20 disabled:opacity-50"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Step 4: KYC ─────────────────────────────────────────────
function Step4KYC({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: SignupData;
  onChange: (d: Partial<SignupData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const aadhaarRegex = /^\d{12}$/;

  const isValid =
    data.kycType === "pan"
      ? panRegex.test(data.kycNumber.toUpperCase())
      : aadhaarRegex.test(data.kycNumber.replace(/\s/g, ""));

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-50 mb-3"
        >
          <FileCheck className="h-7 w-7 text-emerald-600" />
        </motion.div>
        <p className="text-gray-500 text-sm">
          Quick KYC verification to comply with regulatory requirements
        </p>
      </div>

      <div className="space-y-5">
        {/* Document type toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
          <div className="grid grid-cols-2 gap-3">
            {(["pan", "aadhaar"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ kycType: type, kycNumber: "" })}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  data.kycType === type
                    ? "border-gold bg-gold/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {data.kycType === type && (
                  <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-gold" />
                )}
                <p className="font-semibold text-sm text-black">
                  {type === "pan" ? "PAN Card" : "Aadhaar Card"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {type === "pan" ? "Permanent Account Number" : "12-digit Unique ID"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Number input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {data.kycType === "pan" ? "PAN Number" : "Aadhaar Number"}
          </label>
          <Input
            type="text"
            placeholder={data.kycType === "pan" ? "ABCDE1234F" : "1234 5678 9012"}
            value={data.kycNumber}
            onChange={(e) => {
              let val = e.target.value;
              if (data.kycType === "pan") val = val.toUpperCase().slice(0, 10);
              if (data.kycType === "aadhaar") val = val.replace(/[^0-9\s]/g, "").slice(0, 14);
              onChange({ kycNumber: val });
            }}
            className="h-12 rounded-xl border-gray-200 focus:border-gold focus:ring-gold/30 font-mono tracking-wider text-lg"
          />
          {data.kycNumber && (
            <p className={`text-xs mt-1.5 ${isValid ? "text-emerald-600" : "text-gray-400"}`}>
              {isValid ? (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Valid {data.kycType === "pan" ? "PAN" : "Aadhaar"} format
                </span>
              ) : (
                `Enter a valid ${data.kycType === "pan" ? "PAN (e.g. ABCDE1234F)" : "12-digit Aadhaar number"}`
              )}
            </p>
          )}
        </div>

        {/* Trust indicators */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 space-y-2">
          {[
            "Your data is encrypted and stored securely",
            "Used only for regulatory compliance",
            "DigiLocker integration coming soon",
          ].map((text) => (
            <div key={text} className="flex items-center gap-2 text-xs text-emerald-800">
              <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="h-12 px-6 rounded-xl border-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-gold to-amber-400 hover:from-amber-400 hover:to-gold text-black font-semibold shadow-lg shadow-gold/20 disabled:opacity-50"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <button
        onClick={onNext}
        className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600 text-center"
      >
        Skip for now &mdash; verify later
      </button>
    </motion.div>
  );
}

// ─── Step 5: Payment ─────────────────────────────────────────
function Step5Payment({
  data,
  onBack,
  onPay,
  loading,
  error,
}: {
  data: SignupData;
  onBack: () => void;
  onPay: () => void;
  loading: boolean;
  error: string;
}) {
  const savings = calculateSolarSavings(data.capacity);
  const baseCost = data.capacity * SOLAR_CONSTANTS.baseCostPerKw;
  // Single source of truth — same helper the server uses to charge.
  const price = calculateAllocationPrice(data.capacity);
  const bulkDiscount = baseCost - price.subtotal;
  const platformFee = price.platformFee;
  const gstAmount = price.gst;
  const totalPayable = price.total;

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-gold/20 to-amber-100 mb-3"
        >
          <CreditCard className="h-7 w-7 text-gold" />
        </motion.div>
        <p className="text-gray-500 text-sm">Complete payment to activate your solar plan</p>
      </div>

      {/* Order summary card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg shadow-black/5">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D2818] to-[#1a4a2e] p-5 text-white">
          <p className="text-white/50 text-[10px] font-semibold uppercase tracking-[0.15em]">Order Summary</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Sun className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="font-bold text-base">{data.selectedProject?.name}</p>
                <p className="text-white/50 text-xs mt-0.5">{data.capacity.toFixed(2)} kW capacity • {data.selectedProject?.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="p-5 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Base cost ({data.capacity.toFixed(2)} kW × ₹{SOLAR_CONSTANTS.baseCostPerKw.toLocaleString("en-IN")}/kW)</span>
            <span className="text-gray-700">{fmt(baseCost)}</span>
          </div>

          {bulkDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Bulk discount
              </span>
              <span className="text-emerald-600 font-medium">-{fmt(bulkDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Platform fee</span>
            <span className="text-gray-700">{fmt(platformFee)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">GST (18%)</span>
            <span className="text-gray-700">{fmt(gstAmount)}</span>
          </div>

          <div className="border-t-2 border-dashed border-gray-200 pt-3 mt-3 flex justify-between items-center">
            <span className="text-black font-bold text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>Total Payable</span>
            <motion.span
              key={totalPayable}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-bold text-charcoal"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {fmt(totalPayable)}
            </motion.span>
          </div>
        </div>

        {/* What you get */}
        <div className="border-t border-gray-100 p-5 bg-gray-50/50">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-3">
            What you get
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: Zap, text: `${data.capacity.toFixed(2)} kW reserved`, color: "text-gold", bg: "bg-gold/10" },
              { icon: TrendingDown, text: `~${fmt(savings.monthlySavings)}/mo savings`, color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: Shield, text: "75% generation guarantee", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Leaf, text: `${savings.co2OffsetTonnes}T CO₂ offset/yr`, color: "text-green-600", bg: "bg-green-50" },
            ].map((item) => (
              <div key={item.text} className={`flex items-center gap-2 p-2.5 rounded-lg ${item.bg}`}>
                <item.icon className={`w-4 h-4 ${item.color} shrink-0`} />
                <span className="text-xs text-gray-700 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          Your account will be created and activated only after successful payment. All amounts include applicable taxes.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </motion.div>
      )}

      <div className="flex gap-3 mt-6">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="h-12 px-6 rounded-xl border-gray-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onPay}
          disabled={loading}
          className="flex-1 h-14 rounded-xl bg-gradient-to-r from-gold to-amber-400 hover:from-amber-400 hover:to-gold text-black font-bold text-base shadow-xl shadow-gold/25 disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </span>
          ) : (
            <>
              <IndianRupee className="w-5 h-5 mr-1" />
              Pay {fmt(totalPayable)}
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          SSL Encrypted
        </span>
        <span className="flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          Cashfree Secured
        </span>
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3" />
          PCI Compliant
        </span>
      </div>
    </motion.div>
  );
}

// ─── Success Screen ──────────────────────────────────────────
function SuccessScreen({ data }: { data: SignupData }) {
  const savings = calculateSolarSavings(data.capacity);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
        className="inline-flex p-5 rounded-full bg-gradient-to-br from-emerald-100 to-green-50 mb-6"
      >
        <CheckCircle className="h-12 w-12 text-emerald-600" />
      </motion.div>

      <h2 className="text-3xl font-bold text-black mb-2">Welcome to PowerNetPro!</h2>
      <p className="text-gray-500 mb-8">
        Your {data.capacity} kW solar capacity is reserved and ready to go.
      </p>

      <div className="bg-gradient-to-br from-[#0D2818] to-[#1a4a2e] rounded-2xl p-6 text-white text-left mb-8">
        <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-4">
          Your Solar Plan
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">Project</span>
            <span className="font-medium">{data.selectedProject?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Capacity</span>
            <span className="font-medium">{data.capacity} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">Monthly savings</span>
            <span className="font-medium text-gold">{formatINR(savings.monthlySavings)}</span>
          </div>
        </div>
      </div>

      <Link href="/dashboard">
        <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-gold to-amber-400 text-black font-semibold shadow-lg shadow-gold/20">
          <Sparkles className="w-4 h-4 mr-2" />
          Go to Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </Link>
    </motion.div>
  );
}

// ─── Main Signup Flow ────────────────────────────────────────
function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [completed, setCompleted] = useState(false);

  const [data, setData] = useState<SignupData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    state: "",
    discom: "",
    consumerNumber: "",
    selectedProject: null,
    capacity: 3,
    avgBill: 2500,
    savingsPercent: 75,
    kycType: "pan",
    kycNumber: "",
  });

  const update = useCallback(
    (partial: Partial<SignupData>) => setData((prev) => ({ ...prev, ...partial })),
    []
  );

  // Pre-load Cashfree SDK
  useEffect(() => {
    loadCashfreeSdk();
  }, []);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        const result = await res.json();
        if (result.success && result.data.length > 0) {
          setProjects(result.data);
          setData((prev) => ({ ...prev, selectedProject: prev.selectedProject || result.data[0] }));
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // Step 1 → just validate (don't create account yet — defer to payment)
  const handleAccountValidate = async () => {
    setLoading(true);
    setError("");
    try {
      // Basic validation only — account creation happens after payment
      const email = data.email.trim().toLowerCase();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error("Please enter a valid email address");
      }
      if (data.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }
      if (data.name.trim().length < 2) {
        throw new Error("Please enter your full name");
      }
      if (!/^[6-9]\d{9}$/.test(data.phone)) {
        throw new Error("Please enter a valid 10-digit Indian mobile number");
      }
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 → just store DISCOM locally (save to DB after registration)
  const handleDiscomSave = () => {
    setStep(3);
  };

  // Step 5 → Init signup (server-side), open Cashfree Drop-in, then complete after pay.
  // No auth user is created until the server has VERIFIED the order with Cashfree
  // in /api/signup/complete. Dismissing checkout leaves only the pending_signups
  // row, which auto-expires.
  const handlePayment = async () => {
    if (!data.selectedProject) return;
    setLoading(true);
    setError("");

    const finishLogin = async () => {
      try {
        const loginRes = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email.trim().toLowerCase(),
            password: data.password,
          }),
        });
        if (!loginRes.ok) throw new Error("login failed");
        router.push("/dashboard");
        router.refresh();
      } catch {
        setError("Account created but auto-login failed. Please log in manually.");
        setLoading(false);
      }
    };

    try {
      const initRes = await fetch("/api/signup/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(),
          password: data.password,
          name: data.name.trim(),
          phone: data.phone,
          state: data.state || null,
          discom: data.discom || null,
          consumer_number: data.consumerNumber || null,
          kyc_type: data.kycNumber ? data.kycType : null,
          kyc_number: data.kycNumber || null,
          project_id: data.selectedProject.id,
          capacity_kw: data.capacity,
        }),
      });
      const initResult = await initRes.json();
      if (!initRes.ok || !initResult.success) {
        throw new Error(initResult.error || "Could not start signup");
      }
      const order = initResult.data;

      const result = await launchCashfreeCheckout({
        paymentSessionId: order.payment_session_id,
        mode: order.mode,
      });

      if (result.status === "failed") {
        setError(result.error || "Payment failed");
        setLoading(false);
        return;
      }

      if (result.status === "dismissed") {
        setError("Payment cancelled. Your account has not been created.");
        setLoading(false);
        return;
      }

      const completeRes = await fetch("/api/signup/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: order.order_id, password: data.password }),
      });
      const completeResult = await completeRes.json();
      if (!completeRes.ok || !completeResult.success) {
        setError(completeResult.error || "Payment verification failed. Contact support.");
        setLoading(false);
        return;
      }
      await finishLogin();
    } catch (err: any) {
      setError(err.message || "Payment failed");
      setLoading(false);
    }
  };

  // Step 4 → just store KYC locally (save to DB after registration)
  const handleKYCSave = () => {
    setStep(5);
  };

  if (completed) {
    return (
      <div className="min-h-screen flex flex-col">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-white via-offwhite to-gold/5 pt-28 pb-16 px-4">
          <SuccessScreen data={data} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-[#fafaf8] to-gold/[0.03]">
      <LandingHeader />
      <main className="flex-1 pt-36 sm:pt-40 pb-16 px-4 relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-3xl" />
          <div className="absolute -bottom-60 -left-40 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Step indicator */}
          <div className="mb-12">
            <StepIndicator currentStep={step} />
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1Account
                key="step1"
                data={data}
                onChange={update}
                onNext={handleAccountValidate}
                error={error}
                loading={loading}
              />
            )}
            {step === 2 && (
              <Step2Utility
                key="step2"
                data={data}
                onChange={update}
                onNext={handleDiscomSave}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3SolarPlan
                key="step3"
                data={data}
                onChange={update}
                onNext={() => setStep(4)}
                onBack={() => setStep(2)}
                projects={projects}
                loadingProjects={loadingProjects}
              />
            )}
            {step === 4 && (
              <Step4KYC
                key="step4"
                data={data}
                onChange={update}
                onNext={handleKYCSave}
                onBack={() => setStep(3)}
              />
            )}
            {step === 5 && (
              <Step5Payment
                key="step5"
                data={data}
                onBack={() => setStep(4)}
                onPay={handlePayment}
                loading={loading}
                error={error}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <LandingHeader />
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
          </main>
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
