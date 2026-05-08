import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { bucketForKind, type ProjectDocumentKind } from "@/lib/admin/projectDocuments";

const KINDS: ProjectDocumentKind[] = ["ppa", "insurance"];

/**
 * GET /api/projects/[id]/documents/[kind]
 *
 * Public download endpoint — no authentication required. Per product
 * decision, PPA + plant insurance documents are visible to anyone (full
 * transparency for prospective subscribers).
 *
 * Streams the file with a clean filename derived from the project name +
 * document kind, e.g. `Vedvyas-Solar-Park-PPA.pdf`.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; kind: string }> }
) {
  try {
    const { id: projectId, kind: rawKind } = await params;
    const kind = rawKind as ProjectDocumentKind;

    if (!KINDS.includes(kind)) {
      return NextResponse.json(
        { success: false, error: "kind must be 'ppa' or 'insurance'" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: project } = await admin
      .from("projects")
      .select("id, spv_id, name, host_id, insurance_document_path")
      .eq("id", projectId)
      .is("deleted_at", null)
      .maybeSingle();

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    let storagePath: string | null = null;
    let extension = "pdf";

    if (kind === "ppa") {
      const { data: agreement } = await admin
        .from("ppa_agreements")
        .select("agreement_document_path")
        .eq("project_id", project.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      storagePath = agreement?.agreement_document_path || null;
    } else {
      storagePath = project.insurance_document_path || null;
    }

    if (!storagePath) {
      return NextResponse.json(
        { success: false, error: "Document not available" },
        { status: 404 }
      );
    }

    // Pick the correct bucket and stream the file.
    const bucket = bucketForKind(kind);
    const { data: blob, error: downloadErr } = await admin.storage
      .from(bucket)
      .download(storagePath);

    if (downloadErr || !blob) {
      return NextResponse.json(
        { success: false, error: "Document could not be retrieved" },
        { status: 500 }
      );
    }

    extension = (storagePath.split(".").pop() || "pdf").toLowerCase();

    // Generate a clean filename: "<Project-Name>-<KIND>.<ext>"
    const projectSlug = String(project.name)
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const kindLabel = kind === "ppa" ? "PPA" : "Insurance";
    const filename = `${projectSlug}-${kindLabel}.${extension}`;

    const contentType =
      extension === "pdf"
        ? "application/pdf"
        : extension === "docx"
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : extension === "doc"
        ? "application/msword"
        : "application/octet-stream";

    const arrayBuffer = await blob.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer) as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // PDFs render inline in the browser; Word docs always download.
        "Content-Disposition":
          extension === "pdf"
            ? `inline; filename="${filename}"`
            : `attachment; filename="${filename}"`,
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err: any) {
    console.error("Project document download error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Download failed" },
      { status: 500 }
    );
  }
}
