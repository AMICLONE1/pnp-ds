"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  ArrowRight,
} from "lucide-react";

interface UtilityFormCardProps {
  state: string;
  setState: (value: string) => void;
  discom: string;
  setDiscom: (value: string) => void;
  consumerNumber: string;
  setConsumerNumber: (value: string) => void;
  availableDiscoms: string[];
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onSkip: () => void;
}

export function UtilityFormCard({
  state,
  setState,
  discom,
  setDiscom,
  consumerNumber,
  setConsumerNumber,
  availableDiscoms,
  loading,
  error,
  onSubmit,
  onSkip,
}: UtilityFormCardProps) {
  return (
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
          <form onSubmit={onSubmit} className="space-y-6">
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
                onClick={onSkip}
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
  );
}
