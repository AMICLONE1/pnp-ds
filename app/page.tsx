import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Leaf, TrendingUp, Shield, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest-light to-forest-dark text-white">
          <div className="container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-balance">
                Join the Solar Revolution
                <br />
                <span className="text-gold">No Installation Required</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto">
                Reserve solar capacity in community projects and start saving on
                your electricity bills today. Clean energy made simple.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/reserve">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Join Projects
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-offwhite to-transparent" />
        </section>

        {/* How It Works */}
        <section className="py-20 bg-offwhite">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-heading font-bold text-center mb-12 text-charcoal">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  Join Projects
                </h3>
                <p className="text-gray-600">
                  Browse available solar projects and reserve capacity that fits
                  your needs. Choose from 1-100 kW.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  Connect Utility
                </h3>
                <p className="text-gray-600">
                  Link your electricity provider account. We&apos;ll automatically
                  apply credits to your bills.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  Offset Bills
                </h3>
                <p className="text-gray-600">
                  Watch your savings grow as solar credits are applied to your
                  monthly electricity bills.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-heading font-bold text-center mb-12 text-charcoal">
              Why Choose Digital Solar?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <Zap className="h-8 w-8 text-gold mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  No Installation
                </h3>
                <p className="text-gray-600">
                  Participate in solar energy without installing panels on your
                  property. Perfect for renters and apartment dwellers.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <TrendingUp className="h-8 w-8 text-gold mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  Lower Bills
                </h3>
                <p className="text-gray-600">
                  Save money on your electricity bills with automatic credit
                  applications every month.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <Leaf className="h-8 w-8 text-gold mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  Environmental Impact
                </h3>
                <p className="text-gray-600">
                  Track your CO₂ offset and contribute to India&apos;s renewable
                  energy goals.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <Clock className="h-8 w-8 text-gold mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  Quick Setup
                </h3>
                <p className="text-gray-600">
                  Get started in under 5 minutes. No complex paperwork or
                  lengthy approval processes.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <Shield className="h-8 w-8 text-gold mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  Secure & Reliable
                </h3>
                <p className="text-gray-600">
                  Bank-grade security for your payments and data. Trusted by
                  thousands of users.
                </p>
              </div>
              <div className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <Zap className="h-8 w-8 text-gold mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  Flexible Capacity
                </h3>
                <p className="text-gray-600">
                  Choose the capacity that works for you. Start small and scale
                  up anytime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-forest to-forest-light text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Start Saving?
            </h2>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users already saving money and reducing their
              carbon footprint.
            </p>
            <Link href="/reserve">
              <Button variant="secondary" size="lg">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

