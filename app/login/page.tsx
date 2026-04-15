"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSupabase = () => createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Server-side login: rate limited, generic errors, time-padded.
    let res: Response;
    try {
      res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      return;
    }

    const result = await res.json().catch(() => ({ success: false, error: "Login failed." }));
    if (!res.ok || !result.success) {
      setError(result.error || "Invalid email or password.");
      setLoading(false);
      return;
    }

    // Cookie was set in the route handler response — session is live.
    const supabase = getSupabase();

    // Block host/admin accounts from the user portal.
    try {
      const roleRes = await fetch("/api/host/verify");
      const roleResult = await roleRes.json();
      if (roleResult.success && roleResult.isHost) {
        await supabase.auth.signOut();
        setError("This is a Host account. Please use the Host login portal.");
        setLoading(false);
        return;
      }
    } catch {}

    try {
      const adminRes = await fetch("/api/admin/verify");
      const adminResult = await adminRes.json();
      if (adminResult.success && adminResult.isAdmin) {
        await supabase.auth.signOut();
        setError("This is an Admin account. Please use the Admin login portal.");
        setLoading(false);
        return;
      }
    } catch {}

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top_left,_rgba(255,183,0,0.12),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfaf6_100%)]">
      <LandingHeader />
      <main className="flex-1 px-4 pt-24 pb-12 sm:pt-28 sm:pb-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <motion.section
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative hidden overflow-hidden rounded-[2rem] border border-gold/15 bg-white/80 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur lg:block lg:p-10"
          >
            <div className="absolute -right-12 top-10 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
            <div className="absolute -left-10 bottom-4 h-32 w-32 rounded-full bg-forest/10 blur-3xl" />

            <div className="relative space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1.5 text-sm font-medium text-gold-dark">
                <Sparkles className="h-4 w-4" />
                Welcome back to PowerNetPro
              </span>

              <div className="max-w-xl space-y-3">
                <h1 className="text-4xl font-heading font-bold tracking-tight text-black">
                  Sign in to your solar dashboard.
                </h1>
                <p className="max-w-lg text-base leading-7 text-gray-600">
                  Access your account, review bills, and keep track of your savings from one clean place.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    icon: Zap,
                    title: "Quick access",
                    desc: "Get straight to your dashboard without extra steps.",
                  },
                  {
                    icon: Shield,
                    title: "Private and secure",
                    desc: "Your account stays protected with role-based access.",
                  },
                  {
                    icon: Sun,
                    title: "Simple overview",
                    desc: "Check credits, bills, and updates at a glance.",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * index }}
                    className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-dark">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {["Dashboard", "Credits", "Bills"].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md"
          >
            <Card className="overflow-hidden border border-gray-100 shadow-[0_24px_70px_rgba(15,23,42,0.10)]">
              <div className="relative overflow-hidden bg-gradient-to-br from-forest via-forest to-black px-8 py-8 text-center text-white sm:px-10">
                <div className="absolute inset-0">
                  <div className="absolute -right-10 top-4 h-28 w-28 rounded-full bg-gold/20 blur-3xl" />
                  <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
                </div>
                <div className="relative mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                  <Sun className="h-7 w-7 text-gold" />
                </div>
                <h2 className="relative text-2xl font-heading font-bold">Welcome back</h2>
                <p className="relative mt-2 text-sm leading-6 text-white/75">
                  Sign in to continue to your PowerNetPro account.
                </p>
              </div>

              <CardContent className="space-y-6 p-6 sm:p-7">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-black">
                      <Mail className="h-4 w-4 text-gold-dark" />
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
                      autoFocus
                      className="h-12 rounded-xl border-gray-300 bg-white px-4 shadow-sm focus:border-gold focus:ring-gold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-black">
                      <Lock className="h-4 w-4 text-gold-dark" />
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
                      className="h-12 rounded-xl border-gray-300 bg-white px-4 shadow-sm focus:border-gold focus:ring-gold"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-black">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold" />
                      Remember me
                    </label>
                    <Link href="/forgot-password" className="text-sm font-medium text-gray-600 hover:text-black hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="group h-12 w-full rounded-xl font-semibold"
                    isLoading={loading}
                  >
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>

                <div className="border-t border-gray-100 pt-5 text-center">
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-semibold text-black hover:underline">
                      Sign up free
                    </Link>
                  </p>
                  <p className="mt-3 text-xs text-gray-400">
                    <Link href="/host-landing" className="hover:text-black hover:underline">
                      Host Landing
                    </Link>
                    {" · "}
                    <Link href="/admin/login" className="hover:text-black hover:underline">
                      Admin Login
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
}