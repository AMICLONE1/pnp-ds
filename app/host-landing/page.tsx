"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

export default function HostLandingPage() {
    const [activeSection, setActiveSection] = useState("");
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("section[id]");
            let current = "";
            sections.forEach((section) => {
                const element = section as HTMLElement;
                const sectionTop = element.offsetTop - 140;
                if (window.scrollY >= sectionTop) {
                    current = element.getAttribute("id") || "";
                }
            });
            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="font-['DM_Sans',-apple-system,sans-serif] text-[#1A1A18] bg-[#FAFAF8] antialiased leading-relaxed overflow-x-hidden">
            {/* ===== PRIMARY NAVIGATION ===== */}
            <nav className="fixed top-0 left-0 right-0 h-[64px] bg-[#0A0A0A] z-[1000] flex items-center justify-between px-5 md:px-12 border-b border-white/10">
                <Link href="/" className="flex items-center gap-2.5 text-white no-underline">
                    <div className="w-8 h-8 md:w-8 md:h-8 bg-[#D4A843] rounded-lg flex items-center justify-center font-bold text-sm text-[#0A0A0A]">
                        P
                    </div>
                    <span className="font-semibold text-[17px] tracking-tight">PowerNetPro</span>
                </Link>
                <ul className="hidden md:flex items-center gap-2 list-none m-0 p-0">
                    <li>
                        <Link href="#" className="text-white/70 hover:text-white hover:bg-white/5 py-2 px-4 rounded-lg text-sm transition-all duration-200">
                            For Subscribers
                        </Link>
                    </li>
                    <li className="relative group">
                        <Link href="#" className="text-white font-medium hover:bg-white/5 py-2 px-4 rounded-lg text-sm transition-all duration-200 flex items-center">
                            For Hosts
                            <span className="ml-1.5 opacity-60 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-current inline-block w-0 h-0 align-middle"></span>
                        </Link>
                        <div className="absolute top-[calc(100%+8px)] left-0 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.15)] rounded-xl p-2 min-w-[200px] opacity-0 pointer-events-none translate-y-[-4px] group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 transition-all duration-200 z-[1001]">
                            <Link href="#benefits" className="block text-[#4A4A47] hover:bg-[#F7F7F5] hover:text-[#0A0A0A] py-2.5 px-3.5 rounded-lg text-sm">Benefits</Link>
                            <Link href="#how-it-works" className="block text-[#4A4A47] hover:bg-[#F7F7F5] hover:text-[#0A0A0A] py-2.5 px-3.5 rounded-lg text-sm">How It Works</Link>
                            <Link href="#savings" className="block text-[#4A4A47] hover:bg-[#F7F7F5] hover:text-[#0A0A0A] py-2.5 px-3.5 rounded-lg text-sm">Savings</Link>
                            <Link href="#eligibility" className="block text-[#4A4A47] hover:bg-[#F7F7F5] hover:text-[#0A0A0A] py-2.5 px-3.5 rounded-lg text-sm">Eligibility</Link>
                            <Link href="#faq" className="block text-[#4A4A47] hover:bg-[#F7F7F5] hover:text-[#0A0A0A] py-2.5 px-3.5 rounded-lg text-sm">FAQ</Link>
                        </div>
                    </li>
                    <li>
                        <Link href="#" className="text-white/70 hover:text-white hover:bg-white/5 py-2 px-4 rounded-lg text-sm transition-all duration-200">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="text-white/70 hover:text-white hover:bg-white/5 py-2 px-4 rounded-lg text-sm transition-all duration-200">
                            Blog
                        </Link>
                    </li>
                </ul>
                <div className="flex items-center gap-3">
                    <Link href="#" className="text-white/80 hover:text-white hover:bg-white/5 text-sm py-2 px-4 rounded-lg transition-all duration-200 hidden sm:inline-block">
                        Log in
                    </Link>
                    <Link href="#" className="bg-[#D4A843] hover:bg-[#c49a38] text-[#0A0A0A] font-semibold text-sm py-2 px-5 rounded-lg transition-all duration-200 text-center">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* ===== SECONDARY NAVIGATION ===== */}
            <div className="fixed top-[64px] left-0 right-0 h-[48px] bg-white z-[999] flex items-center justify-between px-5 md:px-12 border-b border-[#EBEBEA] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-1">
                    <div className="hidden sm:block text-[13px] font-semibold text-[#0F4425] py-1.5 px-3.5 bg-[#E8F5ED] rounded-md mr-3 tracking-[0.3px] uppercase">
                        Host
                    </div>
                    <ul className="flex items-center gap-0 list-none m-0 p-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
                        {['benefits', 'how-it-works', 'savings', 'eligibility', 'faq'].map((id) => (
                            <li key={id}>
                                <Link
                                    href={`#${id}`}
                                    className={`text-[13.5px] font-medium py-1.5 px-3.5 rounded-md transition-all duration-150 inline-block capitalize ${activeSection === id ? 'text-[#0F4425] bg-[#E8F5ED]' : 'text-[#8A8A87] hover:text-[#1A1A18] hover:bg-[#F7F7F5]'}`}
                                >
                                    {id.replace(/-/g, ' ')}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex items-center gap-2.5">
                    <a href="tel:+918180861415" className="hidden sm:inline-block text-[13px] font-semibold py-1.5 px-4.5 rounded-md transition-all duration-200 text-[#0F4425] border-[1.5px] border-[#0F4425] bg-transparent hover:bg-[#E8F5ED]">
                        Call Us
                    </a>
                    <Link href="#cta" className="text-[13px] font-semibold py-1.5 px-4 inline-block rounded-md transition-all duration-200 bg-[#1B6B3A] text-white border-[1.5px] border-[#1B6B3A] hover:bg-[#0F4425]">
                        Get <span className="hidden sm:inline">a Free</span> Assessment
                    </Link>
                </div>
            </div>

            {/* ===== PAGE CONTENT ===== */}
            <div className="mt-[112px]"> {/* nav + subnav height */}

                {/* HERO */}
                <section className="min-h-[92vh] flex items-center relative overflow-hidden py-[60px] md:py-[80px] px-5 md:px-12" style={{ background: 'linear-gradient(175deg, #0A0A0A 0%, #162B1A 45%, #0F4425 100%)' }} id="overview">
                    {/* Decorative background glows */}
                    <div className="absolute top-[-200px] right-[-200px] w-[800px] h-[800px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.12) 0%, transparent 70%)' }} />
                    <div className="absolute bottom-[-100px] left-[20%] w-[600px] h-[600px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(27,107,58,0.2) 0%, transparent 70%)' }} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[48px] md:gap-[80px] max-w-[1280px] w-full mx-auto relative z-10">
                        <div className="flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 bg-[#D4A843]/15 border border-[#D4A843]/30 text-[#D4A843] text-[13px] font-medium py-1.5 px-4 rounded-full mb-7 w-fit animate-[fadeInUp_0.6s_ease]">
                                <span className="text-[14px]">☀</span> Zero Capital. Maximum Savings.
                            </div>
                            <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(42px,5vw,64px)] font-medium text-white leading-[1.1] tracking-[-1px] mb-6 animate-[fadeInUp_0.6s_ease_0.1s_both]">
                                Turn Your Rooftop Into a <span className="text-[#D4A843] italic">Revenue Machine</span>
                            </h1>
                            <p className="text-[18px] text-white/65 max-w-[520px] leading-[1.65] mb-10 animate-[fadeInUp_0.6s_ease_0.2s_both]">
                                Host a commercial-scale solar plant on your property at zero cost. Consume cheaper electricity from Day 1 and own the entire system after 15 years.
                            </p>
                            <div className="flex flex-wrap gap-3.5 animate-[fadeInUp_0.6s_ease_0.3s_both]">
                                <Link href="#cta" className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl text-[15px] font-semibold transition-all duration-250 bg-[#D4A843] text-[#0A0A0A] hover:bg-[#c49a38] hover:-translate-y-[1px]">
                                    Get Free Site Assessment →
                                </Link>
                                <Link href="#how-it-works" className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl text-[15px] font-semibold transition-all duration-250 bg-transparent text-white border-[1.5px] border-white/25 hover:border-white/50 hover:bg-white/5">
                                    See How It Works
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center justify-center animate-[fadeInUp_0.8s_ease_0.3s_both]">
                            <div className="bg-white/5 backdrop-blur-[20px] border border-white/10 rounded-[20px] p-8 md:p-10 w-full max-w-[480px]">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-white/50 text-[13px] font-medium uppercase tracking-[1px]">Host Savings Preview</span>
                                    <div className="w-2 h-2 bg-[#4ADE80] rounded-full animate-pulse"></div>
                                </div>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="font-['Playfair_Display',Georgia,serif] text-[48px] md:text-[56px] font-semibold text-[#D4A843] leading-[1]">40-50%</span>
                                </div>
                                <div className="text-white/40 text-[13px] mb-8">Reduction in your electricity cost from Day 1</div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 md:p-5">
                                        <div className="text-[20px] md:text-[22px] font-bold text-white mb-0.5">₹10-12</div>
                                        <div className="text-[12px] text-white/40">Your rate per unit</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 md:p-5">
                                        <div className="text-[20px] md:text-[22px] font-bold text-white mb-0.5">₹18-20</div>
                                        <div className="text-[12px] text-white/40">Grid rate per unit</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 md:p-5">
                                        <div className="text-[20px] md:text-[22px] font-bold text-white mb-0.5">₹0</div>
                                        <div className="text-[12px] text-white/40">Capital investment</div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 md:p-5">
                                        <div className="text-[20px] md:text-[22px] font-bold text-white mb-0.5">15 Yrs</div>
                                        <div className="text-[12px] text-white/40">Full ownership transfer</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TRUST BAR */}
                <div className="bg-[#F7F7F5] border-b border-[#EBEBEA] py-5 px-5 md:px-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
                    <span className="text-[13px] text-[#8A8A87] font-medium">Trusted by</span>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 items-center">
                        {['Housing Societies', 'Commercial Buildings', 'Industrial Facilities', 'Educational Institutions'].map((item) => (
                            <div key={item} className="flex items-center gap-2 text-[13px] text-[#4A4A47] font-medium">
                                <div className="w-5 h-5 bg-[#E8F5ED] rounded-full flex items-center justify-center text-[#1B6B3A] text-[11px]">
                                    <Check size={11} strokeWidth={3} />
                                </div>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* BENEFITS */}
                <section id="benefits" className="bg-[#FAFAF8] py-[64px] md:py-[100px] px-5 md:px-12">
                    <div className="max-w-[1120px] mx-auto">
                        <div className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#1B6B3A] mb-3">Why Host With Us</div>
                        <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(32px,3.5vw,48px)] font-medium leading-[1.15] tracking-[-0.5px] text-[#1A1A18] mb-4">
                            Six reasons property owners<br aria-hidden="true" className="hidden sm:block" /> choose PowerNetPro
                        </h2>
                        <p className="text-[17px] text-[#8A8A87] max-w-[600px] leading-[1.6] mb-[56px]">
                            We install, maintain, and manage everything. You just provide the rooftop and enjoy cheaper electricity.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {/* Benefit 1 */}
                            <div className="bg-white border border-[#EBEBEA] rounded-2xl p-7 md:p-8 transition-all duration-300 relative overflow-hidden group hover:border-[#1B6B3A] hover:shadow-[0_8px_32px_rgba(27,107,58,0.08)] hover:-translate-y-1">
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1B6B3A] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="w-12 h-12 rounded-xl bg-[#F2E6C5] flex items-center justify-center text-[22px] mb-5">💰</div>
                                <h3 className="text-[18px] font-semibold mb-2.5 text-[#1A1A18]">Zero Capital Expenditure</h3>
                                <p className="text-[14.5px] text-[#8A8A87] leading-[1.55]">No upfront cost whatsoever. PowerNetPro handles the entire investment — panels, inverters, mounting, wiring, and commissioning.</p>
                            </div>

                            {/* Benefit 2 */}
                            <div className="bg-white border border-[#EBEBEA] rounded-2xl p-7 md:p-8 transition-all duration-300 relative overflow-hidden group hover:border-[#1B6B3A] hover:shadow-[0_8px_32px_rgba(27,107,58,0.08)] hover:-translate-y-1">
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1B6B3A] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="w-12 h-12 rounded-xl bg-[#E8F5ED] flex items-center justify-center text-[22px] mb-5">⚡</div>
                                <h3 className="text-[18px] font-semibold mb-2.5 text-[#1A1A18]">Instant Bill Reduction</h3>
                                <p className="text-[14.5px] text-[#8A8A87] leading-[1.55]">Pay ₹10-12 per unit instead of ₹18-20 grid tariff. Savings begin from the very first month of operation.</p>
                            </div>

                            {/* Benefit 3 */}
                            <div className="bg-white border border-[#EBEBEA] rounded-2xl p-7 md:p-8 transition-all duration-300 relative overflow-hidden group hover:border-[#1B6B3A] hover:shadow-[0_8px_32px_rgba(27,107,58,0.08)] hover:-translate-y-1">
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1B6B3A] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="w-12 h-12 rounded-xl bg-[#F5F0E8] flex items-center justify-center text-[22px] mb-5">🔧</div>
                                <h3 className="text-[18px] font-semibold mb-2.5 text-[#1A1A18]">Complete O&M Included</h3>
                                <p className="text-[14.5px] text-[#8A8A87] leading-[1.55]">All maintenance, monitoring, panel cleaning, and compliance is handled by PowerNetPro throughout the PPA tenure.</p>
                            </div>

                            {/* Benefit 4 */}
                            <div className="bg-white border border-[#EBEBEA] rounded-2xl p-7 md:p-8 transition-all duration-300 relative overflow-hidden group hover:border-[#1B6B3A] hover:shadow-[0_8px_32px_rgba(27,107,58,0.08)] hover:-translate-y-1">
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1B6B3A] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="w-12 h-12 rounded-xl bg-[#F2E6C5] flex items-center justify-center text-[22px] mb-5">🏠</div>
                                <h3 className="text-[18px] font-semibold mb-2.5 text-[#1A1A18]">Full Ownership at Year 15</h3>
                                <p className="text-[14.5px] text-[#8A8A87] leading-[1.55]">After the PPA period, the entire solar plant is transferred to you at a nominal ₹1. From Year 16 onward, your electricity is effectively free.</p>
                            </div>

                            {/* Benefit 5 */}
                            <div className="bg-white border border-[#EBEBEA] rounded-2xl p-7 md:p-8 transition-all duration-300 relative overflow-hidden group hover:border-[#1B6B3A] hover:shadow-[0_8px_32px_rgba(27,107,58,0.08)] hover:-translate-y-1">
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1B6B3A] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="w-12 h-12 rounded-xl bg-[#E8F5ED] flex items-center justify-center text-[22px] mb-5">🌱</div>
                                <h3 className="text-[18px] font-semibold mb-2.5 text-[#1A1A18]">Green Building Credentials</h3>
                                <p className="text-[14.5px] text-[#8A8A87] leading-[1.55]">Earn sustainability credentials, reduce your carbon footprint, and attract environmentally conscious tenants and residents.</p>
                            </div>

                            {/* Benefit 6 */}
                            <div className="bg-white border border-[#EBEBEA] rounded-2xl p-7 md:p-8 transition-all duration-300 relative overflow-hidden group hover:border-[#1B6B3A] hover:shadow-[0_8px_32px_rgba(27,107,58,0.08)] hover:-translate-y-1">
                                <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#1B6B3A] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="w-12 h-12 rounded-xl bg-[#F5F0E8] flex items-center justify-center text-[22px] mb-5">🛡️</div>
                                <h3 className="text-[18px] font-semibold mb-2.5 text-[#1A1A18]">Fully Insured & Secured</h3>
                                <p className="text-[14.5px] text-[#8A8A87] leading-[1.55]">Standard Fire & Perils insurance coverage throughout the PPA tenure, including protection against cyclone, weather, and fire damage.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section id="how-it-works" className="bg-[#F5F0E8] py-[64px] md:py-[100px] px-5 md:px-12">
                    <div className="max-w-[1120px] mx-auto">
                        <div className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#1B6B3A] mb-3">The Process</div>
                        <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(32px,3.5vw,48px)] font-medium leading-[1.15] tracking-[-0.5px] text-[#1A1A18] mb-4">
                            From assessment to activation<br aria-hidden="true" className="hidden sm:block" /> in 4 simple steps
                        </h2>
                        <p className="text-[17px] text-[#8A8A87] max-w-[600px] leading-[1.6] mb-[56px]">
                            Our team handles every aspect of the process. Here&apos;s what to expect.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative items-start z-10">
                            {/* Progress Line (Desktop) */}
                            <div className="hidden lg:block absolute top-[36px] left-[60px] right-[60px] h-[2px] bg-[#D4A843] opacity-30 -z-10" />

                            {[{
                                step: '1', title: 'Site Assessment', text: 'Our engineers evaluate your rooftop — structural integrity, shading, available area, and grid connectivity. Completely free.'
                            }, {
                                step: '2', title: 'Custom Proposal', text: 'Receive a detailed financial proposal showing projected generation, your fixed tariff rate, and 15-year savings vs. grid electricity.'
                            }, {
                                step: '3', title: 'Installation', text: 'Our EPC partner installs the system. We handle all DISCOM approvals, net metering, and commissioning. Takes 3-4 weeks.'
                            }, {
                                step: '4', title: 'Start Saving', text: 'System goes live. You consume solar electricity at a fixed low rate. Monitor everything in real-time through your dashboard.'
                            }].map((item) => (
                                <div key={item.step} className="text-center relative">
                                    <div className="w-[72px] h-[72px] rounded-full bg-white border-2 border-[#D4A843] flex items-center justify-center font-['Playfair_Display',Georgia,serif] text-[28px] font-semibold text-[#D4A843] mx-auto mb-6 relative z-10 shadow-sm">
                                        {item.step}
                                    </div>
                                    <h4 className="text-[17px] font-semibold mb-2.5 text-[#1A1A18]">{item.title}</h4>
                                    <p className="text-[14px] text-[#8A8A87] leading-[1.55] max-w-[240px] mx-auto">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SAVINGS COMPARISON */}
                <section id="savings" className="bg-[#FAFAF8] py-[64px] md:py-[100px] px-5 md:px-12">
                    <div className="max-w-[1120px] mx-auto">
                        <div className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#1B6B3A] mb-3">The Numbers</div>
                        <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(32px,3.5vw,48px)] font-medium leading-[1.15] tracking-[-0.5px] text-[#1A1A18] mb-4">
                            See what you save,<br aria-hidden="true" className="hidden sm:block" /> month after month
                        </h2>
                        <p className="text-[17px] text-[#8A8A87] max-w-[600px] leading-[1.6] mb-[56px]">
                            A side-by-side look at what you&apos;re paying now vs. what you&apos;d pay with PowerNetPro solar on your rooftop.
                        </p>

                        <div className="bg-white border border-[#EBEBEA] rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="bg-[#F7F7F5] md:border-r border-[#EBEBEA] p-10 md:p-12">
                                    <div className="text-[12px] font-semibold uppercase tracking-[1.5px] mb-2 text-[#8A8A87]">Without Solar (Grid)</div>
                                    <div className="font-['Playfair_Display',Georgia,serif] text-[42px] font-semibold mb-1.5 text-[#1A1A18]">₹18-20</div>
                                    <div className="text-[14px] text-[#8A8A87]">per unit (kWh) — and rising annually</div>
                                </div>
                                <div className="bg-[#0F4425] text-white p-10 md:p-12">
                                    <div className="text-[12px] font-semibold uppercase tracking-[1.5px] mb-2 text-[#D4A843]">With PowerNetPro Solar</div>
                                    <div className="font-['Playfair_Display',Georgia,serif] text-[42px] font-semibold mb-1.5 text-white">₹10-12</div>
                                    <div className="text-[14px] text-white/60">per unit (kWh) — fixed for 15 years</div>
                                </div>
                            </div>
                            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left border-t border-[#EBEBEA]">
                                <div className="bg-[#E8F5ED] text-[#1B6B3A] font-bold text-[28px] py-2 px-6 rounded-xl shrink-0">40-50%</div>
                                <span className="text-[16px] text-[#4A4A47] font-medium max-w-[500px]">
                                    savings on your electricity bill, every single month for 15 years. Then the plant is yours — free power for 10+ years more.
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ELIGIBILITY */}
                <section id="eligibility" className="bg-[#F7F7F5] py-[64px] md:py-[100px] px-5 md:px-12">
                    <div className="max-w-[1120px] mx-auto">
                        <div className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#1B6B3A] mb-3">Are You Eligible?</div>
                        <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(32px,3.5vw,48px)] font-medium leading-[1.15] tracking-[-0.5px] text-[#1A1A18] mb-4">
                            Check if your property qualifies
                        </h2>
                        <p className="text-[17px] text-[#8A8A87] max-w-[600px] leading-[1.6] mb-[56px]">
                            Most commercial and large residential properties with adequate rooftop space are eligible. Here&apos;s what we look for.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            <div className="bg-white border border-[#EBEBEA] rounded-[14px] p-8 md:p-9 text-center">
                                <div className="w-14 h-14 rounded-full bg-[#F2E6C5] flex items-center justify-center text-[24px] mx-auto mb-4.5">📐</div>
                                <h4 className="text-[16px] font-semibold mb-2 text-[#1A1A18]">Available Rooftop</h4>
                                <p className="text-[14px] text-[#8A8A87] leading-[1.5]">Minimum 4,000 sq.ft. of shadow-free rooftop area for a meaningful installation.</p>
                            </div>
                            <div className="bg-white border border-[#EBEBEA] rounded-[14px] p-8 md:p-9 text-center">
                                <div className="w-14 h-14 rounded-full bg-[#F2E6C5] flex items-center justify-center text-[24px] mx-auto mb-4.5">⚡</div>
                                <h4 className="text-[16px] font-semibold mb-2 text-[#1A1A18]">Monthly Electricity Bill</h4>
                                <p className="text-[14px] text-[#8A8A87] leading-[1.5]">Common area bill of ₹50,000+ per month to ensure significant savings for your building.</p>
                            </div>
                            <div className="bg-white border border-[#EBEBEA] rounded-[14px] p-8 md:p-9 text-center">
                                <div className="w-14 h-14 rounded-full bg-[#F2E6C5] flex items-center justify-center text-[24px] mx-auto mb-4.5">🏢</div>
                                <h4 className="text-[16px] font-semibold mb-2 text-[#1A1A18]">Building Type</h4>
                                <p className="text-[14px] text-[#8A8A87] leading-[1.5]">Residential societies, commercial offices, industrial facilities, or mixed-use buildings.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="bg-[#FAFAF8] py-[64px] md:py-[100px] px-5 md:px-12">
                    <div className="max-w-[1120px] mx-auto">
                        <div className="text-[12px] font-semibold uppercase tracking-[1.5px] text-[#1B6B3A] mb-3">Common Questions</div>
                        <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(32px,3.5vw,48px)] font-medium leading-[1.15] tracking-[-0.5px] text-[#1A1A18] mb-12">
                            Everything hosts want to know
                        </h2>

                        <div className="max-w-[780px] w-full">
                            {[
                                { q: "Is there really zero cost to the host?", a: "Yes. PowerNetPro covers the entire capital expenditure — panels, inverters, mounting structures, wiring, and installation. The host pays nothing upfront. You simply pay for the solar electricity you consume at a pre-agreed rate of ₹10-12 per unit, which is substantially below the grid tariff of ₹18-20." },
                                { q: "What happens at the end of the 15-year PPA?", a: "At the end of the PPA period, the entire solar plant — panels, inverters, all equipment — is transferred to the host at a token amount of ₹1. From Year 16 onward, the electricity generated is effectively free for the host, with an expected remaining plant life of 10+ years." },
                                { q: "Who handles maintenance and repairs?", a: "PowerNetPro takes full responsibility for all operations and maintenance throughout the PPA tenure. This includes regular panel cleaning, performance monitoring, inverter servicing, and any necessary repairs. The AMC charges are included in your per-unit rate — no additional cost." },
                                { q: "What about net metering and DISCOM approvals?", a: "Our EPC partner handles all DISCOM liaison, net metering applications, and regulatory approvals. The net metering approval typically takes 6-8 weeks. Charges for net metering setup are borne by the host at actuals, but we expedite the process as much as possible." },
                                { q: "Is the solar system insured?", a: "Yes. PowerNetPro maintains Standard Fire and Perils Insurance coverage at its own cost throughout the entire PPA tenure. This covers damage from cyclone, weather events, and fire. The host is responsible for enhanced security of the solar panel system on their premises." },
                                { q: "Can housing societies and gated communities host?", a: "Absolutely. Housing societies are ideal hosts. The solar plant powers common area loads like lifts, parking lights, water pumps, and corridor lighting — all at a fraction of the grid cost. A committee resolution and basic documentation is all that's needed to get started." }
                            ].map((faq, idx) => (
                                <div key={idx} className="border-b border-[#EBEBEA] py-6">
                                    <button
                                        onClick={() => toggleFaq(idx)}
                                        className="flex items-center justify-between w-full bg-transparent border-none font-['DM_Sans',-apple-system,sans-serif] text-[16px] font-semibold text-[#1A1A18] text-left p-0 cursor-pointer"
                                    >
                                        <span>{faq.q}</span>
                                        <span className={`text-[18px] text-[#8A8A87] transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>▼</span>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-350 ease-in-out ${openFaq === idx ? 'max-h-[400px]' : 'max-h-0'}`}>
                                        <div className="pt-[14px] text-[15px] text-[#8A8A87] leading-[1.6]">
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section id="cta" className="text-center py-[100px] px-5 md:px-12" style={{ background: 'linear-gradient(175deg, #0F4425 0%, #0A0A0A 100%)' }}>
                    <h2 className="font-['Playfair_Display',Georgia,serif] text-[clamp(32px,4vw,50px)] font-medium text-white leading-[1.15] mb-4">
                        Ready to save <span className="text-[#D4A843] italic">40-50%</span><br aria-hidden="true" className="hidden sm:block" /> on your electricity bill?
                    </h2>
                    <p className="text-[17px] text-white/55 max-w-[520px] mx-auto mb-10 leading-[1.6]">
                        Get a free site assessment and a customised proposal for your property — no commitment required.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3.5">
                        <a href="tel:+918180861415" className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl text-[15px] font-semibold transition-all duration-250 bg-[#D4A843] text-[#0A0A0A] hover:bg-[#c49a38] hover:-translate-y-[1px]">
                            Call 8180 861 415
                        </a>
                        <a href="https://www.powernetpro.com" className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl text-[15px] font-semibold transition-all duration-250 bg-transparent text-white border-[1.5px] border-white/25 hover:border-white/50 hover:bg-white/5">
                            Visit powernetpro.com →
                        </a>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-[#0A0A0A] py-[64px] px-5 md:px-12 pb-8 text-white/50">
                    <div className="max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                        <div className="lg:col-span-2">
                            <Link href="/" className="flex items-center gap-2 mb-4 text-white no-underline w-fit">
                                <div className="w-8 h-8 bg-[#D4A843] rounded-lg flex items-center justify-center font-bold text-sm text-[#0A0A0A]">
                                    P
                                </div>
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
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">For Hosts</Link>
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">How It Works</Link>
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">Pricing</Link>
                            </div>
                        </div>

                        <div>
                            <h5 className="text-white/30 text-[11px] font-semibold uppercase tracking-[1.5px] mb-4">Company</h5>
                            <div className="flex flex-col gap-2.5">
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">About Us</Link>
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">Blog</Link>
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">Careers</Link>
                                <Link href="#" className="text-white/50 hover:text-white text-[14px] transition-colors duration-200">Contact</Link>
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

                    <div className="max-w-[1120px] mx-auto mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[13px] gap-4">
                        <span>© 2026 PowerNetPro LLP. All rights reserved.</span>
                        <span>Pune, Maharashtra, India</span>
                    </div>
                </footer>

            </div>
        </div>
    );
}
