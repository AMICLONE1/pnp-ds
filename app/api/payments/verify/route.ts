import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

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

    // Verify signature
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

    // Update payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({
        razorpay_payment_id,
        razorpay_signature,
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

    // If payment is for allocation, activate it
    if (payment.allocation_id && payment.payment_type === "allocation") {
      await supabase
        .from("allocations")
        .update({
          status: "active",
          start_date: new Date().toISOString().split("T")[0],
        })
        .eq("id", payment.allocation_id);
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
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

