"use client";

import { useState } from "react";
import { LandingHeader } from "@/components/layout/LandingHeader";
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
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto items-start">
              {/* Contact Information */}
                          <div className="flex flex-col gap-6 justify-between">
                            <Card className="bg-white/95 shadow-lg rounded-3xl border border-gray-100 h-full flex flex-col justify-between">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-2xl font-heading font-bold text-black">Contact Information</CardTitle>
                                <CardDescription className="text-gray-600 font-medium">Reach out to us through any of these channels</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-6 pt-0">
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-gold/10 rounded-xl flex items-center justify-center">
                                    <Mail className="h-6 w-6 text-gold" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-black mb-1">Email</h3>
                                    <a href="mailto:omkarkolhe912@gmail.com" className="text-black hover:underline">omkarkolhe912@gmail.com</a>
                                  </div>
                                </div>
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-gold/10 rounded-xl flex items-center justify-center">
                                    <Phone className="h-6 w-6 text-gold" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-black mb-1">Phone</h3>
                                    <a href="tel:+918180861415" className="text-black hover:underline">+91 8180 861 415</a>
                                    <p className="text-sm text-gray-600 mt-1">Mon - Fri, 9:00 AM - 6:00 PM IST</p>
                                  </div>
                                </div>
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-gold/10 rounded-xl flex items-center justify-center">
                                    <MapPin className="h-6 w-6 text-gold" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-black mb-1">Address</h3>
                                    <p className="text-black">Kothrud, Pune<br />Maharashtra<br />Bharat</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="bg-gradient-to-br from-white/95 to-gold/10 border border-gray-100 shadow rounded-3xl">
                              <CardContent className="pt-6 pb-4">
                                <div className="flex items-start gap-3">
                                  <MessageSquare className="h-5 w-5 text-gold mt-0.5" />
                                  <div>
                                    <h3 className="font-semibold text-black mb-2">Response Time</h3>
                                    <p className="text-sm text-gray-600">We typically respond within 24 hours during business days. For urgent matters, please call us directly.</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Contact Form */}
                          <div className="flex flex-col justify-between h-full">
                            <Card className="bg-white/95 shadow-lg rounded-3xl border border-gray-100 h-full flex flex-col justify-between">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-2xl font-heading font-bold text-black">Send us a Message</CardTitle>
                                <CardDescription className="text-gray-600 font-medium">Fill out the form below and we'll get back to you</CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                {submitted ? (
                                  <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                      <Send className="h-8 w-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
                                    <p className="text-green-700">We've received your message and will get back to you soon.</p>
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
                                      className="rounded-full px-5 py-3 border-gray-300"
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
                                      className="rounded-full px-5 py-3 border-gray-300"
                                    />
                                    <Input
                                      type="tel"
                                      name="phone"
                                      label="Phone Number"
                                      placeholder="+91 98765 43210"
                                      value={formData.phone}
                                      onChange={handleChange}
                                      disabled={loading}
                                      className="rounded-full px-5 py-3 border-gray-300"
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
                                      className="rounded-full px-5 py-3 border-gray-300"
                                    />
                                    <div>
                                      <label className="block text-sm font-medium text-black mb-1.5">Message</label>
                                      <textarea
                                        name="message"
                                        rows={5}
                                        placeholder="Tell us more about your inquiry..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="flex w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                                      />
                                    </div>
                                    <Button
                                      type="submit"
                                      variant="primary"
                                      size="lg"
                                      className="w-full rounded-full font-bold text-lg py-3"
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
