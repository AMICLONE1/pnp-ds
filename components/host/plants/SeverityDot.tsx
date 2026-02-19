interface SeverityDotProps{
    severity: "CRITICAL" | "WARNING" | "INFO"
}
export function SeverityDot({ severity } : SeverityDotProps){
      const colors = {
        CRITICAL: "bg-red-500",
        WARNING: "bg-amber-500",
        INFO: "bg-blue-500",
      };
      return <span className={`w-2 h-2 rounded-full ${colors[severity]}`} />;
}