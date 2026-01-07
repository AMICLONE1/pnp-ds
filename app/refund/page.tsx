"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-4 text-charcoal">
              Refund Policy
            </h1>
            <p className="text-xl text-gray-600">
              Exit anytime and get a refund based on your reservation tenure
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Exit Anytime
              </CardTitle>
              <CardDescription>
                One of the key highlights of Digital Solar from rooftop installations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Unlike traditional rooftop solar which is fixed to your property, Digital Solar
                allows you to exit your reservation at any time. This flexibility is perfect for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Relocating to a different city or state</li>
                <li>Moving to an area not serviceable by us</li>
                <li>Changing financial circumstances</li>
                <li>Any other personal reasons</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-forest" />
                Refund Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Your refund is calculated based on:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Original Reservation Fee:</span>
                  <span className="font-semibold">₹X,XXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credits Generated (Used):</span>
                  <span className="font-semibold text-green-600">-₹X,XXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pro-rated Refund:</span>
                  <span className="font-semibold text-forest">₹X,XXX</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                The refund amount ensures you keep all the gains from credits generated thus far,
                with the same XIRR (time-weighted returns) as if you had held the reservation
                for the full term.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-gold" />
                Refund Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>
                  Request exit from your dashboard or contact support
                </li>
                <li>
                  We calculate your refund based on tenure and credits used
                </li>
                <li>
                  Refund is processed within 7-10 business days
                </li>
                <li>
                  Amount is credited to your original payment method
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Refund</CardTitle>
              <CardDescription>
                Ready to exit? Request your refund here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button variant="primary" className="w-full">
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

