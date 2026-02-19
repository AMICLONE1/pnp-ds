import { motion } from "framer-motion";
import {
  Wallet,
  Download,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_PAYMENT_DUE } from "@/lib/utils/host/data";
import AnimatedNumber from "@/components/host/AnimatedNumber";

export function PaymentDueCard(){
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
              Amount Due for {MOCK_PAYMENT_DUE.month}
            </p>
            <p className="text-3xl font-bold text-forest font-heading">
              <AnimatedNumber
                value={MOCK_PAYMENT_DUE.totalDue}
                prefix="₹"
              />
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-xs text-amber-700 font-medium">
                Due: {MOCK_PAYMENT_DUE.dueDate}
              </span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Generation</span>
              <span className="font-medium text-black">
                {MOCK_PAYMENT_DUE.generationKwh.toLocaleString("en-IN")} kWh
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">PPA Rate</span>
              <span className="font-medium text-black">
                ₹{MOCK_PAYMENT_DUE.ratePerKwh}/kWh
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Adjustments</span>
              <span className="font-medium text-black">
                ₹{MOCK_PAYMENT_DUE.adjustments}
              </span>
            </div>
            <div className="border-t pt-2.5 flex justify-between items-center">
              <span className="text-sm font-semibold text-black">Total</span>
              <span className="text-lg font-bold text-forest">
                ₹{MOCK_PAYMENT_DUE.totalDue.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Action */}
          <button className="w-full flex items-center justify-center gap-2 bg-gold text-forest font-semibold py-2.5 px-4 rounded-xl hover:bg-gold-dark transition-colors text-sm">
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}