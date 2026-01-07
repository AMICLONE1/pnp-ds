"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface Bill {
  id: string;
  bill_number: string;
  amount: number;
  credits_applied: number;
  final_amount: number;
  due_date: string;
  status: string;
}

interface BillPaymentProps {
  bill: Bill;
  onPaymentComplete?: () => void;
}

export function BillPayment({ bill, onPaymentComplete }: BillPaymentProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/bills/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bill_id: bill.id,
          payment_amount: bill.final_amount,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.data.requires_payment) {
          // Redirect to Razorpay payment
          // For now, just show success
          setSuccess(true);
          if (onPaymentComplete) {
            setTimeout(() => {
              onPaymentComplete();
            }, 2000);
          }
        } else {
          // Fully paid with credits
          setSuccess(true);
          if (onPaymentComplete) {
            setTimeout(() => {
              onPaymentComplete();
            }, 2000);
          }
        }
      } else {
        setError(result.error?.message || "Payment failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-charcoal mb-2">Payment Successful!</h3>
          <p className="text-gray-600">
            {bill.final_amount === 0
              ? "Bill paid fully using credits!"
              : "Payment processed successfully."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pay Bill</CardTitle>
        <CardDescription>
          Pay your electricity bill through PowerNetPro with automatic credit application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Bill Amount</span>
            <span className="font-medium">{formatCurrency(bill.amount)}</span>
          </div>
          {bill.credits_applied > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 text-green-600">Credits Applied</span>
              <span className="font-medium text-green-600">
                -{formatCurrency(bill.credits_applied)}
              </span>
            </div>
          )}
          <div className="pt-2 border-t flex justify-between font-semibold">
            <span>Amount to Pay</span>
            <span className="text-forest">{formatCurrency(bill.final_amount)}</span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handlePay}
          disabled={processing || bill.final_amount === 0}
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : bill.final_amount === 0 ? (
            "Already Paid"
          ) : (
            `Pay ${formatCurrency(bill.final_amount)}`
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Pay bill with Bharat BillPay. Credits are automatically applied during payment.
        </p>
      </CardContent>
    </Card>
  );
}

