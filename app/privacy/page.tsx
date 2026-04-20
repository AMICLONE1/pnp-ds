"use client";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, BookOpen, Database, Target, Share2, Clock, Lock, UserCheck, Baby, Globe, RefreshCw, MessageSquare, Scale, Mail, CreditCard } from "lucide-react";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL,
  COMPANY_FULL_ADDRESS,
  GRIEVANCE_OFFICER_NAME,
} from "@/lib/contact";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-gold/10">
      <LandingHeader />

      <main className="flex-1">
        <section className="pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-amber-100 mb-6">
                <Shield className="h-8 w-8 text-gold" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-black mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-gray-600">
                PowerNetPro Pvt. Ltd.
              </p>
              <p className="text-base text-gray-600 mt-1">
                www.powernetpro.com
              </p>
              <p className="text-base text-gray-600 mt-1">
                Effective Date: April 18, 2026
              </p>
            </div>

            <Card className="shadow-lg border-2 border-gold/20">
              <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
                <CardTitle className="text-2xl font-heading font-bold text-black">
                  Privacy Policy Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {/* Section 1 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-gold" />
                    1. Introduction
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    PowerNetPro Pvt. Ltd. (&ldquo;PowerNetPro,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is a Private Limited Company incorporated under the Companies Act, 2013, with its registered office in Pune, Maharashtra, India. We operate the website www.powernetpro.com and associated digital platforms (collectively, the &ldquo;Platform&rdquo;).
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    PowerNetPro operates a digital solar platform that enables urban residents and apartment dwellers to reserve virtual solar capacity within commercial-scale solar installations without physical rooftop requirements. Our Platform connects solar capacity hosts (commercial property owners with rooftop solar installations) with subscribers (end users who reserve virtual solar capacity and receive electricity bill credits).
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    This Privacy Policy explains how we collect, use, store, protect, share, and dispose of your personal data when you access or use our Platform, and the rights you have concerning your personal data. This Privacy Policy is published in compliance with the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 (&ldquo;IT Rules&rdquo;), and the Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;), as applicable.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with any part of this Privacy Policy, you must discontinue use of the Platform immediately.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-gold" />
                    2. Definitions
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    For the purposes of this Privacy Policy, the following terms shall have the meanings ascribed to them:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>&ldquo;Data Fiduciary&rdquo;</strong> means PowerNetPro Pvt. Ltd., which determines the purpose and means of processing personal data.</li>
                    <li><strong>&ldquo;Data Principal&rdquo;</strong> means the individual to whom the personal data relates, i.e., you, the user of the Platform.</li>
                    <li><strong>&ldquo;Data Processor&rdquo;</strong> means any person or entity that processes personal data on behalf of the Data Fiduciary, including third-party service providers engaged by PowerNetPro.</li>
                    <li><strong>&ldquo;Personal Data&rdquo;</strong> means any data about an individual who is identifiable by or in relation to such data.</li>
                    <li><strong>&ldquo;Sensitive Personal Data or Information (SPDI)&rdquo;</strong> means personal information consisting of passwords, financial information, health data, biometric data, sexual orientation, and any data received under lawful contract, as defined under the IT Rules.</li>
                    <li><strong>&ldquo;Processing&rdquo;</strong> means any operation performed on personal data, including collection, recording, organisation, structuring, storage, adaptation, retrieval, consultation, use, disclosure, dissemination, restriction, erasure, or destruction.</li>
                    <li><strong>&ldquo;Consent&rdquo;</strong> means any freely given, specific, informed, and unambiguous indication of the Data Principal&rsquo;s wishes, signifying agreement to the processing of their personal data.</li>
                    <li><strong>&ldquo;Reservation&rdquo;</strong> means the virtual allocation of solar capacity (measured in kW) selected by a subscriber through the Platform.</li>
                    <li><strong>&ldquo;Credit&rdquo;</strong> means the monetary value corresponding to the electricity generated from a subscriber&rsquo;s reserved solar capacity, applied as a bill offset or converted to cash.</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Database className="h-6 w-6 text-gold" />
                    3. Personal Data We Collect
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We collect and process personal data that is necessary for the provision of our services, legal compliance, and to improve your experience on the Platform. The categories of data we collect are as follows:
                  </p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">3.1 Information You Provide Directly</h3>
                  <ul className="list-none space-y-2 text-gray-700 ml-4">
                    <li><strong>(a) Registration and Account Information:</strong> Full name, date of birth, email address, mobile phone number, residential address, state, and preferred distribution company (DISCOM).</li>
                    <li><strong>(b) KYC (Know Your Customer) Verification Data:</strong> Aadhaar number (for e-KYC via DigiLocker API), PAN card number (validated against the Income Tax database), Aadhaar front and back images (for manual KYC upload), and optionally, facial liveness check data for manual KYC verification.</li>
                    <li><strong>(c) Electricity Connection Details:</strong> Consumer number, DISCOM name, billing address, and electricity bill data fetched through the Bharat Bill Payment System (BBPS) API.</li>
                    <li><strong>(d) Bank Account Information:</strong> Bank account number, IFSC code, and account holder name (verified through penny-drop verification) for cash conversion payouts under Option 2.</li>
                    <li><strong>(e) Payment Information:</strong> Transaction details processed through Razorpay payment gateway, including Razorpay order IDs, payment status, and payment confirmation details. PowerNetPro does not store credit card, debit card, or net banking credentials; all card data handling is delegated entirely to Razorpay in compliance with PCI-DSS standards.</li>
                    <li><strong>(f) Communication Data:</strong> Queries, complaints, feedback, and correspondence submitted through customer support channels, email, or the Platform&rsquo;s contact forms.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">3.2 Information Collected Automatically</h3>
                  <ul className="list-none space-y-2 text-gray-700 ml-4">
                    <li><strong>(a) Device and Technical Information:</strong> IP address, browser type and version, operating system, device type, screen resolution, language preferences, and unique device identifiers.</li>
                    <li><strong>(b) Usage Data:</strong> Pages visited, features used, time spent on pages, click patterns, navigation paths, referral URLs, and session duration.</li>
                    <li><strong>(c) Log Data:</strong> Server logs recording access timestamps, request types, response status codes, and error diagnostics.</li>
                    <li><strong>(d) Location Data:</strong> Approximate geographic location derived from your IP address (we do not collect precise GPS location data).</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">3.3 Information from Third Parties</h3>
                  <ul className="list-none space-y-2 text-gray-700 ml-4">
                    <li><strong>(a) DigiLocker:</strong> Aadhaar-based e-KYC verification data, as authorised by you during the verification process.</li>
                    <li><strong>(b) NSDL/CDSL:</strong> PAN verification results confirming the validity of your PAN card details.</li>
                    <li><strong>(c) BBPS (Bharat Bill Payment System):</strong> Electricity bill data including bill amount, due date, consumption details, and payment status for DISCOM accounts linked by you.</li>
                    <li><strong>(d) Razorpay:</strong> Payment confirmation data, transaction status, and refund processing information.</li>
                  </ul>
                </div>

                {/* Section 4 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Target className="h-6 w-6 text-gold" />
                    4. Purpose and Legal Basis for Data Processing
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We process your personal data for the following purposes and on the following legal bases:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gold/20 text-sm">
                      <thead className="bg-gold/10">
                        <tr>
                          <th className="border border-gold/20 px-4 py-2 text-left font-semibold text-black">Purpose</th>
                          <th className="border border-gold/20 px-4 py-2 text-left font-semibold text-black">Data Used</th>
                          <th className="border border-gold/20 px-4 py-2 text-left font-semibold text-black">Legal Basis</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">Account registration and user onboarding</td>
                          <td className="border border-gold/20 px-4 py-2">Name, email, mobile, address, date of birth</td>
                          <td className="border border-gold/20 px-4 py-2">Consent; Performance of contract</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">KYC verification (regulatory compliance)</td>
                          <td className="border border-gold/20 px-4 py-2">Aadhaar, PAN, facial data</td>
                          <td className="border border-gold/20 px-4 py-2">Legal obligation; Consent</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">Solar capacity reservation and credit management</td>
                          <td className="border border-gold/20 px-4 py-2">Electricity connection details, reservation data, credit ledger</td>
                          <td className="border border-gold/20 px-4 py-2">Performance of contract</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">Payment processing and escrow operations</td>
                          <td className="border border-gold/20 px-4 py-2">Payment transaction data, bank account details</td>
                          <td className="border border-gold/20 px-4 py-2">Performance of contract; Legal obligation</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">Electricity bill fetch and payment (BBPS)</td>
                          <td className="border border-gold/20 px-4 py-2">Consumer number, DISCOM details, bill data</td>
                          <td className="border border-gold/20 px-4 py-2">Performance of contract; Consent</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">Cash conversion payouts</td>
                          <td className="border border-gold/20 px-4 py-2">Bank account details, TDS records</td>
                          <td className="border border-gold/20 px-4 py-2">Performance of contract; Legal obligation</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">Customer support and grievance redressal</td>
                          <td className="border border-gold/20 px-4 py-2">Communication data, account details</td>
                          <td className="border border-gold/20 px-4 py-2">Legitimate interest; Consent</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">Platform improvement and analytics</td>
                          <td className="border border-gold/20 px-4 py-2">Usage data, device data, log data</td>
                          <td className="border border-gold/20 px-4 py-2">Legitimate interest</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">Tax compliance (TDS, GST, Form 16A)</td>
                          <td className="border border-gold/20 px-4 py-2">PAN, bank details, transaction records</td>
                          <td className="border border-gold/20 px-4 py-2">Legal obligation</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">Notifications (SMS, email, push)</td>
                          <td className="border border-gold/20 px-4 py-2">Mobile number, email address</td>
                          <td className="border border-gold/20 px-4 py-2">Consent; Legitimate interest</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 5 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Share2 className="h-6 w-6 text-gold" />
                    5. Data Sharing and Disclosure
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    PowerNetPro does not sell, rent, or trade your personal data to any third party for marketing or commercial purposes. We may share your personal data with the following categories of recipients, strictly for the purposes described in this Privacy Policy:
                  </p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">5.1 Third-Party Service Providers</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Razorpay:</strong> For processing payment transactions, managing escrow accounts, and handling refunds. Razorpay operates as an independent Data Processor and maintains its own privacy policy and PCI-DSS compliance.</li>
                    <li><strong>DigiLocker / UIDAI:</strong> For Aadhaar-based e-KYC verification, as authorised by you during the onboarding process.</li>
                    <li><strong>NSDL / CDSL:</strong> For PAN card validation against the Income Tax database.</li>
                    <li><strong>BBPS (NPCI):</strong> For fetching your electricity bill data and processing bill payments on your behalf.</li>
                    <li><strong>Banking Partners:</strong> For NEFT/IMPS disbursements related to cash conversion payouts.</li>
                    <li><strong>Twilio / AWS SNS:</strong> For delivering OTP messages, transactional SMS notifications, and account alerts.</li>
                    <li><strong>AWS SES / SendGrid:</strong> For sending email notifications, monthly credit statements, and marketing communications (with your consent).</li>
                    <li><strong>Cloud Infrastructure Providers:</strong> For hosting the Platform, storing data, and ensuring system availability and disaster recovery.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">5.2 Regulatory and Legal Disclosures</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may disclose your personal data where required by law, regulation, legal process, or governmental request, including compliance with orders from courts, tribunals, the Reserve Bank of India (RBI), the Income Tax Department, the Goods and Services Tax Network (GSTN), State Electricity Regulatory Commissions (SERCs), or any other competent authority.
                  </p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">5.3 Business Transfers</h3>
                  <p className="text-gray-700 leading-relaxed">
                    In the event of a merger, acquisition, reorganisation, restructuring, or sale of all or a portion of our assets, your personal data may be transferred to the successor entity, subject to equivalent data protection safeguards.
                  </p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">5.4 With Your Consent</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may share your personal data with additional third parties where you have provided explicit consent for such sharing.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-gold" />
                    6. Data Retention
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by applicable law. Our retention periods are as follows:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Account and Profile Data:</strong> Retained for the duration of your active account and for a period of three (3) years after account closure or termination, to address any post-termination queries or disputes.</li>
                    <li><strong>KYC Documents (Aadhaar, PAN):</strong> Retained for the duration of the Reservation Agreement (up to fifteen years) and for an additional five (5) years thereafter, as required under anti-money laundering regulations and tax compliance obligations.</li>
                    <li><strong>Transaction and Payment Records:</strong> Retained for a minimum of eight (8) years from the date of the transaction, in compliance with the Income Tax Act, 1961, the GST Act, and other applicable financial regulations.</li>
                    <li><strong>Electricity Bill Data:</strong> Retained for the duration of the Reservation Agreement and for two (2) years thereafter.</li>
                    <li><strong>Credit Ledger and Allocation Records:</strong> Retained for the full fifteen-year reservation tenure and for five (5) years thereafter for audit and reconciliation purposes.</li>
                    <li><strong>Communication and Support Records:</strong> Retained for three (3) years from the date of the last communication.</li>
                    <li><strong>Usage and Log Data:</strong> Retained for a maximum of twenty-four (24) months, after which it is anonymised or deleted.</li>
                    <li><strong>Audit Logs:</strong> Retained for a minimum of five (5) years, as required for regulatory and compliance audits.</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Upon expiry of the applicable retention period, personal data is securely deleted or anonymised using industry-standard data destruction methods.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Lock className="h-6 w-6 text-gold" />
                    7. Data Security Measures
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    PowerNetPro implements robust technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These measures include, but are not limited to:
                  </p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">7.1 Technical Safeguards</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Encryption of personal data in transit using TLS 1.2 or higher protocols.</li>
                    <li>Encryption of sensitive personal data at rest using AES-256 encryption standards.</li>
                    <li>Secure API connections for all data transmissions between the Platform and third-party integrations (DigiLocker, BBPS, Razorpay, banking partners).</li>
                    <li>Multi-factor authentication for administrative access to backend systems.</li>
                    <li>Regular security audits, vulnerability assessments, and penetration testing of the Platform infrastructure.</li>
                    <li>Automated backup systems with encrypted storage and disaster recovery protocols.</li>
                    <li>Intrusion detection and prevention systems (IDS/IPS) monitoring for anomalous activity.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">7.2 Organisational Safeguards</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Role-based access controls (RBAC) limiting access to personal data to authorised personnel only, on a need-to-know basis.</li>
                    <li>Mandatory data protection training for all employees and contractors handling personal data.</li>
                    <li>Maker-checker approval protocols for all escrow fund movements and sensitive administrative operations.</li>
                    <li>Comprehensive audit trails logging all access to and modifications of personal data, including actor identification, timestamp, and IP address.</li>
                    <li>Incident response procedures for prompt detection, containment, and notification of data breaches.</li>
                    <li>Confidentiality agreements and data processing agreements with all third-party service providers.</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">7.3 PCI-DSS Compliance</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All payment card data handling is delegated entirely to Razorpay, which maintains PCI-DSS Level 1 compliance. No credit card, debit card, or net banking credentials are stored on or transmitted through PowerNetPro&rsquo;s servers.
                  </p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-gold" />
                    7.4 Third-Party Payment Processing
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    All payment transactions on PowerNetPro are processed through Razorpay Payments Private Limited, an RBI-authorised Payment Aggregator. Razorpay is PCI DSS Level 1 certified. We do not store your credit card, debit card, or UPI details on our servers. All payment data is handled securely by Razorpay in accordance with RBI guidelines. For Razorpay&rsquo;s privacy practices, please refer to Razorpay&rsquo;s Privacy Policy at{" "}
                    <a
                      href="https://razorpay.com/privacy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:underline"
                    >
                      https://razorpay.com/privacy/
                    </a>
                    .
                  </p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-gold" />
                    7.5 Data Protection Officer
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    In accordance with the Digital Personal Data Protection Act, 2023, we have appointed the following Data Protection Officer:
                  </p>
                  <div className="bg-gold/5 rounded-xl p-6 space-y-2 border border-gold/20">
                    <p className="text-gray-700"><strong>Name:</strong> {GRIEVANCE_OFFICER_NAME}</p>
                    <p className="text-gray-700">
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline">{SUPPORT_EMAIL}</a>
                    </p>
                    <p className="text-gray-700">
                      <strong>Phone:</strong>{" "}
                      <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-gold hover:underline">{SUPPORT_PHONE}</a>
                    </p>
                    <p className="text-gray-700"><strong>Address:</strong> {COMPANY_FULL_ADDRESS}</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    You may contact the Data Protection Officer for any queries regarding your personal data, data access requests, correction requests, or data deletion requests.
                  </p>
                </div>

                {/* Section 8 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <UserCheck className="h-6 w-6 text-gold" />
                    8. Your Rights as a Data Principal
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Under the Digital Personal Data Protection Act, 2023, and other applicable Indian laws, you have the following rights concerning your personal data:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Right to Access:</strong> You have the right to obtain confirmation as to whether your personal data is being processed and to access a summary of such data and the processing activities.</li>
                    <li><strong>Right to Correction:</strong> You have the right to request correction of inaccurate or misleading personal data and to have incomplete data completed.</li>
                    <li><strong>Right to Erasure:</strong> You have the right to request erasure of your personal data where it is no longer necessary for the purpose for which it was collected, subject to our legal retention obligations.</li>
                    <li><strong>Right to Withdraw Consent:</strong> Where processing is based on your consent, you have the right to withdraw consent at any time. Withdrawal of consent shall not affect the lawfulness of processing carried out prior to such withdrawal. Please note that withdrawal of consent for certain processing activities (such as KYC verification) may result in the inability to continue providing services to you.</li>
                    <li><strong>Right to Grievance Redressal:</strong> You have the right to lodge a complaint with our Grievance Officer or, if unresolved, with the Data Protection Board of India established under the DPDP Act.</li>
                    <li><strong>Right to Nominate:</strong> You have the right to nominate any individual who shall, in the event of your death or incapacity, exercise your rights as a Data Principal.</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    To exercise any of the above rights, please contact our Grievance Officer using the details provided in Section 12 of this Privacy Policy. We will respond to your request within thirty (30) days of receipt.
                  </p>
                </div>

                {/* Section 9 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Baby className="h-6 w-6 text-gold" />
                    9. Children&rsquo;s Privacy
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    The Platform is intended exclusively for individuals who are eighteen (18) years of age or older. We do not knowingly collect, process, or store personal data of individuals under the age of eighteen. If you are under eighteen years of age, you are not permitted to register on or use the Platform.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    If we become aware that we have inadvertently collected personal data from an individual under the age of eighteen, we will take immediate steps to delete such data from our systems. If you believe that we have collected personal data from a minor, please contact our Grievance Officer immediately.
                  </p>
                </div>

                {/* Section 10 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Globe className="h-6 w-6 text-gold" />
                    10. Cross-Border Data Transfers
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    PowerNetPro primarily stores and processes your personal data within India. However, certain third-party service providers engaged by us (such as cloud infrastructure providers, email service providers, and analytics platforms) may process data in servers located outside India.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Where personal data is transferred outside India, we ensure that such transfers comply with the provisions of the DPDP Act, 2023, and that adequate safeguards are in place, including contractual obligations requiring the receiving party to maintain data protection standards equivalent to those required under Indian law. We do not transfer personal data to any country or territory that has been restricted by the Central Government of India under the DPDP Act.
                  </p>
                </div>

                {/* Section 11 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <RefreshCw className="h-6 w-6 text-gold" />
                    11. Changes to This Privacy Policy
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We reserve the right to update or modify this Privacy Policy at any time to reflect changes in our data processing practices, legal requirements, or business operations. When we make material changes to this Privacy Policy, we will notify you through one or more of the following methods:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>A prominent notice displayed on the Platform homepage or within your account dashboard.</li>
                    <li>An email notification sent to the email address associated with your account.</li>
                    <li>An SMS notification to your registered mobile number.</li>
                    <li>An in-app notification for users accessing the Platform through mobile applications.</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    The &ldquo;Effective Date&rdquo; at the top of this Privacy Policy indicates when the latest version took effect. Your continued use of the Platform after the effective date of the revised Privacy Policy constitutes your acceptance of the changes. We encourage you to review this Privacy Policy periodically.
                  </p>
                </div>

                {/* Section 12 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-gold" />
                    12. Grievance Officer
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In accordance with the Information Technology Act, 2000, the IT Rules, 2011, and the Digital Personal Data Protection Act, 2023, we have appointed a Grievance Officer to address your concerns and complaints regarding the processing of your personal data.
                  </p>
                  <div className="bg-gold/5 rounded-xl p-6 space-y-2 border border-gold/20">
                    <p className="text-gray-700"><strong>Name:</strong> [Designated Partner / Founder Name]</p>
                    <p className="text-gray-700"><strong>Designation:</strong> Grievance Officer</p>
                    <p className="text-gray-700"><strong>Organisation:</strong> PowerNetPro Pvt. Ltd.</p>
                    <p className="text-gray-700"><strong>Registered Address:</strong> Pune, Maharashtra, India</p>
                    <p className="text-gray-700"><strong>Email:</strong> <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline">{SUPPORT_EMAIL}</a></p>
                    <p className="text-gray-700"><strong>Response Time:</strong> Within thirty (30) days of receipt of your complaint or request.</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    If you are not satisfied with the resolution provided by our Grievance Officer, you have the right to escalate your complaint to the Data Protection Board of India, as established under the DPDP Act, 2023.
                  </p>
                </div>

                {/* Section 13 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Scale className="h-6 w-6 text-gold" />
                    13. Governing Law and Jurisdiction
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    This Privacy Policy shall be governed by and construed in accordance with the laws of India, including but not limited to the Information Technology Act, 2000, the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, and the Digital Personal Data Protection Act, 2023.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Any disputes arising out of or in connection with this Privacy Policy shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.
                  </p>
                </div>

                {/* Section 14 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-gold" />
                    14. Contact Us
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data processing practices, please contact us at:
                  </p>
                  <div className="bg-gold/5 rounded-xl p-6 space-y-2 border border-gold/20">
                    <p className="text-gray-700"><strong>PowerNetPro Pvt. Ltd.</strong></p>
                    <p className="text-gray-700"><strong>Registered Address:</strong> Pune, Maharashtra, India</p>
                    <p className="text-gray-700"><strong>Email:</strong> <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline">{SUPPORT_EMAIL}</a></p>
                    <p className="text-gray-700"><strong>Website:</strong> www.powernetpro.com</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gold/20 text-center">
                  <p className="text-sm text-gray-600">
                    &copy; 2026 PowerNetPro Pvt. Ltd. All rights reserved.
                  </p>
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
