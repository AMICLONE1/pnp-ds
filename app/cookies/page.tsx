"use client";

import type { ComponentType, ReactNode } from "react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  BarChart3,
  Clock,
  Cookie,
  CreditCard,
  FileText,
  Info,
  Mail,
  RefreshCw,
  Settings,
  Shield,
  Target,
} from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/contact";

type SectionCardProps = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
};

type BulletListProps = {
  items: string[];
};

type CookieRow = {
  name: string;
  purpose: string;
  provider: string;
  duration: string;
  type: string;
};

type BrowserSettingRow = {
  browser: string;
  location: string;
};

const similarTrackingTechnologies = [
  "Web Beacons (Pixel Tags): Small transparent image files embedded in web pages or emails that allow us to track whether a page or email has been viewed.",
  "Local Storage: Browser-based storage mechanisms (such as HTML5 localStorage) used to store small amounts of data locally on your device for Platform functionality.",
  "Session Storage: Similar to local storage but limited to the duration of the browser session, used for temporary data required during your active browsing session.",
  "Device Fingerprinting: Collection of information about your device configuration (browser type, screen resolution, installed plugins) to identify your device across sessions for security and fraud prevention purposes.",
];

const strictlyNecessaryCookies: CookieRow[] = [
  {
    name: "session_id",
    purpose: "Maintains user login session",
    provider: "PowerNetPro",
    duration: "Session",
    type: "First-party",
  },
  {
    name: "csrf_token",
    purpose: "Prevents cross-site request forgery attacks",
    provider: "PowerNetPro",
    duration: "Session",
    type: "First-party",
  },
  {
    name: "auth_token",
    purpose: "Authenticates user identity",
    provider: "PowerNetPro",
    duration: "24 hours",
    type: "First-party",
  },
  {
    name: "cookie_consent",
    purpose: "Stores your cookie preference choices",
    provider: "PowerNetPro",
    duration: "12 months",
    type: "First-party",
  },
];

const functionalCookies: CookieRow[] = [
  {
    name: "lang_pref",
    purpose: "Stores language preference",
    provider: "PowerNetPro",
    duration: "12 months",
    type: "First-party",
  },
  {
    name: "ui_settings",
    purpose: "Remembers dashboard display preferences",
    provider: "PowerNetPro",
    duration: "12 months",
    type: "First-party",
  },
  {
    name: "discom_region",
    purpose: "Stores your DISCOM/region selection",
    provider: "PowerNetPro",
    duration: "6 months",
    type: "First-party",
  },
];

const analyticsCookies: CookieRow[] = [
  {
    name: "pnp_analytics",
    purpose: "Internal usage analytics and page views",
    provider: "PowerNetPro",
    duration: "24 months",
    type: "First-party",
  },
];

const browserSettingsRows: BrowserSettingRow[] = [
  {
    browser: "Google Chrome",
    location: "Settings > Privacy and Security > Cookies and other site data",
  },
  {
    browser: "Mozilla Firefox",
    location: "Settings > Privacy & Security > Cookies and Site Data",
  },
  {
    browser: "Microsoft Edge",
    location: "Settings > Cookies and site permissions > Manage and delete cookies",
  },
  {
    browser: "Apple Safari",
    location: "Preferences > Privacy > Cookies and website data",
  },
];

const legalBasisItems = [
  "Strictly Necessary Cookies: These are used without requiring your consent, as they are essential for the provision of the Platform’s core services (legitimate interest and contractual necessity).",
  "Functional Cookies: Used based on your implicit consent through continued use of the Platform. You may disable these through your browser settings.",
  "Analytics Cookies: Used based on your consent, obtained through our cookie consent banner when analytics tools are deployed.",
  "Marketing Cookies: Will only be used with your explicit opt-in consent, obtained through a cookie consent mechanism.",
];

const dataCollectedItems = [
  "IP address and approximate geographic location",
  "Browser type, version, and language",
  "Operating system and device type",
  "Pages visited, time spent, and navigation paths",
  "Referral source and exit pages",
  "Session identifiers and authentication tokens",
  "Cookie consent preferences",
];

function SectionCard({ icon: Icon, title, children }: SectionCardProps) {
  return (
    <Card className="shadow-lg border-2 border-gold/20">
      <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
        <CardTitle className="text-2xl font-heading font-bold text-black flex items-center gap-2">
          <Icon className="h-6 w-6 text-gold" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        {children}
      </CardContent>
    </Card>
  );
}

