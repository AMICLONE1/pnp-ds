import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function HostNotFound() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
      <Card className="border-amber-200 shadow-sm">
        <CardContent className="p-8 sm:p-10 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black font-heading">Host page not found</h1>
            <p className="text-sm sm:text-base text-gray-600">
              This host route does not exist yet. Use the dashboard, alerts, or financials areas to continue.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link href="/host" className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black/85">
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <Link href="/host/financials" className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gray-50">
              <Settings className="h-4 w-4" />
              Open Financials
            </Link>
            <Link href="/host/login" className="inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:text-black">
              <ArrowLeft className="h-4 w-4" />
              Return to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
