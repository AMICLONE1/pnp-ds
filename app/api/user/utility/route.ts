import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
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
    const { state, discom, utility_consumer_number } = body;

    // Validation
    if (!state || !discom || !utility_consumer_number) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "State, DISCOM, and consumer number are required",
          },
        },
        { status: 400 }
      );
    }

    // Validate consumer number format
    const trimmedConsumerNumber = String(utility_consumer_number).trim();
    
    if (trimmedConsumerNumber.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Consumer number must be at least 8 characters",
          },
        },
        { status: 400 }
      );
    }

    if (trimmedConsumerNumber.length > 20) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Consumer number must be less than 20 characters",
          },
        },
        { status: 400 }
      );
    }

    // Validate format: alphanumeric with hyphens and underscores
    const consumerNumberRegex = /^[A-Za-z0-9\-_]+$/;
    if (!consumerNumberRegex.test(trimmedConsumerNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Consumer number contains invalid characters. Only letters, numbers, hyphens, and underscores are allowed.",
          },
        },
        { status: 400 }
      );
    }

    // Check for invalid patterns (cannot start/end with special chars)
    if (/^[^A-Za-z0-9]/.test(trimmedConsumerNumber) || /[^A-Za-z0-9]$/.test(trimmedConsumerNumber)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Consumer number cannot start or end with special characters",
          },
        },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from("users")
      .update({
        state,
        discom,
        utility_consumer_number: trimmedConsumerNumber,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

