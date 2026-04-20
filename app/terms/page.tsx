import type { ComponentType, ReactNode } from "react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  CreditCard,
  FileText,
  Gavel,
  Globe,
  IndianRupee,
  Info,
  Lock,
  Mail,
  RefreshCw,
  Scale,
  Shield,
  Users,
  XCircle,
} from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/contact";

type SectionCardProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  children: ReactNode;
};

type ListProps = {
  items: ReactNode[];
};

const definitions = [
  ["Capacity Reservation", "means the virtual allocation of solar generation capacity (measured in kilowatts, kW) selected and paid for by a Subscriber through the Platform."],
  ["Credit", "means the monetary or unit-based value attributed to the electricity generated from a Subscriber’s reserved solar capacity, which may be applied as an electricity bill offset (Option 1) or converted to cash (Option 2)."],
  ["Credit Ledger", "means the digital record maintained on the Platform tracking each Subscriber’s credit allocation, redemption, and balance."],
  ["DISCOM", "means the electricity distribution company that supplies electricity to the User’s premises."],
  ["Escrow Account", "means the regulated escrow account established with a scheduled commercial bank or NBFC for securing Subscriber reservation fees and funding bill settlement operations."],
  ["Host", "means the commercial property owner or housing society that provides rooftop or premises space for the installation of solar capacity under a Power Purchase Agreement with PowerNetPro."],
  ["KYC", "means Know Your Customer verification, comprising identity verification through Aadhaar and PAN as required by applicable law and Platform policy."],
  ["Option 1", "means the bill offset mode of credit redemption, where Credits are applied to offset the Subscriber’s electricity bill through the BBPS system."],
  ["Option 2", "means the cash conversion mode of credit redemption, where Credits are converted to their INR equivalent and disbursed to the Subscriber’s verified bank account via NEFT/IMPS."],
  ["Reservation Agreement", "means the agreement entered into between PowerNetPro and a Subscriber upon confirmation of a Capacity Reservation, setting out the specific terms of the reservation including capacity, fees, credit rate, and tenure."],
  ["Reservation Fee", "means the one-time fee payable by the Subscriber for reserving solar capacity through the Platform."],
  ["Subscriber", "means an individual or entity that has completed registration, KYC verification, and a Capacity Reservation on the Platform."],
];

const eligibilityItems = [
  "You must be at least eighteen (18) years of age.",
  "You must be a citizen or legal resident of India.",
  "You must possess a valid electricity connection with a recognised DISCOM in India.",
  "You must be competent to enter into a binding contract under the Indian Contract Act, 1872.",
  "You must not have been previously suspended, terminated, or barred from using the Platform.",
];

const userObligations = [
  "Provide accurate, current, and complete information during registration, KYC verification, and at all times during your use of the Platform.",
  "Maintain the security and confidentiality of your account credentials and promptly notify us of any unauthorised access.",
  "Use the Platform only for lawful purposes and in compliance with these Terms and all applicable laws.",
  "Not engage in any activity that could damage, disable, overburden, or impair the Platform or interfere with any other party’s use of the Platform.",
  "Not attempt to gain unauthorised access to any part of the Platform, its servers, databases, or connected systems.",
  "Not reverse engineer, decompile, disassemble, or attempt to derive the source code of the Platform or any underlying technology.",
  "Not use automated tools, bots, scrapers, or other means to access, collect data from, or interact with the Platform without our express written permission.",
  "Not impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity.",
  "Not upload, transmit, or distribute any viruses, malware, or other harmful code through the Platform.",
  "Not use the Platform for any fraudulent or illegal purpose, including money laundering, tax evasion, or identity theft.",
  "Promptly inform PowerNetPro of any changes to your electricity connection, DISCOM, residential address, or bank account details.",
];

const indemnificationItems = [
  "Your breach of any provision of these Terms.",
  "Your violation of any applicable law, regulation, or third-party right.",
  "Your use or misuse of the Platform.",
  "Any false, inaccurate, or misleading information provided by you, including KYC documentation.",
  "Any unauthorised access to or use of your account resulting from your failure to safeguard your credentials.",
];

