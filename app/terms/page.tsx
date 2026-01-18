"use client";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertCircle, CheckCircle, DollarSign, Shield, Users, Zap, CreditCard, TrendingUp, BarChart3, Phone, Mail, MapPin, Info, Gavel, Globe, RefreshCw, XCircle, Lock } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-gold/10">
      <LandingHeader />
      <main className="flex-1">
        <section className="pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-amber-100 mb-6">
                <Scale className="h-8 w-8 text-gold" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-black mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-gray-600">
                Last Updated: January 2026 | Version: 1.0
              </p>
            </div>

            <Card className="shadow-lg border-2 border-gold/20 mb-6">
              <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
                <CardTitle className="text-2xl font-heading font-bold text-black">
                  Welcome to PowerNetPro
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Thank you for choosing PowerNetPro! We're committed to making digital solar energy accessible, transparent, and beneficial for everyone. These Terms of Service explain your rights and our commitments in simple, straightforward language.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using PowerNetPro, you agree to these terms. Please read them carefully.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-gold/20">
              <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
                <CardTitle className="text-2xl font-heading font-bold text-black">
                  Terms and Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {/* Section 1 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Info className="h-6 w-6 text-gold" />
                    1. About Us & Our Services
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>PowerNetPro Private Limited</strong> ("PowerNetPro", "we", "us", or "our") is a company registered under the Companies Act, 2013, with our registered office at <strong>Kothrud, Pune, Maharashtra, Bharat</strong>.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Our platform at <strong>www.powernetpro.com</strong> (the "Platform") enables you to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Reserve digital solar capacity from our renewable energy projects</li>
                    <li>Earn monthly credits from clean solar energy generation</li>
                    <li>Use those credits to offset your electricity bills</li>
                    <li>Monitor your solar generation and credit balance in real-time</li>
                    <li>Contribute to a sustainable energy future</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    <strong>This is a legally binding agreement.</strong> By clicking "I Agree," creating an account, or using our services, you confirm that you have read and understood these terms, you are at least 18 years old, you have the legal capacity to enter into this agreement, and all information you provide is accurate and truthful.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">2. Key Definitions (In Plain English)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gold/30 mt-4">
                      <thead>
                        <tr className="bg-gold/10">
                          <th className="border border-gold/30 p-3 text-left font-semibold text-black">Term</th>
                          <th className="border border-gold/30 p-3 text-left font-semibold text-black">Definition</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Digital Solar Capacity</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">The amount of solar power capacity (measured in kilowatts) that you reserve from our solar installations</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Credits or Monthly Credits</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">The monetary value you earn from your reserved solar capacity's electricity generation</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Credit Balance</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">The total usable credits available in your account</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Projects or Solar Installations</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">Physical solar power systems owned and operated by PowerNetPro</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Reservation</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">Your subscription to a specific amount of solar capacity</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Dashboard</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">Your personal portal where you track generation, credits, and bills</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>DISCOM</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">Distribution Company - your local electricity utility provider</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Activation</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">When your reserved capacity starts generating credits (within 24-48 hours of payment)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 3 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Zap className="h-6 w-6 text-gold" />
                    3. How Digital Solar Reservation Works
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">3.1 Registration Process</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">To get started:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Create an account by providing accurate information (name, email, phone, address)</li>
                    <li>Verify your email and phone number</li>
                    <li>Link your utility account (DISCOM details and electricity bill information)</li>
                    <li>Choose your desired solar capacity reservation</li>
                    <li>Complete payment through our secure gateway</li>
                  </ol>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">3.2 Reservation Details</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">When you reserve digital solar capacity, you receive:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>A specific allocation of solar panels from our operational projects</li>
                    <li>Monthly credits based on actual electricity generation from your allocation</li>
                    <li>Real-time monitoring of your panel performance</li>
                    <li>Transparent billing and credit deployment</li>
                    <li>Access to your personalized dashboard 24/7</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">Activation Timeline:</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Standard activation: 24-48 hours from successful payment</li>
                    <li>You'll receive email and SMS confirmation once activated</li>
                    <li>If activation takes longer than 48 hours, contact support immediately</li>
                    <li>If we fail to activate within 72 hours, you're eligible for a full refund automatically</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">3.3 What We Guarantee</h3>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                    <p className="font-semibold text-black mb-2">What We Guarantee:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>✓ Your reserved capacity will be from real, operational solar panels</li>
                      <li>✓ You'll receive transparent monthly reports</li>
                      <li>✓ Credits will be calculated fairly based on actual generation</li>
                      <li>✓ We'll maintain and service the physical solar infrastructure</li>
                      <li>✓ You can monitor your generation data in real-time</li>
                    </ul>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="font-semibold text-black mb-2">What We Don't Guarantee:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Exact monthly generation amounts (weather varies)</li>
                      <li>Consistent month-to-month credit values (seasonal variations occur)</li>
                      <li>Protection from DISCOM policy changes (government decisions are beyond our control)</li>
                    </ul>
                  </div>
                </div>

                {/* Section 4 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <DollarSign className="h-6 w-6 text-gold" />
                    4. Pricing, Payments & Fees
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">4.1 Transparent Pricing Structure</h3>
                  <div className="bg-gold/5 rounded-xl p-4 border border-gold/20 mb-4">
                    <p className="text-gray-700 mb-2"><strong>Reservation Cost:</strong></p>
                    <p className="text-gray-700 mb-4">Clearly displayed per kilowatt (kW) on our website</p>
                    <p className="text-gray-700 mb-2"><strong>Setup Fee:</strong></p>
                    <p className="text-gray-700 mb-2">One-time onboarding fee: ₹500 (flat rate, regardless of reservation size)</p>
                    <p className="text-gray-700">Covers account setup, verification, DISCOM integration, and initial monitoring configuration</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-3"><strong>No Hidden Charges:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>No monthly subscription fees</li>
                    <li>No maintenance fees</li>
                    <li>No credit usage fees</li>
                    <li>No dashboard access fees</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">4.2 Payment Methods Accepted</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We accept:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
                    <li>Credit cards (Visa, Mastercard, Amex, RuPay)</li>
                    <li>Debit cards (all major banks)</li>
                    <li>Net banking</li>
                    <li>Digital wallets</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    All payments are processed through RBI-approved, PCI-DSS compliant gateways. We never store your complete card details.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-gold" />
                    5. Your Account & Security
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">5.1 Account Creation & Verification</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We take security seriously. To prevent fraud and ensure service quality, we verify:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Email address (via confirmation link)</li>
                    <li>Phone number (via OTP)</li>
                    <li>Utility account ownership (via bill upload or DISCOM API verification)</li>
                    <li>Payment source (via gateway authentication)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">5.2 Your Responsibilities</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">You are responsible for:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Keeping your login credentials confidential</li>
                    <li>Not sharing your account with others</li>
                    <li>Notifying us immediately of any unauthorized access</li>
                    <li>Providing accurate and up-to-date information</li>
                    <li>Maintaining a valid email address and phone number</li>
                    <li>Ensuring your utility account information is current</li>
                  </ul>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-gold" />
                    6. How Credits Work
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">6.1 Earning Credits</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Credits are earned based on actual electricity generated by your reserved solar capacity. Generation happens daily; credits accumulated monthly.
                  </p>
                  <div className="bg-gold/5 rounded-xl p-4 border border-gold/20 mb-4">
                    <p className="font-semibold text-black mb-2">Example:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Your reservation: 5 kW</li>
                      <li>Monthly generation: 600 kWh</li>
                      <li>Credit rate: ₹5 per kWh</li>
                      <li>Monthly credits earned: 600 × ₹5 = ₹3,000</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">6.2 Using Your Credits</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">What you can do with credits:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Pay electricity bills:</strong> Apply credits to offset your DISCOM bill (full or partial)</li>
                    <li><strong>Accumulate:</strong> Let credits build up for larger future bills</li>
                    <li><strong>Transfer:</strong> Gift credits to family members (one-time ₹100 fee)</li>
                    <li><strong>Partial refund:</strong> If you cancel, get 60% as cash</li>
                  </ul>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-gold" />
                    7. Solar Generation & Performance
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">7.1 How We Calculate Generation</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">Our Process:</p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Each reservation is linked to specific panels in operational projects</li>
                    <li>Generation monitored via certified inverter systems</li>
                    <li>Data logged every 15 minutes</li>
                    <li>Daily generation recorded and attributed to your account pro-rata</li>
                    <li>Monthly totals calculated and converted to credits</li>
                  </ol>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">7.2 Production Estimates & Confidence Levels</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="font-semibold text-black mb-2"><strong>P50 Production Level (50% confidence):</strong></p>
                      <p className="text-gray-700">There's a 50% probability that annual generation will meet or exceed this level. Used for standard projections.</p>
                      <p className="text-gray-700 mt-2">Example: 5kW system, P50 = 7,500 kWh/year</p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <p className="font-semibold text-black mb-2"><strong>P90 Production Level (90% confidence):</strong></p>
                      <p className="text-gray-700">There's a 90% probability that annual generation will meet or exceed this level. More conservative estimate.</p>
                      <p className="text-gray-700 mt-2">Example: 5kW system, P90 = 6,500 kWh/year</p>
                    </div>
                  </div>
                  <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mt-4">
                    <p className="font-semibold text-black mb-2"><strong>Our Performance Guarantee:</strong></p>
                    <p className="text-gray-700">If annual generation falls below P90 levels, we'll add bonus credits to bring you up to P90 levels. No questions asked, automatic adjustment.</p>
                  </div>
                </div>

                {/* Section 8 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">8. Bill Payment Services</h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">8.1 How Bill Payment Works</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    PowerNetPro partners with Bharat Bill Payment System (BBPS) to facilitate credit application to your utility bills.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3"><strong>The Process:</strong></p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>You receive your monthly DISCOM bill</li>
                    <li>Choose to pay using PowerNetPro credits (manual or auto-pay)</li>
                    <li>We process payment to your DISCOM via BBPS</li>
                    <li>If credits are insufficient, you pay the remaining balance</li>
                    <li>DISCOM receives payment and updates your account</li>
                    <li>You receive payment confirmation from both DISCOM and PowerNetPro</li>
                  </ol>
                </div>

                {/* Section 9 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-gold" />
                    9. Service Level Agreement (SLA) - Our Commitments
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">9.1 Platform Uptime Guarantee</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We guarantee 99.5% platform availability (excluding scheduled maintenance):
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>This means maximum 3.6 hours downtime per month</li>
                    <li>Monitored 24/7 by automated systems</li>
                    <li>Real-time status page available at status.powernetpro.com</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">9.2 Customer Support SLA</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gold/30 mt-4">
                      <thead>
                        <tr className="bg-gold/10">
                          <th className="border border-gold/30 p-3 text-left font-semibold text-black">Issue Type</th>
                          <th className="border border-gold/30 p-3 text-left font-semibold text-black">Response Time</th>
                          <th className="border border-gold/30 p-3 text-left font-semibold text-black">Resolution Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700">Critical (account locked, payment failure)</td>
                          <td className="border border-gold/30 p-3 text-gray-700">2 hours</td>
                          <td className="border border-gold/30 p-3 text-gray-700">8 hours</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700">High (credit errors, data discrepancies)</td>
                          <td className="border border-gold/30 p-3 text-gray-700">4 hours</td>
                          <td className="border border-gold/30 p-3 text-gray-700">24 hours</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700">Medium (general inquiries, bill questions)</td>
                          <td className="border border-gold/30 p-3 text-gray-700">8 hours</td>
                          <td className="border border-gold/30 p-3 text-gray-700">48 hours</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700">Low (feature requests, feedback)</td>
                          <td className="border border-gold/30 p-3 text-gray-700">24 hours</td>
                          <td className="border border-gold/30 p-3 text-gray-700">5 business days</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 10 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">10. What PowerNetPro is Responsible For</h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">10.1 Our Direct Obligations</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We take full responsibility for:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Platform Performance</strong> - Website uptime, dashboard accuracy, data security</li>
                    <li><strong>Solar Capacity Allocation</strong> - Ensuring your reserved capacity is real and operational</li>
                    <li><strong>Credit Management</strong> - Accurate calculation and timely deployment</li>
                    <li><strong>Customer Service</strong> - Responsive support within SLA timelines</li>
                    <li><strong>Infrastructure Maintenance</strong> - Solar panel cleaning and maintenance</li>
                    <li><strong>Financial Integrity</strong> - Holding customer funds in separate escrow accounts</li>
                  </ul>
                </div>

                {/* Section 11 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-gold" />
                    11. Limitations of Liability (Fair & Balanced)
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">11.1 What We're NOT Liable For</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We cannot be held responsible for:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Government & Regulatory Changes (DISCOM policy modifications, tax changes)</li>
                    <li>Utility Company Actions (service interruptions, billing errors by DISCOM)</li>
                    <li>Force Majeure Events (natural disasters, pandemics, war)</li>
                    <li>User Actions & Errors (incorrect information, unauthorized access)</li>
                    <li>Third-Party Websites & Services</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">11.2 Liability Cap</h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="font-semibold text-black mb-2"><strong>Maximum Liability:</strong></p>
                    <p className="text-gray-700">Our total liability to you for all claims combined will not exceed:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
                      <li>The total amount you paid for your digital solar reservation, OR</li>
                      <li>₹5,00,000 (Five Lakh Rupees), whichever is HIGHER</li>
                    </ul>
                  </div>
                </div>

                {/* Section 12 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Users className="h-6 w-6 text-gold" />
                    12. Your Rights & Responsibilities
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">12.1 Your Rights</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">As a PowerNetPro customer, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li><strong>Transparency & Information</strong> - Access all your account data 24/7</li>
                    <li><strong>Control & Flexibility</strong> - Pause your account for up to 6 months</li>
                    <li><strong>Fair Treatment</strong> - Non-discriminatory service access</li>
                    <li><strong>Refunds & Cancellation</strong> - 30-day satisfaction guarantee (100% refund)</li>
                    <li><strong>Recourse & Resolution</strong> - File complaints through multiple channels</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">12.2 Your Responsibilities</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">To maintain your account and receive services, you must:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Provide accurate information</li>
                    <li>Maintain account security</li>
                    <li>Comply with terms</li>
                    <li>Meet financial responsibilities</li>
                    <li>Communicate and cooperate</li>
                  </ul>
                </div>

                {/* Section 13 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">13. Intellectual Property Rights</h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">13.1 PowerNetPro Ownership</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We own all rights to:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>The PowerNetPro name, logo, and branding</li>
                    <li>Website design, layout, and user interface</li>
                    <li>Software, code, and algorithms</li>
                    <li>Dashboard features and functionality</li>
                    <li>Original content, graphics, and images</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">13.2 Your Limited License</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We grant you a limited, non-exclusive, non-transferable license to:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Access and use the platform for personal purposes</li>
                    <li>View and download your account reports</li>
                    <li>Use dashboard features and tools</li>
                    <li>Access mobile apps (when available)</li>
                  </ul>
                </div>

                {/* Section 14 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <RefreshCw className="h-6 w-6 text-gold" />
                    14. Refund Policy - Transparent & Fair
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">14.1 30-Day Satisfaction Guarantee</h3>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                    <p className="text-gray-700 mb-2"><strong>No questions asked, full refund within 30 days:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Cancel anytime within 30 days of reservation activation</li>
                      <li>100% refund of your reservation amount</li>
                      <li>Processing time: 5-7 business days</li>
                      <li>Refund to original payment method</li>
                      <li>Setup fee (₹500) also fully refunded</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">14.2 Tiered Refund Structure (After 30 Days)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gold/30 mt-4">
                      <thead>
                        <tr className="bg-gold/10">
                          <th className="border border-gold/30 p-3 text-left font-semibold text-black">Time Since Activation</th>
                          <th className="border border-gold/30 p-3 text-left font-semibold text-black">Refund %</th>
                          <th className="border border-gold/30 p-3 text-left font-semibold text-black">Deductions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700">31-90 days (1-3 months)</td>
                          <td className="border border-gold/30 p-3 text-gray-700">90%</td>
                          <td className="border border-gold/30 p-3 text-gray-700">Setup fee only (₹500)</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700">91-180 days (3-6 months)</td>
                          <td className="border border-gold/30 p-3 text-gray-700">85%</td>
                          <td className="border border-gold/30 p-3 text-gray-700">Setup fee + 15% admin fee</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700">181-365 days (6-12 months)</td>
                          <td className="border border-gold/30 p-3 text-gray-700">80%</td>
                          <td className="border border-gold/30 p-3 text-gray-700">Setup fee + 20% admin fee</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700">1-2 years</td>
                          <td className="border border-gold/30 p-3 text-gray-700">75%</td>
                          <td className="border border-gold/30 p-3 text-gray-700">Setup fee + 25% admin fee</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700">2-3 years</td>
                          <td className="border border-gold/30 p-3 text-gray-700">70%</td>
                          <td className="border border-gold/30 p-3 text-gray-700">Setup fee + 30% admin fee</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700">3+ years</td>
                          <td className="border border-gold/30 p-3 text-gray-700">65%</td>
                          <td className="border border-gold/30 p-3 text-gray-700">Setup fee + 35% admin fee</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 15 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-gold" />
                    15. Account Termination
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">15.1 You Can Cancel Anytime</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">You have the right to cancel your account at any time:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Through your dashboard (self-service cancellation)</li>
                    <li>By emailing <a href="mailto:omkarkolhe912@gmail.com" className="text-gold hover:underline">omkarkolhe912@gmail.com</a></li>
                    <li>By calling our customer support line</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Refunds are calculated based on Section 14 (Refund Policy). You'll receive the appropriate refund amount based on how long you've been a customer.
                  </p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">15.2 We Can Terminate Your Account If</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We reserve the right to terminate accounts for:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Fraudulent activity or misrepresentation</li>
                    <li>Violation of these Terms of Service</li>
                    <li>Non-payment of outstanding balances</li>
                    <li>Illegal use of our platform</li>
                    <li>Harassment of staff or other customers</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    We will provide 30 days' written notice (except for fraud or illegal activity, which may be immediate).
                  </p>
                </div>

                {/* Section 16 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Lock className="h-6 w-6 text-gold" />
                    16. Privacy & Data Protection
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">16.1 Our Commitment to Your Privacy</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We take data protection seriously. Your personal information is handled according to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Information Technology Act, 2000 (India)</li>
                    <li>Digital Personal Data Protection Act, 2023 (DPDPA)</li>
                    <li>Our Privacy Policy (available at <a href="/privacy" className="text-gold hover:underline">www.powernetpro.com/privacy</a>)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">16.2 What Data We Collect & Why</h3>
                  <div className="ml-4 space-y-3">
                    <div>
                      <p className="font-semibold text-black mb-1">Personal Information:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>Name, email, phone number</li>
                        <li>Address and utility account details</li>
                        <li>Payment information (processed securely)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1">Usage Data:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>Dashboard activity and preferences</li>
                        <li>Generation and credit data</li>
                        <li>Bill payment history</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">16.3 Your Data Rights</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">Under DPDPA, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion (subject to legal requirements)</li>
                    <li>Data portability (export your data)</li>
                    <li>Withdraw consent (may affect service delivery)</li>
                  </ul>
                </div>

                {/* Section 17 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">17. Force Majeure (Events Beyond Our Control)</h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">17.1 What is Force Majeure?</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Force majeure events are circumstances beyond our reasonable control that prevent us from fulfilling our obligations. These include:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Natural disasters (floods, earthquakes, cyclones)</li>
                    <li>Pandemics and health emergencies</li>
                    <li>War, terrorism, civil unrest</li>
                    <li>Government actions (policy changes, regulations)</li>
                    <li>Utility company failures or grid outages</li>
                    <li>Cyberattacks or security breaches</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">17.2 Our Obligations During Force Majeure</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">During force majeure events, we will:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Notify you within 48 hours of becoming aware</li>
                    <li>Make reasonable efforts to minimize impact</li>
                    <li>Resume services as soon as reasonably possible</li>
                    <li>Provide regular updates on the situation</li>
                    <li>Not charge you for services we cannot deliver</li>
                  </ul>
                </div>

                {/* Section 18 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Gavel className="h-6 w-6 text-gold" />
                    18. Dispute Resolution (Fair & Transparent Process)
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">18.1 Step 1: Direct Communication</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">First, contact our customer support team:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Email: <a href="mailto:omkarkolhe912@gmail.com" className="text-gold hover:underline">omkarkolhe912@gmail.com</a></li>
                    <li>Phone: <a href="tel:+918180861415" className="text-gold hover:underline">+91 8180 861 415</a></li>
                    <li>Live Chat: Available on dashboard</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">Most issues are resolved at this stage within 48 hours.</p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">18.2 Step 2: Internal Escalation</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">If not resolved, escalate to our management team:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Email: escalation@powernetpro.com</li>
                    <li>Response time: 5 business days</li>
                    <li>Written response with resolution plan</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">18.3 Step 3: Mediation</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">If still unresolved, we agree to mediation through:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>An independent mediator agreed upon by both parties</li>
                    <li>Costs shared equally</li>
                    <li>Mediation must be completed within 60 days</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">18.4 Step 4: Arbitration</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">If mediation fails:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Disputes will be resolved through binding arbitration</li>
                    <li>Arbitration under the Arbitration and Conciliation Act, 2015 (India)</li>
                    <li>Language: English</li>
                    <li>Arbitrator: Single arbitrator appointed by mutual agreement</li>
                  </ul>
                </div>

                {/* Section 19 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Globe className="h-6 w-6 text-gold" />
                    19. Geographic Coverage & Service Availability
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">19.1 Current Service Areas</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">PowerNetPro currently serves customers in:</p>
                  <div className="bg-gold/5 rounded-xl p-4 border border-gold/20 mb-4">
                    <p className="font-semibold text-black mb-2">Supported States & DISCOMs:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                      <li>Maharashtra (MSEB, BEST, Tata Power, Adani Electricity)</li>
                      <li>Delhi (BSES, TPDDL)</li>
                      <li>Karnataka (BESCOM, MESCOM, HESCOM)</li>
                      <li>Tamil Nadu (TANGEDCO)</li>
                      <li>Gujarat (Torrent Power, DGVCL, MGVCL, PGVCL, UGVCL)</li>
                      <li>More states being added regularly</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 leading-relaxed">Check our website for the most up-to-date list of supported DISCOMs.</p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">19.2 Expansion Plans</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We're actively expanding to serve more states and DISCOMs. If your area isn't covered yet:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Join our waitlist on the website</li>
                    <li>We'll notify you when service becomes available</li>
                    <li>Priority access for early waitlist members</li>
                  </ul>
                </div>

                {/* Section 20 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">20. Amendments to Terms</h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">20.1 We May Update These Terms</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We may update these Terms of Service from time to time to:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Reflect changes in our services</li>
                    <li>Comply with legal requirements</li>
                    <li>Improve clarity and transparency</li>
                    <li>Address customer feedback</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">20.2 How We'll Notify You</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We'll notify you of material changes through:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Email to your registered address (30 days advance notice)</li>
                    <li>In-app notification on your dashboard</li>
                    <li>SMS for critical changes</li>
                    <li>Updated "Last Updated" date on this page</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Material changes include: pricing modifications, refund policy changes, liability limitations, or service scope changes.
                  </p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">20.3 Your Options</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">If you don't agree with updated terms:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>You can cancel your account within 30 days of the change</li>
                    <li>You'll receive a refund per Section 14 (Refund Policy)</li>
                    <li>Continued use after 30 days means you accept the new terms</li>
                  </ul>
                </div>

                {/* Section 21 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">21. General Provisions</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-black mb-1">21.1 Entire Agreement</p>
                      <p className="text-gray-700">These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and PowerNetPro regarding your use of our services.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1">21.2 Severability</p>
                      <p className="text-gray-700">If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1">21.3 Governing Law & Jurisdiction</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>These terms are governed by the laws of India</li>
                        <li>Any disputes will be subject to the exclusive jurisdiction of courts in Pune, India</li>
                        <li>We comply with all applicable Indian laws and regulations</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1">21.4 Assignment</p>
                      <p className="text-gray-700">You may not transfer or assign your account or rights under these terms without our written consent. We may assign our rights and obligations to a successor entity (with notice to you).</p>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1">21.5 Waiver</p>
                      <p className="text-gray-700">Our failure to enforce any provision of these terms does not constitute a waiver of that provision or any other provision.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1">21.6 Language</p>
                      <p className="text-gray-700">These terms are provided in English. If translated into other languages, the English version will prevail in case of any discrepancies.</p>
                    </div>
                  </div>
                </div>

                {/* Section 22 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Phone className="h-6 w-6 text-gold" />
                    22. Contact Information
                  </h2>
                  <div className="bg-gold/5 rounded-xl p-6 space-y-4 border border-gold/20">
                    <div>
                      <p className="font-semibold text-black mb-2">Customer Support</p>
                      <p className="text-gray-700 mb-2">For service issues, billing questions, technical support:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>Phone: <a href="tel:+918180861415" className="text-gold hover:underline">+91 8180 861 415</a> (Monday-Saturday, 9 AM - 7 PM IST)</li>
                        <li>Email: <a href="mailto:omkarkolhe912@gmail.com" className="text-gold hover:underline">omkarkolhe912@gmail.com</a></li>
                        <li>Live Chat: Available on dashboard during business hours</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-2">Legal & Compliance</p>
                      <p className="text-gray-700 mb-2">For legal notices, privacy concerns, regulatory matters:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>Email: <a href="mailto:omkarkolhe912@gmail.com" className="text-gold hover:underline">omkarkolhe912@gmail.com</a></li>
                        <li>Address: Kothrud, Pune, Maharashtra, Bharat</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 23 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-gold" />
                    23. Acknowledgment & Acceptance
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By clicking "I Agree," creating an account, or using PowerNetPro services, you acknowledge that:
                  </p>
                  <div className="bg-gold/5 rounded-xl p-4 border border-gold/20">
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>✓ You have read and understood these Terms of Service in full</li>
                      <li>✓ You agree to be legally bound by these terms</li>
                      <li>✓ You have the legal capacity to enter into this agreement</li>
                      <li>✓ You provide accurate and truthful information</li>
                      <li>✓ You understand the risks and limitations described</li>
                      <li>✓ You've had the opportunity to seek independent legal advice</li>
                      <li>✓ You accept responsibility for your account security and usage</li>
                    </ul>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    If you do not agree with these terms, please do not use PowerNetPro services.
                  </p>
                </div>

                {/* Section 24 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">24. Our Commitment to You</h2>
                  <div className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 rounded-xl p-6 border border-gold/20">
                    <p className="text-gray-700 leading-relaxed mb-4">At PowerNetPro, we promise:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li><strong>Transparency:</strong> Clear communication, honest disclosures, no hidden terms</li>
                      <li><strong>Fairness:</strong> Customer-friendly policies, reasonable limitations, balanced rights</li>
                      <li><strong>Accountability:</strong> We own our responsibilities and make things right</li>
                      <li><strong>Protection:</strong> Your investment is secured, your data is protected</li>
                      <li><strong>Performance:</strong> We deliver on our commitments or compensate you</li>
                      <li><strong>Sustainability:</strong> Together, we're building a cleaner energy future</li>
                    </ul>
                    <p className="text-gold font-bold text-xl mt-6 text-center">
                      Thank you for choosing PowerNetPro. Let's power India with sunshine!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
