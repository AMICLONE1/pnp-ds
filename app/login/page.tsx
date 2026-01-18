"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import { 
  Sun, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  Shield,
  Zap,
  TrendingDown
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate inputs
    if (!email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      // Provide user-friendly error messages
      if (authError.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    if (data.session) {
      // Ensure session is properly established
      // Wait a bit for cookies to be set and session to be synced
      await new Promise((r) => setTimeout(r, 300));
      
      // Verify session is still valid before redirecting
      const { data: { session: verifiedSession } } = await supabase.auth.getSession();
      if (verifiedSession) {
        // Redirect to dashboard
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Session could not be established. Please try again.");
        setLoading(false);
      }
    } else {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-offwhite via-white to-white/5 pt-28 pb-12 px-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="space-y-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-black text-sm font-medium mb-4"
                >
                  <Sparkles className="h-4 w-4" />
                  Welcome back to PowerNetPro
                </motion.div>
                <h1 className="text-4xl font-heading font-bold text-black mb-3">
                  Sign in to manage your <span className="text-black">solar savings</span>
                </h1>
                <p className="text-black">
                  Access your dashboard, track credits, and manage your electricity bills all in one place.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="space-y-3">
                {[
                  { icon: TrendingDown, title: "Track Savings", desc: "Monitor your monthly solar credits in real-time", color: "text-energy-green", bg: "bg-white/10" },
                  { icon: Zap, title: "Instant Updates", desc: "Get notified when credits are applied to your bills", color: "text-gold", bg: "bg-gold/10" },
                  { icon: Shield, title: "Secure Access", desc: "Your data is protected with enterprise-grade security", color: "text-black", bg: "bg-white/10" },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className={`p-2 rounded-lg ${feature.bg}`}>
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{feature.title}</h3>
                      <p className="text-sm text-gray-500">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 pt-4"
              >
                <div className="text-center">
                  <p className="text-2xl font-bold text-black">10,000+</p>
                  <p className="text-xs text-gray-500">Active Users</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-black">₹2Cr+</p>
                  <p className="text-xs text-gray-500">Saved Monthly</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-black">4.9★</p>
                  <p className="text-xs text-gray-500">User Rating</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-md mx-auto overflow-hidden shadow-xl shadow-forest/5 border-0">
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-br from-white via-white to-white-light p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="relative inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-4"
                >
                  <Sun className="h-10 w-10 text-gold" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative text-2xl font-heading font-bold text-black"
                >
                  Welcome Back
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative text-black/70 text-sm mt-1"
                >
                  Sign in to your PowerNetPro account
                </motion.p>
              </div>

              <CardContent className="p-6">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                      <Mail className="h-4 w-4 text-black" />
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="off"
                      autoFocus
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                      <Lock className="h-4 w-4 text-black" />
                      Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="off"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-black focus:ring-forest" />
                      <span className="text-sm text-black">Remember me</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-black hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full h-12 rounded-xl group"
                    isLoading={loading}
                  >
                    Sign In
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-center text-sm text-black">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-black hover:underline font-semibold">
                      Sign up free
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Mobile-only trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="lg:hidden flex items-center justify-center gap-4 mt-6 text-xs text-gray-500"
            >
              <div className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-black" />
                Secure Login
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <div className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-gold" />
                10,000+ Users
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

