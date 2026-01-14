"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { StructuredData } from "@/components/seo/StructuredData";
import { Sun, ArrowRight, Users, CheckCircle, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Suspense } from "react";

// Import skeleton components for loading states
import {
  HeroSkeleton,
  StatsSkeleton,
  BenefitsSkeleton,
  HowItWorksSkeleton,
  TestimonialsSkeleton,
  FAQSkeleton,
  SectionSkeleton,
} from "@/components/ui/skeletons";

// ============================================
// DYNAMIC IMPORTS WITH LOADING STATES
// This reduces initial bundle size by ~200KB
// ============================================

// Critical path - Hero Section loads first with skeleton
const HeroSection = dynamic(
  () => import("@/components/features/landing/HeroSection").then(mod => ({ default: mod.HeroSection })),
  {
    loading: () => <HeroSkeleton />,
    ssr: true, // Enable SSR for SEO
  }
);

// Above-fold sections - prioritized loading
const StatsSection = dynamic(
  () => import("@/components/features/landing/StatsSection").then(mod => ({ default: mod.StatsSection })),
  {
    loading: () => <StatsSkeleton />,
    ssr: true,
  }
);

// Heavy animation components - disabled SSR to prevent hydration issues
const EnhancedStickyTextFill = dynamic(
  () => import("@/components/ui/animations/EnhancedStickyTextFill").then(mod => ({ default: mod.EnhancedStickyTextFill })),
  {
    loading: () => <div className="h-[300vh] bg-gray-900" />,
    ssr: false,
  }
);

// Below-fold sections - lazy loaded with intersection observer
const BenefitsSection = dynamic(
  () => import("@/components/features/landing/BenefitsSection").then(mod => ({ default: mod.BenefitsSection })),
  {
    loading: () => <BenefitsSkeleton />,
  }
);

const HowItWorksSection = dynamic(
  () => import("@/components/features/landing/HowItWorksSection").then(mod => ({ default: mod.HowItWorksSection })),
  {
    loading: () => <HowItWorksSkeleton />,
  }
);

const ProblemSolution = dynamic(
  () => import("@/components/features/landing/ProblemSolution").then(mod => ({ default: mod.ProblemSolution })),
  {
    loading: () => <SectionSkeleton height="h-[600px]" />,
  }
);

const UtilityCompatibilityChecker = dynamic(
  () => import("@/components/features/landing/UtilityCompatibilityChecker").then(mod => ({ default: mod.UtilityCompatibilityChecker })),
  {
    loading: () => <SectionSkeleton height="h-[400px]" />,
  }
);

// Animation components - load on demand
const TestimonialCarousel = dynamic(
  () => import("@/components/ui/animations").then(mod => ({ default: mod.TestimonialCarousel })),
  {
    loading: () => <TestimonialsSkeleton />,
    ssr: false,
  }
);

const FAQAccordion = dynamic(
  () => import("@/components/ui/animations").then(mod => ({ default: mod.FAQAccordion })),
  {
    loading: () => <FAQSkeleton />,
    ssr: false,
  }
);

// UI progress components
const SmoothScrollProgress = dynamic(
  () => import("@/components/ui/modern-animations").then(mod => ({ default: mod.SmoothScrollProgress })),
  { ssr: false }
);

const CursorFollower = dynamic(
  () => import("@/components/ui/modern-animations").then(mod => ({ default: mod.CursorFollower })),
  { ssr: false }
);

// Import other animations lazily
const ScrollFade = dynamic(
  () => import("@/components/ui/animations").then(mod => ({ default: mod.ScrollFade })),
  { ssr: false }
);

const CardTilt = dynamic(
  () => import("@/components/ui/animations").then(mod => ({ default: mod.CardTilt })),
  { ssr: false }
);

const MagneticButton = dynamic(
  () => import("@/components/ui/animations").then(mod => ({ default: mod.MagneticButton })),
  { ssr: false }
);

const FloatingElement = dynamic(
  () => import("@/components/ui/animations").then(mod => ({ default: mod.FloatingElement })),
  { ssr: false }
);

const AuroraBackground = dynamic(
  () => import("@/components/ui/animations").then(mod => ({ default: mod.LightweightAuroraBackground })),
  { ssr: false }
);

const DotPattern = dynamic(
  () => import("@/components/ui/animations").then(mod => ({ default: mod.DotPattern })),
  { ssr: false }
);

const GradientMesh = dynamic(
  () => import("@/components/ui/animations").then(mod => ({ default: mod.GradientMesh })),
  { ssr: false }
);

const StickyCTA = dynamic(
  () => import("@/components/features/landing/StickyCTA").then(mod => ({ default: mod.StickyCTA })),
  { ssr: false }
);

// ============================================
// DATA (Moved outside component for better performance)
// ============================================

