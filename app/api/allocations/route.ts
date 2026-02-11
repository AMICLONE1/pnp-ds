import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

    // Get user's allocations with capacity block and project info
    const { data: allocationsData, error: allocationsError } = await supabase
      .from("allocations")
      .select(`
        *,
        capacity_block:capacity_blocks(
          id,
          kw,
          project_id,
          project:projects(*)
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (allocationsError) {
      // Fallback: get allocations and fetch related data separately
      console.error("Error with join, trying separate queries:", allocationsError);
      
      const { data: allocationsOnly, error: errorOnly } = await supabase
        .from("allocations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (errorOnly) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "DB_ERROR",
              message: errorOnly.message || "Failed to fetch allocations",
            },
          },
          { status: 500 }
        );
      }

      const allocations = allocationsOnly || [];
      
      // Fetch capacity blocks and projects separately
      if (allocations.length > 0) {
        const blockIds = allocations
          .map((a: any) => a.capacity_block_id)
          .filter((id: string) => id);

        if (blockIds.length > 0) {
          const adminClient = createAdminClient();
          const { data: blocks } = await adminClient
            .from("capacity_blocks")
            .select("id, kw, project_id")
            .in("id", blockIds);

          if (blocks) {
            const projectIds = [...new Set(blocks.map((b: any) => b.project_id))];
            const { data: projects } = await supabase
              .from("projects")
              .select("*")
              .in("id", projectIds);

            // Merge data
            const enrichedAllocations = allocations.map((allocation: any) => {
              const block = blocks.find((b: any) => b.id === allocation.capacity_block_id);
              const project = projects?.find((p: any) => p.id === block?.project_id);
              
              return {
                ...allocation,
                capacity_block: block ? {
                  ...block,
                  project: project || null,
                } : null,
              };
            });

            return NextResponse.json({ success: true, data: enrichedAllocations });
          }
        }
      }

      return NextResponse.json({ success: true, data: allocations });
    }

    // Transform the nested structure for easier frontend consumption
    const transformedAllocations = (allocationsData || []).map((allocation: any) => ({
      ...allocation,
      project: allocation.capacity_block?.project || null,
      block_kw: allocation.capacity_block?.kw || allocation.capacity_kw,
    }));

    return NextResponse.json({ success: true, data: transformedAllocations });
  } catch (error: any) {
    console.error("Allocations GET error:", error);
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
    const { project_id, capacity_kw } = body;

    if (!project_id || !capacity_kw) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Missing required fields: project_id and capacity_kw" },
        },
        { status: 400 }
      );
    }

    // Validate capacity
    if (capacity_kw <= 0 || capacity_kw > 100) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Capacity must be between 1 and 100 kW" },
        },
        { status: 400 }
      );
    }

    // Check if project exists and is active
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, total_kw, status, rate_per_kwh")
      .eq("id", project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Project not found" },
        },
        { status: 404 }
      );
    }

    // Check if project is active
    if (project.status !== "ACTIVE" && project.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_STATUS", message: "Project is not active" },
        },
        { status: 400 }
      );
    }

    // Use admin client to check and allocate capacity blocks
    let adminClient;
    try {
      adminClient = createAdminClient();
    } catch (error: any) {
      console.error("Failed to create admin client:", error.message);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CONFIG_ERROR",
            message: error.message || "Server configuration error. Please check environment variables.",
          },
        },
        { status: 500 }
      );
    }
    
    // Get available capacity blocks for this project
    const { data: availableBlocks, error: blocksError } = await adminClient
      .from("capacity_blocks")
      .select("id, kw")
      .eq("project_id", project_id)
      .eq("status", "AVAILABLE")
      .order("created_at", { ascending: true });

    if (blocksError) {
      console.error("Error checking capacity blocks:", blocksError);
      return NextResponse.json(
        {
          success: false,
          error: { 
            code: "DB_ERROR", 
            message: "Failed to check available capacity",
            details: process.env.NODE_ENV === "development" ? blocksError.message : undefined,
          },
        },
        { status: 500 }
      );
    }

    const availableCapacity = availableBlocks?.reduce((sum, block) => sum + Number(block.kw || 0), 0) || 0;

    if (availableCapacity < capacity_kw) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INSUFFICIENT_CAPACITY",
            message: `Only ${availableCapacity.toFixed(2)} kW available. Requested: ${capacity_kw} kW`,
          },
        },
        { status: 400 }
      );
    }

    // Select blocks to allocate (greedy algorithm - take blocks until we have enough capacity)
    let remainingCapacity = Number(capacity_kw);
    const blocksToAllocate: Array<{ id: string; kw: number }> = [];

    for (const block of availableBlocks || []) {
      if (remainingCapacity <= 0) break;
      
      const blockKw = Number(block.kw || 0);
      if (blockKw > 0) {
        blocksToAllocate.push({ id: block.id, kw: blockKw });
        remainingCapacity -= blockKw;
      }
    }

    // For now, we'll create one allocation per block
    // If you want to group multiple blocks into one allocation, you'll need to adjust the schema
    // Since capacity_block_id is UNIQUE, each allocation can only reference one block
    
    // Create allocations for each block
    const createdAllocations = [];
    
    for (const block of blocksToAllocate) {
      // Mark the capacity block as ALLOCATED
      const { error: updateBlockError } = await adminClient
        .from("capacity_blocks")
        .update({
          status: "ALLOCATED",
          allocated_at: new Date().toISOString(),
        })
        .eq("id", block.id);

      if (updateBlockError) {
        console.error(`Error updating block ${block.id}:`, updateBlockError);
        // Continue with other blocks, but log the error
        continue;
      }

      // Create allocation for this block
      const { data: allocation, error: allocError } = await supabase
        .from("allocations")
        .insert({
          user_id: user.id,
          capacity_block_id: block.id,
          capacity_kw: block.kw, // Store the block's capacity
        })
        .select()
        .single();

      if (allocError) {
        console.error(`Error creating allocation for block ${block.id}:`, allocError);
        // Rollback: mark block as available again
        await adminClient
          .from("capacity_blocks")
          .update({
            status: "AVAILABLE",
            allocated_at: null,
          })
          .eq("id", block.id);
        continue;
      }

      createdAllocations.push(allocation);
      
      // Stop if we've allocated enough capacity
      const totalAllocated = createdAllocations.reduce((sum, a) => sum + Number(a.capacity_kw || 0), 0);
      if (totalAllocated >= capacity_kw) {
        break;
      }
    }

    if (createdAllocations.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "ALLOCATION_FAILED", message: "Failed to create allocations" },
        },
        { status: 500 }
      );
    }

    // Return the first allocation (or all if you prefer)
    // Frontend can handle multiple allocations if needed
    return NextResponse.json({ 
      success: true, 
      data: createdAllocations.length === 1 ? createdAllocations[0] : createdAllocations,
      message: createdAllocations.length > 1 
        ? `Created ${createdAllocations.length} allocations for ${capacity_kw} kW` 
        : undefined
    });
  } catch (error: any) {
    console.error("Unexpected error in POST /api/allocations:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: "SERVER_ERROR", 
          message: error.message || "An unexpected error occurred",
          details: process.env.NODE_ENV === "development" ? error.stack : undefined,
        } 
      },
      { status: 500 }
    );
  }
}
