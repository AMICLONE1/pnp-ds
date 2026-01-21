"use client";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText, Database, Share2, Key, Users, AlertCircle, Mail, Phone, MapPin } from "lucide-react";

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
                Last Updated: January 2026 | Version: 1.0
              </p>
            </div>

            <Card className="shadow-lg border-2 border-gold/20 mb-6">
              <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
                <CardTitle className="text-2xl font-heading font-bold text-black">
                  Our Commitment to Your Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <p className="text-gray-700 leading-relaxed">
                  At PowerNetPro, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  By using PowerNetPro, you agree to the collection and use of information in accordance with this policy.
                </p>
              </CardContent>
            </Card>

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
                    <strong>PowerNetPro Private Limited</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website www.powernetpro.com (the &quot;Service&quot;). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Legal Compliance:</strong> This Privacy Policy is compliant with the Information Technology Act, 2000 (India) and the Digital Personal Data Protection Act, 2023 (DPDPA).
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Database className="h-6 w-6 text-gold" />
                    2. What Data We Collect
                  </h2>
                  
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">2.1 Personal Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We collect information that you provide directly to us:</p>
                  <div className="ml-4 space-y-3">
                    <div>
                      <p className="font-semibold text-black mb-1">Account Information:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Address</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1">Utility Information:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                        <li>DISCOM account number</li>
                        <li>Electricity bill details</li>
                        <li>Consumption data</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">2.2 Payment Information</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Payment processing is handled by secure third-party payment gateways. We do not store your complete card details. We only receive:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Payment transaction IDs</li>
                    <li>Payment status and confirmation</li>
                    <li>Billing address (for verification)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">2.3 Usage Data</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">We automatically collect certain information when you use our Service:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>IP address and device information</li>
                    <li>Browser type and version</li>
                    <li>Pages visited and time spent</li>
                    <li>Date and time of access</li>
                    <li>Solar generation and credit data</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Eye className="h-6 w-6 text-gold" />
                    3. How We Use Your Data
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">We use the collected data for various purposes:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>To provide and maintain our Service</li>
                    <li>To process your reservations and payments</li>
                    <li>To calculate and manage your credits</li>
                    <li>To send you service updates and notifications</li>
                    <li>To provide customer support</li>
                    <li>To detect and prevent fraud</li>
                    <li>To comply with legal obligations</li>
                    <li>To improve our Service and user experience</li>
                  </ul>
                </div>

                {/* Section 4 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Share2 className="h-6 w-6 text-gold" />
                    4. Data Sharing & Disclosure
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We do not sell your personal information. We may share your data only in the following circumstances:
                  </p>
                  <div className="ml-4 space-y-3">
                    <div>
                      <p className="font-semibold text-black mb-1">With Your Consent:</p>
                      <p className="text-gray-700">We share data when you explicitly consent to such sharing.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1">Service Providers:</p>
                      <p className="text-gray-700">We share data with trusted third-party service providers who assist us in operating our platform (payment processors, cloud hosting, analytics).</p>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1">Legal Requirements:</p>
                      <p className="text-gray-700">We may disclose data if required by law or in response to valid requests by public authorities.</p>
                    </div>
                  </div>
                </div>

                {/* Section 5 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Key className="h-6 w-6 text-gold" />
                    5. Data Security
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">Security Measures</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Encrypted storage of sensitive data</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication</li>
                    <li>Secure payment processing (PCI-DSS compliant)</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    While we strive to use commercially acceptable means to protect your data, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-gold" />
                    6. Your Data Rights (Under DPDPA)
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">You have the following rights regarding your personal data:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
                    <li><strong>Right to Correction:</strong> Update or correct inaccurate data</li>
                    <li><strong>Right to Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
                    <li><strong>Right to Data Portability:</strong> Export your data in a machine-readable format</li>
                    <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing</li>
                    <li><strong>Right to Grievance:</strong> File complaints with the Data Protection Board</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    To exercise these rights, contact us at <a href="mailto:omkarkolhe912@gmail.com" className="text-gold hover:underline font-semibold">omkarkolhe912@gmail.com</a>. We will respond within 30 days.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">7. Cookies & Tracking Technologies</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We use cookies and similar tracking technologies to track activity on our Service:
                  </p>
                  <div className="ml-4 space-y-2">
                    <p className="text-gray-700"><strong>Essential Cookies:</strong> Required for the Service to function (authentication, security).</p>
                    <p className="text-gray-700"><strong>Analytics Cookies:</strong> Help us understand how users interact with our Service.</p>
                    <p className="text-gray-700"><strong>Preference Cookies:</strong> Remember your settings and preferences.</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    You can control cookies through your browser settings. However, disabling cookies may affect Service functionality.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    For more details, see our <a href="/cookies" className="text-gold hover:underline font-semibold">Cookie Policy</a>.
                  </p>
                </div>

                {/* Section 8 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">8. Third-Party Services</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Our Service may contain links to third-party websites or services. We are not responsible for their privacy practices:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Payment processors (Razorpay, Stripe)</li>
                    <li>Cloud hosting providers (Supabase, AWS)</li>
                    <li>Analytics services (Google Analytics)</li>
                    <li>Email service providers</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    We encourage you to review the privacy policies of these third-party services.
                  </p>
                </div>

                {/* Section 9 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">9. Data Retention</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">We retain your personal data only for as long as necessary:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Active accounts:</strong> Data retained while your account is active</li>
                    <li><strong>After account closure:</strong> Data retained for 7 years (as required by Indian law for financial records)</li>
                    <li><strong>Legal requirements:</strong> Some data may be retained longer if required by law</li>
                  </ul>
                </div>

                {/* Section 10 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Users className="h-6 w-6 text-gold" />
                    10. Children&apos;s Privacy
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately.
                  </p>
                </div>

                {/* Section 11 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-gold" />
                    11. Changes to This Privacy Policy
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">We may update our Privacy Policy from time to time. We will notify you of any changes by:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Posting the new Privacy Policy on this page</li>
                    <li>Updating the &quot;Last Updated&quot; date</li>
                    <li>Sending you an email notification (for material changes)</li>
                    <li>Displaying a notice on our Service</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </div>

                {/* Section 12 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-gold" />
                    12. Contact Us
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
                  <div className="bg-gold/5 rounded-xl p-6 space-y-3 border border-gold/20">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gold mt-1" />
                      <div>
                        <p className="font-semibold text-black mb-1">Privacy Inquiries:</p>
                        <a href="mailto:omkarkolhe912@gmail.com" className="text-gold hover:underline">omkarkolhe912@gmail.com</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gold mt-1" />
                      <div>
                        <p className="font-semibold text-black mb-1">Phone:</p>
                        <a href="tel:+918180861415" className="text-gold hover:underline">+91 8180 861 415</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gold mt-1" />
                      <div>
                        <p className="font-semibold text-black mb-1">Data Protection Officer:</p>
                        <p className="text-gray-700">Email: <a href="mailto:omkarkolhe912@gmail.com" className="text-gold hover:underline">omkarkolhe912@gmail.com</a></p>
                        <p className="text-gray-700">Address: Kothrud, Pune, Maharashtra, Bharat</p>
                      </div>
                    </div>
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
