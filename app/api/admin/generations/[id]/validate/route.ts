import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/generations/[id]/validate
 * Mark a generation entry as validated (QA workflow).
 * Body: { validated: boolean }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await verifyAdmin();
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const body = await request.json();
    const validated = body.validated !== false; // default true

    const adminClient = createAdminClient();

    const updates: Record<string, any> = {
      validated,
      updated_at: new Date().toISOString(),
    };

    if (validated) {
      updates.validated_by = authResult.user?.id;
      updates.validated_at = new Date().toISOString();
    } else {
      updates.validated_by = null;
      updates.validated_at = null;
    }

    const { data, error } = await adminClient
      .from("generations")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error validating generation:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update validation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Generation validate error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate generation" },
      { status: 500 }
    );
  }
}
