"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
        setEmail("");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-white to-gray-100 text-black">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Stay updated with PowerNetPro
          </h2>
          <p className="text-lg text-gray-100 mb-8">
            Get the latest updates on new projects, features, and energy savings tips
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-green-200">
              <CheckCircle className="h-5 w-5" />
              <p>Thank you for subscribing! Check your email for confirmation.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white text-black"
              />
              <Button
                type="submit"
                variant="secondary"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

