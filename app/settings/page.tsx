"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileUpdateSchema } from "@/lib/validations";
import { SettingsSkeleton } from "@/components/ui/skeletons/SettingsSkeleton";
import { 
  User, 
  Bell, 
  Shield, 
  Settings, 
  CheckCircle, 
  Mail, 
  Phone, 
  Calendar, 
  BadgeCheck,
  Lock,
  Smartphone,
  AlertCircle,
  ChevronRight
} from "lucide-react";

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email_notifications: true,
    sms_notifications: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeSection, setActiveSection] = useState("profile");

  // Update active section based on scroll position
  useEffect(() => {
    const sectionIds = ["profile", "notifications", "security"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/profile", { credentials: "include" });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Redirect to login if unauthorized
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const result = await response.json();
        if (result.success) {
          setProfile(result.data);
          setFormData({
            name: result.data.name || "",
            phone: result.data.phone || "",
            email_notifications: result.data.email_notifications ?? true,
            sms_notifications: result.data.sms_notifications ?? true,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // Don't leave page blank - show error state
      } finally {
        // Show skeleton for minimum 10 seconds
        setTimeout(() => {
          setLoading(false);
        }, 10000);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const validated = profileUpdateSchema.parse(formData);
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Profile updated successfully!");
        setProfile(result.data);
      } else {
        setError(result.error?.message || "Failed to update profile");
      }
    } catch (err: any) {
      if (err.errors) {
        setError(err.errors[0]?.message || "Validation error");
      } else {
        setError(err.message || "Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-20">
          <SettingsSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-gold/5 to-amber-50/30 p-6 md:p-8 border border-gold/20 shadow-lg shadow-gold/5">
              {/* Background decorative elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-100/20 rounded-full blur-2xl" />
              </div>
              
              <div className="relative z-10">
                <motion.div 
                  className="flex items-center gap-4 mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div 
                    className="p-3 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100/30 border border-gold/30 shadow-md"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Settings className="h-6 w-6 text-gold" />
                  </motion.div>
                  <h1 className="text-4xl md:text-5xl font-heading font-bold text-black">
                    Settings
                  </h1>
                </motion.div>
                <motion.p 
                  className="text-gray-700 text-base md:text-lg font-medium ml-16"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Manage your account settings and preferences
                </motion.p>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Navigation Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-1"
            >
              <Card className="sticky top-28 overflow-hidden border-2 border-gold/20 shadow-xl">
                {/* Enhanced User Profile Header */}
                <div className="relative bg-gradient-to-br from-gold/10 via-amber-50/30 to-gold/5 p-5 border-b border-gold/20">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
                  </div>
                  <div className="relative z-10 flex items-center gap-3">
                    <motion.div 
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-amber-100/30 border-2 border-gold/30 flex items-center justify-center shadow-md"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <User className="h-7 w-7 text-gold" />
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-black truncate text-base">{formData.name || "User"}</p>
                      <p className="text-xs text-gray-600 truncate mt-0.5">{profile?.email}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {[
                      { id: "profile", label: "Profile", icon: User },
                      { id: "notifications", label: "Notifications", icon: Bell },
                      { id: "security", label: "Security", icon: Shield },
                    ].map((item, index) => (
                      <motion.a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={() => setActiveSection(item.id)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ x: 4 }}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                          activeSection === item.id
                            ? "bg-gradient-to-r from-gold/20 via-amber-50/30 to-gold/20 text-black border-2 border-gold/30 shadow-md"
                            : "text-black hover:bg-gray-50 border-2 border-transparent hover:border-gray-200"
                        }`}
                      >
                        {activeSection === item.id && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent"
                            layoutId="activeSection"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <item.icon className={`h-5 w-5 relative z-10 ${activeSection === item.id ? "text-gold" : "text-gray-400 group-hover:text-gold"}`} />
                        <span className="font-semibold relative z-10">{item.label}</span>
                        <ChevronRight className={`h-4 w-4 ml-auto relative z-10 transition-transform ${activeSection === item.id ? "text-gold translate-x-1" : "text-gray-300 group-hover:translate-x-1"}`} />
                      </motion.a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Content */}
            <div className="md:col-span-3 space-y-6">
              {/* Profile Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card id="profile" className="overflow-hidden border-2 border-gold/20 shadow-xl">
                  {/* Enhanced Header */}
                  <div className="relative bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 p-6 border-b border-gold/20">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100/30 border border-gold/30 shadow-md"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <User className="h-6 w-6 text-gold" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-2xl mb-1">Profile Information</CardTitle>
                        <CardDescription className="text-base">
                          Update your personal information
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                            <User className="h-4 w-4 text-gold" />
                            Full Name
                          </label>
                          <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            disabled={loading}
                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-gold focus:ring-gold/50 transition-all"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                            <Phone className="h-4 w-4 text-gold" />
                            Phone Number
                          </label>
                          <Input
                            type="tel"
                            placeholder="10-digit mobile number"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            disabled={loading}
                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-gold focus:ring-gold/50 transition-all"
                          />
                        </motion.div>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                          <Mail className="h-4 w-4 text-gold" />
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            className="flex h-12 w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 cursor-not-allowed pr-24"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium">
                            <Lock className="h-3.5 w-3.5" />
                            Locked
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                          <Shield className="h-3 w-3" />
                          Email cannot be changed for security reasons
                        </p>
                      </motion.div>

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

                        {success && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2"
                          >
                            <CheckCircle className="h-4 w-4 shrink-0" />
                            {success}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          isLoading={saving}
                          className="h-12 rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 px-6 text-base font-semibold"
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Save Changes
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Notifications Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card id="notifications" className="overflow-hidden border-2 border-gold/20 shadow-xl">
                  {/* Enhanced Header */}
                  <div className="relative bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 p-6 border-b border-gold/20">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100/30 border border-gold/30 shadow-md"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Bell className="h-6 w-6 text-gold" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-2xl mb-1">Notification Preferences</CardTitle>
                        <CardDescription className="text-base">
                          Choose how you want to be notified
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Enhanced Email Notifications */}
                      <motion.div 
                        className={`relative p-6 border-2 rounded-2xl transition-all group shadow-sm hover:shadow-lg overflow-hidden ${
                          formData.email_notifications 
                            ? "border-gold/50 bg-gradient-to-br from-gold/10 via-amber-50/20 to-gold/5" 
                            : "border-gray-200 hover:border-gold/30 bg-gradient-to-br from-white to-gray-50/50"
                        }`}
                        whileHover={{ scale: 1.01, y: -2 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {/* Background glow when enabled */}
                        {formData.email_notifications && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5"
                          />
                        )}
                        
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <motion.div 
                              className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                                formData.email_notifications
                                  ? "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-300"
                                  : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200"
                              }`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              animate={{ scale: formData.email_notifications ? 1.05 : 1 }}
                            >
                              <Mail className={`h-6 w-6 transition-colors ${
                                formData.email_notifications ? "text-blue-600" : "text-blue-400"
                              }`} />
                            </motion.div>
                            <div className="flex-1">
                              <label className="font-bold text-black text-lg cursor-pointer block mb-1">
                                Email Notifications
                              </label>
                              <p className="text-sm text-gray-600">
                                Bills, credits, and important updates
                              </p>
                              {formData.email_notifications && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200"
                                >
                                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                  <span className="text-xs font-semibold text-green-700">Active</span>
                                </motion.div>
                              )}
                            </div>
                          </div>
                          <div
                            role="switch"
                            aria-checked={formData.email_notifications}
                            tabIndex={0}
                            onClick={() => setFormData({ ...formData, email_notifications: !formData.email_notifications })}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFormData({ ...formData, email_notifications: !formData.email_notifications }); } }}
                            className={`ml-4 w-12 h-7 rounded-full transition-all duration-300 relative shadow-inner cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
                              formData.email_notifications
                                ? "bg-gradient-to-r from-gold to-amber-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <motion.div
                              className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md pointer-events-none"
                              animate={{ left: formData.email_notifications ? "calc(100% - 1.625rem)" : "0.125rem" }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Enhanced SMS Notifications */}
                      <motion.div 
                        className={`relative p-6 border-2 rounded-2xl transition-all group shadow-sm hover:shadow-lg overflow-hidden ${
                          formData.sms_notifications 
                            ? "border-gold/50 bg-gradient-to-br from-gold/10 via-amber-50/20 to-gold/5" 
                            : "border-gray-200 hover:border-gold/30 bg-gradient-to-br from-white to-gray-50/50"
                        }`}
                        whileHover={{ scale: 1.01, y: -2 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        {/* Background glow when enabled */}
                        {formData.sms_notifications && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5"
                          />
                        )}
                        
                        <div className="relative z-10 flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <motion.div 
                              className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                                formData.sms_notifications
                                  ? "bg-gradient-to-br from-green-100 to-green-50 border-green-300"
                                  : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200"
                              }`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              animate={{ scale: formData.sms_notifications ? 1.05 : 1 }}
                            >
                              <Smartphone className={`h-6 w-6 transition-colors ${
                                formData.sms_notifications ? "text-green-600" : "text-green-400"
                              }`} />
                            </motion.div>
                            <div className="flex-1">
                              <label className="font-bold text-black text-lg cursor-pointer block mb-1">
                                SMS Notifications
                              </label>
                              <p className="text-sm text-gray-600">
                                Payment reminders and alerts
                              </p>
                              {formData.sms_notifications && (
                                <motion.div
                                  initial={{ opacity: 0, y: -5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200"
                                >
                                  <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                                  <span className="text-xs font-semibold text-green-700">Active</span>
                                </motion.div>
                              )}
                            </div>
                          </div>
                          <div
                            role="switch"
                            aria-checked={formData.sms_notifications}
                            tabIndex={0}
                            onClick={() => setFormData({ ...formData, sms_notifications: !formData.sms_notifications })}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFormData({ ...formData, sms_notifications: !formData.sms_notifications }); } }}
                            className={`ml-4 w-12 h-7 rounded-full transition-all duration-300 relative shadow-inner cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
                              formData.sms_notifications
                                ? "bg-gradient-to-r from-gold to-amber-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <motion.div
                              className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md pointer-events-none"
                              animate={{ left: formData.sms_notifications ? "calc(100% - 1.625rem)" : "0.125rem" }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* Enhanced Save Button */}
                      <motion.div 
                        className="pt-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={saving}
                            className="w-full sm:w-auto h-12 rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 px-8 text-base font-semibold"
                          >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Save Preferences
                          </Button>
                        </motion.div>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card id="security" className="overflow-hidden border-2 border-gold/20 shadow-xl">
                  {/* Enhanced Header */}
                  <div className="relative bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 p-6 border-b border-gold/20">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
                    </div>
                    <div className="relative z-10 flex items-center gap-4">
                      <motion.div
                        className="p-3 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100/30 border border-gold/30 shadow-md"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Shield className="h-6 w-6 text-gold" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-2xl mb-1">Security</CardTitle>
                        <CardDescription className="text-base">
                          Manage your account security
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 pt-6 space-y-5">
                    {/* Enhanced Change Password */}
                    <motion.div 
                      className="p-6 border-2 border-gray-200 rounded-2xl hover:border-gold/50 hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-gold/5 transition-all shadow-sm hover:shadow-md"
                      whileHover={{ scale: 1.01 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 shadow-sm"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Lock className="h-6 w-6 text-amber-600" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="font-bold text-black mb-2 text-lg">
                            Change Password
                          </h3>
                          <p className="text-sm text-gray-600 mb-5">
                            Update your password regularly to keep your account secure
                          </p>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="sm" className="rounded-xl border-2 hover:border-gold/50 px-4 py-2 font-semibold">
                              <Lock className="h-4 w-4 mr-2" />
                              Change Password
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Enhanced Account Information */}
                    {profile && (
                      <motion.div 
                        className="p-6 border-2 border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <div className="flex items-center gap-3 mb-5">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-gold/20 to-amber-100/30 border border-gold/30">
                            <BadgeCheck className="h-5 w-5 text-gold" />
                          </div>
                          <h3 className="font-bold text-black text-lg">
                            Account Information
                          </h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <motion.div 
                            className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gold/30 transition-all"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">Member since</p>
                              <p className="font-bold text-black">
                                {new Date(profile.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </p>
                            </div>
                          </motion.div>
                          <motion.div 
                            className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gold/30 transition-all"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className={`p-2.5 rounded-lg border ${
                              profile.kyc_status?.toLowerCase() === "verified" 
                                ? "bg-gradient-to-br from-green-100 to-green-50 border-green-200" 
                                : "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-200"
                            }`}>
                              <BadgeCheck className={`h-5 w-5 ${
                                profile.kyc_status?.toLowerCase() === "verified" 
                                  ? "text-green-600" 
                                  : "text-amber-600"
                              }`} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-medium mb-1">KYC Status</p>
                              <p className={`font-bold capitalize ${
                                profile.kyc_status?.toLowerCase() === "verified" 
                                  ? "text-green-600" 
                                  : "text-amber-600"
                              }`}>
                                {profile.kyc_status || "Pending"}
                              </p>
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

