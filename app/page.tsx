"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sun,
  CheckCircle,
  Shield,
  Award,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

// Import new modern components
import { HeroSection } from "@/components/features/landing/HeroSection";
import { StatsSection } from "@/components/features/landing/StatsSection";
import { BenefitsSection } from "@/components/features/landing/BenefitsSection";
import { HowItWorksSection } from "@/components/features/landing/HowItWorksSection";
import { CalculatorSection } from "@/components/features/landing/CalculatorSection";

// Import client-only components - they handle SSR internally
import { SmoothScrollProgress, CursorFollower } from "@/components/ui/modern-animations";

// Import existing components that still work well
import { UtilityCompatibilityChecker } from "@/components/features/landing/UtilityCompatibilityChecker";
import { ProblemSolution } from "@/components/features/landing/ProblemSolution";
import { StickyCTA } from "@/components/features/landing/StickyCTA";
import {
  FAQAccordion,
  TestimonialCarousel,
  ScrollFade,
  CardTilt,
  MagneticButton,
  FloatingElement,
  LightweightAuroraBackground,
  GradientMesh,
  DotPattern
} from "@/components/ui/animations";
import { faqData } from "../lib/utils/data.js"
import { Testimonials } from "@/components/ui/Testimonials";


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Smooth Scroll Progress Indicator */}
      <SmoothScrollProgress />

      {/* Custom Cursor (desktop only) */}
      <CursorFollower />

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold focus:text-black focus:rounded-lg focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Header removed from landing page */}
      <LandingHeader />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        {/* HERO SECTION - New Modern Design */}
        <HeroSection />

        {/* CALCULATOR SECTION - Interactive Wide Calculator */}
        <CalculatorSection />

        {/* STATS SECTION - New Animated Stats */}
        <StatsSection />

        {/* FEATURES / BENEFITS - New Category-based Design */}
        <BenefitsSection />

        {/* HOW IT WORKS - New Timeline Design */}
        <HowItWorksSection />

        {/* PROBLEM VS SOLUTION SECTION */}
        <ProblemSolution />

        {/* TESTIMONIALS */}
        <Testimonials />

        {/* UTILITY COMPATIBILITY */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white via-white to-white relative">
          <div className="container mx-auto px-4">
            <ScrollFade direction="up">
              <UtilityCompatibilityChecker />
            </ScrollFade>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-white via-white to-white text-black relative overflow-hidden">
          <GradientMesh className="absolute inset-0 opacity-20" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-center mb-10"
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2.5 rounded-full text-sm font-semibold mb-4 shadow-sm border border-gold/10"
                  >
                    <Award className="w-4 h-4" />
                    Built for India
                  </motion.span>
                  <motion.h2
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-3 text-black"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    Built for the Indian Energy Ecosystem
                  </motion.h2>
                  <motion.p
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    className="text-base md:text-lg text-black/70 mb-8 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                  >
                    Compliant, secure, and designed for scale. Making clean energy accessible to everyone.
                  </motion.p>
                </motion.div>

                {/* Cards Grid */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  {[
                    { icon: CheckCircle, title: "Regulatory Compliant", desc: "MERC/CERC aligned" },
                    { icon: Shield, title: "ISO 27001 Ready", desc: "Security certified" },
                    { icon: Award, title: "Make in India", desc: "Proudly Indian" },
                    { icon: Users, title: "Startup India", desc: "Recognized startup" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.35 + index * 0.08,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                      }}
                    >
                      <motion.div
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                        className="bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/60 shadow-md hover:shadow-lg transition-all duration-300 group h-full"
                        whileHover={{
                          y: -6,
                          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.12)"
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        {/* Icon Container */}
                        <motion.div
                          className="flex justify-center mb-5"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center shadow-sm group-hover:from-gold/30 group-hover:to-gold/20 transition-all duration-300">
                            <item.icon className="h-7 w-7 text-gold" />
                          </div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
                        >
                          <h3 className="font-bold text-black mb-2 text-center group-hover:text-gold transition-colors duration-300">{item.title}</h3>
                          <p className="text-sm text-black/70 text-center group-hover:text-black/80 transition-colors duration-300">{item.desc}</p>
                        </motion.div>

                        {/* Bottom accent line */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-b-2xl"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                          style={{ transformOrigin: "center" }}
                        />
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden">
          <DotPattern className="absolute inset-0 opacity-10" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-10">
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="inline-block bg-gold/20 text-gold px-4 py-2.5 rounded-full text-sm font-semibold mb-3 shadow-sm border border-gold/10"
                >
                  Got Questions?
                </motion.span>
                <motion.h2
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="text-3xl sm:text-3xl md:text-4xl font-heading font-bold text-black mb-3"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  Frequently Asked Questions
                </motion.h2>
                <motion.p
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  className="text-base md:text-lg text-black/70 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Everything you need to know about Digital Solar
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <ScrollFade direction="up" delay={0.2}>
                <FAQAccordion items={faqData} searchable />
              </ScrollFade>
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
          <LightweightAuroraBackground className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-gold/90 via-gold to-gold-dark/90" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <ScrollFade direction="up">
              <FloatingElement amplitude={5} duration={6}>
                <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-8 shadow-2xl">
                  <Sun className="w-10 h-10 text-gold" />
                </div>
              </FloatingElement>

              {/* Live signup counter */}
              <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
                </span>
                <span className="text-black font-medium text-sm">
                  3 people signed up in the last hour
                </span>
              </div>

              <h2 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-bold mb-6 text-black">
                Join 1,247 Families Who<br />Switched This Month
              </h2>
              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-lg sm:text-xl md:text-2xl text-black/80 mb-8 md:mb-10 max-w-2xl mx-auto">
                Most people finish setup during their coffee break. ☕
              </p>

              <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="flex flex-col sm:flex-row gap-4 justify-center">
                <MagneticButton strength={0.3}>
                  <Link href="/waitlist">
                    <Button
                      variant="primary"
                      size="lg"
                      className="text-lg sm:text-xl px-8 py-5 sm:px-10 sm:py-7 group bg-gold hover:bg-gold-light text-black shadow-2xl"
                    >
                      Join Waitlist
                      <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                </MagneticButton>
                <MagneticButton strength={0.3}>
                  <Link href="/help">
                    <Button
                      variant="outline"
                      size="lg"
                      className="text-lg sm:text-xl px-8 py-5 sm:px-10 sm:py-7 border-2 border-gray-300 text-black hover:bg-gray-100 hover:text-black"
                    >
                      Visit Help Center
                    </Button>
                  </Link>
                </MagneticButton>
              </div>

              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-8 text-sm text-black">
                No credit card required • 5-minute setup • Cancel anytime
              </p>
            </ScrollFade>
          </div>
        </section>
      </main>

      <Footer />
      <StickyCTA />
    </div>
  );
}
