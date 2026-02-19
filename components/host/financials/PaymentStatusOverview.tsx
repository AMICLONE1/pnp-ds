"use client";

import { motion } from "framer-motion";
import { CreditCard, Receipt, ChevronRight, ArrowDownToLine, XCircle } from "lucide-react";
import { TooltipItem } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BILLING_HISTORY, PAYMENT_TRANSACTIONS } from "./data";

export function PaymentStatusOverview() {
  const paidTotal = BILLING_HISTORY.filter((b) => b.status === "PAID").reduce((a, b) => a + b.netPayable, 0);
  const pendingTotal = BILLING_HISTORY.filter((b) => b.status === "PENDING").reduce((a, b) => a + b.netPayable, 0);
  const overdueTotal = BILLING_HISTORY.filter((b) => b.status === "OVERDUE").reduce((a, b) => a + b.netPayable, 0);

  const total = paidTotal + pendingTotal + overdueTotal;

  const doughnutData = {
    labels: ["Paid", "Pending", "Overdue"],
    datasets: [
      {
        data: [paidTotal, pendingTotal, overdueTotal],
        backgroundColor: ["#0D2818", "#FFB800", "#EF4444"],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0D2818",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: TooltipItem<"doughnut">) => {
            const pct = ((context.parsed / total) * 100).toFixed(1);
            return ` ₹${context.parsed.toLocaleString("en-IN", { maximumFractionDigits: 0 })} (${pct}%)`;
          },
        },
      },
    },
  };

  const legend = [
    { label: "Paid", color: "#0D2818", amount: paidTotal },
    { label: "Pending", color: "#FFB800", amount: pendingTotal },
    { label: "Overdue", color: "#EF4444", amount: overdueTotal },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="shadow-sm h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-forest" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="h-[200px] w-[200px] shrink-0 relative">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-400">Total</span>
                  <span className="text-sm font-bold text-black">₹{(total / 100000).toFixed(1)}L</span>
                </div>
              </div>
              <div className="space-y-4 flex-1">
                {legend.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-black">{item.label}</p>
                      <p className="text-xs text-gray-500">
                        ₹{item.amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {((item.amount / total) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.75 }}
      >
        <Card className="shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="w-5 h-5 text-gold" />
              Recent Transactions
            </CardTitle>
            <button className="text-xs text-forest font-medium hover:text-forest-light transition-colors flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {PAYMENT_TRANSACTIONS.map((tx, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className={`p-2 rounded-lg shrink-0 ${tx.type === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                    {tx.type === "credit" ? (
                      <ArrowDownToLine className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{tx.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-bold whitespace-nowrap ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                    {tx.type === "credit" ? "+" : ""}₹{Math.abs(tx.amount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
