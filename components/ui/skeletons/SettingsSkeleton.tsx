import { Skeleton, SkeletonCircle } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center space-y-4">
              <SkeletonCircle className="h-24 w-24" />
              <div className="space-y-2 w-full">
                <Skeleton className="h-5 w-32 mx-auto" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>
              <Skeleton className="h-9 w-full rounded-lg" />
            </div>
          </div>

          {/* Settings Menu */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-4 rounded" />
              </div>
            ))}
          </div>

          {/* Help Card */}
          <div className="bg-gradient-to-br from-white/5 to-gold/5 rounded-2xl p-6 border border-gray-100">
            <Skeleton className="h-5 w-24 mb-3" />
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Settings Sections */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              {/* Section Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(i === 0 ? 4 : 3)].map((_, j) => (
                  <div key={j} className={j === 0 && i === 0 ? "md:col-span-2" : ""}>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-11 w-full rounded-lg" />
                    <Skeleton className="h-3 w-48 mt-2" />
                  </div>
                ))}
              </div>

              {/* Toggle Options (for some sections) */}
              {i === 1 && (
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  {[...Array(3)].map((_, k) => (
                    <div key={k} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                      <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
          ))}

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-10 w-40 rounded-lg mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
