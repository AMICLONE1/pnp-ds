"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, KeyRound, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

interface HostProvisionCardProps {
  onCreated?: () => void;
}

export function HostProvisionCard({ onCreated }: HostProvisionCardProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    business_name: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const businessName = formData.business_name.trim();
    const contactName = formData.contact_name.trim();
    const contactEmail = formData.contact_email.trim().toLowerCase();
    const contactPhone = formData.contact_phone.trim();
    const password = formData.password;

    if (!businessName || !contactName || !contactEmail || !contactPhone || !password) {
      setError("All fields are required to provision a host account.");
      return;
    }

    if (password.length < 12) {
      setError("Use at least 12 characters for the initial password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/hosts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          business_name: businessName,
          contact_name: contactName,
          contact_email: contactEmail,
          contact_phone: contactPhone,
          password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : result.error?.message || "Failed to provision host"
        );
      }

      showToast("success", "Host account created successfully");
      setFormData({
        business_name: "",
        contact_name: "",
        contact_email: "",
        contact_phone: "",
        password: "",
      });
      onCreated?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to provision host";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="border border-emerald-200 bg-emerald-50/40 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            Provision Host Account
          </CardTitle>
          <p className="text-sm text-emerald-900/70">
            Create the host login, active host profile, and secure initial password from one place.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-emerald-950 mb-2">
                <Building2 className="h-4 w-4 text-emerald-700" />
                Business Name
              </label>
              <Input
                value={formData.business_name}
                onChange={(event) => setFormData({ ...formData, business_name: event.target.value })}
                placeholder="Vedvyas Solar Park LLP"
                className="h-11 rounded-xl bg-white"
                disabled={loading}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-emerald-950 mb-2">
                <User className="h-4 w-4 text-emerald-700" />
                Contact Name
              </label>
              <Input
                value={formData.contact_name}
                onChange={(event) => setFormData({ ...formData, contact_name: event.target.value })}
                placeholder="Rajesh Patel"
                className="h-11 rounded-xl bg-white"
                disabled={loading}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-emerald-950 mb-2">
                <Mail className="h-4 w-4 text-emerald-700" />
                Email
              </label>
              <Input
                type="email"
                value={formData.contact_email}
                onChange={(event) => setFormData({ ...formData, contact_email: event.target.value })}
                placeholder="host@example.com"
                className="h-11 rounded-xl bg-white"
                disabled={loading}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-emerald-950 mb-2">
                <Phone className="h-4 w-4 text-emerald-700" />
                Phone
              </label>
              <Input
                value={formData.contact_phone}
                onChange={(event) => setFormData({ ...formData, contact_phone: event.target.value })}
                placeholder="+91 98765 43210"
                className="h-11 rounded-xl bg-white"
                disabled={loading}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-emerald-950 mb-2">
                <KeyRound className="h-4 w-4 text-emerald-700" />
                Temporary Password
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                placeholder="12+ characters"
                className="h-11 rounded-xl bg-white"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-emerald-900/70">
                  The host is created as ACTIVE so they can sign in immediately. Share the credentials securely.
                </p>
                <Button type="submit" isLoading={loading} className="sm:w-auto">
                  Create Host
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}