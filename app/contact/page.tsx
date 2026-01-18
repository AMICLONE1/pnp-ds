"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

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
      <main className="flex-1 bg-gradient-to-br from-offwhite via-white to-gold/5">
        {/* Premium Hero Section */}
        <section className="relative bg-gradient-to-br from-forest via-forest-dark to-forest text-white py-20 overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-energy-green/10 rounded-full blur-3xl -ml-48 -mb-48" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span className="text-sm font-medium">We&apos;re here to help</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight">
                  Get in <span className="text-gold">Touch</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-100 leading-relaxed max-w-2xl mx-auto">
                  Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Premium Contact Section */}
        <section className="py-20 -mt-8 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
              {/* Premium Contact Information */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="border-2 border-forest/20 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest via-gold to-energy-green" />
                    <CardHeader className="pb-4">
                      <CardTitle className="text-3xl font-bold text-charcoal">Contact Information</CardTitle>
                      <CardDescription className="text-base">
                        Reach out to us through any of these channels
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                      <motion.a
                        href="mailto:omkarkolhe912@gmail.com"
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-forest/5 to-transparent hover:from-forest/10 hover:to-forest/5 transition-all group"
                      >
                        <div className="p-3 bg-gradient-to-br from-forest to-forest-dark rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-charcoal mb-1.5 text-lg">Email</h3>
                          <p className="text-forest font-semibold group-hover:text-forest-dark transition-colors">
                            omkarkolhe912@gmail.com
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Send us an email anytime</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-forest opacity-0 group-hover:opacity-100 transition-all" />
                      </motion.a>

                      <motion.a
                        href="tel:+918180861415"
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-forest/5 to-transparent hover:from-forest/10 hover:to-forest/5 transition-all group"
                      >
                        <div className="p-3 bg-gradient-to-br from-forest to-forest-dark rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-charcoal mb-1.5 text-lg">Phone</h3>
                          <p className="text-forest font-semibold group-hover:text-forest-dark transition-colors">
                            +91 8180861415
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Clock className="h-3.5 w-3.5 text-gray-500" />
                            <p className="text-sm text-gray-500">Mon - Fri, 9:00 AM - 6:00 PM IST</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-forest opacity-0 group-hover:opacity-100 transition-all" />
                      </motion.a>

                      <motion.div
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-forest/5 to-transparent hover:from-forest/10 hover:to-forest/5 transition-all group"
                      >
                        <div className="p-3 bg-gradient-to-br from-forest to-forest-dark rounded-xl shadow-lg group-hover:shadow-xl transition-shadow">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-charcoal mb-1.5 text-lg">Address</h3>
                          <p className="text-gray-700 leading-relaxed font-medium">
                            PowerNetPro Headquarters
                            <br />
                            <span className="text-forest">Kothrud, Pune, Maharashtra</span>
                            <br />
                            <span className="text-gray-600">Bharat</span>
                          </p>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Premium Response Time Card */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="bg-gradient-to-br from-gold/10 via-forest/5 to-energy-green/10 border-2 border-gold/30 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-gold to-gold-light rounded-xl shadow-md">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-charcoal mb-2 text-lg flex items-center gap-2">
                            Response Time
                            <span className="px-2 py-0.5 bg-energy-green/20 text-energy-green text-xs font-semibold rounded-full">
                              Fast
                            </span>
                          </h3>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            We typically respond within <span className="font-semibold text-charcoal">24 hours</span> during business days. For urgent matters, please call us directly.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Premium Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="border-2 border-forest/20 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest via-gold to-energy-green" />
                  <CardHeader className="pb-4">
                    <CardTitle className="text-3xl font-bold text-charcoal">Send us a Message</CardTitle>
                    <CardDescription className="text-base">
                      Fill out the form below and we&apos;ll get back to you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 bg-gradient-to-br from-energy-green/10 via-green-50 to-energy-green/5 border-2 border-energy-green/30 rounded-2xl text-center"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                          className="w-20 h-20 bg-gradient-to-br from-energy-green to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                        >
                          <CheckCircle2 className="h-10 w-10 text-white" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-charcoal mb-3">
                          Message Sent Successfully!
                        </h3>
                        <p className="text-gray-700 text-lg">
                          We&apos;ve received your message and will get back to you within 24 hours.
                        </p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-charcoal mb-2">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="h-12 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-charcoal mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="h-12 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-charcoal mb-2">
                            Phone Number <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                            className="h-12 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-charcoal mb-2">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            name="subject"
                            placeholder="How can we help you?"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="h-12 text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-charcoal mb-2">
                            Message <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="message"
                            rows={6}
                            placeholder="Tell us more about your inquiry..."
                            value={formData.message}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="flex w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 text-base text-charcoal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-forest focus:border-forest disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                          />
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full h-14 text-base font-semibold shadow-lg shadow-forest/20 hover:shadow-xl hover:shadow-forest/30 transition-all"
                            disabled={loading}
                            isLoading={loading}
                          >
                            {!loading && <Send className="mr-2 h-5 w-5" />}
                            {loading ? "Sending..." : "Send Message"}
                            {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                          </Button>
                        </motion.div>
                        <p className="text-xs text-gray-500 text-center pt-2">
                          By submitting this form, you agree to our{" "}
                          <a href="/privacy" className="text-forest hover:underline font-semibold">Privacy Policy</a>
                        </p>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