function BulletList({ items }: BulletListProps) {
  return (
    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gold/30 mt-4">
        <thead>
          <tr className="bg-gold/10">
            <th className="border border-gold/30 p-3 text-left font-semibold text-black">Cookie Name</th>
            <th className="border border-gold/30 p-3 text-left font-semibold text-black">Purpose</th>
            <th className="border border-gold/30 p-3 text-left font-semibold text-black">Provider</th>
            <th className="border border-gold/30 p-3 text-left font-semibold text-black">Duration</th>
            <th className="border border-gold/30 p-3 text-left font-semibold text-black">Type</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.name} className={index % 2 === 1 ? "bg-gold/5" : "bg-white"}>
              <td className="border border-gold/30 p-3 text-gray-700 align-top font-semibold">{row.name}</td>
              <td className="border border-gold/30 p-3 text-gray-700 align-top">{row.purpose}</td>
              <td className="border border-gold/30 p-3 text-gray-700 align-top">{row.provider}</td>
              <td className="border border-gold/30 p-3 text-gray-700 align-top">{row.duration}</td>
              <td className="border border-gold/30 p-3 text-gray-700 align-top">{row.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BrowserTable({ rows }: { rows: BrowserSettingRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gold/30 mt-4">
        <thead>
          <tr className="bg-gold/10">
            <th className="border border-gold/30 p-3 text-left font-semibold text-black">Browser</th>
            <th className="border border-gold/30 p-3 text-left font-semibold text-black">Settings Location</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.browser} className={index % 2 === 1 ? "bg-gold/5" : "bg-white"}>
              <td className="border border-gold/30 p-3 text-gray-700 align-top font-semibold">{row.browser}</td>
              <td className="border border-gold/30 p-3 text-gray-700 align-top">{row.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-black mb-4">Cookie Policy</h1>
              <p className="text-lg text-gray-600">PowerNetPro Pvt. Ltd. | www.powernetpro.com | Effective Date: April 18, 2026</p>
            </div>

            <div className="space-y-6">
              <SectionCard icon={Info} title="1. Introduction">
                <p className="text-gray-700 leading-relaxed">
                  This Cookie Policy explains how PowerNetPro Pvt. Ltd. (“PowerNetPro,” “we,” “our,” or “us”) uses cookies and similar tracking technologies on our website www.powernetpro.com and associated digital platforms (the “Platform”).
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This Cookie Policy should be read in conjunction with our Privacy Policy, which provides comprehensive information about how we collect, use, and protect your personal data. By continuing to use our Platform, you consent to the use of cookies as described in this Policy. You may manage your cookie preferences at any time through the mechanisms described in Section 7 below.
                </p>
              </SectionCard>

              <SectionCard icon={Cookie} title="2. What Are Cookies?">
                <p className="text-gray-700 leading-relaxed">
                  Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. Cookies serve various purposes, including remembering your preferences, enabling core functionality, analysing website usage, and improving your overall browsing experience.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Cookies may be set by the website you are visiting (“first-party cookies”) or by third-party services integrated into the website (“third-party cookies”). Cookies may persist for varying durations: “session cookies” are temporary and are deleted when you close your browser, while “persistent cookies” remain on your device until they expire or you delete them manually.
                </p>
              </SectionCard>

              <SectionCard icon={Shield} title="3. Similar Tracking Technologies">
                <p className="text-gray-700 leading-relaxed">In addition to cookies, we may use the following similar technologies:</p>
                <BulletList items={similarTrackingTechnologies} />
              </SectionCard>

              <SectionCard icon={Settings} title="4. Categories of Cookies We Use">
                <p className="text-gray-700 leading-relaxed">
                  We categorise the cookies used on our Platform into the following four categories:
                </p>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-2">4.1 Strictly Necessary Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    These cookies are essential for the basic functioning of the Platform and cannot be disabled. Without these cookies, core services such as user authentication, secure login, session management, and payment processing cannot be provided.
                  </p>
                  <CookieTable rows={strictlyNecessaryCookies} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">4.2 Functional Cookies</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    These cookies enable enhanced functionality and personalisation of the Platform. They may be set by us or by third-party providers whose services we have integrated. If you disable these cookies, some features of the Platform may not function optimally.
                  </p>
                  <CookieTable rows={functionalCookies} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-6 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-gold" />
                    4.3 Analytics and Performance Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    These cookies help us understand how visitors interact with the Platform by collecting and reporting information on usage patterns. This data is aggregated and anonymised wherever possible. As of the effective date of this Policy, PowerNetPro has not yet deployed third-party analytics tools. When analytics tools are implemented in the future (such as Google Analytics), this section and the cookie table below will be updated, and you will be notified of the changes in accordance with our update notification procedures.
                  </p>
                  <CookieTable rows={analyticsCookies} />
                  <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 mt-4">
                    <p className="text-gray-700 leading-relaxed">
                      Note: When third-party analytics services are integrated, additional cookies (e.g., _ga, _gid, _gat from Google Analytics) will be documented in the table above, and this Policy will be updated accordingly.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-6 flex items-center gap-2">
                    <Target className="h-5 w-5 text-gold" />
                    4.4 Marketing and Advertising Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    These cookies are used to track visitors across websites to display relevant advertisements and measure the effectiveness of advertising campaigns. As of the effective date of this Policy, PowerNetPro does not deploy any marketing or advertising cookies. If marketing cookies are introduced in the future, they will be subject to your explicit opt-in consent, and this Policy will be updated to include full details of such cookies.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={CreditCard} title="5. Cookies Set by Third-Party Payment Processors">
                <p className="text-gray-700 leading-relaxed">
                  When you interact with the Cashfree payment checkout on our Platform, Cashfree may set its own cookies on your device to facilitate secure payment processing, fraud detection, and session management. These cookies are governed by Cashfree’s own privacy and cookie policies, and PowerNetPro does not control the cookies set by Cashfree. We encourage you to review Cashfree’s privacy policy at <a href="https://www.cashfree.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">https://www.cashfree.com/privacy-policy</a> for details on their cookie practices.
                </p>
              </SectionCard>

              <SectionCard icon={FileText} title="6. Legal Basis for Using Cookies">
                <BulletList items={legalBasisItems} />
              </SectionCard>

              <SectionCard icon={Settings} title="7. How to Manage Cookies">
                <p className="text-gray-700 leading-relaxed">You have several options for managing cookies on your device:</p>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-2">7.1 Cookie Consent Banner</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you first visit the Platform (and once analytics or marketing cookies are deployed), a cookie consent banner will be displayed, allowing you to accept or reject non-essential cookies. You may update your preferences at any time by clicking on the “Cookie Settings” link available in the footer of the Platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">7.2 Browser Settings</h3>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Most web browsers allow you to manage cookies through their settings. You can configure your browser to block all cookies, accept only first-party cookies, or be notified before a cookie is set. The following links provide guidance for managing cookies in popular browsers:
                  </p>
                  <BrowserTable rows={browserSettingsRows} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-6">7.3 Device-Level Settings</h3>
                  <p className="text-gray-700 leading-relaxed">
                    For mobile devices, you can manage cookie and tracking preferences through your device’s operating system settings (e.g., iOS Settings &gt; Safari &gt; Block All Cookies, or Android Chrome &gt; Settings &gt; Site Settings &gt; Cookies).
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-3 mt-6 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-gold" />
                    7.4 Impact of Disabling Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Please note that disabling or blocking certain cookies may affect the functionality of the Platform. In particular, blocking strictly necessary cookies will prevent you from logging in, making payments, and accessing your generation dashboard. Blocking functional cookies may result in a less personalised experience, and blocking analytics cookies will not affect your ability to use the Platform.
                  </p>
                </div>
              </SectionCard>

              <SectionCard icon={FileText} title="8. Data Collected Through Cookies">
                <p className="text-gray-700 leading-relaxed">
                  The data collected through cookies is processed in accordance with our Privacy Policy. Cookies may collect the following types of data:
                </p>
                <BulletList items={dataCollectedItems} />
                <p className="text-gray-700 leading-relaxed">
                  This data is used for the purposes described in Section 4 above and is not used to personally identify you unless combined with other personal data provided by you through the Platform.
                </p>
              </SectionCard>

              <SectionCard icon={Clock} title="9. Retention of Cookie Data">
                <p className="text-gray-700 leading-relaxed">
                  Cookie data is retained for the duration specified in the cookie tables above. Session cookies are automatically deleted when you close your browser. Persistent cookies are retained on your device until their expiry date or until you manually delete them. Server-side data associated with cookies (such as session logs and analytics data) is retained in accordance with the data retention periods specified in our Privacy Policy.
                </p>
              </SectionCard>

              <SectionCard icon={RefreshCw} title="10. Changes to This Cookie Policy">
                <p className="text-gray-700 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in the cookies we use, the addition of new analytics or marketing tools, changes in applicable law, or updates to our data processing practices. When material changes are made, we will notify you through a cookie consent re-prompt, a notice on the Platform, or email notification.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We encourage you to review this Cookie Policy periodically. The “Effective Date” at the top of this Policy indicates when it was last updated.
                </p>
              </SectionCard>

              <SectionCard icon={Mail} title="11. Contact Us">
                <p className="text-gray-700 leading-relaxed">If you have questions about this Cookie Policy or our use of cookies and tracking technologies, please contact us at:</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
                    <p className="font-semibold text-black mb-1">PowerNetPro Pvt. Ltd.</p>
                    <p className="text-gray-700">Registered Address: Pune, Maharashtra, India</p>
                  </div>
                  <div className="rounded-xl border border-gold/20 bg-gold/5 p-5">
                    <p className="font-semibold text-black mb-1">Email</p>
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline">
                      {SUPPORT_EMAIL}
                    </a>
                  </div>
                  <div className="rounded-xl border border-gold/20 bg-gold/5 p-5 md:col-span-2">
                    <p className="font-semibold text-black mb-1">Website</p>
                    <a href="https://www.powernetpro.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                      www.powernetpro.com
                    </a>
                  </div>
                </div>
              </SectionCard>

              <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-center">
                <p className="text-sm text-gray-700">© 2026 PowerNetPro Pvt. Ltd. All rights reserved.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