const arbitrationItems = [
  "The arbitration shall be conducted by a sole arbitrator appointed by mutual agreement of the parties. If the parties are unable to agree on a sole arbitrator within fifteen (15) days, the arbitrator shall be appointed pursuant to Section 11 of the Arbitration and Conciliation Act, 1996.",
  "The seat and venue of arbitration shall be Pune, Maharashtra, India.",
  "The language of arbitration proceedings shall be English.",
  "The arbitrator’s award shall be final and binding on both parties.",
  "Each party shall bear its own costs of arbitration, and the arbitrator’s fees shall be borne equally by both parties unless the arbitrator orders otherwise.",
];

function SectionCard({ icon: Icon, title, description, children }: SectionCardProps) {
  return (
    <Card className="shadow-lg border-2 border-gold/20">
      <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
        <CardTitle className="text-2xl font-heading font-bold text-black flex items-center gap-2">
          <Icon className="h-6 w-6 text-gold" />
          {title}
        </CardTitle>
        {description ? <p className="text-gray-600">{description}</p> : null}
      </CardHeader>
      <CardContent className="p-8 space-y-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        {children}
      </CardContent>
    </Card>
  );
}

function BulletList({ items }: ListProps) {
  return (
    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
      {items.map((item) => (
        <li key={typeof item === "string" ? item : String(item)}>{item}</li>
      ))}
    </ul>
  );
}

