import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateAllocationPrice } from "@/lib/pricing";
import { verifyPassword } from "@/lib/security/passwordHash";

const completeSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  password: z.string().min(8).max(128),
});

/**
 * Final step of the signup flow. Called by the Razorpay handler after a
 * successful payment. The browser passes back the user's plaintext password
 * (re-supplied from in-memory state on the same page) so we can hand it to
 * supabase.auth.admin.createUser. We re-verify it against the stored hash from
 * /init to make sure the session hasn't been tampered with.
 *
 * On success: creates auth user, allocation, capacity_block, payment row, then
 * deletes the pending_signups row. Returns success — the client then signs in
 * via /api/auth/login and is redirected to /dashboard.
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, password } = parsed.data;

    const allowMock = process.env.NODE_ENV !== "production";
    const isMock =
      allowMock &&
      (razorpay_payment_id.startsWith("mock_payment_") || razorpay_signature === "mock_signature");

    // 1. Verify Razorpay signature (HMAC-SHA256, constant-time compare).
    if (!isMock) {
      const secret = process.env.RAZORPAY_KEY_SECRET;
      if (!secret) {
        return NextResponse.json(
          { success: false, error: "Payment gateway not configured" },
          { status: 503 }
        );
      }
      const expected = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      const a = Buffer.from(expected, "utf8");
      const b = Buffer.from(razorpay_signature, "utf8");
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return NextResponse.json(
          { success: false, error: "Invalid payment signature" },
          { status: 400 }
        );
      }
    }

    const admin = createAdminClient();

    // 2. Look up pending signup by order id.
    const { data: pending, error: pendingErr } = await admin
      .from("pending_signups")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
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

    // 3. Verify the plaintext password the client just supplied matches the
    //    hash recorded during /init. This stops a hijacked tab from completing
    //    someone else's signup with a different password.
    const passwordOk = await verifyPassword(password, pending.password_hash);
    if (!passwordOk) {
      return NextResponse.json(
        { success: false, error: "Password mismatch" },
        { status: 400 }
      );
    }

    // 4. Re-verify pricing (defense against tampered amount in pending row).
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

    // 6. Create the auth user. From here on, any failure must roll back the
    //    auth user so we don't leave an orphan.
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
      // 7. Mirror into public.users. The table stores Aadhaar / PAN in
      //    dedicated columns rather than a generic kyc_document_* pair.
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

      // 8. Create a fresh capacity_block sized exactly to the requested kW.
      //    The DB trigger enforce_project_capacity_trigger guards total project capacity.
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

      // 9. Create payment row first (allocation FK depends on payment_id).
      const { data: payment, error: payErr } = await admin
        .from("payments")
        .insert({
          user_id: userId,
          amount: Number(pending.amount_inr),
          type: "ALLOCATION",
          gateway: "RAZORPAY",
          status: "COMPLETED",
          gateway_order_id: razorpay_order_id,
          gateway_payment_id: razorpay_payment_id,
          metadata: {
            payment_type: "ALLOCATION",
            capacity_kw: Number(pending.capacity_kw),
            project_id: pending.project_id,
            razorpay_signature,
          },
        })
        .select("id")
        .single();
      if (payErr || !payment) throw payErr || new Error("payment insert failed");

      // 10. Create allocation linked to block + payment.
      const { error: allocErr } = await admin.from("allocations").insert({
        user_id: userId,
        capacity_block_id: block.id,
        capacity_kw: Number(pending.capacity_kw),
        payment_id: payment.id,
      });
      if (allocErr) throw allocErr;

      // 11. Wipe the pending row.
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
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
