"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Lock,
  Eye,
  Database,
  UserCheck
} from "lucide-react";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "data-collection", title: "What Data We Collect" },
  { id: "how-we-use", title: "How We Use Your Data" },
  { id: "data-sharing", title: "Data Sharing & Disclosure" },
  { id: "data-security", title: "Data Security" },
  { id: "your-rights", title: "Your Data Rights" },
  { id: "cookies", title: "Cookies & Tracking" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "data-retention", title: "Data Retention" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Changes to Privacy Policy" },
  { id: "contact", title: "Contact Us" },
];

export default function PrivacyPage() {
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
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
                    Our Commitment to Your Privacy
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    At PowerNetPro, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    By using PowerNetPro, you agree to the collection and use of information in accordance with this policy.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Section 1: Introduction */}
            <section id="introduction" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">1</span>
                  Introduction
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    <strong>PowerNetPro Private Limited</strong> ("we", "us", or "our") operates the website www.powernetpro.com (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.
                  </p>
                  <p>
                    We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-4">
                    <p className="font-semibold text-charcoal mb-2">Legal Compliance:</p>
                    <p className="text-sm">
                      This Privacy Policy is compliant with the Information Technology Act, 2000 (India) and the Digital Personal Data Protection Act, 2023 (DPDPA).
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 2: What Data We Collect */}
            <section id="data-collection" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">2</span>
                  What Data We Collect
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-3">2.1 Personal Information</h3>
                    <p className="mb-4">We collect information that you provide directly to us:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                          <UserCheck className="h-5 w-5 text-forest" />
                          Account Information
                        </p>
                        <ul className="text-sm space-y-1 ml-7">
                          <li>• Name</li>
                          <li>• Email address</li>
                          <li>• Phone number</li>
                          <li>• Address</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                          <Database className="h-5 w-5 text-forest" />
                          Utility Information
                        </p>
                        <ul className="text-sm space-y-1 ml-7">
                          <li>• DISCOM account number</li>
                          <li>• Electricity bill details</li>
                          <li>• Consumption data</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-3">2.2 Payment Information</h3>
                    <p className="mb-4">Payment processing is handled by secure third-party payment gateways. We do not store your complete card details. We only receive:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Payment transaction IDs</li>
                      <li>Payment status and confirmation</li>
                      <li>Billing address (for verification)</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-3">2.3 Usage Data</h3>
                    <p className="mb-4">We automatically collect certain information when you use our Service:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Pages visited and time spent</li>
                      <li>Date and time of access</li>
                      <li>Solar generation and credit data</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 3: How We Use Your Data */}
            <section id="how-we-use" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">3</span>
                  How We Use Your Data
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="mb-4">We use the collected data for various purposes:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: CheckCircle, text: "To provide and maintain our Service" },
                      { icon: CheckCircle, text: "To process your reservations and payments" },
                      { icon: CheckCircle, text: "To calculate and manage your credits" },
                      { icon: CheckCircle, text: "To send you service updates and notifications" },
                      { icon: CheckCircle, text: "To provide customer support" },
                      { icon: CheckCircle, text: "To detect and prevent fraud" },
                      { icon: CheckCircle, text: "To comply with legal obligations" },
                      { icon: CheckCircle, text: "To improve our Service and user experience" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <item.icon className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 4: Data Sharing & Disclosure */}
            <section id="data-sharing" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">4</span>
                  Data Sharing & Disclosure
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="mb-4">We do not sell your personal information. We may share your data only in the following circumstances:</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="font-semibold text-charcoal mb-2">With Your Consent:</p>
                      <p className="text-sm">We share data when you explicitly consent to such sharing.</p>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="font-semibold text-charcoal mb-2">Service Providers:</p>
                      <p className="text-sm">We share data with trusted third-party service providers who assist us in operating our platform (payment processors, cloud hosting, analytics).</p>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="font-semibold text-charcoal mb-2">Legal Requirements:</p>
                      <p className="text-sm">We may disclose data if required by law or in response to valid requests by public authorities.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 5: Data Security */}
            <section id="data-security" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">5</span>
                  Data Security
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                      <Lock className="h-5 w-5 text-green-600" />
                      Security Measures
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li>• SSL/TLS encryption for data transmission</li>
                      <li>• Encrypted storage of sensitive data</li>
                      <li>• Regular security audits and updates</li>
                      <li>• Access controls and authentication</li>
                      <li>• Secure payment processing (PCI-DSS compliant)</li>
                    </ul>
                  </div>
                  <p className="text-sm text-gray-600">
                    While we strive to use commercially acceptable means to protect your data, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Section 6: Your Data Rights */}
            <section id="your-rights" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">6</span>
                  Your Data Rights (Under DPDPA)
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="mb-4">You have the following rights regarding your personal data:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "Right to Access: Request a copy of your personal data",
                      "Right to Correction: Update or correct inaccurate data",
                      "Right to Deletion: Request deletion of your data (subject to legal requirements)",
                      "Right to Data Portability: Export your data in a machine-readable format",
                      "Right to Withdraw Consent: Withdraw consent for data processing",
                      "Right to Grievance: File complaints with the Data Protection Board"
                    ].map((right, index) => (
                      <div key={index} className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-sm">{right}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    To exercise these rights, contact us at omkarkolhe912@gmail.com. We will respond within 30 days.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Section 7: Cookies & Tracking */}
            <section id="cookies" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">7</span>
                  Cookies & Tracking Technologies
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="mb-4">We use cookies and similar tracking technologies to track activity on our Service:</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-charcoal mb-2">Essential Cookies:</p>
                      <p className="text-sm">Required for the Service to function (authentication, security).</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-charcoal mb-2">Analytics Cookies:</p>
                      <p className="text-sm">Help us understand how users interact with our Service.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-charcoal mb-2">Preference Cookies:</p>
                      <p className="text-sm">Remember your settings and preferences.</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    You can control cookies through your browser settings. However, disabling cookies may affect Service functionality.
                  </p>
                  <p className="text-sm">
                    For more details, see our <a href="/cookies" className="text-forest hover:underline font-medium">Cookie Policy</a>.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Section 8: Third-Party Services */}
            <section id="third-party" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">8</span>
                  Third-Party Services
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="mb-4">Our Service may contain links to third-party websites or services. We are not responsible for their privacy practices:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Payment processors (Razorpay, Stripe)</li>
                    <li>Cloud hosting providers (Supabase, AWS)</li>
                    <li>Analytics services (Google Analytics)</li>
                    <li>Email service providers</li>
                  </ul>
                  <p className="text-sm text-gray-600">
                    We encourage you to review the privacy policies of these third-party services.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Section 9: Data Retention */}
            <section id="data-retention" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">9</span>
                  Data Retention
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="mb-4">We retain your personal data only for as long as necessary:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Active accounts: Data retained while your account is active</li>
                    <li>After account closure: Data retained for 7 years (as required by Indian law for financial records)</li>
                    <li>Legal requirements: Some data may be retained longer if required by law</li>
                  </ul>
                </div>
              </motion.div>
            </section>

            {/* Section 10: Children's Privacy */}
            <section id="children" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">10</span>
                  Children's Privacy
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Section 11: Changes to Privacy Policy */}
            <section id="changes" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">11</span>
                  Changes to This Privacy Policy
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Posting the new Privacy Policy on this page</li>
                    <li>Updating the "Last Updated" date</li>
                    <li>Sending you an email notification (for material changes)</li>
                    <li>Displaying a notice on our Service</li>
                  </ul>
                  <p className="text-sm text-gray-600">
                    You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Section 12: Contact Us */}
            <section id="contact" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">12</span>
                  Contact Us
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-charcoal mb-3">Privacy Inquiries</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Email: omkarkolhe912@gmail.com</li>
                        <li>• Phone: +91 8180861415</li>
                      </ul>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-charcoal mb-3">Data Protection Officer</h3>
                      <ul className="space-y-2 text-sm">
                        <li>• Email: omkarkolhe912@gmail.com</li>
                        <li>• Address: Kothrud, Pune, Maharashtra, Bharat</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
