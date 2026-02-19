"use client";

import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export function StatusBadge({ status }: { status: "PAID" | "PENDING" | "OVERDUE" }) {
  const config = {
    PAID: { bg: "bg-green-50 border-green-200", text: "text-green-700", Icon: CheckCircle2 },
    PENDING: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", Icon: Clock },
    OVERDUE: { bg: "bg-red-50 border-red-200", text: "text-red-600", Icon: AlertCircle },
  };
  const { bg, text, Icon } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${bg} ${text}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}
