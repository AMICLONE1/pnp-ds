"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HostHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { motion } from "framer-motion";
import {
    IndianRupee,
    Zap,
    Wrench,
    Home,
    Leaf,
    ShieldCheck,
    ArrowRight,
    CheckCircle,
    ChevronDown,
    Ruler,
    Building2,
    Sun,
} from "lucide-react";

const benefits = [
    {
        icon: IndianRupee,
        title: "Zero Capital Expenditure",
        desc: "No upfront cost whatsoever. PowerNetPro handles the entire investment — panels, inverters, mounting, wiring, and commissioning.",
        gradient: "from-gold/20 to-gold/10",
    },
    {
        icon: Zap,
        title: "Instant Bill Reduction",
        desc: "Pay ₹10-12 per unit instead of ₹18-20 grid tariff. Savings begin from the very first month of operation.",
        gradient: "from-green-100 to-green-50",
    },
    {
        icon: Wrench,
        title: "Complete O&M Included",
        desc: "All maintenance, monitoring, panel cleaning, and compliance is handled by PowerNetPro throughout the PPA tenure.",
        gradient: "from-blue-100 to-blue-50",
    },
    {
        icon: Home,
        title: "Full Ownership at Year 15",
        desc: "After the PPA period, the entire solar plant is transferred to you at a nominal ₹1. From Year 16 onward, your electricity is effectively free.",
        gradient: "from-gold/20 to-gold/10",
    },
    {
        icon: Leaf,
        title: "Green Building Credentials",
        desc: "Earn sustainability credentials, reduce your carbon footprint, and attract environmentally conscious tenants and residents.",
        gradient: "from-green-100 to-green-50",
    },
    {
        icon: ShieldCheck,
        title: "Fully Insured & Secured",
        desc: "Standard Fire & Perils insurance coverage throughout the PPA tenure, including protection against cyclone, weather, and fire damage.",
        gradient: "from-blue-100 to-blue-50",
    },
];

const steps = [
    {
        step: "1",
        title: "Site Assessment",
        text: "Our engineers evaluate your rooftop — structural integrity, shading, available area, and grid connectivity. Completely free.",
    },
    {
        step: "2",
        title: "Custom Proposal",
        text: "Receive a detailed financial proposal showing projected generation, your fixed tariff rate, and 15-year savings vs. grid electricity.",
    },
    {
        step: "3",
        title: "Installation",
        text: "Our EPC partner installs the system. We handle all DISCOM approvals, net metering, and commissioning. Takes 3-4 weeks.",
    },
    {
        step: "4",
        title: "Start Saving",
        text: "System goes live. You consume solar electricity at a fixed low rate. Monitor everything in real-time through your dashboard.",
    },
];

const faqs = [
    {
        q: "Is there really zero cost to the host?",
        a: "Yes. PowerNetPro covers the entire capital expenditure — panels, inverters, mounting structures, wiring, and installation. The host pays nothing upfront. You simply pay for the solar electricity you consume at a pre-agreed rate of ₹10-12 per unit, which is substantially below the grid tariff of ₹18-20.",
    },
    {
        q: "What happens at the end of the 15-year PPA?",
        a: "At the end of the PPA period, the entire solar plant — panels, inverters, all equipment — is transferred to the host at a token amount of ₹1. From Year 16 onward, the electricity generated is effectively free for the host, with an expected remaining plant life of 10+ years.",
    },
    {
        q: "Who handles maintenance and repairs?",
        a: "PowerNetPro takes full responsibility for all operations and maintenance throughout the PPA tenure. This includes regular panel cleaning, performance monitoring, inverter servicing, and any necessary repairs. The AMC charges are included in your per-unit rate — no additional cost.",
    },
    {
        q: "What about net metering and DISCOM approvals?",
        a: "Our EPC partner handles all DISCOM liaison, net metering applications, and regulatory approvals. The net metering approval typically takes 6-8 weeks. Charges for net metering setup are borne by the host at actuals, but we expedite the process as much as possible.",
    },
    {
        q: "Is the solar system insured?",
        a: "Yes. PowerNetPro maintains Standard Fire and Perils Insurance coverage at its own cost throughout the entire PPA tenure. This covers damage from cyclone, weather events, and fire. The host is responsible for enhanced security of the solar panel system on their premises.",
    },
    {
        q: "Can housing societies and gated communities host?",
        a: "Absolutely. Housing societies are ideal hosts. The solar plant powers common area loads like lifts, parking lights, water pumps, and corridor lighting — all at a fraction of the grid cost. A committee resolution and basic documentation is all that's needed to get started.",
    },
];

