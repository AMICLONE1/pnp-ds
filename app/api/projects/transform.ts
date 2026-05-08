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
  insurance_document_path?: string | null;
  insurance_uploaded_at?: string | null;
  ppa_document_path?: string | null;
  ppa_document_uploaded_at?: string | null;
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
    documents: {
      ppa_available: Boolean(project.ppa_document_path),
      ppa_uploaded_at: project.ppa_document_uploaded_at || null,
      insurance_available: Boolean(project.insurance_document_path),
      insurance_uploaded_at: project.insurance_uploaded_at || null,
    },
  };
}

