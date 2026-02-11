"use client";

export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import PaymentContent from "@/components/reserve/PaymentContent";

declare global {
  interface Window {
    Razorpay: any;
  }
}


export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
          </div>
        </main>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
