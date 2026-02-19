import { LivePulse } from "./LivePulse";

export function StatusBadge({ status } : { status: "ACTIVE" | "MAINTENANCE" | "INACTIVE" }){
    const styles = {
      ACTIVE: "bg-green-50 text-green-700 border-green-200",
      MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200",
      INACTIVE: "bg-gray-100 text-gray-600 border-gray-200",
    };
    return(
        <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
        >
        {status === "ACTIVE" && <LivePulse />}
        {status}
        </span>
    )
}