import crypto from "crypto";

export type CashfreeMode = "sandbox" | "production";

export type CashfreeCustomer = {
  customer_id: string;
  customer_phone: string;
  customer_email?: string;
  customer_name?: string;
};

export type CashfreeOrderRequest = {
  order_id: string;
  order_amount: number;
  order_currency?: string;
  customer_details: CashfreeCustomer;
  order_meta?: {
    return_url?: string;
    notify_url?: string;
    payment_methods?: string;
    // Some Cashfree merchant accounts have "Invoice details required" turned
    // on (a sandbox/feature flag) which makes these mandatory on every order
    // create. Sending them unconditionally is harmless when the flag is off.
    invoice_date?: string;
    invoice_id?: string;
  };
  order_note?: string;
  order_tags?: Record<string, string>;
};

export type CashfreeOrderResponse = {
  cf_order_id: string;
  order_id: string;
  payment_session_id: string;
  order_status: string;
  order_amount: number;
  order_currency: string;
};

export type CashfreePaymentStatus =
  | "SUCCESS"
  | "FAILED"
  | "PENDING"
  | "USER_DROPPED"
  | "VOID"
  | "CANCELLED"
  | "FLAGGED"
  | "NOT_ATTEMPTED";

const API_VERSION = "2023-08-01";

function getMode(): CashfreeMode {
  return process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ? "production" : "sandbox";
}

