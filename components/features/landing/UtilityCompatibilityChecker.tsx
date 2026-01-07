"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const SUPPORTED_DISCOMS = [
  "BSES Rajdhani",
  "BSES Yamuna",
  "Tata Power",
  "Adani Electricity",
  "BEST",
  "MSEDCL",
  "TPDDL",
  "BESCOM",
  "TNEB",
  "KSEB",
  "Torrent Power",
  "Telangana",
  "Uttar Pradesh Power Corporation",
  "Punjab State Power Corporation",
  "Haryana Power",
  "Gujarat Energy",
  "Rajasthan Power",
  "Madhya Pradesh Power",
  "West Bengal Power",
  "Odisha Power",
];

export function UtilityCompatibilityChecker() {
  const [discom, setDiscom] = useState("");
  const [state, setState] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    compatible: boolean;
    message: string;
  } | null>(null);

  const handleCheck = async () => {
    if (!discom || !state) {
      setResult({
        compatible: false,
        message: "Please select both DISCOM and State",
      });
      return;
    }

    setChecking(true);
    setResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const isCompatible = SUPPORTED_DISCOMS.some(
      (supported) => supported.toLowerCase() === discom.toLowerCase()
    );

    setResult({
      compatible: isCompatible,
      message: isCompatible
        ? `Great! ${discom} is fully supported. You can start using Digital Solar right away.`
        : `${discom} is not yet available in our network. We're expanding rapidly - contact us to be notified when it becomes available.`,
    });

    setChecking(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-heading">
          Check if Digital Solar is available for your utility
        </CardTitle>
        <CardDescription>
          Verify if your electricity provider is supported before signing up
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Select State
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
          >
            <option value="">Select State</option>
            <option value="Delhi">Delhi</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Kerala">Kerala</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Punjab">Punjab</option>
            <option value="Haryana">Haryana</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Odisha">Odisha</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Telangana">Telangana</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Select DISCOM
          </label>
          <select
            value={discom}
            onChange={(e) => setDiscom(e.target.value)}
            className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent"
            disabled={!state}
          >
            <option value="">Select DISCOM</option>
            {state === "Delhi" && (
              <>
                <option value="BSES Rajdhani">BSES Rajdhani</option>
                <option value="BSES Yamuna">BSES Yamuna</option>
                <option value="Tata Power">Tata Power</option>
              </>
            )}
            {state === "Maharashtra" && (
              <>
                <option value="BEST">BEST</option>
                <option value="MSEDCL">MSEDCL</option>
                <option value="Adani Electricity">Adani Electricity</option>
              </>
            )}
            {state === "Karnataka" && <option value="BESCOM">BESCOM</option>}
            {state === "Tamil Nadu" && <option value="TNEB">TNEB</option>}
            {state === "Kerala" && <option value="KSEB">KSEB</option>}
            {state === "Gujarat" && <option value="Torrent Power">Torrent Power</option>}
            {state === "Telangana" && <option value="Telangana">Telangana</option>}
          </select>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleCheck}
          disabled={checking || !discom || !state}
        >
          {checking ? "Checking..." : "Check Compatibility"}
        </Button>

        {result && (
          <div
            className={`p-4 rounded-lg border ${
              result.compatible
                ? "bg-green-50 border-green-200"
                : "bg-yellow-50 border-yellow-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {result.compatible ? (
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  result.compatible ? "text-green-700" : "text-yellow-700"
                }`}
              >
                {result.message}
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">Supported DISCOMs:</p>
          <div className="flex flex-wrap gap-2">
            {SUPPORTED_DISCOMS.slice(0, 10).map((discom) => (
              <span
                key={discom}
                className="px-2 py-1 bg-forest/10 text-forest text-xs rounded"
              >
                {discom}
              </span>
            ))}
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +10 more
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

