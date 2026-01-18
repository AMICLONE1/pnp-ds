"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { 
  Cookie, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Eye,
  Shield
} from "lucide-react";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "what-are-cookies", title: "What Are Cookies?" },
  { id: "types-of-cookies", title: "Types of Cookies We Use" },
  { id: "how-we-use", title: "How We Use Cookies" },
  { id: "third-party", title: "Third-Party Cookies" },
  { id: "managing-cookies", title: "Managing Your Cookie Preferences" },
  { id: "contact", title: "Contact Us" },
];

export default function CookiesPage() {
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
                <Cookie className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                Cookie Policy
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Learn about how we use cookies and similar technologies on PowerNetPro.
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
                  <Cookie className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-heading font-bold text-charcoal mb-3">
                    Our Cookie Policy
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    This Cookie Policy explains what cookies are, how we use them on PowerNetPro, and how you can manage your cookie preferences.
                  </p>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    By using our Service, you consent to the use of cookies in accordance with this policy.
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
                    PowerNetPro uses cookies and similar tracking technologies to enhance your experience, analyze usage, and assist in our marketing efforts. This policy explains what these technologies are and why we use them.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-4">
                    <p className="font-semibold text-charcoal mb-2">Legal Compliance:</p>
                    <p className="text-sm">
                      This Cookie Policy is compliant with applicable data protection laws, including the Digital Personal Data Protection Act, 2023 (DPDPA).
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 2: What Are Cookies */}
            <section id="what-are-cookies" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">2</span>
                  What Are Cookies?
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p>
                    Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-charcoal mb-3">How Cookies Work:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Cookies are stored on your device by your web browser</li>
                      <li>• They contain information about your browsing activity</li>
                      <li>• They help websites remember your preferences and settings</li>
                      <li>• They can be "session cookies" (deleted when you close the browser) or "persistent cookies" (remain until expiration)</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 3: Types of Cookies We Use */}
            <section id="types-of-cookies" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">3</span>
                  Types of Cookies We Use
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-3">3.1 Essential Cookies</h3>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <p className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        Required for Service Functionality
                      </p>
                      <p className="text-sm mb-3">These cookies are necessary for the Service to function and cannot be disabled:</p>
                      <ul className="space-y-2 text-sm ml-7">
                        <li>• Authentication cookies (keep you logged in)</li>
                        <li>• Security cookies (prevent fraud and protect your account)</li>
                        <li>• Session cookies (maintain your session state)</li>
                        <li>• Load balancing cookies (distribute traffic efficiently)</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-3">3.2 Analytics Cookies</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <p className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        Help Us Improve Our Service
                      </p>
                      <p className="text-sm mb-3">These cookies help us understand how visitors interact with our Service:</p>
                      <ul className="space-y-2 text-sm ml-7">
                        <li>• Track page views and user navigation</li>
                        <li>• Identify popular features and areas for improvement</li>
                        <li>• Measure Service performance</li>
                        <li>• Analyze user behavior patterns</li>
                      </ul>
                      <p className="text-sm mt-3 text-gray-600">
                        We use Google Analytics for this purpose. You can opt-out of Google Analytics cookies.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-3">3.3 Preference Cookies</h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                      <p className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                        <Settings className="h-5 w-5 text-purple-600" />
                        Remember Your Settings
                      </p>
                      <p className="text-sm mb-3">These cookies remember your preferences and settings:</p>
                      <ul className="space-y-2 text-sm ml-7">
                        <li>• Language preferences</li>
                        <li>• Display preferences (theme, layout)</li>
                        <li>• Dashboard customization</li>
                        <li>• Notification preferences</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-3">3.4 Marketing Cookies</h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                      <p className="font-semibold text-charcoal mb-2">Used for Marketing (Optional)</p>
                      <p className="text-sm mb-3">These cookies are used to deliver relevant advertisements and track campaign effectiveness:</p>
                      <ul className="space-y-2 text-sm ml-7">
                        <li>• Track which ads you've seen</li>
                        <li>• Measure ad campaign performance</li>
                        <li>• Personalize advertising content</li>
                      </ul>
                      <p className="text-sm mt-3 font-medium">
                        These cookies are optional and require your consent.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 4: How We Use Cookies */}
            <section id="how-we-use" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">4</span>
                  How We Use Cookies
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="mb-4">We use cookies for the following purposes:</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      "To enable core functionality (login, authentication)",
                      "To remember your preferences and settings",
                      "To analyze Service usage and improve performance",
                      "To provide personalized content and features",
                      "To detect and prevent fraud and security threats",
                      "To measure the effectiveness of our marketing campaigns"
                    ].map((purpose, index) => (
                      <div key={index} className="flex items-start gap-2 p-4 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm">{purpose}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 5: Third-Party Cookies */}
            <section id="third-party" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">5</span>
                  Third-Party Cookies
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="mb-4">We may use third-party services that set their own cookies:</p>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-charcoal mb-2">Google Analytics:</p>
                      <p className="text-sm">Used for website analytics. <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-forest hover:underline">Opt-out here</a>.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-charcoal mb-2">Payment Processors:</p>
                      <p className="text-sm">May set cookies for secure payment processing.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-semibold text-charcoal mb-2">Social Media:</p>
                      <p className="text-sm">If you interact with social media features, those platforms may set cookies.</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    We do not control these third-party cookies. Please review their privacy policies.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Section 6: Managing Your Cookie Preferences */}
            <section id="managing-cookies" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">6</span>
                  Managing Your Cookie Preferences
                </h2>
                
                <div className="space-y-6 text-gray-700">
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-3">6.1 Browser Settings</h3>
                    <p className="mb-4">You can control cookies through your browser settings:</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-2">Chrome:</p>
                        <p className="text-sm">Settings → Privacy and Security → Cookies and other site data</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-2">Firefox:</p>
                        <p className="text-sm">Options → Privacy & Security → Cookies and Site Data</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-2">Safari:</p>
                        <p className="text-sm">Preferences → Privacy → Cookies and website data</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="font-semibold text-charcoal mb-2">Edge:</p>
                        <p className="text-sm">Settings → Cookies and site permissions → Cookies and site data</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-3">6.2 Cookie Consent Banner</h3>
                    <p className="mb-4">When you first visit our Service, you'll see a cookie consent banner where you can:</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Accept all cookies</li>
                      <li>Reject non-essential cookies</li>
                      <li>Customize your cookie preferences</li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-charcoal mb-2">Important Note:</p>
                        <p className="text-sm">
                          Disabling essential cookies may prevent certain features of our Service from working properly. You may not be able to log in, make payments, or access certain parts of the Service.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Section 7: Contact Us */}
            <section id="contact" className="scroll-mt-28 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              >
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-forest/10 flex items-center justify-center text-forest font-bold">7</span>
                  Contact Us
                </h2>
                
                <div className="space-y-4 text-gray-700">
                  <p className="mb-4">If you have any questions about our use of cookies, please contact us:</p>
                  <div className="p-6 bg-gray-50 rounded-xl">
                    <ul className="space-y-2 text-sm">
                      <li>• Email: omkarkolhe912@gmail.com</li>
                      <li>• Phone: +91 8180861415</li>
                      <li>• Address: Kothrud, Pune, Maharashtra, Bharat</li>
                    </ul>
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
