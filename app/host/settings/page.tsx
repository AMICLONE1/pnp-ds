import { ShieldCheck, Building2, CreditCard, BellRing, LockKeyhole, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function HostSettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-[1400px] mx-auto">
      <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-slate-50 to-amber-50/30 p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest/5 border border-forest/10 text-forest text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Host account settings
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-black font-heading">
          Portal configuration
        </h1>
        <p className="text-gray-600 mt-2 max-w-2xl">
          Keep the business profile, billing preferences, and access controls aligned with the PPA contract. Host accounts are admin-managed, so sensitive fields should always be reviewed before changes go live.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="shadow-sm border-gray-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-forest" />
              Business profile
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Business name</p>
              <p className="text-sm font-semibold text-black mt-1">Vedvyas Solar Park</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Contact email</p>
              <p className="text-sm font-semibold text-black mt-1">host@example.com</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Billing cycle</p>
              <p className="text-sm font-semibold text-black mt-1">Monthly PPA invoice on the 1st</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Average invoice</p>
              <p className="text-sm font-semibold text-black mt-1">{formatCurrency(446302.5)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-gold" />
              Remittance details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Preferred payout bank</p>
              <p className="font-semibold text-black mt-1">State Bank of India</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">IFSC</p>
              <p className="font-semibold text-black mt-1">SBIN0001234</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Payment due day</p>
              <p className="font-semibold text-black mt-1">10th of every month</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wide font-semibold">Grace period</p>
              <p className="font-semibold text-black mt-1">7 days</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BellRing className="w-5 h-5 text-amber-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p className="rounded-2xl bg-gray-50 p-4">Payment reminders, maintenance notices, and new invoice alerts are routed here and should be acknowledged promptly.</p>
            <p className="rounded-2xl bg-gray-50 p-4">Use the alert center for issue triage, then move financial follow-ups into the invoice history after the monthly payment clears.</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <LockKeyhole className="w-5 h-5 text-forest" />
              Security posture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p className="rounded-2xl bg-gray-50 p-4">Keep admin-issued credentials unique per host account, enable MFA for admin users, and avoid sharing login links across tenants.</p>
            <p className="rounded-2xl bg-gray-50 p-4">Payment data should never be accepted from the browser. Only server-calculated amounts and signed Razorpay payloads should update billing records.</p>
            <div className="flex items-center gap-2 pt-1 text-forest font-medium">
              <Mail className="w-4 h-4" />
              Password recovery and account resets stay centralized under the admin workflow.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
