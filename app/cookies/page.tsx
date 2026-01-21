"use client";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, Shield, Info, BarChart3, Target, Mail, Phone, MapPin } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-gold/10">
      <LandingHeader />
      <main className="flex-1">
        <section className="pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-amber-100 mb-6">
                <Cookie className="h-8 w-8 text-gold" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-black mb-4">
                Cookie Policy
              </h1>
              <p className="text-lg text-gray-600">
                Last Updated: January 2026 | Version: 1.0
              </p>
            </div>

            <Card className="shadow-lg border-2 border-gold/20 mb-6">
              <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
                <CardTitle className="text-2xl font-heading font-bold text-black">
                  Our Cookie Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This Cookie Policy explains what cookies are, how we use them on PowerNetPro, and how you can manage your cookie preferences.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our Service, you consent to the use of cookies in accordance with this policy.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-gold/20">
              <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
                <CardTitle className="text-2xl font-heading font-bold text-black">
                  Cookie Policy Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {/* Section 1 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Info className="h-6 w-6 text-gold" />
                    1. Introduction
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    PowerNetPro uses cookies and similar tracking technologies to enhance your experience, analyze usage, and assist in our marketing efforts. This policy explains what these technologies are and why we use them.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Legal Compliance:</strong> This Cookie Policy is compliant with applicable data protection laws, including the Digital Personal Data Protection Act, 2023 (DPDPA).
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Cookie className="h-6 w-6 text-gold" />
                    2. What Are Cookies?
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3"><strong>How Cookies Work:</strong></p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Cookies are stored on your device by your web browser</li>
                    <li>They contain information about your browsing activity</li>
                    <li>They help websites remember your preferences and settings</li>
                    <li>They can be &quot;session cookies&quot; (deleted when you close the browser) or &quot;persistent cookies&quot; (remain until expiration)</li>
                  </ul>
                </div>

                {/* Section 3 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Settings className="h-6 w-6 text-gold" />
                    3. Types of Cookies We Use
                  </h2>
                  
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gold" />
                    3.1 Essential Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2"><strong>Required for Service Functionality</strong></p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    These cookies are necessary for the Service to function and cannot be disabled:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Authentication cookies (keep you logged in)</li>
                    <li>Security cookies (prevent fraud and protect your account)</li>
                    <li>Session cookies (maintain your session state)</li>
                    <li>Load balancing cookies (distribute traffic efficiently)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-gold" />
                    3.2 Analytics Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2"><strong>Help Us Improve Our Service</strong></p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    These cookies help us understand how visitors interact with our Service:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Track page views and user navigation</li>
                    <li>Identify popular features and areas for improvement</li>
                    <li>Measure Service performance</li>
                    <li>Analyze user behavior patterns</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    We use Google Analytics for this purpose. You can opt-out of Google Analytics cookies.
                  </p>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-gold" />
                    3.3 Preference Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2"><strong>Remember Your Settings</strong></p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    These cookies remember your preferences and settings:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Language preferences</li>
                    <li>Display preferences (theme, layout)</li>
                    <li>Dashboard customization</li>
                    <li>Notification preferences</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6 flex items-center gap-2">
                    <Target className="h-5 w-5 text-gold" />
                    3.4 Marketing Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2"><strong>Used for Marketing (Optional)</strong></p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    These cookies are used to deliver relevant advertisements and track campaign effectiveness:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Track which ads you&apos;ve seen</li>
                    <li>Measure ad campaign performance</li>
                    <li>Personalize advertising content</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed mt-3">
                    These cookies are optional and require your consent.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">4. How We Use Cookies</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">We use cookies for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>To enable core functionality (login, authentication)</li>
                    <li>To remember your preferences and settings</li>
                    <li>To analyze Service usage and improve performance</li>
                    <li>To provide personalized content and features</li>
                    <li>To detect and prevent fraud and security threats</li>
                    <li>To measure the effectiveness of our marketing campaigns</li>
                  </ul>
                </div>

                {/* Section 5 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4">5. Third-Party Cookies</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We may use third-party services that set their own cookies:
                  </p>
                  <div className="bg-gold/5 rounded-xl p-4 border border-gold/20 space-y-3">
                    <div>
                      <p className="font-semibold text-black mb-1"><strong>Google Analytics:</strong></p>
                      <p className="text-gray-700">Used for website analytics. <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Opt-out here</a>.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1"><strong>Payment Processors:</strong></p>
                      <p className="text-gray-700">May set cookies for secure payment processing.</p>
                    </div>
                    <div>
                      <p className="font-semibold text-black mb-1"><strong>Social Media:</strong></p>
                      <p className="text-gray-700">If you interact with social media features, those platforms may set cookies.</p>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    We do not control these third-party cookies. Please review their privacy policies.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Settings className="h-6 w-6 text-gold" />
                    6. Managing Your Cookie Preferences
                  </h2>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-4">6.1 Browser Settings</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">You can control cookies through your browser settings:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gold/30 mt-4">
                      <thead>
                        <tr className="bg-gold/10">
                          <th className="border border-gold/30 p-3 text-left font-semibold text-black">Browser</th>
                          <th className="border border-gold/30 p-3 text-left font-semibold text-black">Settings Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Chrome</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">Settings → Privacy and Security → Cookies and other site data</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Firefox</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">Options → Privacy & Security → Cookies and Site Data</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Safari</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">Preferences → Privacy → Cookies and website data</td>
                        </tr>
                        <tr className="bg-gold/5">
                          <td className="border border-gold/30 p-3 text-gray-700"><strong>Edge</strong></td>
                          <td className="border border-gold/30 p-3 text-gray-700">Settings → Cookies and site permissions → Cookies and site data</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">6.2 Cookie Consent Banner</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    When you first visit our Service, you&apos;ll see a cookie consent banner where you can:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Accept all cookies</li>
                    <li>Reject non-essential cookies</li>
                    <li>Customize your cookie preferences</li>
                  </ul>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                    <p className="font-semibold text-black mb-2"><strong>Important Note:</strong></p>
                    <p className="text-gray-700">
                      Disabling essential cookies may prevent certain features of our Service from working properly. You may not be able to log in, make payments, or access certain parts of the Service.
                    </p>
                  </div>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-gold" />
                    7. Contact Us
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">If you have any questions about our use of cookies, please contact us:</p>
                  <div className="bg-gold/5 rounded-xl p-6 space-y-3 border border-gold/20">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gold mt-1" />
                      <div>
                        <p className="font-semibold text-black mb-1">Email:</p>
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
                        <p className="font-semibold text-black mb-1">Address:</p>
                        <p className="text-gray-700">Kothrud, Pune, Maharashtra, Bharat</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="bg-gold/5 rounded-xl p-4 border border-gold/20 mt-8">
                  <p className="text-sm text-gray-600 italic text-center">
                    This document combines the Privacy Policy, Terms of Service, and Cookie Policy for PowerNetPro Private Limited.
                  </p>
                  <p className="text-sm text-gray-700 text-center mt-2">
                    <strong>PowerNetPro Private Limited</strong><br />
                    Kothrud, Pune, Maharashtra, Bharat<br />
                    www.powernetpro.com
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
