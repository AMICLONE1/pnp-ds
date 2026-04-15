import { createClient } from "@/lib/supabase/client";

export async function fetchBills(): Promise<
  { success: true; data: any[] } | { success: false; error: string }
> {
  try {
    const response = await fetch("/api/bills");
    const result = await response.json();
    if (result.success) {
      return { success: true, data: result.data };
    }
    return { success: false, error: result.error?.message || "Failed to fetch bills" };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}

export interface ManualBillData {
  bill_number: string;
  amount: string;
  due_date: string;
  discom: string;
  proof_url: string;
}

/**
 * Uploads a bill proof file directly to the private `bill-proofs` bucket
 * under `{user_id}/{uuid}.{ext}` (enforced by RLS), and returns the storage
 * path to embed in the bill submission payload.
 */
export async function uploadBillProof(
  file: File
): Promise<{ success: true; path: string } | { success: false; error: string }> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return { success: false, error: "Please log in to upload a bill." };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    if (!["pdf", "jpg", "jpeg", "png", "webp"].includes(ext)) {
      return { success: false, error: "Only PDF, JPG, PNG or WEBP files are allowed." };
    }
    if (file.size > 8 * 1024 * 1024) {
      return { success: false, error: "File must be smaller than 8 MB." };
    }

    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("bill-proofs")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (upErr) return { success: false, error: upErr.message };
    return { success: true, path };
  } catch (err: any) {
    return { success: false, error: err.message || "Upload failed" };
  }
}

export async function submitManualBill(
  data: ManualBillData
): Promise<{ success: true; message: string } | { success: false; error: string }> {
  try {
    const response = await fetch("/api/bills/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      return { success: true, message: result.message || "Bill submitted for review." };
    }
    return { success: false, error: result.error?.message || "Failed to submit bill" };
  } catch (err: any) {
    return { success: false, error: err.message || "An unexpected error occurred" };
  }
}
