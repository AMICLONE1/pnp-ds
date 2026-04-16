import { Skeleton, SkeletonShimmer } from "@/components/ui/skeleton";

export function ProjectListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-white shadow-[0_24px_80px_rgba(255,180,0,0.08)]">
            <SkeletonShimmer className="h-1.5 w-full rounded-none" />
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-7 w-32 rounded-full" />
                <Skeleton className="h-7 w-36 rounded-full" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-11/12" />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm space-y-3">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-12 w-48 rounded-full" />
                <Skeleton className="h-12 w-36 rounded-full" />
              </div>
            </div>
          </div>

          <div className="space-y-3" aria-hidden="true">
            <div className="flex items-end justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-72" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <SkeletonShimmer className="h-3 w-full rounded-none" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[...Array(2)].map((_, statIndex) => (
                        <div key={statIndex} className="rounded-2xl border border-gray-100 bg-gray-50 p-3 space-y-2">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl">
            <div className="border-b border-gold/15 bg-gradient-to-br from-gold/10 via-amber-50 to-white px-5 py-4 space-y-3">
              <Skeleton className="h-3 w-32 rounded-full" />
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-44" />
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-full" />
              </div>

              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <Skeleton className="h-12 w-full rounded-full" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-white p-5 shadow-lg space-y-3">
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
