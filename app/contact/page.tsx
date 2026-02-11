"use client";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import ContactSection from "@/components/contact/ContactSection";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-white to-gold/10">
      <LandingHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-black">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600">
                Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection/>
      </main>
      <Footer />
    </div>
  );
}
