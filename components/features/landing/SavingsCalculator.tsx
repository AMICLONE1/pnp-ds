"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Zap, Calendar, IndianRupee } from "lucide-react";

interface SavingsCalculatorProps {
  defaultBill?: number;
  defaultSavingsPercent?: number;
}

export function SavingsCalculator({
  defaultBill = 2000,
  defaultSavingsPercent = 75,
}: SavingsCalculatorProps) {
  const [avgBill, setAvgBill] = useState(defaultBill.toString());
  const [savingsPercent, setSavingsPercent] = useState(defaultSavingsPercent.toString());

  const billAmount = parseFloat(avgBill) || 0;
  const savingsRate = parseFloat(savingsPercent) || 0;

  // Calculations (similar to SundayGrids)
  const monthlySavings = (billAmount * savingsRate) / 100;
  const reservedSolar = (monthlySavings / 6.05).toFixed(2); // Assuming ₹6.05 per kWh credit
  const energyProduced = (parseFloat(reservedSolar) * 120).toFixed(0); // ~120 kWh per kW per month
  const annualSavings = monthlySavings * 12;
  const yearsToCalculate = 12.3; // Average project term
  const totalSavings = annualSavings * yearsToCalculate;
  const oneTimeFee = parseFloat(reservedSolar) * 50000; // ₹50k per kW (example)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-heading">Forecast your savings</CardTitle>
        <CardDescription>
          Calculate how much you can save with PowerNetPro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Enter Average Bill */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Step 1: Enter average power bill (₹)
          </label>
          <Input
            type="number"
            value={avgBill}
            onChange={(e) => setAvgBill(e.target.value)}
            placeholder="2000"
            min="0"
            className="text-lg"
          />
        </div>

        {/* Step 2: Choose Savings Range */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Step 2: Choose savings range (%)
          </label>
          <div className="space-y-3">
            <Input
              type="number"
              value={savingsPercent}
              onChange={(e) => setSavingsPercent(e.target.value)}
              placeholder="75"
              min="0"
              max="100"
              className="text-lg"
            />
            <input
              type="range"
              min="50"
              max="100"
              value={savingsPercent}
              onChange={(e) => setSavingsPercent(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        {billAmount > 0 && (
          <div className="pt-6 border-t space-y-4">
            <h3 className="text-xl font-semibold text-black mb-4">Results</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-black" />
                  <span className="text-sm font-medium text-green-700">Monthly Savings</span>
                </div>
                <p className="text-2xl font-bold text-black">
                  {formatCurrency(monthlySavings)}
                </p>
              </div>

              <div className="p-4 bg-white/5 rounded-lg border border-gray-200/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-black" />
                  <span className="text-sm font-medium text-black">Reserved Solar</span>
                </div>
                <p className="text-2xl font-bold text-black">
                  {reservedSolar} kW
                </p>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Energy Produced/Mo</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {energyProduced} kWh
                </p>
              </div>

              <div className="p-4 bg-gold/10 rounded-lg border border-gold/20">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-gold" />
                  <span className="text-sm font-medium text-black">Annual Savings</span>
                </div>
                <p className="text-2xl font-bold text-gold">
                  {formatCurrency(annualSavings)}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-white/10 to-gold/10 rounded-lg border border-gray-200/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-black" />
                  <span className="text-sm font-medium text-black">
                    {yearsToCalculate} Yr Savings
                  </span>
                </div>
                <p className="text-2xl font-bold text-black">
                  {formatCurrency(totalSavings)}
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black">One-time Reservation Fee</span>
                <p className="text-xl font-bold text-black">
                  {formatCurrency(oneTimeFee)}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => {
                window.location.href = `/reserve?capacity=${Math.ceil(parseFloat(reservedSolar))}`;
              }}
            >
              Get Started for Free
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

