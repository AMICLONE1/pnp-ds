"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
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
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  Shield,
  Zap,
  TrendingDown,
  CheckCircle,
  Gift
} from "lucide-react";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Wait for cookie to be set
      await new Promise((r) => setTimeout(r, 500));
      // Redirect to reserve page or specified redirect
      const redirect = searchParams.get("redirect") || "/reserve";
      router.push(redirect);
      router.refresh();
    }
  };

  // Password strength checker
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { level: 0, text: "", color: "" };
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    
    if (strength <= 2) return { level: strength, text: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { level: strength, text: "Medium", color: "bg-amber-500" };
    return { level: strength, text: "Strong", color: "bg-white" };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-offwhite via-white to-gold/5 pt-28 pb-12 px-4">
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
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-medium mb-4"
                >
                  <Gift className="h-4 w-4" />
                  Free to join • No credit card required
                </motion.div>
                <h1 className="text-4xl font-heading font-bold text-black mb-3">
                  Start your <span className="text-gold">solar savings</span> journey
                </h1>
                <p className="text-black">
                  Join 10,000+ families already saving on their electricity bills with PowerNetPro&apos;s digital solar platform.
                </p>
              </div>

              {/* What you get */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-black">What you&apos;ll get:</p>
                {[
                  { icon: TrendingDown, text: "Save up to 30% on electricity bills", color: "text-energy-green" },
                  { icon: Zap, text: "Instant solar credits without installation", color: "text-gold" },
                  { icon: Shield, text: "No rooftop needed, no maintenance hassle", color: "text-black" },
                  { icon: CheckCircle, text: "Real-time dashboard to track savings", color: "text-blue-500" },
                ].map((item, index) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`p-1 rounded-full bg-gray-100`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <span className="text-black">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Testimonial */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white to-white-light flex items-center justify-center text-black font-bold text-lg">
                    R
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-black text-sm italic mb-2">
                      &quot;Saved ₹2,400 in just the first month! The signup was quick and I started seeing credits on my bill immediately.&quot;
                    </p>
                    <p className="text-black font-semibold text-sm">Rahul M.</p>
                    <p className="text-gray-400 text-xs">Bangalore</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-md mx-auto overflow-hidden shadow-xl shadow-gold/5 border-0">
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-br from-gold via-gold to-gold-light p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="relative inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-sm mb-4"
                >
                  <Sun className="h-10 w-10 text-black" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative text-2xl font-heading font-bold text-black"
                >
                  Create Account
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative text-black/70 text-sm mt-1"
                >
                  Join PowerNetPro and start saving today
                </motion.p>
              </div>

              <CardContent className="p-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                      <User className="h-4 w-4 text-black" />
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="name"
                      autoFocus
                      className="h-12 rounded-xl"
                    />
                  </div>
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
                      autoComplete="email"
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
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="new-password"
                      className="h-12 rounded-xl"
                    />
                    {password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordStrength.level / 5) * 100}%` }}
                              className={`h-full ${passwordStrength.color} rounded-full`}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            passwordStrength.text === "Weak" ? "text-red-500" :
                            passwordStrength.text === "Medium" ? "text-amber-500" : "text-energy-green"
                          }`}>
                            {passwordStrength.text}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-black mb-2">
                      <Lock className="h-4 w-4 text-black" />
                      Confirm Password
                    </label>
                    <Input
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="new-password"
                      className="h-12 rounded-xl"
                    />
                    {confirmPassword && password && (
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {password === confirmPassword ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5 text-energy-green" />
                            <span className="text-xs text-energy-green">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                            <span className="text-xs text-red-500">Passwords don&apos;t match</span>
                          </>
                        )}
                      </div>
                    )}
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
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>

                  <p className="text-xs text-center text-gray-400">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="text-black hover:underline">Terms</Link>
                    {" "}and{" "}
                    <Link href="/privacy" className="text-black hover:underline">Privacy Policy</Link>
                  </p>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-center text-sm text-black">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black hover:underline font-semibold">
                      Sign in
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
                Free Forever
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <div className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5 text-gold" />
                Instant Setup
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <LandingHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-200"></div>
          </div>
        </main>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
