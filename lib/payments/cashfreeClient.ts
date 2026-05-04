"use client";

declare global {
  interface Window {
    Cashfree: any;
  }
}

const SDK_URL = "https://sdk.cashfree.com/js/v3/cashfree.js";

let loaderPromise: Promise<boolean> | null = null;

export function loadCashfreeSdk(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Cashfree) return Promise.resolve(true);
  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SDK_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return loaderPromise;
}

export type LaunchOptions = {
  paymentSessionId: string;
  mode: "sandbox" | "production";
  redirectTarget?: "_self" | "_modal";
};

export type LaunchResult = {
  status: "success" | "failed" | "dismissed";
  error?: string;
};

export async function launchCashfreeCheckout(opts: LaunchOptions): Promise<LaunchResult> {
  const loaded = await loadCashfreeSdk();
  if (!loaded || !window.Cashfree) {
    return { status: "failed", error: "Cashfree SDK could not be loaded" };
  }

  const cashfree = window.Cashfree({ mode: opts.mode });

  return new Promise<LaunchResult>((resolve) => {
    cashfree
      .checkout({
        paymentSessionId: opts.paymentSessionId,
        redirectTarget: opts.redirectTarget || "_modal",
      })
      .then((result: any) => {
        if (result?.error) {
          resolve({ status: "failed", error: result.error.message || "Payment failed" });
          return;
        }
        if (result?.redirect) {
          // Browser is being redirected by the SDK; nothing more to do here.
          resolve({ status: "success" });
          return;
        }
        if (result?.paymentDetails) {
          resolve({ status: "success" });
          return;
        }
        resolve({ status: "dismissed" });
      })
      .catch((err: any) => {
        resolve({ status: "failed", error: err?.message || "Cashfree checkout error" });
      });
  });
}
