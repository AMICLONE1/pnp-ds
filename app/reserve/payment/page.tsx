"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [project, setProject] = useState<any>(null);
  const supabase = createClient();

  const projectId = searchParams.get("project");
  const capacity = Number(searchParams.get("capacity")) || 5;
  const amount = Number(searchParams.get("amount")) || 25;

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      const response = await fetch("/api/projects");
      const result = await response.json();
      if (result.success) {
        const found = result.data.find((p: any) => p.id === projectId);
        setProject(found);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    // Load Razorpay script
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // Create allocation first
      const allocationResponse = await fetch("/api/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId,
          capacity_kw: capacity,
          monthly_fee: amount,
        }),
      });

      const allocationResult = await allocationResponse.json();

      if (!allocationResult.success) {
        setError(allocationResult.error?.message || "Failed to create allocation");
        setLoading(false);
        return;
      }

      // Create Razorpay order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          allocation_id: allocationResult.data.id,
          payment_type: "allocation",
        }),
      });

      const orderResult = await orderResponse.json();

      if (!orderResult.success) {
        setError(orderResult.error?.message || "Failed to create payment order");
        setLoading(false);
        return;
      }

      // If mock payment (Razorpay not configured), simulate success
      if (orderResult.data.mock) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push(
          `/reserve/success?allocation=${allocationResult.data.id}&project=${projectId}`
        );
        return;
      }

      // Wait for Razorpay to load if needed
      let retries = 0;
      while (typeof window !== "undefined" && !window.Razorpay && retries < 10) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        retries++;
      }

      // Check if Razorpay is loaded
      if (typeof window !== "undefined" && window.Razorpay) {
        // Initialize Razorpay checkout
        const options = {
          key: orderResult.data.key,
          amount: orderResult.data.amount,
          currency: orderResult.data.currency,
          name: "Digital Solar",
          description: `Solar Capacity Reservation - ${capacity} kW`,
          order_id: orderResult.data.order_id,
          handler: async function (response: any) {
            // Verify payment
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              router.push(
                `/reserve/success?allocation=${allocationResult.data.id}&project=${projectId}`
              );
            } else {
              setError(verifyResult.error?.message || "Payment verification failed");
              setLoading(false);
            }
          },
          prefill: {
            email: "",
            contact: "",
          },
          theme: {
            color: "#1B4332",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        setLoading(false);
      } else {
        // Fallback: simulate payment if Razorpay not loaded
        await new Promise((resolve) => setTimeout(resolve, 1500));
        router.push(
          `/reserve/success?allocation=${allocationResult.data.id}&project=${projectId}`
        );
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/reserve"
            className="inline-flex items-center text-forest hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Complete Your Reservation</CardTitle>
              <CardDescription>
                Review your order and proceed to payment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-charcoal">Order Summary</h3>
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Project</span>
                    <span className="font-medium">{project.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{project.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium">{capacity} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Fee</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-forest">{formatCurrency(amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handlePayment}
                  isLoading={loading}
                >
                  {loading ? "Processing..." : "Complete Payment"}
                </Button>
                <p className="text-xs text-center text-gray-500">
                  By proceeding, you agree to our terms and conditions. Payment
                  will be processed securely.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
          </div>
        </main>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
