import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Initialize Razorpay only if keys are available
function initRazorpay() {
  try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      // Dynamic require to avoid build errors if package not installed
      const Razorpay = require("razorpay");
      return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
  } catch (error) {
    // Razorpay package not installed or not configured
    console.warn("Razorpay not configured:", error);
  }
  return null;
}

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
    const { amount, allocation_id, payment_type } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Invalid amount" },
        },
        { status: 400 }
      );
    }

    // Create payment record first
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        allocation_id: allocation_id || null,
        amount,
        currency: "INR",
        status: "PENDING",
        payment_type: payment_type || "allocation",
      })
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

    // Create Razorpay order if configured
    const razorpayInstance = initRazorpay();
    if (!razorpayInstance) {
      // Return mock order if Razorpay not configured
      return NextResponse.json({
        success: true,
        data: {
          order_id: `order_mock_${Date.now()}`,
          amount: Math.round(amount * 100),
          currency: "INR",
          payment_id: payment.id,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          mock: true,
        },
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        user_id: user.id,
        allocation_id: allocation_id || null,
        payment_type: payment_type || "allocation",
      },
    };

    const order = await razorpayInstance.orders.create(options);

    // Update payment with order ID
    await supabase
      .from("payments")
      .update({
        gateway_order_id: order.id,
      })
      .eq("id", payment.id);

    return NextResponse.json({
      success: true,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        payment_id: payment.id,
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        mock: false,
      },
    });
  } catch (error: any) {
    console.error("Payment error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PAYMENT_ERROR",
          message: error.message || "Failed to create payment order",
        },
      },
      { status: 500 }
    );
  }
}
