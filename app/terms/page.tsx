"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { 
  FileText, 
  CheckCircle, 
  AlertCircle,
  ChevronDown,
  Sun,
  Shield,
  Zap,
  Leaf
} from "lucide-react";

const sections = [
  { id: "about", title: "About Us & Our Services" },
  { id: "definitions", title: "Key Definitions" },
  { id: "reservation", title: "How Digital Solar Reservation Works" },
  { id: "pricing", title: "Pricing, Payments & Fees" },
  { id: "account", title: "Your Account & Security" },
  { id: "credits", title: "How Credits Work" },
  { id: "generation", title: "Solar Generation & Performance" },
  { id: "bills", title: "Bill Payment Services" },
  { id: "sla", title: "Service Level Agreement" },
  { id: "responsibilities", title: "What PowerNetPro is Responsible For" },
  { id: "liability", title: "Limitations of Liability" },
  { id: "rights", title: "Your Rights & Responsibilities" },
  { id: "ip", title: "Intellectual Property Rights" },
  { id: "refund", title: "Refund Policy" },
  { id: "termination", title: "Account Termination" },
  { id: "privacy", title: "Privacy & Data Protection" },
  { id: "force-majeure", title: "Force Majeure" },
  { id: "disputes", title: "Dispute Resolution" },
  { id: "geographic", title: "Geographic Coverage" },
  { id: "amendments", title: "Amendments to Terms" },
  { id: "general", title: "General Provisions" },
  { id: "contact", title: "Contact Information" },
];

