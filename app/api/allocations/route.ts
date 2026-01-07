import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Not authenticated" },
        },
        { status: 401 }
      );
    }

    // Get user's allocations
    // Try with join first, fallback to separate queries if join fails
    let allocations: any[] = [];
    let error: any = null;

    // First, try to get allocations with project join
    const { data: allocationsData, error: allocationsError } = await supabase
      .from("allocations")
      .select(
        `
        *,
        project:projects(*)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (allocationsError) {
      // If join fails (likely due to RLS or missing FK), try without join
      console.error("Error with join, trying without:", allocationsError);
      
      const { data: allocationsOnly, error: errorOnly } = await supabase
        .from("allocations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (errorOnly) {
        error = errorOnly;
      } else {
        // Fetch projects separately and merge
        allocations = allocationsOnly || [];
        
        if (allocations.length > 0) {
          const projectIds = allocations
            .map((a: any) => a.project_id)
            .filter((id: string) => id);

          if (projectIds.length > 0) {
            const { data: projects, error: projectsError } = await supabase
              .from("projects")
              .select("*")
              .in("id", projectIds);

            if (!projectsError && projects) {
              // Merge project data into allocations
              allocations = allocations.map((allocation: any) => ({
                ...allocation,
                project: projects.find((p: any) => p.id === allocation.project_id) || null,
              }));
            } else {
              // If projects fetch fails, just add null project
              allocations = allocations.map((allocation: any) => ({
                ...allocation,
                project: null,
              }));
            }
          } else {
            // No project IDs, add null project
            allocations = allocations.map((allocation: any) => ({
              ...allocation,
              project: null,
            }));
          }
        }
      }
    } else {
      // Join succeeded
      allocations = allocationsData || [];
    }

    if (error) {
      console.error("Allocations fetch error:", error);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DB_ERROR",
            message: error.message || "Failed to fetch allocations",
            details: process.env.NODE_ENV === "development" ? error : undefined,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: allocations });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Not authenticated" },
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { project_id, capacity_kw, monthly_fee } = body;

    if (!project_id || !capacity_kw || !monthly_fee) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Missing required fields" },
        },
        { status: 400 }
      );
    }

    // Create allocation
    const { data: allocation, error } = await supabase
      .from("allocations")
      .insert({
        user_id: user.id,
        project_id,
        capacity_kw,
        monthly_fee,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: { code: "DB_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: allocation });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message } },
      { status: 500 }
    );
  }
}

