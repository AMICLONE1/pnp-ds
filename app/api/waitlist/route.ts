import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Please enter a valid phone number").optional(),
  source: z.string().optional().default("website"),
  referralCode: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

/**
 * POST /api/waitlist
 * Join the waitlist for early access
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = waitlistSchema.parse(body);

    const supabase = await createClient();

    // Check if email already exists in waitlist
    const { data: existingEntry } = await supabase
      .from("waitlist")
      .select("id, email, created_at")
      .eq("email", validatedData.email.toLowerCase())
      .single();

    if (existingEntry) {
      return NextResponse.json({
        success: true,
        message: "You're already on the waitlist! We'll notify you when we launch.",
        alreadyExists: true,
        position: null, // Could calculate position if needed
      });
    }

    // Insert into waitlist
    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        email: validatedData.email.toLowerCase(),
        name: validatedData.name || null,
        phone: validatedData.phone || null,
        source: validatedData.source,
        referral_code: validatedData.referralCode || null,
        metadata: validatedData.metadata || {},
        status: "pending",
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Waitlist insert error:", error);

      // Handle unique constraint violation
      if (error.code === "23505") {
        return NextResponse.json({
          success: true,
          message: "You're already on the waitlist! We'll notify you when we launch.",
          alreadyExists: true,
        });
      }

      throw error;
    }

    // Get waitlist position (count of entries before this one)
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .lte("created_at", data.created_at);

    return NextResponse.json({
      success: true,
      message: "You've been added to the waitlist! We'll notify you when we launch.",
      alreadyExists: false,
      position: count || 1,
    });
  } catch (error: unknown) {
    console.error("Waitlist API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: error.errors[0].message,
          },
        },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Failed to join waitlist";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/waitlist
 * Get waitlist stats (public)
 */
export async function GET() {
  try {
    const supabase = await createClient();

    // Get total count of waitlist entries
    const { count, error } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      data: {
        totalSignups: count || 0,
        // Add some fake numbers for social proof if count is low
        displayCount: Math.max(count || 0, 127), // Minimum display of 127
      },
    });
  } catch (error: unknown) {
    console.error("Waitlist stats error:", error);

    return NextResponse.json({
      success: true,
      data: {
        totalSignups: 0,
        displayCount: 127,
      },
    });
  }
}
