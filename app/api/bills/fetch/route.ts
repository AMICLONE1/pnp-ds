import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { bbpsClient } from "@/lib/bbps/client";

/**
 * POST /api/bills/fetch
 * Fetch bills from BBPS API and store in database
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

    // Get user's utility information
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("utility_consumer_number, discom, state")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UTILITY_NOT_CONNECTED",
            message: "Please connect your utility first",
          },
        },
        { status: 400 }
      );
    }

    if (!userData.utility_consumer_number || !userData.discom || !userData.state) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UTILITY_INCOMPLETE",
            message: "Utility information is incomplete. Please update your utility details.",
          },
        },
        { status: 400 }
      );
    }

    // Validate consumer number
    if (
      !bbpsClient.validateConsumerNumber(
        userData.utility_consumer_number,
        userData.discom
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CONSUMER_NUMBER",
            message: "Invalid consumer number format for the selected DISCOM",
          },
        },
        { status: 400 }
      );
    }

    // Fetch bill from BBPS
    const bbpsResponse = await bbpsClient.fetchBill({
      consumerNumber: userData.utility_consumer_number,
      discom: userData.discom,
      state: userData.state,
    });

    if (!bbpsResponse.success || !bbpsResponse.data) {
      return NextResponse.json(
        {
          success: false,
          error: bbpsResponse.error || {
            code: "BBPS_ERROR",
            message: "Failed to fetch bill from BBPS",
          },
        },
        { status: 500 }
      );
    }

    const billData = bbpsResponse.data;

    // Check if bill already exists
    const { data: existingBill } = await supabase
      .from("bills")
      .select("id")
      .eq("user_id", user.id)
      .eq("bill_number", billData.bill_number)
      .eq("bill_month", billData.bill_month)
      .eq("bill_year", billData.bill_year)
      .single();

    if (existingBill) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "BILL_EXISTS",
            message: "This bill has already been fetched",
          },
        },
        { status: 409 }
      );
    }

    // Create bill in database
    // Note: Adjust field names based on your actual schema
    const billInsert: any = {
      user_id: user.id,
      bill_number: billData.bill_number,
      amount: billData.amount,
      due_date: billData.due_date,
      discom: billData.discom,
      status: "PENDING",
      bbps_bill_id: `BBPS-${billData.bill_number}`,
      fetched_at: new Date().toISOString(),
    };

    // Add month/year if they exist in schema
    if (billData.bill_month) billInsert.bill_month = billData.bill_month;
    if (billData.bill_year) billInsert.bill_year = billData.bill_year;

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
      let remainingAmount = Number(billData.amount);
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
            final_amount: Number(billData.amount) - totalCreditsApplied,
            status: totalCreditsApplied >= Number(billData.amount) ? "PAID" : "PENDING",
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

    return NextResponse.json({
      success: true,
      data: updatedBill,
      message: "Bill fetched and credits applied successfully",
    });
  } catch (error: any) {
    console.error("BBPS Fetch Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to fetch bill",
        },
      },
      { status: 500 }
    );
  }
}

