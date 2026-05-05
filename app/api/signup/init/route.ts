import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/security/passwordHash";
import { calculateAllocationPrice } from "@/lib/pricing";
import { checkRateLimit } from "@/lib/security/rateLimiter";
import {
  buildAllowedPaymentMethods,
  createCashfreeOrder,
  getCashfreeMode,
  getPublicAppId,
  isCashfreeConfigured,
} from "@/lib/payments/cashfree";

const initSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  state: z.string().max(60).optional().nullable(),
  discom: z.string().max(120).optional().nullable(),
  consumer_number: z.string().max(60).optional().nullable(),
  kyc_type: z.enum(["pan", "aadhaar"]).optional().nullable(),
  kyc_number: z.string().max(60).optional().nullable(),
  project_id: z.string().uuid(),
  capacity_kw: z.number().positive().max(1000),
});

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function getAppOrigin(request: Request) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    request.headers.get("origin") ||
    "http://localhost:3000"
  );
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(ip, "/api/auth/signup");
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many signup attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetTime - Date.now()) / 1000)) } }
      );
    }

    const parsed = initSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    const body = parsed.data;
    const email = body.email.trim().toLowerCase();

    const admin = createAdminClient();

    const { data: existingUser } = await admin
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    const { data: project, error: projectErr } = await admin
      .from("projects")
      .select("id, total_kw")
      .eq("id", body.project_id)
      .single();
    if (projectErr || !project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const { data: blocks } = await admin
      .from("capacity_blocks")
      .select("kw")
      .eq("project_id", body.project_id)
      .eq("status", "ALLOCATED");
    const used = (blocks || []).reduce((s: number, b: any) => s + Number(b.kw || 0), 0);
    const free = Number(project.total_kw) - used;
    if (body.capacity_kw > free + 1e-9) {
      return NextResponse.json(
        { success: false, error: `Only ${free.toFixed(2)} kW available for this project.` },
        { status: 409 }
      );
    }

    const price = calculateAllocationPrice(body.capacity_kw);
    if (!Number.isFinite(price.total) || price.total <= 0) {
      return NextResponse.json({ success: false, error: "Invalid pricing" }, { status: 400 });
    }

    const passwordHash = await hashPassword(body.password);

    await admin.from("pending_signups").delete().eq("email", email);

    const { data: pending, error: pendingErr } = await admin
      .from("pending_signups")
      .insert({
        email,
        password_hash: passwordHash,
        name: body.name.trim(),
        phone: body.phone,
        state: body.state || null,
        discom: body.discom || null,
        utility_consumer_number: body.consumer_number || null,
        kyc_type: body.kyc_type || null,
        kyc_number: body.kyc_number || null,
        project_id: body.project_id,
        capacity_kw: body.capacity_kw,
        amount_inr: price.total,
      })
      .select("id")
      .single();

    if (pendingErr || !pending) {
      console.error("signup/init: pending insert failed", pendingErr);
      return NextResponse.json({ success: false, error: "Could not start signup" }, { status: 500 });
    }

    if (!isCashfreeConfigured()) {
      return NextResponse.json(
        { success: false, error: "Payment gateway not configured" },
        { status: 503 }
      );
    }

    const orderId = `pnp_signup_${pending.id}`;
    const origin = getAppOrigin(request);

    const order = await createCashfreeOrder({
      order_id: orderId,
      order_amount: Math.round(price.total * 100) / 100,
      order_currency: "INR",
      customer_details: {
        // No auth user yet — synthesize a customer_id from the pending row.
        customer_id: `pending_${pending.id}`,
        customer_phone: body.phone,
        customer_email: email,
        customer_name: body.name.trim(),
      },
      order_meta: {
        return_url: `${origin}/signup?order_id=${orderId}`,
        notify_url: `${origin}/api/payments/webhook`,
        payment_methods: buildAllowedPaymentMethods(),
        invoice_date: new Date().toISOString(),
        invoice_id: `signup_${pending.id}`,
      },
      order_note: `${body.capacity_kw.toFixed(2)} kW solar reservation`,
      order_tags: {
        pending_signup_id: pending.id,
        capacity_kw: String(body.capacity_kw),
      },
    });

    await admin
      .from("pending_signups")
      .update({ gateway_order_id: order.order_id })
      .eq("id", pending.id);

    return NextResponse.json({
      success: true,
      data: {
        order_id: order.order_id,
        payment_session_id: order.payment_session_id,
        amount: order.order_amount,
        currency: order.order_currency,
        app_id: getPublicAppId(),
        mode: getCashfreeMode(),
        pending_signup_id: pending.id,
      },
    });
  } catch (err: any) {
    console.error("signup/init error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
