"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STATES, DISCOMS_BY_STATE } from "@/lib/constants";
import { CheckCircle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function ConnectPage() {
  const router = useRouter();
  const [state, setState] = useState("");
  const [discom, setDiscom] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [availableDiscoms, setAvailableDiscoms] = useState<string[]>([]);

  useEffect(() => {
    if (state && DISCOMS_BY_STATE[state]) {
      setAvailableDiscoms(DISCOMS_BY_STATE[state]);
      setDiscom(""); // Reset discom when state changes
    } else {
      setAvailableDiscoms([]);
    }
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!state || !discom || !consumerNumber) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Consumer number validation (basic - can be enhanced)
    if (consumerNumber.length < 8) {
      setError("Consumer number must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/utility", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          discom,
          utility_consumer_number: consumerNumber,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(result.error?.message || "Failed to connect utility");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-12">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-heading font-bold mb-4 text-charcoal">
                Utility Connected!
              </h2>
              <p className="text-gray-600">
                Your utility provider has been linked successfully. Credits will
                now be applied to your bills automatically.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2 text-charcoal">
              Connect Your Utility
            </h1>
            <p className="text-gray-600">
              Link your electricity provider to start receiving credits on your
              bills
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Utility Information</CardTitle>
              <CardDescription>
                We&apos;ll use this to apply solar credits to your electricity bills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
                    required
                    disabled={loading}
                  >
                    <option value="">Select State</option>
                    {STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">
                    DISCOM (Distribution Company)
                  </label>
                  <select
                    value={discom}
                    onChange={(e) => setDiscom(e.target.value)}
                    className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent disabled:opacity-50"
                    required
                    disabled={loading || !state}
                  >
                    <option value="">
                      {state ? "Select DISCOM" : "Select State first"}
                    </option>
                    {availableDiscoms.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  type="text"
                  label="Consumer Number"
                  placeholder="Enter your consumer number"
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  required
                  disabled={loading}
                />

                {error && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    isLoading={loading}
                  >
                    Connect Utility
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.push("/dashboard")}
                    disabled={loading}
                  >
                    Skip for Now
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

