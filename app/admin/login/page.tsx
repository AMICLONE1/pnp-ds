"use client";

export const dynamic = 'force-dynamic';
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
    ShieldCheck,
    Mail,
    Lock,
    ArrowRight,
    AlertCircle,
    Server,
    Users,
    Activity,
} from "lucide-react";

export default function AdminLoginPage() {
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
                setError("Invalid email or password.");
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

        // Verify user is an ADMIN
        try {
            const roleRes = await fetch("/api/admin/verify");
            const roleResult = await roleRes.json();

            if (roleResult.success && roleResult.isAdmin) {
                router.push("/admin");
                router.refresh();
                return;
            } else {
                // Not an admin — sign them out and show error
                await supabase.auth.signOut();
                setError("This account does not have Admin access.");
                setLoading(false);
                return;
            }
        } catch {
            await supabase.auth.signOut();
            setError("Could not verify admin access. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <LandingHeader />
            <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-offwhite via-white to-white/5 pt-28 pb-12 px-4">
                <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Admin Info */}
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
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-sm font-medium mb-4 border border-red-200"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    Admin Access Only
                                </motion.div>
                                <h1 className="text-4xl font-heading font-bold text-black mb-3">
                                    System <span className="text-red-600">Administration</span>
                                </h1>
                                <p className="text-black">
                                    Restricted area. Only authorized administrators can access this portal.
                                </p>
                            </div>

                            {/* Feature Cards */}
                            <div className="space-y-3">
                                {[
                                    { icon: Users, title: "User Management", desc: "Manage users, hosts, and roles", color: "text-blue-600", bg: "bg-blue-50" },
                                    { icon: Activity, title: "System Monitoring", desc: "Track platform health and analytics", color: "text-emerald-600", bg: "bg-emerald-50" },
                                    { icon: Server, title: "Infrastructure", desc: "Manage projects, payments, and configurations", color: "text-amber-600", bg: "bg-amber-50" },
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
                            <div className="bg-gradient-to-br from-red-50 via-white to-white p-8 text-center relative overflow-hidden">
                                <div className="absolute inset-0 overflow-hidden">
                                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-100/50 rounded-full blur-2xl" />
                                    <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-rose-100/50 rounded-full blur-2xl" />
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="relative inline-flex p-4 rounded-2xl bg-red-50 mb-4"
                                >
                                    <ShieldCheck className="h-10 w-10 text-red-600" />
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative text-2xl font-heading font-bold text-black"
                                >
                                    Admin Login
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="relative text-black/70 text-sm mt-1"
                                >
                                    Authorized personnel only
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
                                            placeholder="admin@powernet.pro"
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
                                        className="w-full h-12 rounded-xl group bg-red-600 hover:bg-red-700 text-white"
                                        isLoading={loading}
                                    >
                                        Sign In as Admin
                                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <p className="text-center text-sm text-gray-500">
                                        Not an admin?{" "}
                                        <Link href="/login" className="text-black hover:underline font-semibold">
                                            User Login
                                        </Link>
                                        {" · "}
                                        <Link href="/host/login" className="text-black hover:underline font-semibold">
                                            Host Login
                                        </Link>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

