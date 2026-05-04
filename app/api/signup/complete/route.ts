import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateAllocationPrice } from "@/lib/pricing";
import { verifyPassword } from "@/lib/security/passwordHash";
import { fetchCashfreeOrder, fetchCashfreePayments } from "@/lib/payments/cashfree";

const completeSchema = z.object({
  order_id: z.string().min(1),
  password: z.string().min(8).max(128),
});

/**
 * Final step of the signup flow. Called by the browser after Cashfree Drop-in
 * reports success. We re-fetch the order from Cashfree (don't trust the client),
 * then create the auth user, allocation, capacity_block, payment row.
 */
export async function POST(request: Request) {
  try {
    const parsed = completeSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }
    const { order_id, password } = parsed.data;

    // 1. Verify with Cashfree directly.
    const order = await fetchCashfreeOrder(order_id);
    if (order.order_status !== "PAID") {
      return NextResponse.json(
        { success: false, error: `Payment is ${order.order_status}` },
        { status: 400 }
      );
    }
    const payments = await fetchCashfreePayments(order_id);
    const successful = payments.find((p) => p.payment_status === "SUCCESS");
    if (!successful) {
      return NextResponse.json(
        { success: false, error: "No successful payment found for this order" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // 2. Look up pending signup by order id.
    const { data: pending, error: pendingErr } = await admin
      .from("pending_signups")
      .select("*")
      .eq("gateway_order_id", order_id)
      .maybeSingle();

    if (pendingErr || !pending) {
      return NextResponse.json(
        { success: false, error: "Signup session not found" },
        { status: 404 }
      );
    }

    if (new Date(pending.expires_at) < new Date()) {
      await admin.from("pending_signups").delete().eq("id", pending.id);
      return NextResponse.json(
        { success: false, error: "Signup session expired. Please start again." },
        { status: 410 }
      );
    }

    // 3. Verify password matches the hash we stored at /init.
    const passwordOk = await verifyPassword(password, pending.password_hash);
    if (!passwordOk) {
      return NextResponse.json(
        { success: false, error: "Password mismatch" },
        { status: 400 }
      );
    }

    // 4. Re-verify pricing.
    const expectedPrice = calculateAllocationPrice(Number(pending.capacity_kw));
    if (Math.abs(expectedPrice.total - Number(pending.amount_inr)) > 0.01) {
      return NextResponse.json(
        { success: false, error: "Pricing mismatch — please retry signup" },
        { status: 400 }
      );
    }

    // 5. Re-check email isn't taken.
    const { data: existingUser } = await admin
      .from("users")
      .select("id")
      .eq("email", pending.email)
      .maybeSingle();
    if (existingUser) {
      await admin.from("pending_signups").delete().eq("id", pending.id);
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // 6. Create the auth user.
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: pending.email,
      password,
      email_confirm: true,
      user_metadata: { name: pending.name, phone: pending.phone },
    });

    if (authError || !authData?.user) {
      console.error("signup/complete: createUser failed", authError);
      return NextResponse.json(
        { success: false, error: authError?.message || "Failed to create account" },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    const rollback = async () => {
      await admin.from("payments").delete().eq("user_id", userId);
      await admin.from("allocations").delete().eq("user_id", userId);
      await admin.from("users").delete().eq("id", userId);
      await admin.auth.admin.deleteUser(userId).catch(() => {});
    };

    try {
      const kycType = (pending.kyc_type || "").toLowerCase();
      const { error: mirrorErr } = await admin.from("users").insert({
        id: userId,
        email: pending.email,
        name: pending.name,
        phone: pending.phone,
        state: pending.state,
        discom: pending.discom,
        utility_consumer_number: pending.utility_consumer_number,
        kyc_status: pending.kyc_number ? "PENDING" : "PENDING",
        aadhaar_number: kycType === "aadhaar" ? pending.kyc_number || null : null,
        pan_number: kycType === "pan" ? pending.kyc_number || null : null,
      });
      if (mirrorErr && !mirrorErr.message?.includes("duplicate")) throw mirrorErr;

      const { data: block, error: blockErr } = await admin
        .from("capacity_blocks")
        .insert({
          project_id: pending.project_id,
          kw: Number(pending.capacity_kw),
          status: "ALLOCATED",
          allocated_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (blockErr || !block) throw blockErr || new Error("block insert failed");

      const { data: payment, error: payErr } = await admin
        .from("payments")
        .insert({
          user_id: userId,
          amount: Number(pending.amount_inr),
          type: "ALLOCATION",
          gateway: "CASHFREE",
          status: "COMPLETED",
          gateway_order_id: order_id,
          gateway_payment_id: successful.cf_payment_id,
          metadata: {
            payment_type: "ALLOCATION",
            capacity_kw: Number(pending.capacity_kw),
            project_id: pending.project_id,
            cf_payment_id: successful.cf_payment_id,
            payment_method: successful.payment_method,
          },
        })
        .select("id")
        .single();
      if (payErr || !payment) throw payErr || new Error("payment insert failed");

      const { error: allocErr } = await admin.from("allocations").insert({
        user_id: userId,
        capacity_block_id: block.id,
        capacity_kw: Number(pending.capacity_kw),
        payment_id: payment.id,
      });
      if (allocErr) throw allocErr;

      await admin.from("pending_signups").delete().eq("id", pending.id);

      return NextResponse.json({
        success: true,
        data: { email: pending.email },
      });
    } catch (err: any) {
      console.error("signup/complete: post-auth failure, rolling back", err);
      await rollback();
      return NextResponse.json(
        { success: false, error: err?.message || "Failed to finalize signup" },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("signup/complete error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
