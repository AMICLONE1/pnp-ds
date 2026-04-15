import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Not authenticated" },
        },
        { status: 401 }
      );
    }

    const body = verifyPaymentSchema.safeParse(await request.json());

    if (!body.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: body.error.errors.map((item) => item.message).join(", "),
          },
        },
        { status: 400 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body.data;
    const allowMockPayments = process.env.NODE_ENV !== "production";
    const isMockPayment =
      allowMockPayments &&
      (razorpay_payment_id.startsWith("mock_payment_") || razorpay_signature === "mock_signature");

    if (!isMockPayment) {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "PAYMENT_GATEWAY_UNAVAILABLE",
              message: "Payment gateway is not configured",
            },
          },
          { status: 503 }
        );
      }

      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");

      // Constant-time compare to avoid signature timing oracles.
      const a = Buffer.from(generatedSignature, "utf8");
      const b = Buffer.from(razorpay_signature, "utf8");
      if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "INVALID_SIGNATURE", message: "Invalid payment signature" },
          },
          { status: 400 }
        );
      }
    }

    const { data: payment, error: paymentFetchError } = await supabase
      .from("payments")
      .select("id, amount, type, bill_id, status, metadata")
      .eq("gateway_order_id", razorpay_order_id)
      .eq("user_id", user.id)
      .single();

    if (paymentFetchError || !payment) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "PAYMENT_NOT_FOUND", message: "Payment order not found" },
        },
        { status: 404 }
      );
    }

    // Idempotency: if this payment is already COMPLETED, return success without
    // re-running the activation side-effects (prevents replay double-credits).
    if (payment.status === "COMPLETED") {
      return NextResponse.json({ success: true, data: payment });
    }

    if (payment.type === "MONTHLY") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNSUPPORTED_PAYMENT_TYPE",
            message: "Monthly host payments must be verified through /api/host/payments/verify",
          },
        },
        { status: 400 }
      );
    }

    const existingMetadata = (payment.metadata || {}) as Record<string, unknown>;
    const { data: verifiedPayment, error: paymentUpdateError } = await supabase
      .from("payments")
      .update({
        gateway_payment_id: razorpay_payment_id,
        metadata: {
          ...existingMetadata,
          razorpay_signature,
        },
        status: "COMPLETED",
      })
      .eq("id", payment.id)
      .select()
      .single();

    if (paymentUpdateError || !verifiedPayment) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "DB_ERROR", message: paymentUpdateError?.message || "Failed to update payment" },
        },
        { status: 500 }
      );
    }

    if (payment.type === "ALLOCATION") {
      const allocationId = String(existingMetadata.allocation_id || "");

      if (!allocationId) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "MISSING_METADATA",
              message: "Allocation reference missing from payment metadata",
            },
          },
          { status: 400 }
        );
      }

      const { data: allocation, error: allocationError } = await supabase
        .from("allocations")
        .select(
          `id, capacity_block_id, payment_id, capacity_block:capacity_blocks(
            id,
            status
          )`
        )
        .eq("id", allocationId)
        .eq("user_id", user.id)
        .single();

      if (allocationError || !allocation) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "DB_ERROR", message: "Failed to fetch allocation details" },
          },
          { status: 500 }
        );
      }

      if (allocation.payment_id && allocation.payment_id !== verifiedPayment.id) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "ALREADY_LINKED",
              message: "Allocation already linked to another payment",
            },
          },
          { status: 409 }
        );
      }

      const { error: linkError } = await supabase
        .from("allocations")
        .update({ payment_id: verifiedPayment.id })
        .eq("id", allocationId)
        .eq("user_id", user.id);

      if (linkError) {
        console.error("Error linking payment to allocation:", linkError);
      }

      const capacityBlock = Array.isArray(allocation.capacity_block)
        ? allocation.capacity_block[0]
        : allocation.capacity_block;

      if (capacityBlock && capacityBlock.status !== "ALLOCATED") {
        let adminClient;

        try {
          adminClient = createAdminClient();
        } catch (error: any) {
          console.error("Failed to create admin client:", error.message);
        }

        if (adminClient) {
          const { error: updateBlockError } = await adminClient
            .from("capacity_blocks")
            .update({
              status: "ALLOCATED",
              allocated_at: new Date().toISOString(),
            })
            .eq("id", allocation.capacity_block_id);

          if (updateBlockError) {
            console.error("Error updating capacity block status:", updateBlockError);
          }
        }
      }
    }

    if (payment.type === "BILL") {
      const billId = payment.bill_id || String(existingMetadata.bill_id || "");

      if (!billId) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "MISSING_METADATA",
              message: "Bill reference missing from payment record",
            },
          },
          { status: 400 }
        );
      }

      const { error: billUpdateError } = await supabase
        .from("bills")
        .update({
          status: "PAID",
          paid_at: new Date().toISOString(),
        })
        .eq("id", billId)
        .eq("user_id", user.id);

      if (billUpdateError) {
        console.error("Error updating bill status:", billUpdateError);
      }
    }

    return NextResponse.json({
      success: true,
      data: verifiedPayment,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to verify payment",
        },
      },
      { status: 500 }
    );
  }
}
