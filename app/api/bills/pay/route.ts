import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bbpsClient } from "@/lib/bbps/client";

/**
 * POST /api/bills/pay
 * Pay a bill through the platform (similar to SundayGrids)
 */
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
    const { bill_id, payment_amount } = body;

    if (!bill_id || !payment_amount) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "bill_id and payment_amount are required",
          },
        },
        { status: 400 }
      );
    }

    // Get bill
    const { data: bill, error: billError } = await supabase
      .from("bills")
      .select("*")
      .eq("id", bill_id)
      .eq("user_id", user.id)
      .single();

    if (billError || !bill) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "BILL_NOT_FOUND", message: "Bill not found" },
        },
        { status: 404 }
      );
    }

    // Check if already paid
    if (bill.status === "PAID") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "ALREADY_PAID", message: "Bill is already paid" },
        },
        { status: 400 }
      );
    }

    // Auto-apply credits if available
    const { data: availableCredits } = await supabase
      .from("credit_ledgers")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "PENDING")
      .order("created_at", { ascending: true });

    let creditsApplied = 0;
    const creditsToApply: any[] = [];

    if (availableCredits && availableCredits.length > 0) {
      let remainingAmount = Number(bill.amount);
      const maxCreditsToApply = Math.min(
        Number(bill.amount),
        availableCredits.reduce((sum, c) => sum + Number(c.amount), 0)
      );

      for (const credit of availableCredits) {
        if (remainingAmount <= 0 || creditsApplied >= maxCreditsToApply) break;
        const creditAmount = Number(credit.amount);
        const appliedAmount = Math.min(creditAmount, remainingAmount, maxCreditsToApply - creditsApplied);

        creditsToApply.push({
          id: credit.id,
          appliedAmount,
        });

        creditsApplied += appliedAmount;
        remainingAmount -= appliedAmount;
      }
    }

    // Calculate final amount after credits
    const finalAmount = Math.max(0, Number(bill.amount) - creditsApplied);
    const paymentNeeded = Math.min(Number(payment_amount), finalAmount);

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        bill_id: bill.id,
        amount: paymentNeeded,
        currency: "INR",
        status: "PENDING",
        payment_type: "bill",
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

    // Update bill with credits
    if (creditsToApply.length > 0) {
      await supabase
        .from("bills")
        .update({
          credits_applied: creditsApplied,
          final_amount: finalAmount,
        })
        .eq("id", bill.id);

      // Mark credits as applied
      for (const credit of creditsToApply) {
        await supabase
          .from("credit_ledgers")
          .update({
            status: "APPLIED",
            ref_id: bill.id,
            ref_type: "bill",
          })
          .eq("id", credit.id);
      }
    }

    // If payment needed, create Razorpay order
    if (paymentNeeded > 0) {
      // Redirect to payment or return payment details
      // For now, return payment info
      return NextResponse.json({
        success: true,
        data: {
          payment_id: payment.id,
          amount: paymentNeeded,
          credits_applied: creditsApplied,
          final_amount: finalAmount,
          requires_payment: true,
        },
        message: "Credits applied. Payment required for remaining amount.",
      });
    } else {
      // Bill fully paid with credits
      await supabase
        .from("bills")
        .update({
          status: "PAID",
          paid_at: new Date().toISOString(),
        })
        .eq("id", bill.id);

      await supabase
        .from("payments")
        .update({
          status: "COMPLETED",
        })
        .eq("id", payment.id);

      return NextResponse.json({
        success: true,
        data: {
          payment_id: payment.id,
          credits_applied: creditsApplied,
          final_amount: 0,
          requires_payment: false,
        },
        message: "Bill paid successfully using credits!",
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to process bill payment",
        },
      },
      { status: 500 }
    );
  }
}

