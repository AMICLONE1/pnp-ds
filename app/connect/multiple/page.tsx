"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const STATES = [
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Punjab",
  "Haryana",
  "West Bengal",
  "Odisha",
  "Madhya Pradesh",
  "Telangana",
];

const DISCOMS_BY_STATE: Record<string, string[]> = {
  Delhi: ["BSES Rajdhani", "BSES Yamuna", "Tata Power"],
  Maharashtra: ["BEST", "MSEDCL", "Adani Electricity"],
  Karnataka: ["BESCOM"],
  "Tamil Nadu": ["TNEB"],
  Kerala: ["KSEB"],
  Gujarat: ["Torrent Power"],
  Telangana: ["Telangana"],
};

interface UtilityAccount {
  id?: string;
  state: string;
  discom: string;
  consumer_number: string;
  nickname?: string;
  is_primary: boolean;
}

export default function MultipleUtilitiesPage() {
  const [utilities, setUtilities] = useState<UtilityAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchUtilities();
  }, []);

  const fetchUtilities = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch utilities (assuming we add a utilities table)
      // For now, use existing user utility
      const { data: userProfile } = await supabase
        .from("users")
        .select("utility_consumer_number, discom, state")
        .eq("id", user.id)
        .single();

      if (userProfile?.utility_consumer_number) {
        setUtilities([
          {
            state: userProfile.state || "",
            discom: userProfile.discom || "",
            consumer_number: userProfile.utility_consumer_number,
            is_primary: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching utilities:", error);
    } finally {
      setLoading(false);
    }
  };

  const addUtility = () => {
    setUtilities([
      ...utilities,
      {
        state: "",
        discom: "",
        consumer_number: "",
        is_primary: false,
      },
    ]);
  };

  const removeUtility = (index: number) => {
    setUtilities(utilities.filter((_, i) => i !== index));
  };

  const updateUtility = (index: number, field: keyof UtilityAccount, value: string | boolean) => {
    const updated = [...utilities];
    updated[index] = { ...updated[index], [field]: value };
    setUtilities(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save utilities (implement API endpoint)
      // For now, just show success
      alert("Utilities saved successfully!");
    } catch (error) {
      console.error("Error saving utilities:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2 text-charcoal">
              Multiple Utility Accounts
            </h1>
            <p className="text-gray-600">
              Link multiple electricity providers to offset bills for different locations
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Utility Accounts</CardTitle>
              <CardDescription>
                Manage multiple utility connections. Credits can be applied to any connected bill.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {utilities.map((utility, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-charcoal">
                      {utility.nickname || `Utility ${index + 1}`}
                      {utility.is_primary && (
                        <span className="ml-2 text-xs bg-forest text-white px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </h3>
                    {!utility.is_primary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeUtility(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        State
                      </label>
                      <select
                        value={utility.state}
                        onChange={(e) => updateUtility(index, "state", e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                      >
                        <option value="">Select State</option>
                        {STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        DISCOM
                      </label>
                      <select
                        value={utility.discom}
                        onChange={(e) => updateUtility(index, "discom", e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                        disabled={!utility.state}
                      >
                        <option value="">Select DISCOM</option>
                        {utility.state &&
                          DISCOMS_BY_STATE[utility.state]?.map((discom) => (
                            <option key={discom} value={discom}>
                              {discom}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Consumer Number
                      </label>
                      <Input
                        value={utility.consumer_number}
                        onChange={(e) =>
                          updateUtility(index, "consumer_number", e.target.value)
                        }
                        placeholder="Enter consumer number"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-charcoal mb-1">
                        Nickname (optional)
                      </label>
                      <Input
                        value={utility.nickname || ""}
                        onChange={(e) => updateUtility(index, "nickname", e.target.value)}
                        placeholder="e.g., Home, Office, Rental Property"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addUtility} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Utility
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Utilities"}
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

