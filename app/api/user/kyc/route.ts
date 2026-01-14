import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const aadhaar_number = formData.get("aadhaar_number") as string;
    const pan_number = formData.get("pan_number") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const pincode = formData.get("pincode") as string;
    const aadhaar_file = formData.get("aadhaar_file") as File | null;
    const pan_file = formData.get("pan_file") as File | null;

    // Validation
    if (!aadhaar_number || !pan_number || !address || !city || !state || !pincode) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "All fields are required" } },
        { status: 400 }
      );
    }

    // Validate Aadhaar (12 digits)
    if (!/^\d{12}$/.test(aadhaar_number)) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid Aadhaar number" } },
        { status: 400 }
      );
    }

    // Validate PAN (10 characters: 5 letters, 4 digits, 1 letter)
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan_number)) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid PAN number" } },
        { status: 400 }
      );
    }

    // Validate Pincode (6 digits)
    if (!/^\d{6}$/.test(pincode)) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid pincode" } },
        { status: 400 }
      );
    }

    // Upload files to Supabase Storage (if provided and storage is configured)
    let aadhaar_file_url = null;
    let pan_file_url = null;

    try {
      if (aadhaar_file) {
        const fileExt = aadhaar_file.name.split('.').pop();
        const fileName = `${user.id}/aadhaar_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('kyc-documents')
          .upload(fileName, aadhaar_file, {
            cacheControl: '3600',
            upsert: false
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('kyc-documents')
            .getPublicUrl(fileName);
          aadhaar_file_url = urlData.publicUrl;
        }
        // Note: If storage fails, we continue without file URL
      }

      if (pan_file) {
        const fileExt = pan_file.name.split('.').pop();
        const fileName = `${user.id}/pan_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('kyc-documents')
          .upload(fileName, pan_file, {
            cacheControl: '3600',
            upsert: false
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from('kyc-documents')
            .getPublicUrl(fileName);
          pan_file_url = urlData.publicUrl;
        }
        // Note: If storage fails, we continue without file URL
      }
    } catch (storageError) {
      // Storage might not be configured, continue without file URLs
      console.warn("Storage upload failed, continuing without file URLs:", storageError);
    }

    // Update user profile with KYC information
    // Build update object with only fields that exist
    const updateData: any = {
      kyc_status: "SUBMITTED",
      updated_at: new Date().toISOString(),
    };

    // Add fields if columns exist (they may not be in all schemas)
    // These will be stored in the database if columns exist
    if (aadhaar_number) updateData.aadhaar_number = aadhaar_number;
    if (pan_number) updateData.pan_number = pan_number;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (pincode) updateData.pincode = pincode;
    if (aadhaar_file_url) updateData.aadhaar_file_url = aadhaar_file_url;
    if (pan_file_url) updateData.pan_file_url = pan_file_url;

    const { data: updatedProfile, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating KYC:", updateError);
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: "Failed to update KYC information" } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: "KYC submitted successfully. Verification will be completed within 24-48 hours.",
    });
  } catch (error: any) {
    console.error("KYC submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}
