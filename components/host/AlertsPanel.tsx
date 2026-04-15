import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/lib/utils/host/useDashboard";
import { SeverityBadge } from "@/components/host/SeverityBadge";

interface AlertsPanelProps {
  alerts: Alert[];
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-amber-500" />
            Recent Alerts
          </CardTitle>
          <Link href="/host/alerts" className="text-xs text-forest font-medium hover:text-forest-light transition-colors flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              All systems operating normally
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="mt-0.5 shrink-0">
                    <SeverityBadge severity={String(alert.severity).toUpperCase() as "CRITICAL" | "WARNING" | "INFO"} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {alert.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {alert.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {alert.time}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}