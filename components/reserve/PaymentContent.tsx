"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Mail } from "lucide-react";

/**
 * Reserve-more-capacity is temporarily disabled for existing users. New users
 * go through /signup (which bundles reserve + Cashfree payment in one flow).
 * Until /api/reserve/complete exists for logged-in users, we show a notice
 * here rather than breaking mid-flow against the hard-closed POST
 * /api/allocations endpoint.
 */
export default function PaymentContent() {
  const searchParams = useSearchParams();
  const [project, setProject] = useState<any>(null);
  const projectId = searchParams.get("project");
  const capacity = Number(searchParams.get("capacity")) || 5;

  useEffect(() => {
    if (!projectId) return;
    fetch("/api/projects")
      .then((r) => r.json())
      .then((result) => {
        if (result.success) {
          setProject(result.data.find((p: any) => p.id === projectId) || null);
        }
      })
      .catch(() => {});
  }, [projectId]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/reserve"
            className="inline-flex items-center text-sm text-black hover:underline mb-5"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to projects
          </Link>

          <Card className="border border-amber-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-700" />
                </div>
                <div>
                  <CardTitle>Reserve more capacity — coming soon</CardTitle>
                  <CardDescription>
                    Additional capacity reservations for existing accounts open shortly.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {project && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
                  <p className="font-semibold text-black">{project.name}</p>
                  <p className="text-gray-600">{project.location}</p>
                  <p className="mt-2 text-xs text-gray-500">
                    Requested: {capacity} kW
                  </p>
                </div>
              )}

              <p className="text-sm text-gray-700">
                We&apos;re finalising the secure payment flow for top-up reservations.
                In the meantime, reach out and our team will allocate the capacity
                manually and send you a payment link.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Link href="/contact">
                  <Button variant="primary">
                    <Mail className="h-4 w-4 mr-1.5" />
                    Contact sales
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline">Back to dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
