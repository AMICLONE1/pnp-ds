"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "pnp-cookie-consent";

type ConsentState = {
  essential: true;
  analytics: boolean;
  preferences: boolean;
  setAt: string;
};

function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

function writeConsent(state: ConsentState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [preferences, setPreferences] = useState(true);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
    }
  }, []);

  const persist = (analyticsVal: boolean, preferencesVal: boolean) => {
    writeConsent({
      essential: true,
      analytics: analyticsVal,
      preferences: preferencesVal,
      setAt: new Date().toISOString(),
    });
    setVisible(false);
    setShowPreferences(false);
  };

  const acceptAll = () => persist(true, true);
  const rejectNonEssential = () => persist(false, false);
  const savePreferences = () => persist(analytics, preferences);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:px-6 sm:pb-6"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <div className="mx-auto max-w-5xl rounded-2xl border border-gold/30 bg-white shadow-2xl overflow-hidden">
        {!showPreferences ? (
          <div className="p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10">
                <Cookie className="h-5 w-5 text-gold" />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                We use cookies to improve your experience on our website. By continuing to browse, you consent to our use of cookies as described in our{" "}
                <Link href="/cookies" className="text-gold hover:underline font-semibold">Cookie Policy</Link>.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-shrink-0">
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="rounded-full border border-gold/40 px-4 py-2 text-sm font-semibold text-black hover:bg-gold/10 transition-colors"
              >
                Manage Preferences
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition-colors shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-lg font-bold text-black">Cookie Preferences</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose which categories of cookies you allow. You can change this anytime from our{" "}
                  <Link href="/cookies" className="text-gold hover:underline">Cookie Policy</Link>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                aria-label="Close preferences"
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="font-semibold text-black text-sm">Essential Cookies</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Required for the site to function (authentication, security). Always on.
                  </p>
                </div>
                <input type="checkbox" checked disabled className="mt-1 h-4 w-4 accent-gold" />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-4 cursor-pointer">
                <div>
                  <p className="font-semibold text-black text-sm">Analytics Cookies</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Help us understand how users interact with our Service.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-gold"
                />
              </label>

              <label className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 p-4 cursor-pointer">
                <div>
                  <p className="font-semibold text-black text-sm">Preference Cookies</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Remember your settings and preferences across visits.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences}
                  onChange={(e) => setPreferences(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-gold"
                />
              </label>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-5">
              <button
                type="button"
                onClick={rejectNonEssential}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Reject Non-Essential
              </button>
              <button
                type="button"
                onClick={savePreferences}
                className="rounded-full bg-gold px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition-colors shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
