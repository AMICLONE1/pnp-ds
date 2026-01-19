"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STATES, DISCOMS_BY_STATE } from "@/lib/constants";
import { 
  CheckCircle, 
  MapPin, 
  Building2, 
  CreditCard, 
  Zap, 
  Shield, 
  TrendingDown,
  ArrowRight,
  Sparkles,
  Clock,
  Receipt
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default function ConnectPage() {
  const router = useRouter();
  const [state, setState] = useState("");
  const [discom, setDiscom] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [availableDiscoms, setAvailableDiscoms] = useState<string[]>([]);

  useEffect(() => {
    if (state && DISCOMS_BY_STATE[state]) {
      setAvailableDiscoms(DISCOMS_BY_STATE[state]);
      setDiscom(""); // Reset discom when state changes
    } else {
      setAvailableDiscoms([]);
    }
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!state || !discom || !consumerNumber) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Consumer number validation - enhanced with format checking
    const trimmedConsumerNumber = consumerNumber.trim();
    
    if (!trimmedConsumerNumber) {
      setError("Consumer number is required");
      setLoading(false);
      return;
    }

    if (trimmedConsumerNumber.length < 8) {
      setError("Consumer number must be at least 8 characters");
      setLoading(false);
      return;
    }

    if (trimmedConsumerNumber.length > 20) {
      setError("Consumer number must be less than 20 characters");
      setLoading(false);
      return;
    }

    // Validate format: should be alphanumeric (letters and numbers only)
    // Some DISCOMs allow special characters, but we'll validate basic format
    const consumerNumberRegex = /^[A-Za-z0-9\-_]+$/;
    if (!consumerNumberRegex.test(trimmedConsumerNumber)) {
      setError("Consumer number contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed.");
      setLoading(false);
      return;
    }

    // Check for common invalid patterns
    if (/^[^A-Za-z0-9]/.test(trimmedConsumerNumber) || /[^A-Za-z0-9]$/.test(trimmedConsumerNumber)) {
      setError("Consumer number cannot start or end with special characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/utility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          discom,
          utility_consumer_number: consumerNumber,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        // Show validation errors from API
        const errorMessage = result.error?.message || "Failed to connect utility";
        setError(errorMessage);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center container mx-auto px-4 pt-28 pb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Card className="max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-br from-energy-green to-green-500 p-8 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="h-12 w-12 text-black" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-heading font-bold text-black"
                >
                  Utility Connected!
                </motion.h2>
              </div>
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-black mb-4">
                    Your utility provider has been linked successfully. Credits will
                    now be applied to your bills automatically.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-black">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Redirecting to dashboard...
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-black text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              Quick Setup • Takes 2 minutes
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3 text-black">
              Connect Your <span className="text-black">Utility</span>
            </h1>
            <p className="text-black max-w-xl mx-auto">
              Link your electricity provider to start receiving solar credits on your bills automatically
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Benefits Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              <div className="bg-gradient-to-br from-white via-white to-white-light rounded-2xl p-6 text-black">
                <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" />
                  Why Connect?
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: TrendingDown, title: "Auto-apply Credits", desc: "Solar credits applied to your bills automatically" },
                    { icon: Receipt, title: "Track Bills", desc: "View all your electricity bills in one place" },
                    { icon: Clock, title: "Real-time Updates", desc: "Get notified when new bills arrive" },
                    { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and never shared" },
                  ].map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-white/10 shrink-0">
                        <benefit.icon className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{benefit.title}</h4>
                        <p className="text-black/70 text-xs">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-black text-sm">BBPS Certified</p>
                    <p className="text-xs text-gray-500">Authorized bill payment partner</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-3"
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/10">
                      <Building2 className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <CardTitle>Utility Information</CardTitle>
                      <CardDescription>
                        We&apos;ll use this to apply solar credits to your bills
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Progress Steps */}
                    <div className="flex items-center gap-2 mb-6">
                      {[
                        { num: 1, label: "State", active: true, complete: !!state },
                        { num: 2, label: "DISCOM", active: !!state, complete: !!discom },
                        { num: 3, label: "Consumer ID", active: !!discom, complete: !!consumerNumber },
                      ].map((step, index) => (
                        <div key={step.num} className="flex items-center flex-1">
                          <div className={`flex items-center gap-2 ${step.active ? 'opacity-100' : 'opacity-40'}`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                              step.complete ? 'bg-white text-white' : step.active ? 'bg-white text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {step.complete ? <CheckCircle className="h-4 w-4" /> : step.num}
                            </div>
                            <span className="text-xs font-medium text-black hidden sm:block">{step.label}</span>
                          </div>
                          {index < 2 && (
                            <div className={`flex-1 h-0.5 mx-2 rounded ${step.complete ? 'bg-white' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-5">
                      {/* State Field */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                          <MapPin className="h-4 w-4 text-black" />
                          State
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent transition-all hover:border-gray-200/50"
                          required
                          disabled={loading}
                        >
                          <option value="">Select your state</option>
                          {STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* DISCOM Field */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                          <Building2 className="h-4 w-4 text-black" />
                          DISCOM (Distribution Company)
                        </label>
                        <select
                          value={discom}
                          onChange={(e) => setDiscom(e.target.value)}
                          className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:border-gray-200/50"
                          required
                          disabled={loading || !state}
                        >
                          <option value="">
                            {state ? "Select your DISCOM" : "Select state first"}
                          </option>
                          {availableDiscoms.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        {!state && (
                          <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                            <ArrowRight className="h-3 w-3" />
                            Select your state to see available DISCOMs
                          </p>
                        )}
                      </div>

                      {/* Consumer Number Field */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                          <CreditCard className="h-4 w-4 text-black" />
                          Consumer Number
                        </label>
                        <Input
                          type="text"
                          placeholder="Enter your consumer number"
                          value={consumerNumber}
                          onChange={(e) => setConsumerNumber(e.target.value)}
                          required
                          disabled={loading}
                          className="h-12 rounded-xl"
                        />
                        <p className="text-xs text-gray-400 mt-1.5">
                          Found on your electricity bill (usually 10-12 digits)
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
                        >
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="flex-1 h-12 rounded-xl group"
                        isLoading={loading}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Connect Utility
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="h-12 rounded-xl"
                        onClick={() => router.push("/dashboard")}
                        disabled={loading}
                      >
                        Skip
                      </Button>
                    </div>

                    <p className="text-xs text-center text-gray-400">
                      By connecting, you agree to our data sharing policy for bill retrieval
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