function getBaseUrl() {
  return getMode() === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

export function isCashfreeConfigured() {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
}

export function getCashfreeMode(): CashfreeMode {
  return getMode();
}

export function getPublicAppId() {
  return process.env.CASHFREE_APP_ID || "";
}

async function cashfreeFetch<T>(
  path: string,
  init: { method: string; body?: unknown; headers?: Record<string, string> }
): Promise<T> {
  if (!isCashfreeConfigured()) {
    throw new Error("Cashfree credentials are not configured");
  }

  const headers: Record<string, string> = {
    "x-client-id": process.env.CASHFREE_APP_ID!,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
    "x-api-version": API_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const res = await fetch(`${getBaseUrl()}${path}`, {
    method: init.method,
    headers: { ...headers, ...(init.headers || {}) },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // non-JSON response
  }

  if (!res.ok) {
    const message = json?.message || json?.error_description || `Cashfree API error (${res.status})`;
    const code = json?.code || `HTTP_${res.status}`;
    // Log only what we need to diagnose — never the request body. The body
    // contains customer phone, email, name, GSTIN and other PII that must
    // not end up in Vercel runtime logs.
    const sentBodyShape =
      init.body && typeof init.body === "object"
        ? Object.keys(init.body as Record<string, unknown>)
        : undefined;
    console.error("[Cashfree] request failed", {
      path,
      status: res.status,
      code,
      message,
      sentBodyKeys: sentBodyShape,
      response_code: json?.code,
      response_type: json?.type,
    });
    const err = new Error(message) as Error & { code?: string; status?: number; raw?: any };
    err.code = code;
    err.status = res.status;
    err.raw = json;
    throw err;
  }

  return json as T;
}

export function createCashfreeOrder(payload: CashfreeOrderRequest) {
  // Some Cashfree merchant accounts (sandbox especially) require every order
  // to carry `invoice_date` and `invoice_number`. Per Cashfree's API docs,
  // these belong as custom string key-value pairs inside `order_tags`, NOT as
  // top-level fields and NOT inside order_meta. Cashfree validates the date
  // as ISO 8601 (e.g. 2021-07-02T10:20:12Z) — `YYYY-MM-DD` alone is rejected.
  const invoiceDate =
    payload.order_meta?.invoice_date || new Date().toISOString();
  const invoiceNumber = payload.order_meta?.invoice_id || payload.order_id;

  // Strip our internal invoice_date/invoice_id from order_meta — Cashfree's
  // order_meta schema doesn't include them and may reject unknown fields.
  const { invoice_date: _omitDate, invoice_id: _omitId, ...cleanedOrderMeta } =
    payload.order_meta || {};

  const enriched: any = {
    ...payload,
    order_meta: cleanedOrderMeta,
    order_tags: {
      ...(payload.order_tags || {}),
      invoice_date: invoiceDate,
      invoice_number: invoiceNumber,
      invoice_name: payload.order_note || invoiceNumber,
      // Cashfree's "Invoice details required" flag enforces a `gst` field
      // (GST amount, not GSTIN). order_tags values must be strings, but
      // Cashfree validates this as a number — and rejects zero or values
      // under ~₹1. Compute a notional 18% slice and floor it at ₹1.
      gst: Math.max(1, Math.round((payload.order_amount * 18) / 118 * 100) / 100).toFixed(2),
      // GSTIN is sourced from CASHFREE_GSTIN env var. In production this
      // is required; locally we fall back to a syntactically-valid
      // placeholder via getCashfreeGstin().
      gstin: getCashfreeGstin(),
    },
  };

  return cashfreeFetch<CashfreeOrderResponse>("/orders", {
    method: "POST",
    body: enriched,
  });
}

export function fetchCashfreeOrder(orderId: string) {
  return cashfreeFetch<CashfreeOrderResponse & { order_status: string }>(
    `/orders/${encodeURIComponent(orderId)}`,
    { method: "GET" }
  );
}

export type CashfreePaymentEntity = {
  cf_payment_id: string;
  order_id: string;
  payment_status: CashfreePaymentStatus;
  payment_amount: number;
  payment_currency: string;
  payment_method?: any;
  payment_group?: string;
  payment_time?: string;
  bank_reference?: string;
  auth_id?: string;
};

export function fetchCashfreePayments(orderId: string) {
  return cashfreeFetch<CashfreePaymentEntity[]>(
    `/orders/${encodeURIComponent(orderId)}/payments`,
    { method: "GET" }
  );
}

export type CashfreeRefundRequest = {
  refund_amount: number;
  refund_id: string;
  refund_note?: string;
  refund_speed?: "STANDARD" | "INSTANT";
};

export type CashfreeRefundResponse = {
  cf_refund_id: string;
  refund_id: string;
  order_id: string;
  refund_amount: number;
  refund_currency: string;
  refund_status: "SUCCESS" | "PENDING" | "ONHOLD" | "CANCELLED";
  refund_note?: string;
};

export function createCashfreeRefund(orderId: string, payload: CashfreeRefundRequest) {
  return cashfreeFetch<CashfreeRefundResponse>(
    `/orders/${encodeURIComponent(orderId)}/refunds`,
    { method: "POST", body: payload }
  );
}

/**
 * Verify the signature on a Cashfree webhook payload.
 *
 * Cashfree signs webhooks with HMAC-SHA256 over `timestamp + rawBody`, base64-encoded.
 * Caller MUST pass the raw request body — do not parse and re-stringify, the
 * signature will not match.
 */
export function verifyCashfreeWebhook(rawBody: string, timestamp: string, signature: string) {
  const secret = process.env.CASHFREE_WEBHOOK_SECRET || process.env.CASHFREE_SECRET_KEY;
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}${rawBody}`)
    .digest("base64");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature, "utf8");
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function buildAllowedPaymentMethods() {
  // Server controls which methods are offered at checkout. Wallets/pay-later are
  // intentionally excluded per current product decision.
  return "cc,dc,upi,nb";
}

// Syntactically-valid placeholder GSTIN used only in non-production. In
// production, CASHFREE_GSTIN must be set to the merchant's real registered
// GSTIN — we fail closed if it is missing so we never ship test data into
// real Cashfree orders.
const PLACEHOLDER_GSTIN = "27AAAAA0000A1Z5";

export function getCashfreeGstin(): string {
  const fromEnv = (process.env.CASHFREE_GSTIN || "").trim();
  if (fromEnv) return fromEnv;
  if (process.env.NEXT_PUBLIC_CASHFREE_MODE === "production") {
    throw new Error(
      "CASHFREE_GSTIN env var is required in production. Set it to the merchant's registered GSTIN."
    );
  }
  return PLACEHOLDER_GSTIN;
}
