"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
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
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-heading font-bold mb-4 text-black">
            Something went wrong!
          </h1>
          <p className="text-black mb-6">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" onClick={reset}>
              Try Again
            </Button>
            <Link href="/">
              <Button variant="outline">Go Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

