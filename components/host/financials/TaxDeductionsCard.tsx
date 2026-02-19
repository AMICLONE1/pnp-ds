"use client";

import { motion } from "framer-motion";
import { Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BILLING_HISTORY } from "./data";

export function TaxDeductionsCard() {
  const currentBill = BILLING_HISTORY[0];
  const totalTax = currentBill.cgst + currentBill.sgst;
  const grossAmount = currentBill.baseAmount + totalTax;
  const netAfterTds = grossAmount - currentBill.tds;

  const deductions = [
    { label: "CGST (9%)", amount: currentBill.cgst, type: "tax" as const },
    { label: "SGST (9%)", amount: currentBill.sgst, type: "tax" as const },
    { label: "TDS (2%)", amount: currentBill.tds, type: "deduction" as const },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.95 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Percent className="w-5 h-5 text-gold" />
            Tax & Deductions (Current Month)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Base amount */}
          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Base Amount (Generation × PPA Rate)</span>
            <span className="text-sm font-semibold text-black">
              ₹{currentBill.baseAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </span>
          </div>

          {/* Deduction bars */}
          <div className="space-y-4">
            {deductions.map((d) => {
              const barColor = d.type === "tax" ? "bg-forest" : "bg-red-400";
              const barWidth = d.type === "tax" ? "18%" : "4%";
              return (
                <div key={d.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{d.label}</span>
                    <span className={`text-sm font-semibold ${d.type === "deduction" ? "text-red-500" : "text-black"}`}>
                      {d.type === "deduction" ? "-" : "+"}₹
                      {d.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${barColor}`}
                      initial={{ width: 0 }}
                      animate={{ width: barWidth }}
                      transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Gross Amount (Base + GST)</span>
              <span className="text-sm font-medium text-black">
                ₹{grossAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Less: TDS Deducted</span>
              <span className="text-sm font-medium text-red-500">
                -₹{currentBill.tds.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-base font-bold text-black">Net Payable</span>
              <span className="text-xl font-bold text-forest">
                ₹{netAfterTds.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
