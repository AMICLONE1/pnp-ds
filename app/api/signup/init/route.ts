import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashPassword } from "@/lib/security/passwordHash";
import { calculateAllocationPrice } from "@/lib/pricing";
import { checkRateLimit } from "@/lib/security/rateLimiter";

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

function initRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  try {
    const Razorpay = require("razorpay");
    return new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  } catch {
    return null;
  }
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    // Rate limit by IP — 3 signup inits per hour (matches existing config)
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

    // 1. Reject if a confirmed auth user with this email already exists.
    //    We probe via the public.users mirror table (cheaper than listing auth users).
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

    // 2. Verify project exists and has enough free capacity.
    const { data: project, error: projectErr } = await admin
      .from("projects")
      .select("id, total_kw")
      .eq("id", body.project_id)
      .single();
    if (projectErr || !project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    // Only ALLOCATED blocks actually consume capacity. Legacy AVAILABLE seed
    // rows from the old shared-block model are ignored under the virtual
    // booking model (one fresh block per allocation).
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

    // 3. Compute server-authoritative price.
    const price = calculateAllocationPrice(body.capacity_kw);
    if (!Number.isFinite(price.total) || price.total <= 0) {
      return NextResponse.json({ success: false, error: "Invalid pricing" }, { status: 400 });
    }

    // 4. Hash password and persist pending row.
    const passwordHash = await hashPassword(body.password);

    // Drop any prior pending rows for this email (user retried).
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

    // 5. Create Razorpay order. Mock fallback for local dev only.
    const razorpay = initRazorpay();
    let orderId: string;
    let mock = false;
    if (razorpay) {
      const order = await razorpay.orders.create({
        amount: Math.round(price.total * 100),
        currency: "INR",
        receipt: `su_${pending.id.replace(/-/g, "")}`.slice(0, 40),
        notes: {
          pending_signup_id: pending.id,
          email,
          capacity_kw: String(body.capacity_kw),
        },
      });
      orderId = order.id;
    } else {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { success: false, error: "Payment gateway not configured" },
          { status: 503 }
        );
      }
      orderId = `order_mock_${Date.now()}_${pending.id.slice(0, 8)}`;
      mock = true;
    }

    await admin
      .from("pending_signups")
      .update({ razorpay_order_id: orderId })
      .eq("id", pending.id);

    return NextResponse.json({
      success: true,
      data: {
        order_id: orderId,
        amount: Math.round(price.total * 100),
        currency: "INR",
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        pending_signup_id: pending.id,
        mock,
      },
    });
  } catch (err: any) {
    console.error("signup/init error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