const eligibility = [
    {
        icon: Ruler,
        title: "Available Rooftop",
        desc: "Minimum 4,000 sq.ft. of shadow-free rooftop area for a meaningful installation.",
    },
    {
        icon: Zap,
        title: "Monthly Electricity Bill",
        desc: "Common area bill of ₹50,000+ per month to ensure significant savings for your building.",
    },
    {
        icon: Building2,
        title: "Building Type",
        desc: "Residential societies, commercial offices, industrial facilities, or mixed-use buildings.",
    },
];

const trustItems = [
    "Housing Societies",
    "Commercial Buildings",
    "Industrial Facilities",
    "Educational Institutions",
];

export default function HostLandingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Host-specific header */}
            <HostHeader />

            <main className="flex-1 mt-[96px]">
                {/* ============================================ */}
                {/* HERO SECTION */}
                {/* ============================================ */}
                <section
                    id="overview"
                    className="relative overflow-hidden py-16 md:py-24 lg:py-32 px-4 md:px-8"
                >
                    {/* Background image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: "url('/images/host_landing_page_hero_background.jpg')" }}
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/60" />

                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative z-10">
                        {/* Left content */}
                        <motion.div
                            className="flex flex-col justify-center"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 text-gold text-xs font-semibold py-2 px-4 rounded-full mb-6 w-fit"
                            >
                                <Sun className="w-4 h-4" />
                                Zero Capital. Maximum Savings.
                            </motion.div>

                            <motion.h1
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.1] tracking-tight mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                Turn Your Rooftop Into a{" "}
                                <span className="text-gold">Revenue Machine</span>
                            </motion.h1>

                            <motion.p
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-base md:text-lg text-white/60 max-w-lg leading-relaxed mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                Host a commercial-scale solar plant on your property at zero
                                cost. Consume cheaper electricity from Day 1 and own the entire
                                system after 15 years.
                            </motion.p>

                            <motion.div
                                className="flex flex-wrap gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <Link
                                    href="#cta"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    className="inline-flex items-center gap-2 py-3 px-7 rounded-xl text-sm font-bold transition-all duration-300 bg-gold text-black hover:bg-gold-light hover:-translate-y-0.5 shadow-lg shadow-gold/20"
                                >
                                    Get Free Site Assessment
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="#how-it-works"
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    className="inline-flex items-center gap-2 py-3 px-7 rounded-xl text-sm font-bold transition-all duration-300 bg-transparent text-white border border-white/25 hover:border-white/50 hover:bg-white/5"
                                >
                                    See How It Works
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Right — savings preview card */}
                        <motion.div
                            className="flex items-center justify-center"
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.7 }}
                        >
                            <div className="glass-card rounded-2xl p-7 md:p-9 w-full max-w-md">
                                <div className="flex items-center justify-between mb-7">
                                    <span
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-white/50 text-xs font-semibold uppercase tracking-widest"
                                    >
                                        Host Savings Preview
                                    </span>
                                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                                </div>

                                <div className="flex items-baseline gap-2 mb-1.5">
                                    <span
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-5xl md:text-6xl font-heading font-bold text-gold leading-none"
                                    >
                                        40-50%
                                    </span>
                                </div>
                                <div
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    className="text-white/40 text-xs mb-7"
                                >
                                    Reduction in your electricity cost from Day 1
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: "₹10-12", label: "Your rate per unit" },
                                        { value: "₹18-20", label: "Grid rate per unit" },
                                        { value: "₹0", label: "Capital investment" },
                                        { value: "15 Yrs", label: "Full ownership transfer" },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="bg-white/5 border border-white/10 rounded-xl p-4"
                                        >
                                            <div
                                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                                className="text-lg md:text-xl font-bold text-white mb-0.5"
                                            >
                                                {item.value}
                                            </div>
                                            <div
                                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                                className="text-[11px] text-white/40"
                                            >
                                                {item.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ============================================ */}
                {/* TRUST BAR */}
                {/* ============================================ */}
                <div className="bg-gray-50 border-b border-gray-200 py-5 px-6 md:px-10">
                    <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
                        <span
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                            className="text-xs text-gray-400 font-semibold uppercase tracking-wider"
                        >
                            Trusted by
                        </span>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-center">
                            {trustItems.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-2 text-xs text-gray-700 font-medium"
                                >
                                    <div className="w-5 h-5 bg-gold/15 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-3 h-3 text-gold" />
                                    </div>
                                    <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ============================================ */}
                {/* BENEFITS */}
                {/* ============================================ */}
                <section id="benefits" className="bg-white py-12 md:py-16 px-6 md:px-10">
                    <div className="w-full mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="inline-flex items-center gap-2 bg-gold/15 text-gold px-4 py-2 rounded-full text-xs font-semibold mb-4 border border-gold/10"
                            >
                                Why Host With Us
                            </span>
                            <h2
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-black mb-3"
                            >
                                Six reasons property owners
                                <br className="hidden sm:block" /> choose PowerNetPro
                            </h2>
                            <p
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-base md:text-lg text-gray-500 max-w-xl leading-relaxed mb-12"
                            >
                                We install, maintain, and manage everything. You just provide
                                the rooftop and enjoy cheaper electricity.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {benefits.map((b, idx) => (
                                <motion.div
                                    key={b.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                                >
                                    <div className="bg-white border border-gray-200 rounded-2xl p-7 md:p-8 transition-all duration-300 relative overflow-hidden group hover:border-gold/50 hover:shadow-lg hover:-translate-y-1 h-full">
                                        {/* Top accent */}
                                        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold to-gold-light opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        <div
                                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
                                        >
                                            <b.icon className="w-6 h-6 text-gold" />
                                        </div>
                                        <h3
                                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                                            className="text-base font-bold mb-2 text-black group-hover:text-gold transition-colors duration-300"
                                        >
                                            {b.title}
                                        </h3>
                                        <p
                                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                                            className="text-sm text-gray-500 leading-relaxed"
                                        >
                                            {b.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============================================ */}
                {/* HOW IT WORKS */}
                {/* ============================================ */}
                <section
                    id="how-it-works"
                    className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 px-6 md:px-10"
                >
                    <div className="w-full mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="inline-flex items-center gap-2 bg-gold/15 text-gold px-4 py-2 rounded-full text-xs font-semibold mb-4 border border-gold/10"
                            >
                                The Process
                            </span>
                            <h2
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-black mb-3"
                            >
                                From assessment to activation
                                <br className="hidden sm:block" /> in 4 simple steps
                            </h2>
                            <p
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-base md:text-lg text-gray-500 max-w-xl leading-relaxed mb-14"
                            >
                                Our team handles every aspect of the process. Here&apos;s what
                                to expect.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                            {/* Progress line (desktop) */}
                            <div className="hidden lg:block absolute top-[40px] left-[80px] right-[80px] h-0.5 bg-gradient-to-r from-gold/30 via-gold/50 to-gold/30" />

                            {steps.map((item, idx) => (
                                <motion.div
                                    key={item.step}
                                    className="text-center relative"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.12, duration: 0.5 }}
                                >
                                    <div className="w-[72px] h-[72px] rounded-full bg-white border-2 border-gold flex items-center justify-center mx-auto mb-5 relative z-10 shadow-md">
                                        <span
                                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                                            className="text-2xl font-heading font-bold text-gold"
                                        >
                                            {item.step}
                                        </span>
                                    </div>
                                    <h4
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-base font-bold mb-2 text-black"
                                    >
                                        {item.title}
                                    </h4>
                                    <p
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-sm text-gray-500 leading-relaxed max-w-[240px] mx-auto"
                                    >
                                        {item.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============================================ */}
                {/* SAVINGS COMPARISON */}
                {/* ============================================ */}
                <section id="savings" className="bg-white py-12 md:py-16 px-6 md:px-10">
                    <div className="w-full mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="inline-flex items-center gap-2 bg-gold/15 text-gold px-4 py-2 rounded-full text-xs font-semibold mb-4 border border-gold/10"
                            >
                                The Numbers
                            </span>
                            <h2
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-black mb-3"
                            >
                                See what you save,
                                <br className="hidden sm:block" /> month after month
                            </h2>
                            <p
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-base md:text-lg text-gray-500 max-w-xl leading-relaxed mb-12"
                            >
                                A side-by-side look at what you&apos;re paying now vs. what
                                you&apos;d pay with PowerNetPro solar on your rooftop.
                            </p>
                        </motion.div>

                        <motion.div
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {/* Without solar */}
                                <div className="bg-gray-50 md:border-r border-b md:border-b-0 border-gray-200 p-8 md:p-12">
                                    <div
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-400"
                                    >
                                        Without Solar (Grid)
                                    </div>
                                    <div
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-4xl md:text-5xl font-heading font-bold mb-1.5 text-black"
                                    >
                                        ₹18-20
                                    </div>
                                    <div
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-sm text-gray-500"
                                    >
                                        per unit (kWh) — and rising annually
                                    </div>
                                </div>

                                {/* With solar */}
                                <div
                                    className="p-8 md:p-12 text-white"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #0D2818, #1B5E3E)",
                                    }}
                                >
                                    <div
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-xs font-bold uppercase tracking-widest mb-2 text-gold"
                                    >
                                        With PowerNetPro Solar
                                    </div>
                                    <div
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-4xl md:text-5xl font-heading font-bold mb-1.5 text-white"
                                    >
                                        ₹10-12
                                    </div>
                                    <div
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-sm text-white/60"
                                    >
                                        per unit (kWh) — fixed for 15 years
                                    </div>
                                </div>
                            </div>

                            {/* Bottom summary */}
                            <div className="p-6 md:p-10 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left border-t border-gray-200">
                                <div className="bg-gold/15 text-gold font-heading font-bold text-2xl md:text-3xl py-2.5 px-6 rounded-xl shrink-0">
                                    40-50%
                                </div>
                                <span
                                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                                    className="text-sm md:text-base text-gray-600 font-medium max-w-md"
                                >
                                    savings on your electricity bill, every single month for 15
                                    years. Then the plant is yours — free power for 10+ years
                                    more.
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ============================================ */}
                {/* ELIGIBILITY */}
                {/* ============================================ */}
                <section
                    id="eligibility"
                    className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16 px-6 md:px-10"
                >
                    <div className="w-full mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="inline-flex items-center gap-2 bg-gold/15 text-gold px-4 py-2 rounded-full text-xs font-semibold mb-4 border border-gold/10"
                            >
                                Are You Eligible?
                            </span>
                            <h2
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-black mb-3"
                            >
                                Check if your property qualifies
                            </h2>
                            <p
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-base md:text-lg text-gray-500 max-w-xl leading-relaxed mb-12"
                            >
                                Most commercial and large residential properties with adequate
                                rooftop space are eligible. Here&apos;s what we look for.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            {eligibility.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    className="bg-white border border-gray-200 rounded-2xl p-8 md:p-9 text-center transition-all duration-300 hover:border-gold/50 hover:shadow-lg hover:-translate-y-1"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                                >
                                    <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-5">
                                        <item.icon className="w-6 h-6 text-gold" />
                                    </div>
                                    <h4
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-base font-bold mb-2 text-black"
                                    >
                                        {item.title}
                                    </h4>
                                    <p
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="text-sm text-gray-500 leading-relaxed"
                                    >
                                        {item.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============================================ */}
                {/* FAQ */}
                {/* ============================================ */}
                <section id="faq" className="bg-white py-12 md:py-16 px-6 md:px-10 w-full">
                    <div className="w-full mx-auto flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="inline-flex items-center gap-2 bg-gold/15 text-gold px-4 py-2 rounded-full text-xs font-semibold mb-4 border border-gold/10"
                            >
                                Common Questions
                            </span>
                            <h2
                                style={{ fontFamily: "'Montserrat', sans-serif" }}
                                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-black mb-10"
                            >
                                Everything hosts want to know
                            </h2>
                        </motion.div>

                        <div className="max-w-3xl">
                            {faqs.map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    className="border-b border-gray-200"
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                                >
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                                        className="flex items-center justify-between w-full bg-transparent border-none text-sm md:text-base font-bold text-black text-left py-5 cursor-pointer group"
                                    >
                                        <span className="pr-4 group-hover:text-gold transition-colors duration-200">
                                            {faq.q}
                                        </span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${openFaq === idx ? "rotate-180 text-gold" : ""
                                                }`}
                                        />
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? "max-h-[500px] pb-5" : "max-h-0"
                                            }`}
                                    >
                                        <p
                                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                                            className="text-sm text-gray-500 leading-relaxed"
                                        >
                                            {faq.a}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ============================================ */}
                {/* CTA */}
                <section id="cta" className="text-center py-[100px] px-6 md:px-12" style={{ background: 'linear-gradient(175deg, #0F4425 0%, #0A0A0A 100%)' }}>
                    <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(32px,4vw,50px)] font-medium text-white leading-[1.15] mb-4">
                        Ready to save <span className="text-[#D4A843] italic">40-50%</span><br aria-hidden="true" className="hidden sm:block" /> on your electricity bill?
                    </h2>
                    <p className="text-[17px] text-white/55 max-w-[520px] mx-auto mb-10 leading-[1.6]">
                        Get a free site assessment and a customised proposal for your property — no commitment required.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3.5">
                        <a href="https://wa.me/918805881601" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl text-[15px] font-semibold transition-all duration-250 bg-[#D4A843] text-[#0A0A0A] hover:bg-[#c49a38] hover:-translate-y-[1px]">
                            Message 8805 881 601
                        </a>
                        <a href="https://www.powernetpro.com" className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl text-[15px] font-semibold transition-all duration-250 bg-transparent text-white border-[1.5px] border-white/25 hover:border-white/50 hover:bg-white/5">
                            Visit powernetpro.com →
                        </a>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-[#0A0A0A] py-[64px] px-6 md:px-10 pb-8 text-white/50">
                    <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-2 mb-4 text-white no-underline w-fit">
                                <span className="font-semibold text-[17px] tracking-tight">PowerNetPro</span>
                            </Link>
                            <p className="text-[14px] leading-[1.6] max-w-[280px]">
                                Democratising solar energy access through digital infrastructure. Solar savings without a rooftop.
                            </p>
                        </div>

                        <div>
                            <h5 className="text-white/30 text-[11px] font-semibold uppercase tracking-[1.5px] mb-4">Platform</h5>
                            <div className="flex flex-col gap-2.5">
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">For Subscribers</Link>
                                <Link href="/" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">For Hosts</Link>
                                <Link href="#how-it-works" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">How It Works</Link>
                                <Link href="#savings" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">Pricing</Link>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-white/30 text-[11px] font-semibold uppercase tracking-[1.5px] mb-4">Company</h5>
                            <div className="flex flex-col gap-2.5">
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">About Us</Link>
                                <Link href="/blog" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">Blog</Link>
                                <Link href="/contact" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">Contact</Link>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-white/30 text-[11px] font-semibold uppercase tracking-[1.5px] mb-4">Legal</h5>
                            <div className="flex flex-col gap-2.5">
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">Terms of Service</Link>
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">Privacy Policy</Link>
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">PPA Agreement</Link>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[13px] gap-4">
                        <span>© 2026 PowerNetPro Pvt Ltd. All rights reserved.</span>
                        <span>Pune, Maharashtra, India</span>
                    </div>
                </footer>
            </main>
        </div>
    )
}