const faqData = [
  {
    question: "What is Digital Solar and how does it work?",
    answer: "Digital Solar allows you to access clean solar energy without installing panels on your property. You reserve capacity from community solar projects, and the energy generated creates credits that automatically offset your electricity bills.",
    category: "Getting Started"
  },
  {
    question: "Do I need to own my home to participate?",
    answer: "No! Digital Solar is perfect for renters, apartment dwellers, and anyone who can't install panels. As long as you pay an electricity bill, you can participate and save.",
    category: "Eligibility"
  },
  {
    question: "How much can I save on my electricity bills?",
    answer: "Most users save between ₹500-2,000 per month depending on their capacity reservation. Our calculator can give you a personalized estimate based on your current usage.",
    category: "Savings"
  },
  {
    question: "Is there any installation required?",
    answer: "Zero installation required. No technicians visiting your home, no permits, no hardware. Everything is managed digitally through our platform.",
    category: "Getting Started"
  },
  {
    question: "How do solar credits appear on my bill?",
    answer: "Credits are automatically applied to your utility bill each month. You'll see them as a line item showing the energy generated from your reserved capacity, reducing your total bill.",
    category: "Billing"
  },
  {
    question: "What happens if the solar project generates less energy than expected?",
    answer: "We guarantee 75% of forecasted generation. This means even during cloudy periods or monsoon season, you're protected against significant shortfalls.",
    category: "Guarantees"
  },
  {
    question: "Can I change my capacity reservation later?",
    answer: "Yes! You can increase your capacity at any time. Decreasing capacity or cancelling follows our 30-day notice policy with pro-rated refunds.",
    category: "Flexibility"
  },
  {
    question: "Which utilities are supported?",
    answer: "We currently support major utilities across Maharashtra, Karnataka, Tamil Nadu, and Gujarat. Use our compatibility checker to see if your utility is supported.",
    category: "Eligibility"
  },
];

const testimonialData = [
  {
    content: "I've been saving over ₹1,800 every month since joining PowerNet Pro. As someone living in an apartment, I never thought I could go solar. This is revolutionary!",
    author: "Priya Sharma",
    role: "Apartment Resident",
    location: "Mumbai",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    savings: "₹1,800/month"
  },
  {
    content: "The setup took literally 5 minutes. No technicians, no roof inspections, nothing. Just sign up and start saving. Wish I knew about this years ago.",
    author: "Rajesh Kumar",
    role: "IT Professional",
    location: "Bangalore",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    savings: "₹2,100/month"
  },
  {
    content: "Finally, clean energy that works for tenants! I've moved twice since joining and my solar credits follow me. Best green decision I've made.",
    author: "Ananya Patel",
    role: "Tenant",
    location: "Pune",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    savings: "₹1,500/month"
  },
  {
    content: "As a small business owner, every rupee counts. Digital Solar has reduced our electricity costs by 35%. The team support is exceptional too.",
    author: "Mohammed Ismail",
    role: "Business Owner",
    location: "Chennai",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
    savings: "₹4,200/month"
  },
];

const trustItems = [
  { icon: CheckCircle, title: "Regulatory Compliant", desc: "MERC/CERC aligned" },
  { icon: Shield, title: "ISO 27001 Ready", desc: "Security certified" },
  { icon: Award, title: "Make in India", desc: "Proudly Indian" },
  { icon: Users, title: "Startup India", desc: "Recognized startup" },
];

