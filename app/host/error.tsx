"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Card className="border-red-200 shadow-sm">
        <CardContent className="p-8 sm:p-10 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black font-heading">Host page error</h1>
            <p className="text-sm sm:text-base text-gray-600">
              {error.message || "Something went wrong while loading the host portal."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Button onClick={reset} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/host" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-50">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}