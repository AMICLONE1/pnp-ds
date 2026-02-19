import {
  AlertTriangle,
  Info,
} from "lucide-react";

export function SeverityBadge({ severity } : { severity: "CRITICAL" | "WARNING" | "INFO" }){
    const styles = {
      CRITICAL: "bg-red-100 text-red-700 border-red-200",
      WARNING: "bg-amber-50 text-amber-700 border-amber-200",
      INFO: "bg-blue-50 text-blue-700 border-blue-200",
    };
    const icons = {
      CRITICAL: AlertTriangle,
      WARNING: AlertTriangle,
      INFO: Info,
    };
    const Icon = icons[severity];
    return(
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[severity]}`}>
            <Icon className="w-3 h-3" />
            {severity}
        </span>
    )
}