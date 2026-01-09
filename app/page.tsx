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
import dynamic from "next/dynamic";
import { SolarIcon, EnergyWave } from "@/components/features/landing/AnimatedSVG";
import { ScrollAnimation } from "@/components/features/landing/ScrollAnimation";
import { LiveStats } from "@/components/features/landing/LiveStats";
import { UtilityCompatibilityChecker } from "@/components/features/landing/UtilityCompatibilityChecker";
import { Testimonials } from "@/components/features/landing/Testimonials";
import { Newsletter } from "@/components/features/landing/Newsletter";
import { InlineCalculator } from "@/components/features/landing/InlineCalculator";
import { LiveStatsTicker } from "@/components/features/landing/LiveStatsTicker";
import { AnimatedHeadline } from "@/components/features/landing/AnimatedHeadline";
import { ProcessVisualization } from "@/components/features/landing/ProcessVisualization";
import { StickyCTA } from "@/components/features/landing/StickyCTA";
import { GlassCard } from "@/components/features/landing/GlassCard";

// Lazy load heavy 3D components to avoid webpack issues
const Hero3D = dynamic(() => import("@/components/features/landing/Hero3D").then(mod => ({ default: mod.Hero3D })), {
  ssr: false,
  loading: () => null,
});

const ParticleSystem = dynamic(() => import("@/components/features/landing/ParticleSystem").then(mod => ({ default: mod.ParticleSystem })), {
  ssr: false,
  loading: () => null,
});
import { useHeroAnimation } from "@/hooks/useHeroAnimation";
import { useStatsCounter } from "@/hooks/useStatsCounter";
import { motion } from "framer-motion";
import { heroSequence } from "@/lib/animations";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function HomePage() {
  const heroRef = useHeroAnimation();
  const statsRef = useStatsCounter();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-charcoal focus:rounded-lg focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {/* Hero Section with 3D Background - Enhanced */}
        <section 
          className="relative min-h-screen flex items-center justify-center overflow-x-hidden bg-gradient-to-br from-forest via-forest-light to-forest-dark text-white pb-24"
          aria-label="Hero section"
        >
          {/* Particle System Background */}
          <ParticleSystem />
          
          {/* 3D Background - Lazy loaded to avoid SSR issues */}
          <Hero3D />
          
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest/50 to-forest gradient-mesh opacity-30" />
          
          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
            <div ref={heroRef} className="max-w-6xl mx-auto text-center">
              {/* Animated Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex justify-center mb-6"
              >
                <div className="animate-bounce">
                  <SolarIcon />
                </div>
              </motion.div>

              {/* Massive Headline - Progressive Disclosure */}
              <AnimatedHeadline delay={heroSequence.headline.delay * 1000}>
                <div className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-4 text-balance leading-tight">
                  Save ₹2,000/month
                  <br />
                  <span className="gradient-text">
                    on Electricity Bills
                  </span>
                </div>
              </AnimatedHeadline>
              
              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: heroSequence.subheadline.delay }}
                className="text-xl md:text-2xl lg:text-3xl text-gray-100 mb-6 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                No Installation. No Hassle. Just Savings.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: heroSequence.subheadline.delay + 0.1 }}
                className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
              >
                Reserve solar capacity from community projects. Credits automatically applied to your bills.
              </motion.p>

              {/* Inline Calculator - Progressive Disclosure */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: heroSequence.calculator.duration,
                  delay: heroSequence.calculator.delay,
                  type: "spring",
                  stiffness: 100
                }}
                className="mb-10"
              >
                <InlineCalculator />
              </motion.div>

              {/* Trust Indicators - Sequential Fade In */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: heroSequence.trustIndicators.delay,
                    },
                  },
                }}
                className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10 text-sm md:text-base"
              >
                {[
                  { icon: Users, text: "1,000+ Users" },
                  { icon: TrendingUp, text: "₹50Cr+ Saved" },
                  { icon: Award, text: "ISO Certified" },
                  { icon: Shield, text: "Bank-Grade Security" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center gap-2 glass-card px-5 py-3 rounded-full"
                  >
                    <item.icon className="h-5 w-5 text-gold" aria-hidden="true" />
                    <span className="font-semibold">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced CTAs - Slide In */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: heroSequence.ctas.delay }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                <Link href="/reserve" aria-label="Start saving now">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto text-lg md:text-xl px-10 py-7 group bg-gold hover:bg-gold-light text-charcoal font-bold shadow-2xl hover:shadow-gold/50 transition-all transform hover:scale-105 glow-button focus-visible-ring"
                  >
                    Start Saving Now
                    <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/signup" aria-label="Watch 60 second demo">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-lg md:text-xl px-10 py-7 border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm font-semibold focus-visible-ring"
                  >
                    Watch 60s Demo
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Animated Wave */}
          <EnergyWave />
          
          {/* Live Stats Ticker - Progressive Disclosure */}
          <LiveStatsTicker />
          
          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center cursor-pointer"
              aria-label="Scroll down"
              role="button"
              tabIndex={0}
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
                }
              }}
            >
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="container mx-auto px-4">
            <div ref={statsRef} className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <ScrollAnimation direction="up" delay={0.1}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-forest/5 to-transparent border border-forest/10">
                  <div className="text-5xl font-bold text-forest mb-2">
                    <span className="stat-number" data-target="1">0</span>K+
                  </div>
                  <div className="text-gray-600 font-medium">Residential Owners</div>
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
                    ₹<span className="stat-number" data-target="50">0</span>Cr+
                  </div>
                  <div className="text-gray-600 font-medium">Total Savings</div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Early in Page */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-4">
            <Testimonials />
          </div>
        </section>

        {/* Utility Compatibility Checker */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-4">
            <ScrollAnimation direction="fade">
              <UtilityCompatibilityChecker />
            </ScrollAnimation>
          </div>
        </section>

        {/* How It Works - Enhanced */}
        <ProcessVisualization />

        {/* Connect with Solar Section */}
        <section className="py-24 bg-gradient-to-b from-white to-offwhite relative">
          <div className="container mx-auto px-4">
            <ScrollAnimation direction="fade">
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-charcoal">
                  Connect with solar installed elsewhere
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  While conventional solar has to be linked directly to your home meter, Digital Solar generates energy credits to offset your power bills.
                </p>
              </div>
            </ScrollAnimation>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto mb-16">
              <ScrollAnimation direction="left">
                <div className="p-8 rounded-2xl shadow-xl border border-forest/20 bg-gradient-to-br from-forest/5 to-transparent">
                  <h3 className="text-3xl font-heading font-bold text-forest mb-6">
                    Digital Solar
                  </h3>
                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                      Works best for tenants and apartments
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                      Zero Installation - No extra hardware or permits needed
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Secured Generation</strong> - 75% of forecasted generation is covered*
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                      Offset with Credits - Slash usage & fixed charges
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                      Offsetting power for multiple locations
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                      Can add more solar capacity later
                    </li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-forest/20">
                    <p className="text-xs text-gray-600 italic">
                      *75% of forecasted generation is covered. This means even if actual generation
                      is lower than forecast, you&apos;re protected up to 75% of the expected output.
                    </p>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="right">
                <div className="p-8 rounded-2xl shadow-xl border border-gray-200 bg-white">
                  <h3 className="text-3xl font-heading font-bold text-charcoal mb-6">
                    Rooftop Solar
                  </h3>
                  <ul className="space-y-4 text-lg text-gray-700">
                    <li className="flex items-center">
                      <Clock className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
                      Works mostly for standalone houses
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
                      Fixed to Rooftop - Local utility approval required
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
                      Yield risk on you - Intermittency due to weather and shade
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
                      Reduce in Units - Lowers only usage charges
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
                      Solar capacity limited by roof space
                    </li>
                    <li className="flex items-center">
                      <Clock className="h-6 w-6 text-gray-400 mr-3 flex-shrink-0" />
                      Troubleshooting can get expensive
                    </li>
                  </ul>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </section>

        {/* Benefits - Enhanced Design */}
        <section className="py-24 bg-white relative overflow-hidden" aria-label="Benefits">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-forest/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6 text-charcoal">
                Why Choose Digital Solar?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The smarter way to go solar without the hassles of installation.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            >
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
                  gradient: "from-energy-green to-green-600",
                },
                {
                  icon: Leaf,
                  title: "Environmental Impact",
                  description:
                    "Track your CO₂ offset and contribute to India&apos;s renewable energy goals. Every kW matters.",
                  gradient: "from-energy-blue to-blue-600",
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
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <GlassCard className="p-6 h-full" hover>
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-xl flex items-center justify-center mb-4 transition-transform shadow-lg`}
                    >
                      <benefit.icon className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-charcoal transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
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
                  Built for the Indian Energy Ecosystem
                </h2>
                <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
                  Compliant, secure, and designed for scale. Making clean energy accessible to everyone.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <CheckCircle className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Regulatory Compliant</h3>
                    <p className="text-sm text-gray-200">
                      MERC/CERC aligned
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <Shield className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">ISO 27001 Ready</h3>
                    <p className="text-sm text-gray-200">
                      Security certified
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <Award className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Make in India</h3>
                    <p className="text-sm text-gray-200">
                      Proudly Indian
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                    <Users className="h-8 w-8 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Startup India</h3>
                    <p className="text-sm text-gray-200">
                      Recognized startup
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
                Got questions? We&apos;ve got answers.
              </h2>
              <p className="text-xl text-charcoal/80 mb-10 max-w-2xl mx-auto">
                Here&apos;s everything you need to know before joining us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/help">
                  <Button
                    variant="primary"
                    size="lg"
                    className="text-lg px-8 py-6 group bg-forest hover:bg-forest-light text-white"
                  >
                    Visit Help Center
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
      <StickyCTA />
    </div>
  );
}
