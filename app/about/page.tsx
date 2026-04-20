"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sun,
  Target,
  Eye,
  Linkedin,
  ArrowRight,
  Zap,
  Users,
  Building2,
  Globe,
} from "lucide-react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL,
  COMPANY_LEGAL_NAME,
  COMPANY_CIN,
  COMPANY_DIPP,
  COMPANY_FULL_ADDRESS,
} from "@/lib/contact";

const founders = [
  {
    name: "Omkar Kolhe",
    role: "Founder & CEO",
    image: "/images/omk.jpg",
    linkedin: "https://www.linkedin.com/in/omkarkolhe",
  },
  {
    name: "Jinal Rathod",
    role: "Co-founder & CFO",
    image: "/images/Jinal.jpeg",
    linkedin: "https://www.linkedin.com/in/jinalrathod03/",
  },
];

const stats = [
  { label: "Founded", value: "2026" },
  { label: "Headquarters", value: "India" },
  { label: "Focus", value: "Community Solar" },
  { label: "Model", value: "Subscription" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-forest via-forest to-forest-light pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
            <motion.div
              className="absolute top-20 right-16 hidden lg:block"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <Sun className="w-32 h-32 text-gold/10" strokeWidth={0.6} />
            </motion.div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-full mb-6">
                <Sun className="w-4 h-4 text-gold" />
                <span
                  className="text-sm font-semibold text-white/80"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  About PowerNetPro
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-heading mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Making solar accessible to{" "}
                <span className="text-gold">every apartment resident</span>
              </h1>

              <p
                className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                No rooftop needed. No installation. No complexity. Just clean,
                affordable solar energy — delivered digitally.
              </p>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12"
            >
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">
                    {s.label}
                  </p>
                  <p
                    className="text-lg font-bold text-white mt-1"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {s.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
              {/* Mission */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-gold" />
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-black font-heading"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Our Mission
                  </h2>
                </div>
                <p
                  className="text-gray-600 leading-relaxed text-base sm:text-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  To break the barrier between clean energy and the people who
                  need it most. Millions of urban Indian families want solar but
                  are locked out — not because it&apos;s expensive, but because they
                  live in apartments. We exist to change that.
                </p>
                <p
                  className="text-gray-600 leading-relaxed text-base sm:text-lg mt-4"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  PowerNetPro is building the platform that turns idle rooftops
                  into shared solar assets and puts affordable clean energy
                  within reach of every household — no ownership required, no
                  installation, no complexity.
                </p>
                <div className="mt-6 p-5 rounded-2xl bg-gold/5 border border-gold/15">
                  <p
                    className="text-sm font-semibold text-forest italic"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    &ldquo;We believe access to solar shouldn&apos;t depend on the kind
                    of building you live in. One subscription at a time, we&apos;re
                    making clean energy a basic utility, not a luxury.&rdquo;
                  </p>
                </div>
              </motion.div>

              {/* Vision */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest/20 to-emerald-500/10 flex items-center justify-center">
                    <Eye className="w-6 h-6 text-forest" />
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold text-black font-heading"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Our Vision
                  </h2>
                </div>
                <p
                  className="text-gray-600 leading-relaxed text-base sm:text-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  To build India&apos;s largest distributed solar network — where
                  every apartment resident can subscribe to clean energy as
                  effortlessly as they recharge their phone. We see a future
                  where thousands of urban rooftops across the country are
                  generating solar power, millions of households are saving on
                  electricity without owning a single panel, and energy flows
                  between communities through a decentralized digital
                  marketplace.
                </p>
                <p
                  className="text-gray-600 leading-relaxed text-base sm:text-lg mt-4"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  PowerNetPro isn&apos;t just a solar company — we&apos;re building the
                  infrastructure layer for how urban India will produce, consume,
                  and trade energy for the next decade.
                </p>
                <div className="mt-6 p-5 rounded-2xl bg-forest/5 border border-forest/15">
                  <p
                    className="text-sm font-semibold text-forest italic"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    &ldquo;Our north star is simple: if you have an electricity bill,
                    you should have access to solar. Period.&rdquo;
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What drives us */}
        <section className="py-16 sm:py-20 bg-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2
                className="text-2xl sm:text-3xl font-bold text-black font-heading"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                What Drives Us
              </h2>
            </motion.div>

            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: Zap,
                  title: "Accessibility",
                  desc: "Solar for apartment residents who can't install panels",
                },
                {
                  icon: Users,
                  title: "Community",
                  desc: "Shared rooftops powering entire neighborhoods",
                },
                {
                  icon: Building2,
                  title: "Simplicity",
                  desc: "Subscribe like a utility — no hardware, no hassle",
                },
                {
                  icon: Globe,
                  title: "Impact",
                  desc: "Every kWh offsets carbon and lowers energy costs",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-gold/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3
                    className="font-bold text-black mb-2"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-gray-500"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Founding Team */}
        <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-4">
                <Users className="w-4 h-4 text-gold" />
                <span
                  className="text-sm font-semibold text-black"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Founding Team
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black font-heading"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                The People Behind{" "}
                <span className="text-gold">PowerNetPro</span>
              </h2>
            </motion.div>

            <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12 max-w-3xl mx-auto">
              {founders.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="flex-1 group"
                >
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-xl transition-all duration-500">
                    {/* Photo */}
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <Image
                        src={f.image}
                        alt={f.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* LinkedIn button */}
                      <a
                        href={f.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-white/50 text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all duration-300 shadow-lg"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>

                      {/* Name overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3
                          className="text-xl sm:text-2xl font-bold text-white"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          {f.name}
                        </h3>
                        <p
                          className="text-gold font-semibold text-sm mt-1"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          {f.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Registration Details */}
        <section className="py-16 sm:py-20 bg-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-4">
                  <Building2 className="w-4 h-4 text-gold" />
                  <span
                    className="text-sm font-semibold text-black"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Company Registration
                  </span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-black font-heading"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Company Registration Details
                </h2>
              </div>

              <div
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <p className="text-gray-700">
                  <strong className="text-black">Legal Name:</strong> {COMPANY_LEGAL_NAME}
                </p>
                <p className="text-gray-700">
                  <strong className="text-black">Corporate Identification Number (CIN):</strong> {COMPANY_CIN}
                </p>
                <p className="text-gray-700">
                  <strong className="text-black">Startup India Recognition (DIPP):</strong> {COMPANY_DIPP}
                </p>
                <p className="text-gray-700">
                  <strong className="text-black">Registered Office:</strong> {COMPANY_FULL_ADDRESS}
                </p>
                <p className="text-gray-700">
                  <strong className="text-black">Email:</strong>{" "}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline">{SUPPORT_EMAIL}</a>
                </p>
                <p className="text-gray-700">
                  <strong className="text-black">Phone:</strong>{" "}
                  <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-gold hover:underline">{SUPPORT_PHONE}</a>
                </p>

                <p
                  className="text-gray-600 leading-relaxed pt-4 border-t border-gray-100 mt-4 text-sm"
                >
                  {COMPANY_LEGAL_NAME} is a company registered under the Companies Act, 2013, recognized by Startup India under the Department for Promotion of Industry and Internal Trade (DPIIT).
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-forest via-forest to-forest-light relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-3xl sm:text-4xl font-bold text-white font-heading mb-4"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Ready to go solar?
              </h2>
              <p
                className="text-white/60 mb-8 max-w-xl mx-auto"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Join the movement. Subscribe to clean energy and start saving
                from day one.
              </p>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 bg-gold text-forest font-bold text-lg rounded-full shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto group transition-all"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
