"use client";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, UserCheck, MapPin, FileText, Clock, ListChecks, Shield, Mail, Phone } from "lucide-react";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_TEL,
  COMPANY_LEGAL_NAME,
  COMPANY_FULL_ADDRESS,
  GRIEVANCE_OFFICER_NAME,
  GRIEVANCE_OFFICER_DESIGNATION,
  GRIEVANCE_WORKING_HOURS,
} from "@/lib/contact";

export default function GrievancePage() {
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
                Grievance Redressal
              </h1>
              <p className="text-lg text-gray-600">
                {COMPANY_LEGAL_NAME}
              </p>
            </div>

            <Card className="shadow-lg border-2 border-gold/20 mb-6">
              <CardContent className="p-8" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <p className="text-gray-700 leading-relaxed">
                  {COMPANY_LEGAL_NAME} is committed to providing the highest quality service to all our customers. If you have any concerns, complaints, or grievances regarding our services, we encourage you to reach out to us.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-2 border-gold/20">
              <CardHeader className="bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 border-b border-gold/20">
                <CardTitle className="text-2xl font-heading font-bold text-black">
                  Grievance Mechanism
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-10" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <UserCheck className="h-6 w-6 text-gold" />
                    Grievance Officer Details
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and RBI guidelines, we have appointed the following Grievance Officer:
                  </p>
                  <div className="bg-gold/5 rounded-xl p-6 space-y-2 border border-gold/20">
                    <p className="text-gray-700"><strong>Name:</strong> {GRIEVANCE_OFFICER_NAME}</p>
                    <p className="text-gray-700"><strong>Designation:</strong> {GRIEVANCE_OFFICER_DESIGNATION}</p>
                    <p className="text-gray-700">
                      <strong>Email:</strong>{" "}
                      <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline">{SUPPORT_EMAIL}</a>
                    </p>
                    <p className="text-gray-700">
                      <strong>Phone:</strong>{" "}
                      <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-gold hover:underline">{SUPPORT_PHONE}</a>
                    </p>
                    <p className="text-gray-700"><strong>Working Hours:</strong> {GRIEVANCE_WORKING_HOURS}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-gold" />
                    Registered Office Address
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{COMPANY_FULL_ADDRESS}</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-gold" />
                    How to File a Complaint
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    You can raise a grievance through any of the following channels:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>
                      Email us at{" "}
                      <a href={`mailto:${SUPPORT_EMAIL}`} className="text-gold hover:underline font-semibold">{SUPPORT_EMAIL}</a>{" "}
                      with your registered email ID and a description of your concern.
                    </li>
                    <li>
                      Call us at{" "}
                      <a href={`tel:${SUPPORT_PHONE_TEL}`} className="text-gold hover:underline font-semibold">{SUPPORT_PHONE}</a>{" "}
                      during working hours.
                    </li>
                    <li>
                      Use the Contact Form on our{" "}
                      <a href="/contact" className="text-gold hover:underline font-semibold">Contact page</a>.
                    </li>
                    <li>Write to us at our registered office address.</li>
                  </ol>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Clock className="h-6 w-6 text-gold" />
                    Complaint Resolution Timeline
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">We follow a structured resolution process:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>Acknowledgement:</strong> Within 48 hours of receiving your complaint.</li>
                    <li><strong>Investigation:</strong> We will investigate your concern and keep you informed of the progress.</li>
                    <li><strong>Resolution:</strong> We aim to resolve all complaints within 30 days of receipt.</li>
                    <li>
                      <strong>Escalation:</strong> If your complaint is not resolved to your satisfaction within 30 days, you may escalate the matter to{" "}
                      <a href={`mailto:escalation@powernetpro.com`} className="text-gold hover:underline">escalation@powernetpro.com</a>.
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <ListChecks className="h-6 w-6 text-gold" />
                    Important Information
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Please include the following when filing a complaint to help us resolve it faster:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Your registered name and email address</li>
                    <li>Your PowerNetPro account ID / reservation ID (if applicable)</li>
                    <li>A clear description of the issue</li>
                    <li>Any supporting documents or screenshots</li>
                    <li>Your preferred resolution</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-black mb-4 flex items-center gap-2">
                    <Shield className="h-6 w-6 text-gold" />
                    Regulatory Compliance
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    This grievance mechanism is established in compliance with the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020, the Information Technology Act, 2000, and the Reserve Bank of India guidelines for Payment Aggregators.
                  </p>
                </div>

                <div className="bg-gold/5 rounded-xl p-6 border border-gold/20">
                  <h3 className="text-lg font-bold text-black mb-3">Quick Contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="h-5 w-5 text-gold" />
                      <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:underline">{SUPPORT_EMAIL}</a>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone className="h-5 w-5 text-gold" />
                      <a href={`tel:${SUPPORT_PHONE_TEL}`} className="hover:underline">{SUPPORT_PHONE}</a>
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
