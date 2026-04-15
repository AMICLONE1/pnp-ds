"use client";

export const dynamic = 'force-dynamic';
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { HostAuthHeader } from "@/components/layout/HostAuthHeader";
import {
  Sun,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Building2,
  BarChart3,
  Wallet,
  Users,
} from "lucide-react";

function HostLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hostError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSupabase = () => createClient();

  useEffect(() => {
    if (hostError === "host_inactive") {
      setError("This host account is inactive. Please ask an administrator to reactivate it.");
    }
  }, [hostError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

    const supabase = getSupabase();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      if (
        authError.message.includes("Invalid login credentials") ||
        authError.message.includes("Invalid login") ||
        authError.message.includes("Email not confirmed") ||
        authError.message.includes("User not found")
      ) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    if (!data || !data.session) {
      setError("Login failed. Please try again.");
      setLoading(false);
      return;
    }

    // Ensure session is properly established
    await new Promise((r) => setTimeout(r, 300));

    const { data: { user: verifiedUser }, error: sessionError } = await supabase.auth.getUser();

    if (sessionError || !verifiedUser) {
      setError("Session could not be established. Please try again.");
      setLoading(false);
      return;
    }

    // Verify user is a HOST
    try {
      const roleRes = await fetch("/api/host/verify");
      const roleResult = await roleRes.json();

      if (roleResult.success && roleResult.isHost) {
        router.push("/host");
        router.refresh();
        return;
      } else {
        // Not a host — sign them out and show error
        await supabase.auth.signOut();
        if (roleResult.error === "HOST_INACTIVE") {
          setError("This host account is inactive. Please ask an administrator to reactivate it.");
        } else if (roleResult.error === "HOST_NOT_FOUND") {
          setError("This account is not provisioned as a host yet.");
        } else if (roleResult.error === "ACCOUNT_DISABLED") {
          setError("This account has been disabled.");
        } else {
          setError("This account does not have Host access. Please use the correct login page for your role.");
        }
        setLoading(false);
        return;
      }
    } catch {
      await supabase.auth.signOut();
      setError("Could not verify host access. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HostAuthHeader />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-offwhite via-white to-white/5 pt-28 pb-12 px-4">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Host Benefits */}
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
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-sm font-medium mb-4 border border-amber-200"
                >
                  <Building2 className="h-4 w-4" />
                  Host Partner Portal
                </motion.div>
                <h1 className="text-4xl font-heading font-bold text-black mb-3">
                  Manage your <span className="text-amber-600">solar plants</span>
                </h1>
                <p className="text-black">
                  Access your host dashboard to manage solar installations, track generation, and monitor financials.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="space-y-3">
                {[
                  { icon: BarChart3, title: "Plant Analytics", desc: "Monitor energy generation and performance metrics", color: "text-energy-green", bg: "bg-emerald-50" },
                  { icon: Wallet, title: "Financial Dashboard", desc: "Track revenue, payments, and earnings in real-time", color: "text-gold", bg: "bg-amber-50" },
                  { icon: Users, title: "Customer Management", desc: "View and manage connected consumers", color: "text-black", bg: "bg-gray-50" },
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
              <div className="bg-gradient-to-br from-amber-50 via-white to-white p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl" />
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="relative inline-flex p-4 rounded-2xl bg-amber-50 mb-4"
                >
                  <Building2 className="h-10 w-10 text-amber-600" />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative text-2xl font-heading font-bold text-black"
                >
                  Host Portal
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative text-black/70 text-sm mt-1"
                >
                  Sign in with the username and password issued by your administrator
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
                      placeholder="host@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="username"
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
                      autoComplete="current-password"
                      className="h-12 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-end">
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
                    Sign In as Host
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-center text-sm text-gray-500">
                    Accounts are created by the admin team. No self-signup is available.
                  </p>
                  <p className="text-center text-sm mt-3">
                    <Link href="/host-landing" className="text-black hover:underline font-semibold">
                      Back to Host Landing
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function HostLoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-gradient-to-br from-offwhite via-white to-white/5" />}
    >
      <HostLoginContent />
    </Suspense>
  );
}
