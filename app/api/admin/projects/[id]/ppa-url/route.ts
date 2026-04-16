import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/admin/projects/[id]/ppa-url
 * Returns a signed URL for the PPA document and metadata
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const authResult = await verifyAdmin();
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error || "FORBIDDEN");
        }

        const projectId = id;
        if (!projectId) {
            return NextResponse.json(
                { success: false, error: "Project ID is required" },
                { status: 400 }
            );
        }

        const adminClient = createAdminClient();

        // Get the PPA agreement for this project
        const { data: agreement, error: agreementError } = await adminClient
            .from("ppa_agreements")
            .select("id, agreement_number, agreement_document_path, status")
            .eq("project_id", projectId)
            .single();

        if (agreementError) {
            console.error("Error fetching PPA agreement:", agreementError);
            return NextResponse.json(
                { success: false, error: "Agreement not found" },
                { status: 404 }
            );
        }

        if (!agreement) {
            return NextResponse.json({
                success: true,
                data: {
                    url: null,
                    agreementNumber: null,
                    expiresAt: null,
                },
            });
        }

        // If no document path, return empty response
        if (!agreement.agreement_document_path) {
            return NextResponse.json({
                success: true,
                data: {
                    url: null,
                    agreementNumber: agreement.agreement_number,
                    expiresAt: null,
                },
            });
        }

        // Generate signed URL (1 hour expiry)
        const { data: signedUrlData, error: signedUrlError } = await adminClient.storage
            .from("ppa-documents")
            .createSignedUrl(agreement.agreement_document_path, 3600);

        if (signedUrlError) {
            console.error("Error generating signed URL:", signedUrlError);
            return NextResponse.json(
                { success: false, error: "Failed to generate signed URL" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                url: signedUrlData.signedUrl,
                agreementNumber: agreement.agreement_number,
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
            },
        });
    } catch (error) {
        console.error("Admin PPA URL error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch PPA URL" },
            { status: 500 }
        );
    }
}
