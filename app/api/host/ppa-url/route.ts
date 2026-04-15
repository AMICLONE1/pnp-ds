import { NextRequest, NextResponse } from "next/server";
import { verifyHost, unauthorizedResponse } from "@/lib/host/hostAuth";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * GET /api/host/ppa-url
 * Returns a signed URL for the host's PPA document
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyHost();
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error || "FORBIDDEN");
        }

        const hostId = authResult.hostId;
        if (!hostId) {
            return unauthorizedResponse("Host ID not found");
        }

        const adminClient = createAdminClient();

        // Get the host's active PPA agreement
        const { data: agreement, error: agreementError } = await adminClient
            .from("ppa_agreements")
            .select("id, agreement_number, agreement_document_path, status")
            .eq("host_id", hostId)
            .eq("status", "ACTIVE")
            .single();

        if (agreementError) {
            console.error("Error fetching PPA agreement:", agreementError);
            return NextResponse.json({
                success: true,
                data: {
                    url: null,
                    agreementNumber: null,
                    expiresAt: null,
                },
            });
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
        console.error("Host PPA URL error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch PPA URL" },
            { status: 500 }
        );
    }
}
