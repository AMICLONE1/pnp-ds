"use client";

import { IndianRupee, Check, Info } from "lucide-react";
import { RESERVATION_RATE_PER_KW, SETUP_FEE } from "@/lib/contact";

const RATE = RESERVATION_RATE_PER_KW;

const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const exampleRows = [
  { capacity: "1 kW", amount: RATE + SETUP_FEE, breakdown: `${formatINR(RATE)} + ${formatINR(SETUP_FEE)} setup` },
  { capacity: "2 kW", amount: 2 * RATE + SETUP_FEE, breakdown: `${formatINR(2 * RATE)} + ${formatINR(SETUP_FEE)} setup` },
  { capacity: "5 kW", amount: 5 * RATE + SETUP_FEE, breakdown: `${formatINR(5 * RATE)} + ${formatINR(SETUP_FEE)} setup` },
];

const included = [
  "Reserved solar capacity from operational projects",
  "Monthly credits based on actual energy generation",
  "Real-time monitoring dashboard",
  "Bill payment via BBPS integration",
  "24/7 customer support",
  "30-day full refund guarantee",
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-12 md:py-16" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-4">
            <IndianRupee className="w-4 h-4 text-gold" />
            <span className="text-sm font-semibold text-black">Transparent Pricing</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-black mb-3">
            Pricing
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Digital Solar reservations are priced per kilowatt (kW) of solar capacity. Your one-time reservation fee secures your capacity for the full 15-year credit period.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-2 border-gold/20 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-black mb-4">Core Fees</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex justify-between border-b border-gray-100 pb-2">
                <span>Reservation Fee</span>
                <span className="font-semibold text-black">{formatINR(RATE)} per kW</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 pb-2">
                <span>Setup Fee</span>
                <span className="font-semibold text-black">{formatINR(SETUP_FEE)} (one-time)</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 pb-2">
                <span>Monthly Fees</span>
                <span className="font-semibold text-black">None</span>
              </li>
              <li className="flex justify-between border-b border-gray-100 pb-2">
                <span>Maintenance Fees</span>
                <span className="font-semibold text-black">None</span>
              </li>
              <li className="flex justify-between">
                <span>Dashboard Access</span>
                <span className="font-semibold text-black">Free, included</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border-2 border-gold/20 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-black mb-4">Example Pricing</h3>
            <ul className="space-y-3 text-gray-700">
              {exampleRows.map((row) => (
                <li key={row.capacity} className="border-b border-gray-100 pb-2 last:border-0">
                  <div className="flex justify-between">
                    <span className="font-semibold text-black">{row.capacity} reservation</span>
                    <span className="font-semibold text-gold">{formatINR(row.amount)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{row.breakdown}</p>
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-4 flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-gold flex-shrink-0 mt-0.5" />
              All prices are in Indian Rupees (INR). GST, if applicable, will be charged extra and shown at checkout.
            </p>
          </div>
        </div>

        <div className="bg-gold/5 border border-gold/20 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-black mb-4">What&rsquo;s Included</h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-gray-700">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-gold flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
