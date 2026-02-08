"use client";

import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import SuccessContent from "@/components/reserve/SuccessContent";

export const dynamic = 'force-dynamic';

export default function SuccessPage() {
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
      <SuccessContent />
    </Suspense>
  );
}

