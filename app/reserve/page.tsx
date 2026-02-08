"use client";

export const dynamic = 'force-dynamic';
import { Suspense } from "react";
import { ProjectListSkeleton } from "@/components/ui/skeletons/ProjectListSkeleton";
import ReservePageContent from "@/components/reserve/ReservePageContent";

export default function ReservePage() {
  return (
    <Suspense fallback={<ProjectListSkeleton />}>
      <ReservePageContent />
    </Suspense>
  );
}
