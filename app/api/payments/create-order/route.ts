import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { calculateAllocationPrice } from "@/lib/pricing";

const createPaymentSchema = z.object({
  allocation_id: z.string().uuid().optional(),
  bill_id: z.string().uuid().optional(),
  payment_type: z.enum(["ALLOCATION", "MONTHLY", "BILL"]),
});

function initRazorpay() {
  try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const Razorpay = require("razorpay");
      return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
    }
  } catch (error) {
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

    const body = createPaymentSchema.safeParse(await request.json());

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

    const { allocation_id, bill_id, payment_type } = body.data;

    if (payment_type === "MONTHLY") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNSUPPORTED_PAYMENT_TYPE",
            message: "Monthly host payments must use /api/host/payments/create-order",
          },
        },
        { status: 400 }
      );
    }

    let amount = 0;
    const paymentMetadata: Record<string, unknown> = {
      payment_type,
    };
    let billIdToPersist: string | null = null;

    if (payment_type === "ALLOCATION") {
      if (!allocation_id) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "allocation_id is required for allocation payments",
            },
          },
          { status: 400 }
        );
      }

      const { data: allocation, error: allocationError } = await supabase
        .from("allocations")
        .select("id, payment_id, capacity_kw")
        .eq("id", allocation_id)
        .eq("user_id", user.id)
        .single();

      if (allocationError || !allocation) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "ALLOCATION_NOT_FOUND", message: "Allocation not found" },
          },
          { status: 404 }
        );
      }

      if (allocation.payment_id) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "ALREADY_LINKED", message: "Allocation already has a linked payment" },
          },
          { status: 409 }
        );
      }

      // Server-authoritative price: setup cost (with bulk discount) + platform fee + GST.
      // Mirrors lib/pricing.ts so client and server agree on the total.
      const price = calculateAllocationPrice(Number(allocation.capacity_kw));
      amount = price.total;

      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "INVALID_AMOUNT", message: "Could not calculate allocation payment amount" },
          },
          { status: 400 }
        );
      }

      paymentMetadata.allocation_id = allocation_id;
      paymentMetadata.capacity_kw = allocation.capacity_kw;
      paymentMetadata.price_breakdown = price;
    }

    if (payment_type === "BILL") {
      if (!bill_id) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "bill_id is required for bill payments",
            },
          },
          { status: 400 }
        );
      }

      const { data: bill, error: billError } = await supabase
        .from("bills")
        .select("id, amount, credits_applied, status")
        .eq("id", bill_id)
        .eq("user_id", user.id)
        .single();

      if (billError || !bill) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "BILL_NOT_FOUND",
              message: "Bill not found",
            },
          },
          { status: 404 }
        );
      }

      if (bill.status === "PAID") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "ALREADY_PAID",
              message: "Bill is already paid",
            },
          },
          { status: 400 }
        );
      }

      amount = Math.max(0, Number(bill.amount) - Number(bill.credits_applied || 0));
      billIdToPersist = bill.id;

      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "NO_PAYMENT_REQUIRED",
              message: "No payment is required for this bill",
            },
          },
          { status: 400 }
        );
      }

      paymentMetadata.bill_id = bill.id;
      paymentMetadata.credits_applied = bill.credits_applied || 0;
    }

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        amount,
        type: payment_type,
        gateway: "RAZORPAY",
        status: "PENDING",
        bill_id: billIdToPersist,
        metadata: paymentMetadata,
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

    const razorpayInstance = initRazorpay();
    if (!razorpayInstance) {
      if (process.env.NODE_ENV === "production") {
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

      const mockOrderId = `order_mock_${Date.now()}`;

      await supabase
        .from("payments")
        .update({
          gateway_order_id: mockOrderId,
        })
        .eq("id", payment.id);

      return NextResponse.json({
        success: true,
        data: {
          order_id: mockOrderId,
          amount: Math.round(amount * 100),
          currency: "INR",
          payment_id: payment.id,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          mock: true,
        },
      });
    }

    const order = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `order_${payment.id}`,
      notes: {
        payment_id: payment.id,
        user_id: user.id,
        payment_type,
        allocation_id: allocation_id || "",
        bill_id: bill_id || "",
      },
    });

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
