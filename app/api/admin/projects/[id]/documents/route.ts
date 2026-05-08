import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  uploadProjectDocument,
  deleteProjectDocument,
  type ProjectDocumentKind,
} from "@/lib/admin/projectDocuments";

const ALLOWED_KINDS: ProjectDocumentKind[] = ["ppa", "insurance"];

/**
 * POST /api/admin/projects/[id]/documents
 *
 * Upload (or replace) a project's PPA or plant insurance document. Form-data
 * fields:
 *   kind     — "ppa" | "insurance"
 *   file     — PDF or Word doc, ≤10 MB
 *
 * Replaces the existing file if one is already attached, deletes the old
 * storage object, and writes an audit_log row noting which admin replaced
 * what.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAdmin();
    if (!auth.authorized) {
      return unauthorizedResponse(auth.error || "FORBIDDEN");
    }

    const { id: projectId } = await params;
    const formData = await request.formData();
    const kind = String(formData.get("kind") || "") as ProjectDocumentKind;
    const file = formData.get("file") as File | null;

    if (!ALLOWED_KINDS.includes(kind)) {
      return NextResponse.json(
        { success: false, error: "kind must be 'ppa' or 'insurance'" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "file is required" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: project } = await admin
      .from("projects")
      .select(
        "id, spv_id, host_id, insurance_document_path, insurance_uploaded_at"
      )
      .eq("id", projectId)
      .maybeSingle();

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Resolve current path so we can delete the replaced file at the end.
    let oldPath: string | null = null;
    let agreementId: string | null = null;
    if (kind === "ppa") {
      const { data: agreement } = await admin
        .from("ppa_agreements")
        .select("id, agreement_document_path")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!agreement) {
        return NextResponse.json(
          {
            success: false,
            error: "No PPA agreement exists yet for this project. Create the project first.",
          },
          { status: 409 }
        );
      }
      oldPath = agreement.agreement_document_path || null;
      agreementId = agreement.id;
    } else {
      oldPath = project.insurance_document_path || null;
    }

    let newPath: string;
    try {
      newPath = await uploadProjectDocument(admin, {
        kind,
        file,
        hostId: String(project.host_id),
        spvId: String(project.spv_id),
      });
    } catch (uploadErr) {
      return NextResponse.json(
        {
          success: false,
          error: uploadErr instanceof Error ? uploadErr.message : "Upload failed",
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    if (kind === "ppa" && agreementId) {
      const { error: updateErr } = await admin
        .from("ppa_agreements")
        .update({
          agreement_document_path: newPath,
          agreement_document_uploaded_at: now,
        })
        .eq("id", agreementId);
      if (updateErr) {
        await deleteProjectDocument(admin, kind, newPath);
        return NextResponse.json(
          { success: false, error: updateErr.message },
          { status: 500 }
        );
      }
    } else if (kind === "insurance") {
      const { error: updateErr } = await admin
        .from("projects")
        .update({
          insurance_document_path: newPath,
          insurance_uploaded_at: now,
        })
        .eq("id", project.id);
      if (updateErr) {
        await deleteProjectDocument(admin, kind, newPath);
        return NextResponse.json(
          { success: false, error: updateErr.message },
          { status: 500 }
        );
      }
    }

    // Audit log: who replaced what, when. The audit_log table stores generic
    // entries — we don't want to fail the request if the table is missing or
    // the insert is rejected.
    await admin
      .from("audit_log")
      .insert({
        user_id: auth.user?.id || null,
        action: kind === "ppa" ? "PPA_DOCUMENT_REPLACED" : "INSURANCE_DOCUMENT_REPLACED",
        resource_type: "project",
        resource_id: project.id,
        metadata: {
          spv_id: project.spv_id,
          old_path: oldPath,
          new_path: newPath,
          replaced_at: now,
        },
      })
      .then(() => undefined, () => undefined);

    // Delete the previous file last — best-effort, doesn't block success.
    if (oldPath && oldPath !== newPath) {
      await deleteProjectDocument(admin, kind, oldPath);
    }

    return NextResponse.json({
      success: true,
      data: {
        kind,
        path: newPath,
        uploaded_at: now,
      },
    });
  } catch (err: any) {
    console.error("Project document upload error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
