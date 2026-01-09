"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-offwhite">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-forest to-forest-dark text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-100">
                Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Contact Information</CardTitle>
                    <CardDescription>
                      Reach out to us through any of these channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-forest/10 rounded-lg">
                        <Mail className="h-6 w-6 text-forest" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-charcoal mb-1">Email</h3>
                        <a
                          href="mailto:support@powernetpro.com"
                          className="text-forest hover:underline"
                        >
                          support@powernetpro.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-forest/10 rounded-lg">
                        <Phone className="h-6 w-6 text-forest" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-charcoal mb-1">Phone</h3>
                        <a
                          href="tel:+9118001234567"
                          className="text-forest hover:underline"
                        >
                          +91 1800 123 4567
                        </a>
                        <p className="text-sm text-gray-600 mt-1">
                          Mon - Fri, 9:00 AM - 6:00 PM IST
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-forest/10 rounded-lg">
                        <MapPin className="h-6 w-6 text-forest" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-charcoal mb-1">Address</h3>
                        <p className="text-gray-700">
                          PowerNetPro Headquarters
                          <br />
                          Bangalore, Karnataka
                          <br />
                          India
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Info Card */}
                <Card className="bg-gradient-to-br from-forest/5 to-gold/5 border-forest/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-forest mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-charcoal mb-2">Response Time</h3>
                        <p className="text-sm text-gray-600">
                          We typically respond within 24 hours during business days. For urgent matters, please call us directly.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we&apos;ll get back to you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Send className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-green-800 mb-2">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-green-700">
                          We&apos;ve received your message and will get back to you soon.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                          type="text"
                          name="name"
                          label="Full Name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <Input
                          type="email"
                          name="email"
                          label="Email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <Input
                          type="tel"
                          name="phone"
                          label="Phone Number"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={loading}
                        />
                        <Input
                          type="text"
                          name="subject"
                          label="Subject"
                          placeholder="How can we help?"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                        <div>
                          <label className="block text-sm font-medium text-charcoal mb-1.5">
                            Message
                          </label>
                          <textarea
                            name="message"
                            rows={5}
                            placeholder="Tell us more about your inquiry..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-forest focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                          />
                        </div>
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          className="w-full"
                          disabled={loading}
                          isLoading={loading}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

