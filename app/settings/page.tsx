"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileUpdateSchema } from "@/lib/validations";
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
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
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
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-forest/10">
                <Settings className="h-6 w-6 text-forest" />
              </div>
              <h1 className="text-4xl font-heading font-bold text-charcoal">
                Settings
              </h1>
            </div>
            <p className="text-gray-600 ml-14">
              Manage your account settings and preferences
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Navigation Sidebar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-1"
            >
              <Card className="sticky top-28 overflow-hidden">
                <div className="bg-gradient-to-br from-forest to-forest-light p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{formData.name || "User"}</p>
                      <p className="text-xs text-white/70 truncate">{profile?.email}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <nav className="space-y-1">
                    {[
                      { id: "profile", label: "Profile", icon: User },
                      { id: "notifications", label: "Notifications", icon: Bell },
                      { id: "security", label: "Security", icon: Shield },
                    ].map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={() => setActiveSection(item.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          activeSection === item.id
                            ? "bg-forest/10 text-forest"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${activeSection === item.id ? "text-forest" : "text-gray-400 group-hover:text-forest"}`} />
                        <span className="font-medium">{item.label}</span>
                        <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${activeSection === item.id ? "text-forest" : "text-gray-300"}`} />
                      </a>
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
                <Card id="profile" className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-forest/10">
                        <User className="h-5 w-5 text-forest" />
                      </div>
                      <div>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your personal information
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                            <User className="h-4 w-4 text-forest" />
                            Full Name
                          </label>
                          <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            disabled={loading}
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                            <Phone className="h-4 w-4 text-forest" />
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
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-2">
                          <Mail className="h-4 w-4 text-forest" />
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            className="flex h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 cursor-not-allowed pr-24"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-md bg-gray-200 text-xs text-gray-500">
                            <Lock className="h-3 w-3" />
                            Locked
                          </div>
                        </div>
                        <p className="mt-1.5 text-xs text-gray-400">
                          Email cannot be changed for security reasons
                        </p>
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

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={loading}
                        className="h-12 rounded-xl"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
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
                <Card id="notifications" className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-forest/10">
                        <Bell className="h-5 w-5 text-forest" />
                      </div>
                      <div>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>
                          Choose how you want to be notified
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* Email Notifications Toggle */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-forest/30 hover:bg-forest/5 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-forest/10 group-hover:bg-forest/20 transition-colors">
                            <Mail className="h-5 w-5 text-forest" />
                          </div>
                          <div>
                            <label className="font-medium text-charcoal">
                              Email Notifications
                            </label>
                            <p className="text-sm text-gray-500">
                              Bills, credits, and important updates
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.email_notifications}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email_notifications: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-forest/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
                        </label>
                      </div>
                      
                      {/* SMS Notifications Toggle */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-forest/30 hover:bg-forest/5 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-forest/10 group-hover:bg-forest/20 transition-colors">
                            <Smartphone className="h-5 w-5 text-forest" />
                          </div>
                          <div>
                            <label className="font-medium text-charcoal">
                              SMS Notifications
                            </label>
                            <p className="text-sm text-gray-500">
                              Payment reminders and alerts
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.sms_notifications}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                sms_notifications: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-forest/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
                        </label>
                      </div>

                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={loading}
                        className="h-12 rounded-xl"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Preferences
                      </Button>
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
                <Card id="security" className="overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-forest/10">
                        <Shield className="h-5 w-5 text-forest" />
                      </div>
                      <div>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>
                          Manage your account security
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    {/* Change Password */}
                    <div className="p-5 border border-gray-200 rounded-xl hover:border-forest/30 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-amber-50">
                          <Lock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-charcoal mb-1">
                            Change Password
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Update your password regularly to keep your account secure
                          </p>
                          <Button variant="outline" size="sm" className="rounded-lg">
                            <Lock className="h-4 w-4 mr-2" />
                            Change Password
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    {profile && (
                      <div className="p-5 border border-gray-200 rounded-xl bg-gray-50/50">
                        <div className="flex items-center gap-2 mb-4">
                          <BadgeCheck className="h-5 w-5 text-forest" />
                          <h3 className="font-semibold text-charcoal">
                            Account Information
                          </h3>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                            <div className="p-2 rounded-lg bg-forest/10">
                              <Calendar className="h-4 w-4 text-forest" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Member since</p>
                              <p className="font-medium text-charcoal">
                                {new Date(profile.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric"
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                            <div className={`p-2 rounded-lg ${
                              profile.kyc_status?.toLowerCase() === "verified" 
                                ? "bg-green-50" 
                                : "bg-amber-50"
                            }`}>
                              <BadgeCheck className={`h-4 w-4 ${
                                profile.kyc_status?.toLowerCase() === "verified" 
                                  ? "text-green-600" 
                                  : "text-amber-600"
                              }`} />
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">KYC Status</p>
                              <p className={`font-medium capitalize ${
                                profile.kyc_status?.toLowerCase() === "verified" 
                                  ? "text-green-600" 
                                  : "text-amber-600"
                              }`}>
                                {profile.kyc_status || "Pending"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
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

