import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { fetchCashfreeOrder, fetchCashfreePayments } from "@/lib/payments/cashfree";

const verifyPaymentSchema = z.object({
  order_id: z.string().min(1),
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
        { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
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

    const { order_id } = body.data;

    const { data: payment, error: paymentFetchError } = await supabase
      .from("payments")
      .select("id, amount, type, bill_id, status, metadata")
      .eq("gateway_order_id", order_id)
      .eq("user_id", user.id)
      .single();

    if (paymentFetchError || !payment) {
      return NextResponse.json(
        { success: false, error: { code: "PAYMENT_NOT_FOUND", message: "Payment order not found" } },
        { status: 404 }
      );
    }

    // Idempotency: already activated, return success.
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

    // Authoritative status comes from Cashfree directly. We don't trust the
    // client to claim success — we re-fetch the order and its payment(s).
    const order = await fetchCashfreeOrder(order_id);

    if (order.order_status !== "PAID") {
      return NextResponse.json({
        success: false,
        error: {
          code: "PAYMENT_NOT_COMPLETED",
          message: `Payment is ${order.order_status}`,
        },
        data: { order_status: order.order_status },
      }, { status: 400 });
    }

    const payments = await fetchCashfreePayments(order_id);
    const successful = payments.find((p) => p.payment_status === "SUCCESS");

    if (!successful) {
      return NextResponse.json(
        { success: false, error: { code: "PAYMENT_NOT_COMPLETED", message: "No successful payment found for this order" } },
        { status: 400 }
      );
    }

    const existingMetadata = (payment.metadata || {}) as Record<string, unknown>;
    const { data: verifiedPayment, error: paymentUpdateError } = await supabase
      .from("payments")
      .update({
        gateway_payment_id: successful.cf_payment_id,
        metadata: {
          ...existingMetadata,
          cf_payment_id: successful.cf_payment_id,
          payment_method: successful.payment_method,
          payment_time: successful.payment_time,
          bank_reference: successful.bank_reference,
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
            error: { code: "MISSING_METADATA", message: "Allocation reference missing from payment metadata" },
          },
          { status: 400 }
        );
      }

      const { data: allocation, error: allocationError } = await supabase
        .from("allocations")
        .select(
          `id, capacity_block_id, payment_id, capacity_block:capacity_blocks(id, status)`
        )
        .eq("id", allocationId)
        .eq("user_id", user.id)
        .single();

      if (allocationError || !allocation) {
        return NextResponse.json(
          { success: false, error: { code: "DB_ERROR", message: "Failed to fetch allocation details" } },
          { status: 500 }
        );
      }

      if (allocation.payment_id && allocation.payment_id !== verifiedPayment.id) {
        return NextResponse.json(
          { success: false, error: { code: "ALREADY_LINKED", message: "Allocation already linked to another payment" } },
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
          { success: false, error: { code: "MISSING_METADATA", message: "Bill reference missing from payment record" } },
          { status: 400 }
        );
      }

      const { error: billUpdateError } = await supabase
        .from("bills")
        .update({ status: "PAID", paid_at: new Date().toISOString() })
        .eq("id", billId)
        .eq("user_id", user.id);

      if (billUpdateError) {
        console.error("Error updating bill status:", billUpdateError);
      }
    }

    return NextResponse.json({ success: true, data: verifiedPayment });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: error.message || "Failed to verify payment" },
      },
      { status: 500 }
    );
  }
}
