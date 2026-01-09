"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileUpdateSchema } from "@/lib/validations";
import { User, Bell, Shield } from "lucide-react";

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
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2 text-charcoal">
              Settings
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Navigation */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    <a
                      href="#profile"
                      className="block px-4 py-2 rounded-lg bg-forest/10 text-forest font-medium"
                    >
                      Profile
                    </a>
                    <a
                      href="#notifications"
                      className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      Notifications
                    </a>
                    <a
                      href="#security"
                      className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      Security
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Section */}
              <Card id="profile">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-forest" />
                    <CardTitle>Profile Information</CardTitle>
                  </div>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="text"
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={loading}
                    />
                    <Input
                      type="tel"
                      label="Phone Number"
                      placeholder="10-digit mobile number"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={loading}
                    />
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="flex h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                        {success}
                      </div>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={loading}
                    >
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Notifications Section */}
              <Card id="notifications">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-forest" />
                    <CardTitle>Notification Preferences</CardTitle>
                  </div>
                  <CardDescription>
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="font-medium text-charcoal">
                          Email Notifications
                        </label>
                        <p className="text-sm text-gray-600">
                          Receive updates via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.email_notifications}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email_notifications: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-forest focus:ring-forest rounded"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <label className="font-medium text-charcoal">
                          SMS Notifications
                        </label>
                        <p className="text-sm text-gray-600">
                          Receive updates via SMS
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.sms_notifications}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sms_notifications: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-forest focus:ring-forest rounded"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={loading}
                    >
                      Save Preferences
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Security Section */}
              <Card id="security">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-forest" />
                    <CardTitle>Security</CardTitle>
                  </div>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-charcoal mb-2">
                      Change Password
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Update your password to keep your account secure
                    </p>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                  {profile && (
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium text-charcoal mb-2">
                        Account Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member since:</span>
                          <span className="font-medium">
                            {new Date(profile.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">KYC Status:</span>
                          <span className="font-medium capitalize">
                            {profile.kyc_status || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

