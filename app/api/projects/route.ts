import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { transformProject } from "./transform";

export async function GET() {
  try {
    const supabase = await createClient();

    // Try different status values - handle both enum and text
    let projects: any[] = [];
    let projectsError: any = null;

    // First try with 'ACTIVE' (enum value - uppercase)
    let { data: projectsData, error: error1 } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "ACTIVE")
      .order("created_at", { ascending: false });

    // If that fails, try with 'active' (lowercase)
    if (error1) {
      console.error("Error with ACTIVE status, trying 'active':", error1);
      const result = await supabase
        .from("projects")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      
      if (!result.error) {
        projectsData = result.data;
        projectsError = null;
      } else {
        projectsError = result.error;
      }
    } else {
      projectsData = projectsData;
      projectsError = null;
    }

    // If still fails, try without status filter (get all projects)
    if (projectsError) {
      console.error("Error with status filter, trying without filter:", projectsError);
      const result = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (!result.error) {
        projectsData = result.data;
        projectsError = null;

        // Filter active projects in code if needed
        if (projectsData) {
          projectsData = projectsData.filter(
            (p: any) => 
              p.status === "active" || 
              p.status === "ACTIVE" || 
              p.status?.toLowerCase() === "active"
          );
        }
      } else {
        projectsError = result.error;
      }
    }

    if (projectsError) {
      console.error("Projects fetch error:", projectsError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DB_ERROR",
            message: projectsError.message || "Failed to fetch projects",
            details: process.env.NODE_ENV === "development" ? projectsError : undefined,
          },
        },
        { status: 500 }
      );
    }

    projects = projectsData || [];

    // Calculate available capacity for each project from capacity_blocks
    if (projects.length > 0) {
      const projectIds = projects.map((p: any) => p.id);
      
      // Get available capacity blocks for all projects
      const { data: capacityBlocks } = await supabase
        .from("capacity_blocks")
        .select("project_id, kw")
        .in("project_id", projectIds)
        .eq("status", "AVAILABLE");

      // Calculate available capacity per project
      const capacityMap = new Map<string, number>();
      if (capacityBlocks) {
        capacityBlocks.forEach((block: any) => {
          const current = capacityMap.get(block.project_id) || 0;
          capacityMap.set(block.project_id, current + Number(block.kw || 0));
        });
      }

      // Add available_capacity_kw to each project
      projects = projects.map((project: any) => ({
        ...project,
        available_capacity_kw: capacityMap.get(project.id) || project.total_kw || 0,
      }));
    }

    // Transform projects to match frontend interface
    const transformedProjects = projects.map(transformProject);

    return NextResponse.json({ success: true, data: transformedProjects });
  } catch (error: any) {
    console.error("Projects API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Internal server error",
          stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        },
      },
      { status: 500 }
    );
  }
}

