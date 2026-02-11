export default function DashboardSkeleton(){
    return(
        <div className="p-8 space-y-8 animate-pulse">
            {/* Header skeleton */}
            <div className="h-8 w-64 bg-gray-100 rounded-lg" />

            {/* Stat cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-2xl" />
                ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="h-80 bg-gray-100 rounded-2xl" />
                <div className="h-80 bg-gray-100 rounded-2xl" />
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="h-80 bg-gray-100 rounded-2xl" />
                <div className="h-80 bg-gray-100 rounded-2xl" />
            </div>
        </div>
    )
}