function NumberedList({ items }: ListProps) {
  return (
    <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
      {items.map((item) => (
        <li key={typeof item === "string" ? item : String(item)}>{item}</li>
      ))}
    </ol>
  );
}

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
                PowerNetPro Pvt. Ltd. | www.powernetpro.com | Effective Date: April 18, 2026
              </p>
            </div>

            <div className="space-y-6">
              <SectionCard icon={FileText} title="1. Introduction and Acceptance">
                <p className="text-gray-700 leading-relaxed">
                  These Terms of Service (“Terms”) constitute a legally binding agreement between you (“User,” “you,” or “your”) and PowerNetPro Pvt. Ltd. (“PowerNetPro,” “we,” “our,” or “us”), a Private Limited Company incorporated under the Companies Act, 2013, with its registered office in Pune, Maharashtra, India.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  These Terms govern your access to and use of the website www.powernetpro.com, associated digital platforms, mobile applications (when available), and all services provided therethrough (collectively, the “Platform”). By accessing, browsing, registering on, or using the Platform in any manner, you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, our Cookie Policy, and our Refund Policy, which are incorporated herein by reference.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you do not agree with any provision of these Terms, you must immediately cease all use of the Platform and refrain from registering for or using any services offered through it.
                </p>
              </SectionCard>

              <SectionCard icon={Scale} title="2. Definitions">
                <p className="text-gray-700 leading-relaxed">In these Terms, unless the context otherwise requires:</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gold/30 mt-4">
                    <thead>
                      <tr className="bg-gold/10">
                        <th className="border border-gold/30 p-3 text-left font-semibold text-black">Term</th>
                        <th className="border border-gold/30 p-3 text-left font-semibold text-black">Definition</th>
                      </tr>
                    </thead>
                    <tbody>
                      {definitions.map(([term, definition], index) => (
                        <tr key={term} className={index % 2 === 1 ? "bg-gold/5" : "bg-white"}>
                          <td className="border border-gold/30 p-3 text-gray-700 align-top font-semibold">“{term}”</td>
                          <td className="border border-gold/30 p-3 text-gray-700 align-top">{definition}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>

              <SectionCard icon={Shield} title="3. Eligibility">
                <p className="text-gray-700 leading-relaxed">To access and use the Platform, you must satisfy all of the following eligibility requirements:</p>
                <BulletList items={eligibilityItems} />
                <p className="text-gray-700 leading-relaxed">
                  If you are registering on behalf of a business entity (such as a company, LLP, partnership firm, or proprietorship), you represent and warrant that you have the legal authority to bind that entity to these Terms.
                </p>
              </SectionCard>

              <SectionCard icon={Lock} title="4. Account Registration and KYC">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-1">4.1 Registration</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    To use the Platform’s services, you must create an account by providing accurate and complete registration information, including your full name, date of birth, email address, mobile phone number, residential address, and preferred DISCOM. Registration is initiated through mobile number OTP verification.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify PowerNetPro of any unauthorised access to or use of your account.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">4.2 KYC Verification</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Completion of KYC verification is mandatory before you can make a Capacity Reservation. KYC verification may be completed through Aadhaar-based e-KYC via DigiLocker API (real-time verification) or manual document upload (Aadhaar front/back and PAN card), subject to administrative review within forty-eight (48) business hours. PAN validation is conducted against the Income Tax database through NSDL/CDSL API integration.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You represent and warrant that all KYC documents and information provided by you are genuine, accurate, and belong to you. Provision of false, misleading, or fraudulent KYC information constitutes grounds for immediate account termination and may result in legal action.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">4.3 Bank Account Linkage</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    If you wish to receive cash conversion payouts under Option 2, you must link a verified bank account. Verification is conducted through penny-drop verification (INR 1 credit and immediate reversal to confirm account validity). You represent that the bank account belongs to you and that you are the authorised account holder.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={Globe} title="5. Services Provided">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-1">5.1 Digital Solar Platform</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    PowerNetPro operates a digital solar platform that enables Subscribers to reserve virtual solar capacity within commercial-scale solar installations deployed on Host properties. The Platform facilitates the following services:
                  </p>
                  <BulletList
                    items={[
                      "Browsing and selecting available solar capacity reservations across active installations.",
                      "Reserving solar capacity (minimum threshold of 1.5 kW) through a one-time Reservation Fee.",
                      "Real-time monitoring of solar generation from reserved capacity through an online dashboard.",
                      "Receiving electricity bill credits (at a rate of INR 6.50 to INR 7.00 per unit) based on actual generation from reserved capacity.",
                      "Redeeming Credits through Option 1 (bill offset via BBPS) or Option 2 (cash conversion to bank account).",
                      "Viewing monthly credit statements, generation reports, and environmental impact data.",
                    ]}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">5.2 Nature of Services</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    PowerNetPro does not sell electricity directly to Subscribers. The Platform provides an Energy-as-a-Service model wherein Subscribers receive financial credits proportional to the solar energy generated from their reserved capacity. The actual electricity generated is consumed on-site by the Host, who pays PowerNetPro a pre-agreed per-unit tariff. PowerNetPro does not currently operate under a Virtual Net Metering (VNM) model.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Credits received by Subscribers represent a financial value derived from the generation performance of the solar installation and are not a direct supply of electricity to the Subscriber’s premises.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={IndianRupee} title="6. Capacity Reservation and Fees">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-1">6.1 Reservation Process</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Once KYC verification is complete, you may browse available solar capacity tiers on the Platform. Each tier displays the capacity allocation (in kW), estimated monthly credit generation (in kWh), equivalent bill savings estimate, annual and fifteen-year savings projections, and the one-time Reservation Fee.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Upon selecting a capacity tier, you will be presented with a Reservation Agreement detailing the specific terms of your reservation. By confirming the reservation and making payment, you accept the terms of the Reservation Agreement.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">6.2 Reservation Fee</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    The Reservation Fee is a one-time payment in the range of INR 35,000 to INR 40,000 per kW (subject to applicable government subsidies and promotions). The Reservation Fee is processed through Razorpay and routed to the Escrow Account. The Reservation Fee is payable through UPI, net banking, credit card, debit card, or other payment methods supported by Razorpay.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">6.3 Reservation Tenure</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Each Capacity Reservation has a tenure of fifteen (15) years from the date of activation. At the end of the tenure, the solar plant and associated equipment are transferred to the Host as per the terms of the Power Purchase Agreement. Your credit entitlements shall cease upon expiry of the reservation tenure.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">6.4 Reservation Activation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Your Capacity Reservation shall be activated upon confirmation of Reservation Fee receipt in the Escrow Account and commissioning of the associated solar installation. The activation date, unique Reservation ID, and credit generation schedule shall be communicated to you through the Platform, email, and SMS.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={CreditCard} title="7. Credit System">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-1">7.1 Credit Allocation</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Credits are allocated to your account on a monthly basis, based on the actual solar energy generated from your reserved capacity. The Platform calculates per-user generation based on capacity reservation ratios and allocates credits accordingly. Credits are allocated at a rate of INR 6.50 to INR 7.00 per unit of electricity generated, as specified in your Reservation Agreement.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">7.2 Credit Redemption – Option 1 (Bill Offset)</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Under Option 1, you may apply your accumulated Credits to offset your electricity bill. The Platform fetches your electricity bill data through the BBPS API, calculates the credit-equivalent value at the applicable DISCOM tariff, and processes the bill payment from the operational sub-account of the Escrow Account. Credits used for bill offset are debited from your Credit Ledger.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">7.3 Credit Redemption – Option 2 (Cash Conversion)</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Under Option 2, you may convert your accumulated Credits to their INR equivalent and receive a cash payout to your verified bank account via NEFT/IMPS. Tax Deducted at Source (TDS) shall be deducted on cash conversion payouts as applicable under the Income Tax Act, 1961. PowerNetPro shall generate annual Form 16A for TDS deducted on your payouts.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">7.4 Credit Validity</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Credits are valid for the duration of your Reservation tenure (fifteen years). Accumulated Credits that are not redeemed before the expiry of your Reservation tenure shall lapse and cannot be recovered, refunded, or transferred.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={Users} title="8. User Obligations">
                <p className="text-gray-700 leading-relaxed">As a User of the Platform, you agree to:</p>
                <BulletList items={userObligations} />
              </SectionCard>

              <SectionCard icon={Info} title="9. Intellectual Property">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-1">9.1 Ownership</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All intellectual property rights in and to the Platform, including but not limited to the website design, user interface, source code, algorithms, software, databases, text, graphics, logos, trademarks, service marks, trade names, and all content published on the Platform, are the exclusive property of PowerNetPro Pvt. Ltd. or its licensors and are protected under applicable Indian and international intellectual property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">9.2 Limited Licence</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Subject to your compliance with these Terms, PowerNetPro grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable licence to access and use the Platform solely for your personal, non-commercial purposes as a registered User. This licence does not include the right to modify, reproduce, distribute, publicly display, or create derivative works of any Platform content.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">9.3 Restrictions</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You shall not, without the prior written consent of PowerNetPro, copy, reproduce, distribute, transmit, display, perform, publish, license, create derivative works from, transfer, or sell any content, information, software, products, or services obtained from or through the Platform.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">9.4 User-Generated Content</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you submit any content to the Platform (such as feedback, reviews, or suggestions), you grant PowerNetPro a non-exclusive, royalty-free, perpetual, irrevocable, worldwide licence to use, reproduce, modify, and distribute such content in connection with the operation and promotion of the Platform.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={AlertCircle} title="10. Disclaimers and Limitation of Liability">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-1">10.1 Service Disclaimer</h3>
                  <p className="text-gray-700 leading-relaxed uppercase">
                    THE PLATFORM AND ALL SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">10.2 Generation and Credit Disclaimer</h3>
                  <p className="text-gray-700 leading-relaxed">
                    PowerNetPro does not guarantee specific levels of solar energy generation or credit amounts. Solar generation is subject to natural variability including weather conditions, seasonal fluctuations, equipment performance, grid curtailment, and force majeure events. Estimated generation and savings figures provided on the Platform are illustrative projections and not guaranteed outcomes.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">10.3 Third-Party Services</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Platform integrates with third-party services including Razorpay, DigiLocker, BBPS, and banking partners. PowerNetPro is not responsible for the availability, accuracy, performance, or security of any third-party service. Any issues arising from third-party services should be directed to the respective service provider.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">10.4 Limitation of Liability</h3>
                  <div className="space-y-4 text-gray-700 leading-relaxed uppercase">
                    <p>
                      TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL POWERNETPRO, ITS PARTNERS, EMPLOYEES, AGENTS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR BUSINESS OPPORTUNITY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE PLATFORM, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                    </p>
                    <p>
                      THE TOTAL AGGREGATE LIABILITY OF POWERNETPRO FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THESE TERMS OR YOUR USE OF THE PLATFORM SHALL NOT EXCEED THE TOTAL AMOUNT OF RESERVATION FEES PAID BY YOU TO POWERNETPRO IN THE TWELVE (12) MONTHS PRECEDING THE DATE OF THE CLAIM.
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">10.5 Regulatory and Policy Changes</h3>
                  <p className="text-gray-700 leading-relaxed">
                    PowerNetPro’s business model is subject to regulatory frameworks including net metering policies, DISCOM regulations, and state electricity commission directives. Changes in these regulatory frameworks may affect credit rates, service availability, or operational model. PowerNetPro shall not be liable for any adverse impact resulting from regulatory or policy changes beyond its control.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={Shield} title="11. Indemnification">
                <p className="text-gray-700 leading-relaxed mb-2">
                  You agree to indemnify, defend, and hold harmless PowerNetPro, its designated partners, employees, agents, contractors, and affiliates from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or in connection with:
                </p>
                <BulletList items={indemnificationItems} />
              </SectionCard>

              <SectionCard icon={XCircle} title="12. Suspension and Termination">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-1">12.1 Suspension</h3>
                  <p className="text-gray-700 leading-relaxed">
                    PowerNetPro reserves the right to suspend your access to the Platform, in whole or in part, at any time and without prior notice, if we reasonably believe that you have violated any provision of these Terms, you have provided false or fraudulent KYC information, your account has been compromised or is being used for unauthorised purposes, your actions pose a risk to the Platform, other Users, or third parties, or if required by law, regulation, or court order.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">12.2 Termination by PowerNetPro</h3>
                  <p className="text-gray-700 leading-relaxed">
                    PowerNetPro may terminate your account and Reservation Agreement upon written notice if you commit a material breach of these Terms and fail to cure such breach within thirty (30) days of receiving written notice, you are found to have engaged in fraudulent or illegal activity, or continued provision of services becomes impracticable due to regulatory changes or force majeure events extending beyond one hundred and eighty (180) days.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">12.3 Termination by User</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You may request termination of your account and cancellation of your Capacity Reservation at any time through the account settings on the Platform or by contacting our customer support team. Termination and refund shall be processed in accordance with our Refund Policy.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">12.4 Consequences of Termination</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Upon termination of your account, all unused Credits in your account shall lapse immediately and cannot be recovered, refunded, or converted to cash. Any refund of the Reservation Fee shall be processed in accordance with the Refund Policy. Your obligation to pay any outstanding amounts to PowerNetPro shall survive termination.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={RefreshCw} title="13. Force Majeure">
                <p className="text-gray-700 leading-relaxed">
                  PowerNetPro shall not be liable for any failure or delay in performance of its obligations under these Terms if such failure or delay results from circumstances beyond its reasonable control, including but not limited to natural disasters (earthquakes, floods, cyclones), acts of God, epidemics or pandemics, war, terrorism, civil unrest, government actions or restrictions, regulatory changes affecting net metering or solar energy policies, power grid failures or DISCOM outages, equipment failures beyond normal operational parameters, cyberattacks or data security incidents affecting critical infrastructure, or strikes, lockouts, or industrial disputes.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  In the event of a force majeure event, PowerNetPro shall notify affected Users as soon as reasonably practicable and shall use reasonable efforts to mitigate the impact and resume services at the earliest opportunity.
                </p>
              </SectionCard>

              <SectionCard icon={Gavel} title="14. Dispute Resolution">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-1">14.1 Informal Resolution</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In the event of any dispute, claim, or controversy arising out of or relating to these Terms or the Platform (“Dispute”), you agree to first attempt to resolve the Dispute informally by contacting PowerNetPro’s customer support team. PowerNetPro shall use reasonable efforts to resolve the Dispute within thirty (30) days of receipt of your written complaint.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">14.2 Arbitration</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    If the Dispute is not resolved through informal resolution within thirty (30) days, the Dispute shall be referred to and finally resolved by arbitration in accordance with the Arbitration and Conciliation Act, 1996, as amended from time to time.
                  </p>
                  <BulletList items={arbitrationItems} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">14.3 Governing Law</h3>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of India, including the Indian Contract Act, 1872, the Information Technology Act, 2000, the Consumer Protection Act, 2019, and other applicable legislation. Subject to Section 14.2, the courts at Pune, Maharashtra shall have exclusive jurisdiction over any matters arising from these Terms.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={RefreshCw} title="15. Modifications to Terms">
                <p className="text-gray-700 leading-relaxed mb-3">
                  PowerNetPro reserves the right to modify, amend, or update these Terms at any time. When material changes are made, we will provide notice through a prominent notification on the Platform, email notification to your registered email address, or SMS notification to your registered mobile number, at least fifteen (15) days before the changes take effect.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Your continued use of the Platform after the effective date of the revised Terms constitutes your acceptance of the modifications. If you do not agree with the revised Terms, you must discontinue use of the Platform and may request account termination in accordance with Section 12.3.
                </p>
              </SectionCard>

              <SectionCard icon={FileText} title="16. Miscellaneous">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-1">16.1 Entire Agreement</h3>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms, together with the Privacy Policy, Cookie Policy, Refund Policy, and any Reservation Agreement, constitute the entire agreement between you and PowerNetPro concerning the Platform and supersede all prior agreements, understandings, negotiations, and discussions, whether oral or written.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">16.2 Severability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If any provision of these Terms is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if modification is not possible, severed from these Terms. The remaining provisions shall continue in full force and effect.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">16.3 Waiver</h3>
                  <p className="text-gray-700 leading-relaxed">
                    No failure or delay by PowerNetPro in exercising any right, power, or remedy under these Terms shall operate as a waiver thereof. A single or partial exercise of any right shall not preclude further exercise of any right or that or any other right.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">16.4 Assignment</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You may not assign, transfer, or delegate your rights or obligations under these Terms without the prior written consent of PowerNetPro. PowerNetPro may assign its rights and obligations under these Terms to any affiliate, successor, or acquiring entity without your consent, provided that the assignee agrees to be bound by these Terms.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">16.5 Notices</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All notices required or permitted under these Terms shall be in writing and shall be deemed delivered when sent to the email address associated with your account (for notices to you) or to <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline font-semibold">{SUPPORT_EMAIL}</a> (for notices to PowerNetPro). For formal legal notices, written communication sent via registered post or courier to the registered office address shall also be accepted.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">16.6 No Agency</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Nothing in these Terms creates any agency, partnership, joint venture, or employment relationship between you and PowerNetPro. You do not have authority to bind PowerNetPro in any manner whatsoever.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">16.7 Survival</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The following provisions shall survive any termination or expiration of these Terms: Sections 9 (Intellectual Property), 10 (Disclaimers and Limitation of Liability), 11 (Indemnification), 14 (Dispute Resolution), and any other provisions that by their nature should survive.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={Mail} title="17. Contact Information">
                <p className="text-gray-700 leading-relaxed mb-4">
                  For questions, concerns, or notices relating to these Terms of Service, please contact us at:
                </p>
                <div className="bg-gold/5 rounded-xl p-6 space-y-3 border border-gold/20">
                  <p className="text-gray-700"><strong>PowerNetPro Pvt. Ltd.</strong></p>
                  <p className="text-gray-700">Registered Address: Pune, Maharashtra, India</p>
                  <p className="text-gray-700">Email: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline font-semibold">{SUPPORT_EMAIL}</a></p>
                  <p className="text-gray-700">Customer Support: <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline font-semibold">{SUPPORT_EMAIL}</a></p>
                  <p className="text-gray-700">Website: www.powernetpro.com</p>
                </div>
                <div className="border-t border-gold/20 pt-4 text-sm text-gray-600 text-center">
                  © 2026 PowerNetPro Pvt. Ltd.. All rights reserved.
                </div>
              </SectionCard>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}