import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing payment details",
          },
        },
        { status: 400 }
      );
    }

    // Verify signature (skip for mock payments)
    const isMockPayment = razorpay_payment_id.startsWith("mock_payment_") || razorpay_signature === "mock_signature";
    
    if (!isMockPayment) {
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
        .update(text)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "INVALID_SIGNATURE", message: "Invalid payment signature" },
          },
          { status: 400 }
        );
      }
    }

    // Update payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: "COMPLETED",
      })
      .eq("gateway_order_id", razorpay_order_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (paymentError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "DB_ERROR", message: paymentError.message },
        },
        { status: 500 }
      );
    }

    // If payment is for allocation, activate it and allocate capacity blocks
    if (payment.allocation_id && payment.payment_type === "allocation") {
      // Get allocation details
      const { data: allocation, error: allocationError } = await supabase
        .from("allocations")
        .select("id, project_id, capacity_kw, status")
        .eq("id", payment.allocation_id)
        .single();

      if (allocationError || !allocation) {
        console.error("Error fetching allocation:", allocationError);
        return NextResponse.json(
          {
            success: false,
            error: { code: "DB_ERROR", message: "Failed to fetch allocation details" },
          },
          { status: 500 }
        );
      }

      // Only allocate if allocation is still pending
      if (allocation.status === "pending") {
        // Get available capacity blocks for this project
        // Use admin client to ensure we can read all blocks regardless of RLS
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
        const { data: availableBlocks, error: blocksError } = await adminClient
          .from("capacity_blocks")
          .select("id, kw")
          .eq("project_id", allocation.project_id)
          .eq("status", "AVAILABLE")
          .order("created_at", { ascending: true })
          .limit(Math.ceil(allocation.capacity_kw)); // Get enough blocks

        if (blocksError) {
          console.error("Error fetching capacity blocks:", blocksError);
          return NextResponse.json(
            {
              success: false,
              error: { code: "DB_ERROR", message: "Failed to fetch capacity blocks" },
            },
            { status: 500 }
          );
        }

        if (!availableBlocks || availableBlocks.length === 0) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "INSUFFICIENT_CAPACITY",
                message: "No capacity blocks available for allocation",
              },
            },
            { status: 400 }
          );
        }

        // Calculate how much capacity we need to allocate
        let remainingCapacity = Number(allocation.capacity_kw);
        const blocksToAllocate: string[] = [];

        for (const block of availableBlocks) {
          if (remainingCapacity <= 0) break;
          blocksToAllocate.push(block.id);
          remainingCapacity -= Number(block.kw || 0);
        }

        // Check if we have enough blocks
        const allocatedCapacity = blocksToAllocate.reduce((sum, blockId) => {
          const block = availableBlocks.find((b) => b.id === blockId);
          return sum + Number(block?.kw || 0);
        }, 0);

        if (allocatedCapacity < Number(allocation.capacity_kw)) {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "INSUFFICIENT_CAPACITY",
                message: `Only ${allocatedCapacity.toFixed(2)} kW available. Required: ${allocation.capacity_kw} kW`,
              },
            },
            { status: 400 }
          );
        }

        // Update capacity blocks status to ALLOCATED
        // Use admin client to bypass RLS for this operation
        const { error: updateBlocksError } = await adminClient
          .from("capacity_blocks")
          .update({ status: "ALLOCATED" })
          .in("id", blocksToAllocate);

        if (updateBlocksError) {
          console.error("Error updating capacity blocks:", updateBlocksError);
          return NextResponse.json(
            {
              success: false,
              error: { code: "DB_ERROR", message: "Failed to allocate capacity blocks" },
            },
            { status: 500 }
          );
        }

        // Update allocation status to active
        const { error: updateAllocationError } = await supabase
          .from("allocations")
          .update({
            status: "active",
            start_date: new Date().toISOString().split("T")[0],
          })
          .eq("id", payment.allocation_id);

        if (updateAllocationError) {
          console.error("Error updating allocation:", updateAllocationError);
          // Try to revert capacity blocks (though this is best-effort)
          await adminClient
            .from("capacity_blocks")
            .update({ status: "AVAILABLE" })
            .in("id", blocksToAllocate);
          
          return NextResponse.json(
            {
              success: false,
              error: { code: "DB_ERROR", message: "Failed to activate allocation" },
            },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to verify payment",
        },
      },
      { status: 500 }
    );
  }
}