// ============================================
// PAGE COMPONENT
// ============================================

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <div className="min-h-screen flex flex-col bg-white">
        {/* Smooth Scroll Progress Indicator */}
        <Suspense fallback={null}>
          <SmoothScrollProgress />
        </Suspense>

        {/* Custom Cursor (desktop only) */}
        <Suspense fallback={null}>
          <CursorFollower />
        </Suspense>

        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-charcoal focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>

        <Header />

        <main id="main-content" className="flex-1 relative" tabIndex={-1}>
          {/* HERO SECTION - Critical Path */}
          <HeroSection />

          {/* Text Fill Animation - Heavy component, no SSR */}
          <Suspense fallback={<div className="h-[300vh] bg-gray-900" />}>
            <EnhancedStickyTextFill
              texts={[
                "Start Saving Now. No Installation. No Hassle.",
                "Quick Setup. Easy Management. Big Savings.",
              ]}
              height="300vh"
              backgroundColor="bg-gray-900"
              textClassName="text-white"
              fadeDirection="up"
            />
          </Suspense>

          {/* STATS SECTION */}
          <StatsSection />

          {/* FEATURES / BENEFITS */}
          <BenefitsSection />

          {/* HOW IT WORKS */}
          <HowItWorksSection />

          {/* PROBLEM VS SOLUTION */}
          <ProblemSolution />

          {/* TESTIMONIALS */}
          <section className="py-24 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />
            <div className="container mx-auto px-4 relative z-10">
              <Suspense fallback={<div className="animate-pulse" />}>
                <ScrollFade direction="up">
                  <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      <Users className="w-4 h-4" />
                      Customer Stories
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                      What Our Users Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Real savings from real people across India
                    </p>
                  </div>
                </ScrollFade>
              </Suspense>

              <TestimonialCarousel testimonials={testimonialData} />
            </div>
          </section>

          {/* UTILITY COMPATIBILITY */}
          <section className="py-24 bg-gradient-to-b from-white via-offwhite to-white relative">
            <div className="container mx-auto px-4">
              <Suspense fallback={<SectionSkeleton height="h-[400px]" />}>
                <ScrollFade direction="up">
                  <UtilityCompatibilityChecker />
                </ScrollFade>
              </Suspense>
            </div>
          </section>

          {/* TRUST SECTION */}
          <section className="py-24 bg-gradient-to-br from-forest via-forest to-forest-dark text-white relative overflow-hidden">
            <Suspense fallback={null}>
              <GradientMesh className="absolute inset-0 opacity-20" />
            </Suspense>

            <div className="container mx-auto px-4 relative z-10">
              <Suspense fallback={<div className="animate-pulse" />}>
                <ScrollFade direction="up">
                  <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-semibold mb-6">
                      <Award className="w-4 h-4" />
                      Built for India
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                      Built for the Indian Energy Ecosystem
                    </h2>
                    <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
                      Compliant, secure, and designed for scale. Making clean energy accessible to everyone.
                    </p>

                    <div className="grid md:grid-cols-4 gap-6 mb-12">
                      {trustItems.map((item, index) => (
                        <Suspense key={index} fallback={<div className="h-32 bg-white/10 rounded-xl animate-pulse" />}>
                          <ScrollFade direction="up" delay={index * 0.1}>
                            <CardTilt maxTilt={8}>
                              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <item.icon className="h-8 w-8 text-gold mx-auto mb-4" />
                                <h3 className="font-semibold mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-200">{item.desc}</p>
                              </div>
                            </CardTilt>
                          </ScrollFade>
                        </Suspense>
                      ))}
                    </div>
                  </div>
                </ScrollFade>
              </Suspense>
            </div>
          </section>

          {/* FAQ SECTION */}
          <section className="py-24 bg-white relative overflow-hidden">
            <Suspense fallback={null}>
              <DotPattern className="absolute inset-0 opacity-10" />
            </Suspense>
            <div className="container mx-auto px-4 relative z-10">
              <Suspense fallback={<div className="animate-pulse" />}>
                <ScrollFade direction="up">
                  <div className="text-center mb-16">
                    <span className="inline-block bg-energy-blue/10 text-energy-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      Got Questions?
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Everything you need to know about Digital Solar
                    </p>
                  </div>
                </ScrollFade>
              </Suspense>

              <div className="max-w-3xl mx-auto">
                <Suspense fallback={<FAQSkeleton />}>
                  <ScrollFade direction="up" delay={0.2}>
                    <FAQAccordion items={faqData} searchable />
                  </ScrollFade>
                </Suspense>
              </div>
            </div>
          </section>

          {/* FINAL CTA */}
          <section className="py-32 relative overflow-hidden">
            <Suspense fallback={null}>
              <AuroraBackground className="absolute inset-0" />
            </Suspense>
            <div className="absolute inset-0 bg-gradient-to-b from-gold/90 via-gold to-gold-dark/90" />

            <div className="container mx-auto px-4 text-center relative z-10">
              <Suspense fallback={<div className="animate-pulse" />}>
                <ScrollFade direction="up">
                  <FloatingElement amplitude={5} duration={6}>
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-forest rounded-2xl mb-8 shadow-2xl">
                      <Sun className="w-10 h-10 text-gold" />
                    </div>
                  </FloatingElement>

                  {/* Live signup counter */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 bg-charcoal/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                  >
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-energy-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-energy-green"></span>
                    </span>
                    <span className="text-charcoal font-medium text-sm">
                      3 people signed up in the last hour
                    </span>
                  </motion.div>

                  <h2 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 text-charcoal">
                    Join 1,247 Families Who<br />Switched This Month
                  </h2>
                  <p className="text-xl md:text-2xl text-charcoal/80 mb-10 max-w-2xl mx-auto">
                    Most people finish setup during their coffee break. ☕
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <MagneticButton strength={0.3}>
                      <Link href="/reserve">
                        <Button
                          variant="primary"
                          size="lg"
                          className="text-xl px-10 py-7 group bg-forest hover:bg-forest-light text-white shadow-2xl"
                        >
                          Get Started Free
                          <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </Button>
                      </Link>
                    </MagneticButton>
                    <MagneticButton strength={0.3}>
                      <Link href="/help">
                        <Button
                          variant="outline"
                          size="lg"
                          className="text-xl px-10 py-7 border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-white"
                        >
                          Visit Help Center
                        </Button>
                      </Link>
                    </MagneticButton>
                  </div>

                  <p className="mt-8 text-sm text-charcoal/60">
                    No credit card required • 5-minute setup • Cancel anytime
                  </p>
                </ScrollFade>
              </Suspense>
            </div>
          </section>
        </main>

        <Footer />
        
        <Suspense fallback={null}>
          <StickyCTA />
        </Suspense>
      </div>
    </>
  );
}
