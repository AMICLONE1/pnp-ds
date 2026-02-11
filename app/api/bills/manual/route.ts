import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/bills/manual
 * Manually create a bill (for testing or when BBPS is not available)
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
    const { bill_number, amount, due_date, bill_month, bill_year, discom } = body;

    // Validation
    if (!bill_number || !amount || !due_date || !discom) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields: bill_number, amount, due_date, discom",
          },
        },
        { status: 400 }
      );
    }

    // Check if bill already exists
    const { data: existingBill } = await supabase
      .from("bills")
      .select("id")
      .eq("user_id", user.id)
      .eq("bill_number", bill_number)
      .single();

    if (existingBill) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BILL_EXISTS",
            message: "A bill with this number already exists",
          },
        },
        { status: 409 }
      );
    }

    // Create bill - only use fields that exist in schema
    const billInsert: any = {
      user_id: user.id,
      bill_number: bill_number || null,
      amount: Number(amount),
      due_date,
      discom,
      status: "PENDING",
    };

    // Note: bill_month and bill_year are not in the current schema
    // If needed, they can be added to the schema or stored in metadata

    const { data: bill, error: billError } = await supabase
      .from("bills")
      .insert(billInsert)
      .select()
      .single();

    if (billError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "DB_ERROR", message: billError.message },
        },
        { status: 500 }
      );
    }

    // Auto-apply credits if available
    const { data: availableCredits } = await supabase
      .from("credit_ledgers")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "PENDING")
      .order("created_at", { ascending: true });

    if (availableCredits && availableCredits.length > 0) {
      let remainingAmount = Number(amount);
      const creditsToApply: any[] = [];

      for (const credit of availableCredits) {
        if (remainingAmount <= 0) break;
        const creditAmount = Number(credit.amount);
        const appliedAmount = Math.min(creditAmount, remainingAmount);

        creditsToApply.push({
          id: credit.id,
          appliedAmount,
        });

        remainingAmount -= appliedAmount;
      }

      if (creditsToApply.length > 0) {
        const totalCreditsApplied = creditsToApply.reduce(
          (sum, c) => sum + c.appliedAmount,
          0
        );

        // Calculate final amount (not stored in DB, calculated on the fly)
        const finalAmount = Number(amount) - totalCreditsApplied;
        const newStatus = totalCreditsApplied >= Number(amount) ? "PAID" : "PENDING";

        await supabase
          .from("bills")
          .update({
            credits_applied: totalCreditsApplied,
            status: newStatus,
            // Note: final_amount is not in schema, calculate it when needed
            // final_amount = amount - credits_applied
          })
          .eq("id", bill.id);

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
    }

    // Fetch updated bill
    const { data: updatedBill } = await supabase
      .from("bills")
      .select("*")
      .eq("id", bill.id)
      .single();

    return NextResponse.json({
      success: true,
      data: updatedBill,
      message: "Bill added and credits applied successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to add bill",
        },
      },
      { status: 500 }
    );
  }
}

