import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

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

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, allocation_id } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing payment details",
          },
        },
        { status: 400 }
      );
    }

    // Verify signature (skip for mock payments)
    const isMockPayment = razorpay_payment_id.startsWith("mock_payment_") || razorpay_signature === "mock_signature";
    
    if (!isMockPayment) {
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(text)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "INVALID_SIGNATURE", message: "Invalid payment signature" },
          },
          { status: 400 }
        );
      }
    }

    // Get existing payment first to preserve metadata
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("metadata")
      .eq("gateway_order_id", razorpay_order_id)
      .eq("user_id", user.id)
      .single();

    // Update payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({
        gateway_payment_id: razorpay_payment_id,
        metadata: {
          ...(existingPayment?.metadata || {}),
          razorpay_signature,
        },
        status: "COMPLETED",
      })
      .eq("gateway_order_id", razorpay_order_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "DB_ERROR", message: paymentError.message },
        },
        { status: 500 }
      );
    }

    // If payment is for allocation and allocation_id is provided, link them
    if (allocation_id && payment.type === "ALLOCATION") {
      // Get allocation details with capacity block info
      const { data: allocation, error: allocationError } = await supabase
        .from("allocations")
        .select(`
          id,
          capacity_kw,
          capacity_block_id,
          capacity_block:capacity_blocks(
            id,
            project_id,
            status
          )
        `)
        .eq("id", allocation_id)
        .eq("user_id", user.id)
        .single();

      if (allocationError || !allocation) {
        console.error("Error fetching allocation:", allocationError);
        return NextResponse.json(
          {
            success: false,
            error: { code: "DB_ERROR", message: "Failed to fetch allocation details" },
          },
          { status: 500 }
        );
      }

      // Check if allocation already has a payment (to prevent double-linking)
      if (allocation.payment_id && allocation.payment_id !== payment.id) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "ALREADY_LINKED", message: "Allocation already linked to another payment" },
          },
          { status: 400 }
        );
      }

      // Link payment to allocation
      const { error: linkError } = await supabase
        .from("allocations")
        .update({ payment_id: payment.id })
        .eq("id", allocation_id);

      if (linkError) {
        console.error("Error linking payment to allocation:", linkError);
        // Don't fail the payment verification, just log the error
      }

      // Ensure capacity block is marked as ALLOCATED
      if (allocation.capacity_block && allocation.capacity_block.status !== "ALLOCATED") {
        let adminClient;
        try {
          adminClient = createAdminClient();
        } catch (error: any) {
          console.error("Failed to create admin client:", error.message);
          // Continue without updating block status
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
            // Don't fail payment verification, just log
          }
        }
      }
    }

    // If payment is for a bill, update bill status
    if (payment.bill_id && payment.type === "BILL") {
      const { error: billUpdateError } = await supabase
        .from("bills")
        .update({
          status: "PAID",
          paid_at: new Date().toISOString(),
        })
        .eq("id", payment.bill_id)
        .eq("user_id", user.id);

      if (billUpdateError) {
        console.error("Error updating bill status:", billUpdateError);
        // Don't fail payment verification
      }
    }

    return NextResponse.json({
      success: true,
      data: payment,
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
