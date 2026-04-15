import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/admin/hosts/ppa-upload
 * Upload a PPA PDF document for a specific agreement.
 * FormData: file (PDF), agreement_id, host_id
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdmin();
    if (!authResult.authorized) {
      return unauthorizedResponse(authResult.error || "FORBIDDEN");
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const agreementId = formData.get("agreement_id") as string;
    const hostId = formData.get("host_id") as string;

    if (!file || !agreementId) {
      return NextResponse.json(
        { success: false, error: "File and agreement_id are required" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { success: false, error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const buffer = await file.arrayBuffer();
    const timestamp = Date.now();
    const fileName = `ppa-documents/${hostId}/${agreementId}/${timestamp}.pdf`;

    const { error: uploadError } = await adminClient.storage
      .from("ppa-documents")
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("PPA upload error:", uploadError);
      return NextResponse.json(
        { success: false, error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Update agreement with document path
    const { error: updateError } = await adminClient
      .from("ppa_agreements")
      .update({
        agreement_document_path: fileName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", agreementId);

    if (updateError) {
      console.error("Agreement update error:", updateError);
      return NextResponse.json(
        { success: false, error: "File uploaded but failed to link to agreement" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: { path: fileName } });
  } catch (error) {
    console.error("PPA upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload PPA document" },
      { status: 500 }
    );
  }
}
