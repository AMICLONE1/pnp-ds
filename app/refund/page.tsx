import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  RefreshCw,
  FileText,
  Clock,
  IndianRupee,
  ListOrdered,
  AlertCircle,
  Wallet,
  Mail,
  Scale,
  XCircle,
} from "lucide-react";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL,
  COMPANY_LEGAL_NAME,
  GRIEVANCE_OFFICER_NAME,
  RESERVATION_RATE_PER_KW,
  SETUP_FEE,
} from "@/lib/contact";

const RATE = RESERVATION_RATE_PER_KW;
const TWO_KW = 2 * RATE;

const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;

export default function RefundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-gold/10">
      <LandingHeader />

      <main className="flex-1">
        <section className="pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-amber-100 mb-6">
                <RefreshCw className="h-8 w-8 text-gold" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-black mb-4">
                Refund &amp; Cancellation Policy
              </h1>
              <p className="text-lg text-gray-600">
                Last Updated: April 2026
              </p>
            </div>

            <Card className="shadow-lg border-2 border-gold/20 mb-6">
              <CardContent className="p-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <p className="text-gray-700 leading-relaxed">
                  {COMPANY_LEGAL_NAME} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to transparency in all financial matters. This policy explains how cancellations and refunds are handled for our Digital Solar reservation service.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-gold/20">
              <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
                <CardTitle className="text-2xl font-heading font-bold text-black">
                  Refund &amp; Cancellation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {/* Section 1 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-gold" />
                    1. Your Right to Cancel
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    You may cancel your Digital Solar reservation at any time. There are no lock-in penalties. Cancellation can be initiated by logging into your dashboard and clicking &lsquo;Cancel Reservation&rsquo;, emailing us at{" "}
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline font-semibold">{SUPPORT_EMAIL}</a>, or calling{" "}
                    <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-gold hover:underline font-semibold">{SUPPORT_PHONE}</a>.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-gold" />
                    2. 30-Day Full Refund Guarantee
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you cancel within 30 days of your reservation activation, you will receive a 100% refund of your reservation amount, including the setup fee of {formatINR(SETUP_FEE)}. No questions asked. Refund will be processed within 5&ndash;7 business days to your original payment method.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <IndianRupee className="h-6 w-6 text-gold" />
                    3. Refund After 30 Days
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    If you cancel after 30 days, your refund is calculated as follows:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gold/20 text-sm">
                      <thead className="bg-gold/10">
                        <tr>
                          <th className="border border-gold/20 px-4 py-2 text-left font-semibold text-black">Time Since Activation</th>
                          <th className="border border-gold/20 px-4 py-2 text-left font-semibold text-black">Refund Percentage</th>
                          <th className="border border-gold/20 px-4 py-2 text-left font-semibold text-black">Deductions</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700">
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">31&ndash;90 days (1&ndash;3 months)</td>
                          <td className="border border-gold/20 px-4 py-2">90% refund</td>
                          <td className="border border-gold/20 px-4 py-2">Only setup fee ({formatINR(SETUP_FEE)}) deducted</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">91&ndash;180 days (3&ndash;6 months)</td>
                          <td className="border border-gold/20 px-4 py-2">85% refund</td>
                          <td className="border border-gold/20 px-4 py-2">Setup fee + 15% admin fee deducted</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">181&ndash;365 days (6&ndash;12 months)</td>
                          <td className="border border-gold/20 px-4 py-2">80% refund</td>
                          <td className="border border-gold/20 px-4 py-2">Setup fee + 20% admin fee deducted</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">1&ndash;2 years</td>
                          <td className="border border-gold/20 px-4 py-2">75% refund</td>
                          <td className="border border-gold/20 px-4 py-2">Setup fee + 25% admin fee deducted</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">2&ndash;3 years</td>
                          <td className="border border-gold/20 px-4 py-2">70% refund</td>
                          <td className="border border-gold/20 px-4 py-2">Setup fee + 30% admin fee deducted</td>
                        </tr>
                        <tr>
                          <td className="border border-gold/20 px-4 py-2">3+ years</td>
                          <td className="border border-gold/20 px-4 py-2">65% refund</td>
                          <td className="border border-gold/20 px-4 py-2">Setup fee + 35% admin fee deducted</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gold/5 rounded-xl p-4 border border-gold/20 mt-4">
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Example:</strong> If you reserved 2 kW at {formatINR(RATE)}/kW (total {formatINR(TWO_KW)}) and cancel after 4 months, your refund would be 85% of the reservation amount minus the {formatINR(SETUP_FEE)} setup fee.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <ListOrdered className="h-6 w-6 text-gold" />
                    4. Refund Process
                  </h2>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Step 1:</strong> Submit your cancellation request via dashboard, email, or phone.</li>
                    <li><strong>Step 2:</strong> We will acknowledge your request within 48 hours.</li>
                    <li><strong>Step 3:</strong> Your refund amount is calculated based on the table above.</li>
                    <li><strong>Step 4:</strong> Refund is processed within 5&ndash;7 business days.</li>
                    <li><strong>Step 5:</strong> Amount is credited to your original payment method (UPI, bank account, or card).</li>
                  </ol>
                </div>

                {/* Section 5 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-gold" />
                    5. Non-Refundable Scenarios
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Refunds will NOT be issued in the following cases:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Account terminated by PowerNetPro due to fraud, misrepresentation, or violation of Terms of Service.</li>
                    <li>Credits already used for bill payment or cash conversion cannot be refunded (they have already been consumed).</li>
                  </ul>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-gold" />
                    6. Credits Earned Before Cancellation
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Any credits earned and used before your cancellation date are yours to keep. The refund calculation only applies to the unused portion of your reservation fee.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Mail className="h-6 w-6 text-gold" />
                    7. Contact for Refund Queries
                  </h2>
                  <div className="bg-gold/5 rounded-xl p-6 space-y-2 border border-gold/20">
                    <p className="text-gray-700">
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline">{SUPPORT_EMAIL}</a>
                    </p>
                    <p className="text-gray-700">
                      <strong>Phone:</strong>{" "}
                      <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-gold hover:underline">{SUPPORT_PHONE}</a>
                    </p>
                    <p className="text-gray-700">
                      <strong>Grievance Officer:</strong> {GRIEVANCE_OFFICER_NAME} (see{" "}
                      <a href="/grievance" className="text-gold hover:underline">Grievance Redressal</a>{" "}
                      page)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-4 border-t border-gold/20">
                  <Scale className="h-5 w-5 text-gold mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600 leading-relaxed">
                    This policy is governed by the laws of India and is compliant with the Consumer Protection (E-Commerce) Rules, 2020.
                  </p>
                </div>

                <div className="pt-4 border-t border-gold/20 text-center">
                  <p className="text-sm text-gray-600">
                    &copy; 2026 {COMPANY_LEGAL_NAME}. All rights reserved.
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
