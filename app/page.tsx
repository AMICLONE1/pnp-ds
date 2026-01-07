"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Leaf,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  BarChart3,
  Users,
  Award,
} from "lucide-react";
import { Hero3D } from "@/components/features/landing/Hero3D";
import { SolarIcon, EnergyWave } from "@/components/features/landing/AnimatedSVG";
import { ScrollAnimation } from "@/components/features/landing/ScrollAnimation";
import { useHeroAnimation } from "@/hooks/useHeroAnimation";
import { useStatsCounter } from "@/hooks/useStatsCounter";

export default function HomePage() {
  const heroRef = useHeroAnimation();
  const statsRef = useStatsCounter();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1">
        {/* Hero Section with 3D Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-forest via-forest-light to-forest-dark text-white">
          {/* 3D Background */}
          <Hero3D />
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest/50 to-forest" />
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
            <div ref={heroRef} className="max-w-5xl mx-auto text-center">
              {/* Animated Icon */}
              <div className="flex justify-center mb-8">
                <div className="animate-bounce">
                  <SolarIcon />
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-heading font-bold mb-6 text-balance leading-tight">
                Trade Energy
                <br />
                <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent animate-gradient">
                  Like Never Before
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
                All in one Energy Trading Platform. The infrastructure for the next generation of energy trading.
                Built on Beckn Protocol and Unified Energy Interface (UEI).
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Shield className="h-4 w-4 text-gold" />
                  <span>Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Users className="h-4 w-4 text-gold" />
                  <span>1K+ Residential Owners</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="h-4 w-4 text-gold" />
                  <span>ISO 27001 Ready</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/reserve">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-6 group"
                  >
                    Join The Network
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Animated Wave */}
          <EnergyWave />
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto px-4">
            <div ref={statsRef} className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <ScrollAnimation direction="up" delay={0.1}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-forest/5 to-transparent border border-forest/10">
                  <div className="text-5xl font-bold text-forest mb-2">
                    <span className="stat-number" data-target="500">0</span>+
                  </div>
                  <div className="text-gray-600 font-medium">MW Capacity</div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation direction="up" delay={0.2}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent border border-gold/10">
                  <div className="text-5xl font-bold text-gold mb-2">
                    <span className="stat-number" data-target="500">0</span> MT
                  </div>
                  <div className="text-gray-600 font-medium">Carbon Reduced</div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation direction="up" delay={0.3}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/10">
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    <span className="stat-number" data-target="45">0</span>%
                  </div>
                  <div className="text-gray-600 font-medium">Higher Returns</div>
                </div>
              </ScrollAnimation>
              <ScrollAnimation direction="up" delay={0.4}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    <span className="stat-number" data-target="1">0</span>K+
                  </div>
                  <div className="text-gray-600 font-medium">Residential Owners</div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* How It Works - Enhanced */}
        <section className="py-24 bg-gradient-to-b from-offwhite to-white relative">
          <div className="container mx-auto px-4">
            <ScrollAnimation direction="fade">
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-charcoal">
                  How It Works
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Three simple steps to start saving on your electricity bills
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              <ScrollAnimation direction="up" delay={0.1}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-forest to-gold rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                  <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-forest to-forest-light rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-center text-charcoal">
                      Join Projects
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Browse available solar projects across India. Select your
                      preferred capacity (1-100 kW) and see real-time pricing.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <Zap className="h-8 w-8 text-gold" />
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="up" delay={0.2}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gold to-forest rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                  <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-gold to-gold-light rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                      <span className="text-3xl font-bold text-charcoal">2</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-center text-charcoal">
                      Connect Utility
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Link your electricity provider account. We support all major
                      DISCOMs across India. Setup takes less than 2 minutes.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <TrendingUp className="h-8 w-8 text-forest" />
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="up" delay={0.3}>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-forest rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
                  <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-full">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                      <span className="text-3xl font-bold text-white">3</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-center text-charcoal">
                      Offset Bills
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">
                      Watch your savings grow! Solar credits are automatically
                      applied to your monthly bills. Track everything in real-time.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Benefits - Enhanced Design */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollAnimation direction="fade">
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-charcoal">
                  Why Choose PowerNetPro?
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Built for the Indian Energy Ecosystem. Compliant, secure, and designed for scale.
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: "No Installation",
                  description:
                    "Participate in solar energy without installing panels. Perfect for renters and apartment dwellers.",
                  gradient: "from-forest to-forest-light",
                },
                {
                  icon: TrendingUp,
                  title: "Lower Bills",
                  description:
                    "Save money on electricity bills with automatic credit applications every month. Average savings: ₹500-2000/month.",
                  gradient: "from-green-500 to-green-600",
                },
                {
                  icon: Leaf,
                  title: "Environmental Impact",
                  description:
                    "Track your CO₂ offset and contribute to India&apos;s renewable energy goals. Every kW matters.",
                  gradient: "from-blue-500 to-blue-600",
                },
                {
                  icon: Clock,
                  title: "Quick Setup",
                  description:
                    "Get started in under 5 minutes. No complex paperwork or lengthy approval processes.",
                  gradient: "from-purple-500 to-purple-600",
                },
                {
                  icon: Shield,
                  title: "Secure & Reliable",
                  description:
                    "Bank-grade security for payments and data. Trusted by thousands of users across India.",
                  gradient: "from-forest to-forest-dark",
                },
                {
                  icon: BarChart3,
                  title: "Flexible Capacity",
                  description:
                    "Choose capacity that works for you. Start small with 1 kW and scale up anytime.",
                  gradient: "from-gold to-gold-light",
                },
              ].map((benefit, index) => (
                <ScrollAnimation key={index} direction="up" delay={index * 0.1}>
                  <div className="group relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-forest/50 transition-all duration-300 hover:shadow-2xl">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <benefit.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-charcoal group-hover:text-forest transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-forest/0 to-gold/0 group-hover:from-forest/5 group-hover:to-gold/5 transition-all duration-300 -z-10" />
                  </div>
                </ScrollAnimation>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-gradient-to-br from-forest to-forest-dark text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute top-0 left-0 w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            ></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollAnimation direction="fade">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                  Trusted by PowerNetPro
                </h2>
                <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
                  We&apos;re a legitimate, registered company committed to making clean
                  energy accessible to everyone in India.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <CheckCircle className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Registered Company</h3>
                    <p className="text-sm text-gray-200">
                      Legally incorporated and compliant with all regulations
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <Shield className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Secure Payments</h3>
                    <p className="text-sm text-gray-200">
                      PCI DSS compliant payment processing via Razorpay
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <Award className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Industry Certified</h3>
                    <p className="text-sm text-gray-200">
                      ISO certified processes and quality standards
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                    Regulatory Compliant
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                    ISO 27001 Ready
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                    Make in India
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                    Startup India
                  </div>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="py-24 bg-gradient-to-br from-gold via-gold-light to-gold-dark text-charcoal relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <ScrollAnimation direction="fade">
              <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
                Ready to Start Saving?
              </h2>
              <p className="text-xl text-charcoal/80 mb-10 max-w-2xl mx-auto">
                Join thousands of users already saving money and reducing their
                carbon footprint. Your solar journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/reserve">
                  <Button
                    variant="primary"
                    size="lg"
                    className="text-lg px-8 py-6 group bg-forest hover:bg-forest-light text-white"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                  >
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
