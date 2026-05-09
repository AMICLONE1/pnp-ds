import type { SupabaseClient } from "@supabase/supabase-js";

export type ProjectDocumentKind = "ppa" | "insurance";

const PPA_BUCKET = "ppa-documents";
const INSURANCE_BUCKET = "project-documents";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const ACCEPTED_MIME_TYPES = new Set<string>([
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
]);

const EXTENSION_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

function bucketFor(kind: ProjectDocumentKind) {
  return kind === "ppa" ? PPA_BUCKET : INSURANCE_BUCKET;
}

// Path segments must contain ONLY safe characters. Anything outside this
// set is stripped, which makes it impossible to introduce `..`, `/`, or
// other traversal sequences via the `spv_id` field. UUIDs already match
// this set so hostId is unaffected.
const SAFE_SEGMENT_RE = /[^A-Za-z0-9_.-]/g;

function safeSegment(value: string, fallback: string) {
  const cleaned = String(value || "").replace(SAFE_SEGMENT_RE, "");
  return cleaned || fallback;
}

function pathFor(
  kind: ProjectDocumentKind,
  hostId: string,
  spvId: string,
  ext: string
) {
  // Keep a stable folder per host/project so old uploads can be deleted on
  // replace without affecting other plants. Filename includes a timestamp so
  // signed-URL caches don't return a stale doc after a replace.
  const folder = kind === "ppa" ? "ppa-documents" : "insurance-documents";
  const safeHost = safeSegment(hostId, "unknown-host");
  const safeSpv = safeSegment(spvId, "unknown-spv");
  return `${folder}/${safeHost}/${safeSpv}/${Date.now()}.${ext}`;
}

export type UploadOptions = {
  kind: ProjectDocumentKind;
  file: File;
  hostId: string;
  spvId: string;
};

/**
 * Upload a project document (PPA or plant insurance) to Supabase Storage and
 * return the storage path. Caller is responsible for persisting the path
 * onto the relevant DB row (ppa_agreements.agreement_document_path or
 * projects.insurance_document_path).
 */
export async function uploadProjectDocument(
  adminClient: SupabaseClient,
  opts: UploadOptions
): Promise<string> {
  const { kind, file, hostId, spvId } = opts;

  if (!file || file.size === 0) {
    throw new Error("File is empty");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("File exceeds 10MB limit");
  }
  if (!ACCEPTED_MIME_TYPES.has(file.type)) {
    throw new Error("File must be a PDF or Word document (.pdf, .doc, .docx)");
  }

  const ext = EXTENSION_BY_MIME[file.type];
  const buffer = await file.arrayBuffer();
  const path = pathFor(kind, hostId, spvId, ext);

  // Final guard — should never trigger because pathFor sanitizes inputs,
  // but if anyone refactors safeSegment loosely we want this to fail loud.
  if (path.includes("..") || path.startsWith("/")) {
    throw new Error("Refusing to upload to suspicious path");
  }

  const { error } = await adminClient.storage
    .from(bucketFor(kind))
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload document: ${error.message}`);
  }

  return path;
}

/**
 * Best-effort delete of an old document path. Used when replacing — we don't
 * fail the request if the old file is already gone.
 */
export async function deleteProjectDocument(
  adminClient: SupabaseClient,
  kind: ProjectDocumentKind,
  path: string | null | undefined
): Promise<void> {
  if (!path) return;
  await adminClient.storage.from(bucketFor(kind)).remove([path]).catch(() => {
    // Ignore — file may have already been deleted; we don't want to block the
    // replace flow on stale-pointer cleanup.
  });
}

/**
 * Build a public URL for a stored document. Both buckets are public per the
 * current product decision (full transparency for prospective subscribers).
 */
export function buildDocumentPublicUrl(
  adminClient: SupabaseClient,
  kind: ProjectDocumentKind,
  path: string
): string {
  const { data } = adminClient.storage.from(bucketFor(kind)).getPublicUrl(path);
  return data.publicUrl;
}

export const PROJECT_DOCUMENT_BUCKETS = {
  ppa: PPA_BUCKET,
  insurance: INSURANCE_BUCKET,
};

export const PROJECT_DOCUMENT_LIMITS = {
  maxBytes: MAX_BYTES,
  acceptMimeTypes: Array.from(ACCEPTED_MIME_TYPES),
};

export function bucketForKind(kind: ProjectDocumentKind): string {
  return bucketFor(kind);
}
