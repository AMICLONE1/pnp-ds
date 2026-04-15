import { motion } from "framer-motion";
import Link from "next/link";
import {
  Wallet,
  Download,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentDue } from "@/lib/utils/host/useDashboard";
import AnimatedNumber from "@/components/host/AnimatedNumber";

interface PaymentDueCardProps {
  paymentDue: PaymentDue | null;
}

export function PaymentDueCard({ paymentDue }: PaymentDueCardProps) {
  if (!paymentDue) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="shadow-sm h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="w-5 h-5 text-gold" />
              Payment Due
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">All payments up to date</p>
                <p className="text-xs text-green-700 mt-0.5">No pending invoices</p>
              </div>
            </div>
            <Link href="/host/financials" className="w-full flex items-center justify-center gap-2 bg-gold text-forest font-semibold py-2.5 px-4 rounded-xl hover:bg-gold-dark transition-colors text-sm">
              <Download className="w-4 h-4" />
              View Billing History
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet className="w-5 h-5 text-gold" />
            Payment Due
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Amount */}
          <div className="bg-forest/5 rounded-xl p-4 border border-forest/10">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
              Amount Due for {paymentDue.month}
            </p>
            <p className="text-3xl font-bold text-forest font-heading">
              <AnimatedNumber
                value={paymentDue.totalDue}
                prefix="₹"
              />
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs text-amber-700 font-medium">
                Due: {paymentDue.dueDate}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Generation</span>
              <span className="font-medium text-black">
                {paymentDue.generationKwh.toLocaleString("en-IN")} kWh
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">PPA Rate</span>
              <span className="font-medium text-black">
                ₹{paymentDue.ratePerKwh}/kWh
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Adjustments</span>
              <span className="font-medium text-black">
                ₹{paymentDue.adjustments}
              </span>
            </div>
            <div className="border-t pt-2.5 flex justify-between items-center">
              <span className="text-sm font-semibold text-black">Total</span>
              <span className="text-lg font-bold text-forest">
                ₹{paymentDue.totalDue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Action */}
          <Link href="/host/financials#billing" className="w-full flex items-center justify-center gap-2 bg-gold text-forest font-semibold py-2.5 px-4 rounded-xl hover:bg-gold-dark transition-colors text-sm">
            <Download className="w-4 h-4" />
            Review Invoice
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}