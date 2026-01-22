"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sun,
  Mail,
  CheckCircle2,
  Sparkles,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Loader2,
  PartyPopper,
  Clock,
  Bell,
} from "lucide-react";
import Link from "next/link";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [position, setPosition] = useState<number | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(127);

  // Fetch waitlist count on mount
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/waitlist");
        const data = await res.json();
        if (data.success) {
          setWaitlistCount(data.data.displayCount);
        }
      } catch {
        // Use default count
      }
    };
    fetchCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          source: "waitlist_page",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        setPosition(data.position);
        if (!data.alreadyExists) {
          setWaitlistCount((prev) => prev + 1);
        }
      } else {
        setError(data.error?.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Unable to connect. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Zap, title: "Early Access", desc: "Be among the first to reserve solar capacity" },
    { icon: Shield, title: "Founder Pricing", desc: "Lock in exclusive launch rates" },
    { icon: Bell, title: "Priority Support", desc: "Direct line to our founding team" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingHeader />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden py-12 md:py-20">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,184,0,0.25),rgba(34,197,94,0.15),transparent_60%)] blur-3xl opacity-80" />
          </div>

          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-black px-4 py-2 rounded-full mb-6"
                >
                  <Clock className="w-4 h-4 text-gold" />
                  <span className="text-sm font-semibold">Launching Soon</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-black mb-6 leading-tight"
                >
                  Join the{" "}
                  <span className="text-gold">Solar Revolution</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
                >
                  Be the first to experience Digital Solar. No rooftop needed.
                  Save up to 75% on electricity bills with zero installation hassle.
                </motion.p>

                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center lg:justify-start gap-4 mb-8"
                >
                  <div className="flex -space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/40 border-2 border-white flex items-center justify-center"
                      >
                        <Users className="w-4 h-4 text-gold" />
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-black font-bold">{waitlistCount.toLocaleString()}+ joined</p>
                    <p className="text-gray-500 text-sm">on the waitlist</p>
                  </div>
                </motion.div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  {benefits.map((benefit, i) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-black">{benefit.title}</p>
                        <p className="text-sm text-gray-500">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right - Form Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 via-gold/10 to-green-400/20 rounded-3xl blur-2xl opacity-60" />

                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-10">
                  {!isSuccess ? (
                    <>
                      {/* Form Header */}
                      <div className="text-center mb-8">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          className="w-16 h-16 bg-gradient-to-br from-gold to-gold-light rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold/30"
                        >
                          <Sun className="w-8 h-8 text-black" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-black mb-2">
                          Get Early Access
                        </h2>
                        <p className="text-gray-500">
                          Join the waitlist and we'll notify you when we launch
                        </p>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Name (optional)
                          </label>
                          <Input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full h-12 px-4 border-gray-200 focus:border-gold focus:ring-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Email address <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="w-full h-12 pl-12 pr-4 border-gray-200 focus:border-gold focus:ring-gold"
                            />
                          </div>
                        </div>

                        {error && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-500 text-sm bg-red-50 p-3 rounded-lg"
                          >
                            {error}
                          </motion.p>
                        )}

                        <Button
                          type="submit"
                          disabled={isLoading || !email}
                          className="w-full h-12 bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-bold text-lg shadow-lg shadow-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Joining...
                            </>
                          ) : (
                            <>
                              Join Waitlist
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </form>

                      {/* Trust badges */}
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-6 text-gray-400 text-xs">
                          <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            <span>No spam</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Unsubscribe anytime</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Success State */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-400/30"
                      >
                        <PartyPopper className="w-10 h-10 text-white" />
                      </motion.div>

                      <h2 className="text-2xl font-bold text-black mb-2">
                        You're on the list!
                      </h2>

                      {position && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="inline-flex items-center gap-2 bg-gold/10 text-gold px-4 py-2 rounded-full mb-4"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span className="font-semibold">Position #{position}</span>
                        </motion.div>
                      )}

                      <p className="text-gray-600 mb-6">
                        We'll send you an email when PowerNetPro launches.
                        <br />
                        Get ready to start saving!
                      </p>

                      <div className="space-y-3">
                        <Link href="/">
                          <Button
                            variant="outline"
                            className="w-full h-12 border-gray-200 hover:bg-gray-50"
                          >
                            Back to Home
                          </Button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Coming Soon Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-black mb-4">
                What's Coming
              </h2>
              <p className="text-gray-600">
                Here's what you'll get when we launch
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Sun,
                  title: "Digital Solar",
                  desc: "Reserve solar capacity without installing panels on your roof",
                },
                {
                  icon: Zap,
                  title: "Bill Credits",
                  desc: "Get solar credits applied directly to your electricity bill",
                },
                {
                  icon: Shield,
                  title: "Zero Risk",
                  desc: "No upfront costs, no maintenance, cancel anytime",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-bold text-black mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
