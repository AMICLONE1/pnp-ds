import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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

    // Get user's bills
    const { data: bills, error } = await supabase
      .from("bills")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: bills });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
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
    const { bill_number, amount, due_date, bill_month, bill_year, discom } = body;

    // Create bill
    const { data: bill, error } = await supabase
      .from("bills")
      .insert({
        user_id: user.id,
        bill_number,
        amount,
        due_date,
        bill_month,
        bill_year,
        discom,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: error.message } },
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

      // Update credits and bill
      if (creditsToApply.length > 0) {
        const totalCreditsApplied = creditsToApply.reduce(
          (sum, c) => sum + c.appliedAmount,
          0
        );

        await supabase
          .from("bills")
          .update({
            credits_applied: totalCreditsApplied,
            final_amount: Number(amount) - totalCreditsApplied,
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
    }

    // Fetch updated bill
    const { data: updatedBill } = await supabase
      .from("bills")
      .select("*")
      .eq("id", bill.id)
      .single();

    return NextResponse.json({ success: true, data: updatedBill });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

