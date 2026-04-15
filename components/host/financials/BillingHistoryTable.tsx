"use client";

import { motion } from "framer-motion";
import { FileText, Download, ArrowDownToLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { BILLING_HISTORY } from "./data";

export function BillingHistoryTable() {
  // Calculate tax and other amounts from BILLING_HISTORY
  const bills = BILLING_HISTORY.map((bill) => {
    const baseAmount = bill.generation * bill.rate;
    const cgst = baseAmount * 0.09;
    const sgst = baseAmount * 0.09;
    const tds = baseAmount * 0.02;
    const netPayable = baseAmount + cgst + sgst - tds + bill.adjustments;

    return {
      ...bill,
      baseAmount,
      cgst,
      sgst,
      tds,
      netPayable,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-forest" />
            Billing History
          </CardTitle>
          <button className="text-xs text-forest font-medium hover:text-forest-light transition-colors flex items-center gap-1">
            Export CSV <Download className="w-3.5 h-3.5" />
          </button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Generation</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Base Amt</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax (GST)</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">TDS</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Net Payable</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, i) => (
                  <motion.tr
                    key={bill.month}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 + i * 0.06 }}
                    className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-6">
                      <span className="font-medium text-black">{bill.month}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-black">
                      {bill.generation.toLocaleString("en-IN")}{" "}
                      <span className="text-gray-400 text-xs">kWh</span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-black">
                      ₹{bill.rate.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium text-black">
                      ₹{bill.baseAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-right text-black">
                      ₹{(bill.cgst + bill.sgst).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3.5 px-4 text-right text-red-500 text-xs font-medium">
                      -₹{bill.tds.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-forest">
                      ₹{bill.netPayable.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={bill.status} />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-forest hover:bg-forest/5 transition-all">
                        <ArrowDownToLine className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
