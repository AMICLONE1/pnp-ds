import { Skeleton, SkeletonCircle, SkeletonShimmer } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center space-y-4">
              <SkeletonCircle className="h-20 w-20" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-5 w-32 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>

          {/* Quote Card */}
          <div className="bg-gradient-to-br from-white/5 to-gold/5 rounded-2xl p-6 border border-gray-100">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/6 mb-4" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <Skeleton className="h-7 w-24 mb-2" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>

          {/* Content Cards with Posts */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {/* Post Header */}
                <div className="flex items-start gap-4 mb-4">
                  <SkeletonCircle className="h-12 w-12 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>

                {/* Post Content */}
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Post Image (for some cards) */}
                {i % 2 === 0 && (
                  <SkeletonShimmer className="h-64 w-full rounded-xl mb-4" />
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
              <SkeletonShimmer className="h-64 w-full rounded-lg" />
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
              <SkeletonShimmer className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
