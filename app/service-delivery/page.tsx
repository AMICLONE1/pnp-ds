"use client";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Truck,
  Zap,
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Bell,
  Activity,
  Mail,
} from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_PHONE, SUPPORT_PHONE_TEL } from "@/lib/contact";

export default function ServiceDeliveryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-gold/10">
      <LandingHeader />

      <main className="flex-1">
        <section className="pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-amber-100 mb-6">
                <Truck className="h-8 w-8 text-gold" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-black mb-4">
                Service Delivery Policy
              </h1>
              <p className="text-lg text-gray-600">
                Last Updated: April 2026
              </p>
            </div>

            <Card className="shadow-lg border-2 border-gold/20 mb-6">
              <CardContent className="p-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <p className="text-gray-700 leading-relaxed">
                  PowerNetPro is a digital solar energy platform. We do not ship physical products. Our service is delivered entirely online through our digital platform. Here is how and when our services are delivered:
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-gold/20">
              <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
                <CardTitle className="text-2xl font-heading font-bold text-black">
                  How We Deliver Our Service
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-gold" />
                    1. Activation of Solar Capacity
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    After successful payment, your reserved solar capacity is activated within 24&ndash;48 hours. You will receive confirmation via email and SMS with your dashboard login details.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <LayoutDashboard className="h-6 w-6 text-gold" />
                    2. Dashboard Access
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Upon activation, you get immediate access to your personalised dashboard where you can monitor real-time solar generation, credit balance, and bill payment history.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-gold" />
                    3. Monthly Credit Generation
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Solar credits are generated daily based on actual energy production from your reserved panels. Credits are accumulated and calculated on a monthly basis. Your monthly credit summary is available on your dashboard by the 5th of each month.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-gold" />
                    4. Bill Payment Processing
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    When you choose to apply credits to your electricity bill, payment is processed via Bharat Bill Payment System (BBPS) within 2&ndash;3 business days.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Bell className="h-6 w-6 text-gold" />
                    5. Communication
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    You will receive email and SMS notifications for: payment confirmation, capacity activation, monthly credit summaries, bill payment confirmations, and any service updates.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Activity className="h-6 w-6 text-gold" />
                    6. Service Availability
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our platform is available 24/7 with a 99.5% uptime guarantee. Scheduled maintenance windows are communicated at least 48 hours in advance.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-gold" />
                    Contact
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    For any delivery-related queries, email{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline font-semibold">{SUPPORT_EMAIL}</a>{" "}
                    or call{" "}
                    <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-gold hover:underline font-semibold">{SUPPORT_PHONE}</a>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
