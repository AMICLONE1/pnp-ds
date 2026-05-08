"use client";

import Link from "next/link";
import { FileText, ShieldCheck } from "lucide-react";

export type ProjectDocumentsCardProps = {
  projectId: string;
  projectName?: string;
  ppaAvailable: boolean;
  ppaUploadedAt?: string | null;
  insuranceAvailable: boolean;
  insuranceUploadedAt?: string | null;
  className?: string;
  /**
   * When set to "compact" the card renders without the title block — useful
   * when embedding inside another section that already has a heading.
   */
  variant?: "default" | "compact";
};

function formatDate(value: string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Renders View/Download buttons for a project's PPA + plant insurance.
 * Used on:
 *   - the public reserve cards (via ProjectCard)
 *   - host portal (so the host can pull their own contract)
 *   - subscriber dashboard (so subscribers see what they signed up to)
 *
 * If neither document is uploaded yet, the card renders nothing — empty
 * state is handled by the parent page.
 */
export function ProjectDocumentsCard({
  projectId,
  projectName,
  ppaAvailable,
  ppaUploadedAt,
  insuranceAvailable,
  insuranceUploadedAt,
  className,
  variant = "default",
}: ProjectDocumentsCardProps) {
  if (!ppaAvailable && !insuranceAvailable) return null;

  const ppaDate = formatDate(ppaUploadedAt);
  const insuranceDate = formatDate(insuranceUploadedAt);

  return (
    <div
      className={
        "rounded-2xl border border-gray-200 bg-white p-5 " + (className || "")
      }
    >
      {variant === "default" && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-black">Project documents</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {projectName
              ? `${projectName} — official agreements and certificates.`
              : "Official agreements and certificates."}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ppaAvailable && (
          <Link
            href={`/api/projects/${projectId}/documents/ppa`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 rounded-xl border border-gold/25 bg-gold/5 p-3 hover:bg-gold/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-gold-dark" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-black">PPA Agreement</p>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                {ppaDate ? `Uploaded ${ppaDate}` : "View signed agreement"}
              </p>
            </div>
          </Link>
        )}

        {insuranceAvailable && (
          <Link
            href={`/api/projects/${projectId}/documents/insurance`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 hover:bg-emerald-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-black">Plant Insurance</p>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                {insuranceDate ? `Uploaded ${insuranceDate}` : "View certificate"}
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
