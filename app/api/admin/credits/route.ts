import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { sanitizeSearchTerm } from "@/lib/security/inputSanitizer";

type CreditLedgerStatus = "PENDING" | "APPLIED" | "EXPIRED";
type CreditLedgerType = "GENERATION" | "ADJUSTMENT" | "REFUND";

interface CreditEntry {
    id: string;
    user_id: string;
    user_name: string;
    user_email: string;
    amount: number;
    type: CreditLedgerType;
    status: CreditLedgerStatus;
    month: number | null;
    year: number | null;
    ref_type: string | null;
    description: string | null;
    created_at: string;
}

/**
 * GET /api/admin/credits
 * Returns credit ledger entries with filtering and pagination
 */
export async function GET(request: NextRequest) {
    try {
        const authResult = await verifyAdmin();
        if (!authResult.authorized) {
            return unauthorizedResponse(authResult.error || "FORBIDDEN");
        }

        const { searchParams } = new URL(request.url);
        const search = sanitizeSearchTerm(searchParams.get("search") || "");
        const status = searchParams.get("status") || "all";
        const type = searchParams.get("type") || "all";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);
        const offset = (page - 1) * limit;

        if (!["all", "PENDING", "APPLIED", "EXPIRED"].includes(status)) {
            return NextResponse.json(
                { success: false, error: "Invalid status filter" },
                { status: 400 }
            );
        }

        if (!["all", "GENERATION", "ADJUSTMENT", "REFUND"].includes(type)) {
            return NextResponse.json(
                { success: false, error: "Invalid type filter" },
                { status: 400 }
            );
        }

        const adminClient = createAdminClient();

        // Build query with user join
        let query = adminClient
            .from("credit_ledgers")
            .select(
                `
                id,
                user_id,
                amount,
                type,
                status,
                month,
                year,
                ref_type,
                description,
                created_at,
                users:user_id(name, email)
                `,
                { count: "exact" }
            )
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1);

        // Apply status filter
        if (status !== "all") {
            query = query.eq("status", status as CreditLedgerStatus);
        }

        // Apply type filter
        if (type !== "all") {
            query = query.eq("type", type as CreditLedgerType);
        }

        const { data: entriesRaw, error, count } = (await query) as any;

        if (error) {
            console.error("Error fetching credit ledgers:", error);
            return NextResponse.json(
                { success: false, error: "Failed to fetch credit ledgers" },
                { status: 500 }
            );
        }

        // Transform data to flatten user info
        const entries: CreditEntry[] = (entriesRaw || []).map((entry: any) => ({
            id: entry.id,
            user_id: entry.user_id,
            user_name: entry.users?.[0]?.name || "Unknown",
            user_email: entry.users?.[0]?.email || "",
            amount: entry.amount,
            type: entry.type,
            status: entry.status,
            month: entry.month,
            year: entry.year,
            ref_type: entry.ref_type,
            description: entry.description,
            created_at: entry.created_at,
        }));

        // Filter by search term (name or email) if provided
        const filteredEntries = search
            ? entries.filter(
                  (e) =>
                      e.user_name.toLowerCase().includes(search.toLowerCase()) ||
                      e.user_email.toLowerCase().includes(search.toLowerCase())
              )
            : entries;

        // Calculate stats from all entries (not just current page)
        const statsQuery = adminClient.from("credit_ledgers").select("amount, status", { count: "exact" });

        const [pendingResult, appliedResult, expiredResult, totalUsersResult] = await Promise.all([
            adminClient
                .from("credit_ledgers")
                .select("amount", { count: "exact" })
                .eq("status", "PENDING"),
            adminClient
                .from("credit_ledgers")
                .select("amount", { count: "exact" })
                .eq("status", "APPLIED"),
            adminClient
                .from("credit_ledgers")
                .select("amount", { count: "exact" })
                .eq("status", "EXPIRED"),
            adminClient
                .from("credit_ledgers")
                .select("user_id", { count: "exact" }),
        ]);

        const calculateTotal = (result: any) => {
            return (result.data || []).reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
        };

        const stats = {
            totalPending: calculateTotal(pendingResult),
            totalApplied: calculateTotal(appliedResult),
            totalExpired: calculateTotal(expiredResult),
            totalAmount: calculateTotal(pendingResult) + calculateTotal(appliedResult) + calculateTotal(expiredResult),
            activeUsers: new Set((entriesRaw || []).map((e: any) => e.user_id)).size,
        };

        return NextResponse.json({
            success: true,
            data: {
                entries: filteredEntries,
                stats,
                pagination: {
                    page,
                    limit,
                    total: count || 0,
                    totalPages: Math.ceil((count || 0) / limit),
                },
            },
        });
    } catch (error) {
        console.error("Admin credits error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch credits" },
            { status: 500 }
        );
    }
}
