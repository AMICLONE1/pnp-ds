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

    const { data: profile, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
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

    // Whitelist allowed fields to prevent privilege escalation
    const allowedFields = [
      'full_name',
      'phone',
      'address',
      'city',
      'state',
      'pincode',
      'notification_preferences',
      'avatar_url'
    ];

    // Extract only allowed fields from request body
    const sanitizedUpdate: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        sanitizedUpdate[field] = body[field];
      }
    }

    // Return error if no valid fields provided
    if (Object.keys(sanitizedUpdate).length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_REQUEST", message: "No valid fields to update" },
        },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from("users")
      .update(sanitizedUpdate)
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