export default function TermsPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Header />
      <main className="flex-1 pt-28 pb-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-forest to-forest-light mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                PowerNetPro Terms of Service
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Welcome to PowerNetPro! We're committed to making digital solar energy accessible, transparent, and beneficial for everyone.
              </p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <span>Last Updated: January 2026</span>
                <span>•</span>
                <span>Version: 1.0</span>
              </div>
            </motion.div>

            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gold/10 to-forest/10 rounded-2xl p-8 mb-12 border border-gold/20"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-gold/20">
                  <Shield className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-charcoal mb-3">
                    Welcome to PowerNetPro
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Thank you for choosing PowerNetPro! We're committed to making digital solar energy accessible, transparent, and beneficial for everyone. These Terms of Service explain your rights and our commitments in simple, straightforward language.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    By using PowerNetPro, you agree to these terms. Please read them carefully.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Quick Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-forest" />
                  Quick Navigation
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={() => {
                        setActiveSection(section.id);
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="text-sm text-gray-600 hover:text-forest hover:bg-forest/5 px-3 py-2 rounded-lg transition-colors"
                    >
                      {section.title}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Terms Content */}
            <div className="space-y-8">
              {/* Section 1: About Us */}
              <section id="about" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">1</span>
                    About Us & Our Services
                  </h2>
                  
                  <div className="space-y-6 text-gray-700 leading-relaxed">
                    <div>
                      <p className="mb-4">
                        <strong>PowerNetPro Private Limited</strong> ("PowerNetPro", "we", "us", or "our") is a company registered under the Companies Act, 2013, with our registered office at Kothrud, Pune, Maharashtra, Bharat.
                      </p>
                      <p className="mb-4">
                        Our platform at <strong>www.powernetpro.com</strong> (the "Platform") enables you to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                        <li>Reserve digital solar capacity from our renewable energy projects</li>
                        <li>Earn monthly credits from clean solar energy generation</li>
                        <li>Use those credits to offset your electricity bills</li>
                        <li>Monitor your solar generation and credit balance in real-time</li>
                        <li>Contribute to a sustainable energy future</li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-charcoal mb-2">This is a legally binding agreement.</p>
                          <p className="text-sm">
                            By clicking "I Agree," creating an account, or using our services, you confirm that:
                          </p>
                          <ul className="list-disc list-inside space-y-1 mt-2 text-sm ml-4">
                            <li>You have read and understood these terms</li>
                            <li>You are at least 18 years old</li>
                            <li>You have the legal capacity to enter into this agreement</li>
                            <li>All information you provide is accurate and truthful</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 2: Key Definitions */}
              <section id="definitions" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">2</span>
                    Key Definitions (In Plain English)
                  </h2>
                  
                  <div className="space-y-4 text-gray-700">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-1">Digital Solar Capacity</p>
                        <p className="text-sm">The amount of solar power capacity (measured in kilowatts) that you reserve from our solar installations</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-1">Credits or Monthly Credits</p>
                        <p className="text-sm">The monetary value you earn from your reserved solar capacity's electricity generation</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-1">Credit Balance</p>
                        <p className="text-sm">The total usable credits available in your account</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-1">Projects or Solar Installations</p>
                        <p className="text-sm">Physical solar power systems owned and operated by PowerNetPro</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-1">Reservation</p>
                        <p className="text-sm">Your subscription to a specific amount of solar capacity</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-1">Dashboard</p>
                        <p className="text-sm">Your personal portal where you track generation, credits, and bills</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-1">DISCOM</p>
                        <p className="text-sm">Distribution Company - your local electricity utility provider</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-1">Activation</p>
                        <p className="text-sm">When your reserved capacity starts generating credits (within 24-48 hours of payment)</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 3: How Digital Solar Reservation Works */}
              <section id="reservation" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">3</span>
                    How Digital Solar Reservation Works
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">3.1 Registration Process</h3>
                      <p className="mb-4">To get started:</p>
                      <ol className="list-decimal list-inside space-y-2 ml-4 mb-4">
                        <li>Create an account by providing accurate information (name, email, phone, address)</li>
                        <li>Verify your email and phone number</li>
                        <li>Link your utility account (DISCOM details and electricity bill information)</li>
                        <li>Choose your desired solar capacity reservation</li>
                        <li>Complete payment through our secure gateway</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">3.2 Reservation Details</h3>
                      <p className="mb-4">When you reserve digital solar capacity, you receive:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                        <li>A specific allocation of solar panels from our operational projects</li>
                        <li>Monthly credits based on actual electricity generation from your allocation</li>
                        <li>Real-time monitoring of your panel performance</li>
                        <li>Transparent billing and credit deployment</li>
                        <li>Access to your personalized dashboard 24/7</li>
                      </ul>
                      
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-4">
                        <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Activation Timeline
                        </h4>
                        <ul className="space-y-2 text-sm">
                          <li>• Standard activation: 24-48 hours from successful payment</li>
                          <li>• You'll receive email and SMS confirmation once activated</li>
                          <li>• If activation takes longer than 48 hours, contact support immediately</li>
                          <li>• If we fail to activate within 72 hours, you're eligible for a full refund automatically</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">3.3 What We Guarantee</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                          <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            What We Guarantee
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li>✓ Your reserved capacity will be from real, operational solar panels</li>
                            <li>✓ You'll receive transparent monthly reports</li>
                            <li>✓ Credits will be calculated fairly based on actual generation</li>
                            <li>✓ We'll maintain and service the physical solar infrastructure</li>
                            <li>✓ You can monitor your generation data in real-time</li>
                          </ul>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                          <h4 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            What We Don't Guarantee
                          </h4>
                          <ul className="space-y-2 text-sm">
                            <li>• Exact monthly generation amounts (weather varies)</li>
                            <li>• Consistent month-to-month credit values (seasonal variations occur)</li>
                            <li>• Protection from DISCOM policy changes (government decisions are beyond our control)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 4: Pricing, Payments & Fees */}
              <section id="pricing" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">4</span>
                    Pricing, Payments & Fees
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">4.1 Transparent Pricing Structure</h3>
                      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                        <div>
                          <p className="font-semibold text-charcoal mb-2">Reservation Cost:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                            <li>Clearly displayed per kilowatt (kW) on our website</li>
                            <li>One-time payment for your chosen capacity</li>
                            <li>Current pricing: [₹XX,XXX per kW] (updated transparently on our platform)</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-charcoal mb-2">Setup Fee:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                            <li>One-time onboarding fee: ₹500 (flat rate, regardless of reservation size)</li>
                            <li>Covers account setup, verification, DISCOM integration, and initial monitoring configuration</li>
                            <li>Clearly shown before payment</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="font-semibold text-charcoal mb-2">No Hidden Charges:</p>
                          <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                            <li>No monthly subscription fees</li>
                            <li>No maintenance fees</li>
                            <li>No credit usage fees</li>
                            <li>No dashboard access fees</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">4.2 Payment Methods Accepted</h3>
                      <p className="mb-3">We accept:</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {["UPI (Google Pay, PhonePe, Paytm, etc.)", "Credit cards (Visa, Mastercard, Amex, RuPay)", "Debit cards (all major banks)", "Net banking", "Digital wallets"].map((method) => (
                          <div key={method} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{method}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-4">
                        All payments are processed through RBI-approved, PCI-DSS compliant gateways. We never store your complete card details.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 5: Your Account & Security */}
              <section id="account" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">5</span>
                    Your Account & Security
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">5.1 Account Creation & Verification</h3>
                      <p className="mb-4">We take security seriously. To prevent fraud and ensure service quality, we verify:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                        <li>Email address (via confirmation link)</li>
                        <li>Phone number (via OTP)</li>
                        <li>Utility account ownership (via bill upload or DISCOM API verification)</li>
                        <li>Payment source (via gateway authentication)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">5.2 Your Responsibilities</h3>
                      <p className="mb-4">You are responsible for:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                        <li>Keeping your login credentials confidential</li>
                        <li>Not sharing your account with others</li>
                        <li>Notifying us immediately of any unauthorized access</li>
                        <li>Providing accurate and up-to-date information</li>
                        <li>Maintaining a valid email address and phone number</li>
                        <li>Ensuring your utility account information is current</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 6: How Credits Work */}
              <section id="credits" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">6</span>
                    How Credits Work
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">6.1 Earning Credits</h3>
                      <p className="mb-4">Credits are earned based on actual electricity generated by your reserved solar capacity. Generation happens daily; credits accumulated monthly.</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <p className="font-semibold text-charcoal mb-2">Example:</p>
                        <ul className="space-y-2 text-sm">
                          <li>• Your reservation: 5 kW</li>
                          <li>• Monthly generation: 600 kWh</li>
                          <li>• Credit rate: ₹5 per kWh</li>
                          <li>• Monthly credits earned: 600 × ₹5 = ₹3,000</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">6.2 Using Your Credits</h3>
                      <p className="mb-4">What you can do with credits:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Pay electricity bills: Apply credits to offset your DISCOM bill (full or partial)</li>
                        <li>Accumulate: Let credits build up for larger future bills</li>
                        <li>Transfer: Gift credits to family members (one-time ₹100 fee)</li>
                        <li>Partial refund: If you cancel, get 60% as cash</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 7: Solar Generation & Performance */}
              <section id="generation" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">7</span>
                    Solar Generation & Performance
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">7.1 How We Calculate Generation</h3>
                      <p className="mb-4">Our Process:</p>
                      <ol className="list-decimal list-inside space-y-2 ml-4">
                        <li>Each reservation is linked to specific panels in operational projects</li>
                        <li>Generation monitored via certified inverter systems</li>
                        <li>Data logged every 15 minutes</li>
                        <li>Daily generation recorded and attributed to your account pro-rata</li>
                        <li>Monthly totals calculated and converted to credits</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">7.2 Production Estimates & Confidence Levels</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                          <h4 className="font-semibold text-charcoal mb-2">P50 Production Level (50% confidence)</h4>
                          <p className="text-sm mb-2">There's a 50% probability that annual generation will meet or exceed this level. Used for standard projections.</p>
                          <p className="text-sm font-medium">Example: 5kW system, P50 = 7,500 kWh/year</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                          <h4 className="font-semibold text-charcoal mb-2">P90 Production Level (90% confidence)</h4>
                          <p className="text-sm mb-2">There's a 90% probability that annual generation will meet or exceed this level. More conservative estimate.</p>
                          <p className="text-sm font-medium">Example: 5kW system, P90 = 6,500 kWh/year</p>
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-4">
                        <h4 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          Our Performance Guarantee
                        </h4>
                        <p className="text-sm">If annual generation falls below P90 levels, we'll add bonus credits to bring you up to P90 levels. No questions asked, automatic adjustment.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 8: Bill Payment Services */}
              <section id="bills" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">8</span>
                    Bill Payment Services
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">8.1 How Bill Payment Works</h3>
                      <p className="mb-4">PowerNetPro partners with Bharat Bill Payment System (BBPS) to facilitate credit application to your utility bills.</p>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <p className="font-semibold text-charcoal mb-3">The Process:</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm">
                          <li>You receive your monthly DISCOM bill</li>
                          <li>Choose to pay using PowerNetPro credits (manual or auto-pay)</li>
                          <li>We process payment to your DISCOM via BBPS</li>
                          <li>If credits are insufficient, you pay the remaining balance</li>
                          <li>DISCOM receives payment and updates your account</li>
                          <li>You receive payment confirmation from both DISCOM and PowerNetPro</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 9: Service Level Agreement */}
              <section id="sla" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">9</span>
                    Service Level Agreement (SLA) - Our Commitments
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">9.1 Platform Uptime Guarantee</h3>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <p className="font-semibold text-charcoal mb-3">We guarantee 99.5% platform availability (excluding scheduled maintenance):</p>
                        <ul className="space-y-2 text-sm">
                          <li>• This means maximum 3.6 hours downtime per month</li>
                          <li>• Monitored 24/7 by automated systems</li>
                          <li>• Real-time status page available at status.powernetpro.com</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">9.2 Customer Support SLA</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-forest/10">
                              <th className="border border-gray-300 p-3 text-left font-semibold text-charcoal">Issue Type</th>
                              <th className="border border-gray-300 p-3 text-left font-semibold text-charcoal">Response Time</th>
                              <th className="border border-gray-300 p-3 text-left font-semibold text-charcoal">Resolution Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 p-3">Critical (account locked, payment failure)</td>
                              <td className="border border-gray-300 p-3">2 hours</td>
                              <td className="border border-gray-300 p-3">8 hours</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 p-3">High (credit errors, data discrepancies)</td>
                              <td className="border border-gray-300 p-3">4 hours</td>
                              <td className="border border-gray-300 p-3">24 hours</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-3">Medium (general inquiries, bill questions)</td>
                              <td className="border border-gray-300 p-3">8 hours</td>
                              <td className="border border-gray-300 p-3">48 hours</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 p-3">Low (feature requests, feedback)</td>
                              <td className="border border-gray-300 p-3">24 hours</td>
                              <td className="border border-gray-300 p-3">5 business days</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 10: What PowerNetPro is Responsible For */}
              <section id="responsibilities" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">10</span>
                    What PowerNetPro is Responsible For
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">10.1 Our Direct Obligations</h3>
                      <p className="mb-4">We take full responsibility for:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Platform Performance - Website uptime, dashboard accuracy, data security",
                          "Solar Capacity Allocation - Ensuring your reserved capacity is real and operational",
                          "Credit Management - Accurate calculation and timely deployment",
                          "Customer Service - Responsive support within SLA timelines",
                          "Infrastructure Maintenance - Solar panel cleaning and maintenance",
                          "Financial Integrity - Holding customer funds in separate escrow accounts"
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 11: Limitations of Liability */}
              <section id="liability" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">11</span>
                    Limitations of Liability (Fair & Balanced)
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">11.1 What We're NOT Liable For</h3>
                      <p className="mb-4">We cannot be held responsible for:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Government & Regulatory Changes (DISCOM policy modifications, tax changes)</li>
                        <li>Utility Company Actions (service interruptions, billing errors by DISCOM)</li>
                        <li>Force Majeure Events (natural disasters, pandemics, war)</li>
                        <li>User Actions & Errors (incorrect information, unauthorized access)</li>
                        <li>Third-Party Websites & Services</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">11.2 Liability Cap</h3>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <p className="font-semibold text-charcoal mb-2">Maximum Liability:</p>
                        <p className="text-sm mb-2">Our total liability to you for all claims combined will not exceed:</p>
                        <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                          <li>The total amount you paid for your digital solar reservation, OR</li>
                          <li>₹5,00,000 (Five Lakh Rupees), whichever is HIGHER</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 12: Your Rights & Responsibilities */}
              <section id="rights" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">12</span>
                    Your Rights & Responsibilities
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">12.1 Your Rights</h3>
                      <p className="mb-4">As a PowerNetPro customer, you have the right to:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Transparency & Information - Access all your account data 24/7",
                          "Control & Flexibility - Pause your account for up to 6 months",
                          "Fair Treatment - Non-discriminatory service access",
                          "Refunds & Cancellation - 30-day satisfaction guarantee (100% refund)",
                          "Recourse & Resolution - File complaints through multiple channels"
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-2 p-4 bg-green-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">12.2 Your Responsibilities</h3>
                      <p className="mb-4">To maintain your account and receive services, you must:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Provide accurate information</li>
                        <li>Maintain account security</li>
                        <li>Comply with terms</li>
                        <li>Meet financial responsibilities</li>
                        <li>Communicate and cooperate</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 13: Intellectual Property Rights */}
              <section id="ip" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">13</span>
                    Intellectual Property Rights
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">13.1 PowerNetPro Ownership</h3>
                      <p className="mb-4">We own all rights to:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>The PowerNetPro name, logo, and branding</li>
                        <li>Website design, layout, and user interface</li>
                        <li>Software, code, and algorithms</li>
                        <li>Dashboard features and functionality</li>
                        <li>Original content, graphics, and images</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">13.2 Your Limited License</h3>
                      <p className="mb-4">We grant you a limited, non-exclusive, non-transferable license to:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Access and use the platform for personal purposes</li>
                        <li>View and download your account reports</li>
                        <li>Use dashboard features and tools</li>
                        <li>Access mobile apps (when available)</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 14: Refund Policy - Important Section */}
              <section id="refund" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">14</span>
                    Refund Policy - Transparent & Fair
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">14.1 30-Day Satisfaction Guarantee</h3>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <p className="font-semibold text-charcoal mb-3">No questions asked, full refund within 30 days:</p>
                        <ul className="space-y-2 text-sm">
                          <li>• Cancel anytime within 30 days of reservation activation</li>
                          <li>• 100% refund of your reservation amount</li>
                          <li>• Processing time: 5-7 business days</li>
                          <li>• Refund to original payment method</li>
                          <li>• Setup fee (₹500) also fully refunded</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">14.2 Tiered Refund Structure (After 30 Days)</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-forest/10">
                              <th className="border border-gray-300 p-3 text-left font-semibold text-charcoal">Time Since Activation</th>
                              <th className="border border-gray-300 p-3 text-left font-semibold text-charcoal">Refund %</th>
                              <th className="border border-gray-300 p-3 text-left font-semibold text-charcoal">Deductions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 p-3">31-90 days (1-3 months)</td>
                              <td className="border border-gray-300 p-3">90%</td>
                              <td className="border border-gray-300 p-3">Setup fee only (₹500)</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 p-3">91-180 days (3-6 months)</td>
                              <td className="border border-gray-300 p-3">85%</td>
                              <td className="border border-gray-300 p-3">Setup fee + 15% admin fee</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-3">181-365 days (6-12 months)</td>
                              <td className="border border-gray-300 p-3">80%</td>
                              <td className="border border-gray-300 p-3">Setup fee + 20% admin fee</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 p-3">1-2 years</td>
                              <td className="border border-gray-300 p-3">75%</td>
                              <td className="border border-gray-300 p-3">Setup fee + 25% admin fee</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-3">2-3 years</td>
                              <td className="border border-gray-300 p-3">70%</td>
                              <td className="border border-gray-300 p-3">Setup fee + 30% admin fee</td>
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 p-3">3+ years</td>
                              <td className="border border-gray-300 p-3">65%</td>
                              <td className="border border-gray-300 p-3">Setup fee + 35% admin fee</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 15: Account Termination */}
              <section id="termination" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">15</span>
                    Account Termination
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">15.1 You Can Cancel Anytime</h3>
                      <p className="mb-4">You have the right to cancel your account at any time:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Through your dashboard (self-service cancellation)</li>
                        <li>By emailing omkarkolhe912@gmail.com</li>
                        <li>By calling our customer support line</li>
                      </ul>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-4">
                        <p className="font-semibold text-charcoal mb-2">Refund Eligibility:</p>
                        <p className="text-sm">Refunds are calculated based on Section 14 (Refund Policy). You'll receive the appropriate refund amount based on how long you've been a customer.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">15.2 We Can Terminate Your Account If</h3>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <p className="font-semibold text-charcoal mb-3">We reserve the right to terminate accounts for:</p>
                        <ul className="space-y-2 text-sm">
                          <li>• Fraudulent activity or misrepresentation</li>
                          <li>• Violation of these Terms of Service</li>
                          <li>• Non-payment of outstanding balances</li>
                          <li>• Illegal use of our platform</li>
                          <li>• Harassment of staff or other customers</li>
                        </ul>
                        <p className="text-sm mt-3 font-medium">We will provide 30 days' written notice (except for fraud or illegal activity, which may be immediate).</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 16: Privacy & Data Protection */}
              <section id="privacy" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">16</span>
                    Privacy & Data Protection
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">16.1 Our Commitment to Your Privacy</h3>
                      <p className="mb-4">We take data protection seriously. Your personal information is handled according to:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Information Technology Act, 2000 (India)</li>
                        <li>Digital Personal Data Protection Act, 2023 (DPDPA)</li>
                        <li>Our Privacy Policy (available at www.powernetpro.com/privacy)</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">16.2 What Data We Collect & Why</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="font-semibold text-charcoal mb-2">Personal Information:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Name, email, phone number</li>
                            <li>• Address and utility account details</li>
                            <li>• Payment information (processed securely)</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <p className="font-semibold text-charcoal mb-2">Usage Data:</p>
                          <ul className="text-sm space-y-1">
                            <li>• Dashboard activity and preferences</li>
                            <li>• Generation and credit data</li>
                            <li>• Bill payment history</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">16.3 Your Data Rights</h3>
                      <p className="mb-4">Under DPDPA, you have the right to:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Access your personal data</li>
                        <li>Correct inaccurate information</li>
                        <li>Request deletion (subject to legal requirements)</li>
                        <li>Data portability (export your data)</li>
                        <li>Withdraw consent (may affect service delivery)</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 17: Force Majeure */}
              <section id="force-majeure" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">17</span>
                    Force Majeure (Events Beyond Our Control)
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">17.1 What is Force Majeure?</h3>
                      <p className="mb-4">Force majeure events are circumstances beyond our reasonable control that prevent us from fulfilling our obligations. These include:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Natural disasters (floods, earthquakes, cyclones)",
                          "Pandemics and health emergencies",
                          "War, terrorism, civil unrest",
                          "Government actions (policy changes, regulations)",
                          "Utility company failures or grid outages",
                          "Cyberattacks or security breaches"
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">17.2 Our Obligations During Force Majeure</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <p className="font-semibold text-charcoal mb-2">During force majeure events, we will:</p>
                        <ul className="space-y-2 text-sm">
                          <li>• Notify you within 48 hours of becoming aware</li>
                          <li>• Make reasonable efforts to minimize impact</li>
                          <li>• Resume services as soon as reasonably possible</li>
                          <li>• Provide regular updates on the situation</li>
                          <li>• Not charge you for services we cannot deliver</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 18: Dispute Resolution */}
              <section id="disputes" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">18</span>
                    Dispute Resolution (Fair & Transparent Process)
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">18.1 Step 1: Direct Communication</h3>
                      <p className="mb-4">First, contact our customer support team:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Email: omkarkolhe912@gmail.com</li>
                        <li>Phone: +91 8180861415</li>
                        <li>Live Chat: Available on dashboard</li>
                      </ul>
                      <p className="mt-4 text-sm text-gray-600">Most issues are resolved at this stage within 48 hours.</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">18.2 Step 2: Internal Escalation</h3>
                      <p className="mb-4">If not resolved, escalate to our management team:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Email: escalation@powernetpro.com</li>
                        <li>Response time: 5 business days</li>
                        <li>Written response with resolution plan</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">18.3 Step 3: Mediation</h3>
                      <p className="mb-4">If still unresolved, we agree to mediation through:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>An independent mediator agreed upon by both parties</li>
                        <li>Costs shared equally</li>
                        <li>Mediation must be completed within 60 days</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">18.4 Step 4: Arbitration</h3>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                        <p className="font-semibold text-charcoal mb-2">If mediation fails:</p>
                        <ul className="space-y-2 text-sm">
                          <li>• Disputes will be resolved through binding arbitration</li>
                          <li>• Arbitration under the Arbitration and Conciliation Act, 2015 (India)</li>
                          <li>• Location: [Your City], India</li>
                          <li>• Language: English</li>
                          <li>• Arbitrator: Single arbitrator appointed by mutual agreement</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 19: Geographic Coverage */}
              <section id="geographic" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">19</span>
                    Geographic Coverage & Service Availability
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">19.1 Current Service Areas</h3>
                      <p className="mb-4">PowerNetPro currently serves customers in:</p>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <p className="font-semibold text-charcoal mb-3">Supported States & DISCOMs:</p>
                        <ul className="space-y-2 text-sm">
                          <li>• Maharashtra (MSEB, BEST, Tata Power, Adani Electricity)</li>
                          <li>• Delhi (BSES, TPDDL)</li>
                          <li>• Karnataka (BESCOM, MESCOM, HESCOM)</li>
                          <li>• Tamil Nadu (TANGEDCO)</li>
                          <li>• Gujarat (Torrent Power, DGVCL, MGVCL, PGVCL, UGVCL)</li>
                          <li>• More states being added regularly</li>
                        </ul>
                        <p className="text-sm mt-3 text-gray-600">Check our website for the most up-to-date list of supported DISCOMs.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">19.2 Expansion Plans</h3>
                      <p className="mb-4">We're actively expanding to serve more states and DISCOMs. If your area isn't covered yet:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Join our waitlist on the website</li>
                        <li>We'll notify you when service becomes available</li>
                        <li>Priority access for early waitlist members</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 20: Amendments to Terms */}
              <section id="amendments" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">20</span>
                    Amendments to Terms
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">20.1 We May Update These Terms</h3>
                      <p className="mb-4">We may update these Terms of Service from time to time to:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Reflect changes in our services</li>
                        <li>Comply with legal requirements</li>
                        <li>Improve clarity and transparency</li>
                        <li>Address customer feedback</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">20.2 How We'll Notify You</h3>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <p className="font-semibold text-charcoal mb-3">We'll notify you of material changes through:</p>
                        <ul className="space-y-2 text-sm">
                          <li>• Email to your registered address (30 days advance notice)</li>
                          <li>• In-app notification on your dashboard</li>
                          <li>• SMS for critical changes</li>
                          <li>• Updated "Last Updated" date on this page</li>
                        </ul>
                        <p className="text-sm mt-3 font-medium">Material changes include: pricing modifications, refund policy changes, liability limitations, or service scope changes.</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">20.3 Your Options</h3>
                      <p className="mb-4">If you don't agree with updated terms:</p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>You can cancel your account within 30 days of the change</li>
                        <li>You'll receive a refund per Section 14 (Refund Policy)</li>
                        <li>Continued use after 30 days means you accept the new terms</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 21: General Provisions */}
              <section id="general" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">21</span>
                    General Provisions
                  </h2>
                  
                  <div className="space-y-6 text-gray-700">
                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">21.1 Entire Agreement</h3>
                      <p className="mb-4">These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and PowerNetPro regarding your use of our services.</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">21.2 Severability</h3>
                      <p className="mb-4">If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">21.3 Governing Law & Jurisdiction</h3>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <ul className="space-y-2 text-sm">
                          <li>• These terms are governed by the laws of India</li>
                          <li>• Any disputes will be subject to the exclusive jurisdiction of courts in [Your City], India</li>
                          <li>• We comply with all applicable Indian laws and regulations</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">21.4 Assignment</h3>
                      <p className="mb-4">You may not transfer or assign your account or rights under these terms without our written consent. We may assign our rights and obligations to a successor entity (with notice to you).</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">21.5 Waiver</h3>
                      <p className="mb-4">Our failure to enforce any provision of these terms does not constitute a waiver of that provision or any other provision.</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-charcoal mb-3">21.6 Language</h3>
                      <p className="mb-4">These terms are provided in English. If translated into other languages, the English version will prevail in case of any discrepancies.</p>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 22: Contact Information */}
              <section id="contact" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">22</span>
                    Contact Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-charcoal mb-3">Customer Support</h3>
                      <p className="text-sm text-gray-600 mb-2">For service issues, billing questions, technical support:</p>
                      <ul className="space-y-2 text-sm">
                        <li>• Phone: +91 8180861415 (Monday-Saturday, 9 AM - 7 PM IST)</li>
                        <li>• Email: omkarkolhe912@gmail.com</li>
                        <li>• WhatsApp: +91-XXXXX-XXXXX (existing customers)</li>
                        <li>• Live Chat: Available on dashboard during business hours</li>
                      </ul>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-charcoal mb-3">Legal & Compliance</h3>
                      <p className="text-sm text-gray-600 mb-2">For legal notices, privacy concerns, regulatory matters:</p>
                      <ul className="space-y-2 text-sm">
                        <li>• Email: omkarkolhe912@gmail.com</li>
                        <li>• Address: Kothrud, Pune, Maharashtra, Bharat</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* Section 23: Acknowledgment */}
              <section id="acknowledgment" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-forest to-forest-light rounded-2xl p-8 text-white"
                >
                  <h2 className="text-3xl font-heading font-bold mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold">23</span>
                    Acknowledgment & Acceptance
                  </h2>
                  
                  <p className="mb-6 leading-relaxed">
                    By clicking "I Agree," creating an account, or using PowerNetPro services, you acknowledge that:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {[
                      "You have read and understood these Terms of Service in full",
                      "You agree to be legally bound by these terms",
                      "You have the legal capacity to enter into this agreement",
                      "You provide accurate and truthful information",
                      "You understand the risks and limitations described",
                      "You've had the opportunity to seek independent legal advice",
                      "You accept responsibility for your account security and usage"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-sm">
                      If you do not agree with these terms, please do not use PowerNetPro services.
                    </p>
                  </div>
                </motion.div>
              </section>

              {/* Section 24: Our Commitment */}
              <section id="commitment" className="scroll-mt-28">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-gold/10 to-energy-green/10 rounded-2xl p-8 border border-gold/20"
                >
                  <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center text-gold font-bold">24</span>
                    Our Commitment to You
                  </h2>
                  
                  <p className="text-lg text-gray-700 mb-6">
                    At PowerNetPro, we promise:
                  </p>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { icon: Sun, text: "Transparency: Clear communication, honest disclosures, no hidden terms" },
                      { icon: Zap, text: "Fairness: Customer-friendly policies, reasonable limitations, balanced rights" },
                      { icon: Shield, text: "Accountability: We own our responsibilities and make things right" },
                      { icon: Leaf, text: "Protection: Your investment is secured, your data is protected" },
                      { icon: CheckCircle, text: "Performance: We deliver on our commitments or compensate you" },
                      { icon: Sun, text: "Sustainability: Together, we're building a cleaner energy future" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl">
                        <item.icon className="h-5 w-5 text-forest shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-xl font-semibold text-charcoal mb-2">
                      Thank you for choosing PowerNetPro.
                    </p>
                    <p className="text-gray-700">
                      Let's power India with sunshine!
                    </p>
                  </div>
                </motion.div>
              </section>
            </div>

            {/* Back to Top */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-xl hover:bg-forest-light transition-colors"
              >
                <ChevronDown className="h-4 w-4 rotate-180" />
                Back to Top
              </button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
