"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Generic post-Cashfree redirect target. Cashfree's production URL validator
 * only accepts a small set of return URLs, so all four payment flows
 * (signup, driver checkout, host financials, host monthly billing) point
 * here. We figure out where the user was going from sessionStorage hints
 * left behind by each flow and bounce them there.
 *
 * The page is intentionally thin — verification happens in the originating
 * flow's UI once the user lands there. Webhook reconciliation is the
 * authoritative path so even if this page is closed, the payment record
 * still resolves correctly.
 */
function PaymentReturnInner() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const flow = sessionStorage.getItem("pnp_payment_flow");
    sessionStorage.removeItem("pnp_payment_flow");

    let target = "/dashboard";
    if (flow === "host_financials" || flow === "host_payment") {
      target = "/host/financials";
    } else if (flow === "signup") {
      target = "/signup";
    } else if (flow === "reserve") {
      target = "/dashboard";
    }

    router.replace(target);
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <Loader2 className="h-8 w-8 text-gold animate-spin mb-4" />
      <h1 className="text-lg font-semibold text-black">Confirming your payment</h1>
      <p className="mt-2 text-sm text-gray-500 max-w-md">
        Please wait while we redirect you back to your account. Do not close this tab.
      </p>
    </main>
  );
}

export default function PaymentReturnPage() {
  return (
    <Suspense fallback={null}>
      <PaymentReturnInner />
    </Suspense>
  );
}
