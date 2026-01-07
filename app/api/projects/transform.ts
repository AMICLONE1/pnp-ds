/**
 * Transform database project fields to frontend format
 * Handles different schema field names
 */

interface DatabaseProject {
  id: string;
  name: string;
  description?: string;
  location: string;
  state: string;
  // Handle both naming conventions
  price_per_kw?: number;
  rate_per_kwh?: number;
  total_capacity_kw?: number;
  total_kw?: number;
  available_capacity_kw?: number;
  available_capacity?: number;
  status: string;
  commission_date?: string;
  operational_until?: string;
  image_url?: string;
  spv_id?: string;
}

export function transformProject(project: DatabaseProject) {
  return {
    id: project.id,
    name: project.name,
    description: project.description || "",
    location: project.location,
    state: project.state,
    price_per_kw: project.price_per_kw || project.rate_per_kwh || 500,
    available_capacity_kw:
      project.available_capacity_kw ||
      project.available_capacity ||
      project.total_capacity_kw ||
      project.total_kw ||
      0,
    commission_date: project.commission_date,
    operational_until: project.operational_until,
    image_url: project.image_url,
    rate_per_kwh: project.rate_per_kwh || project.price_per_kw || 6.05,
  };
}

