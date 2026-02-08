import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  Mail,
  Smartphone,
} from "lucide-react";

interface NotificationSectionProps {
  formData: { email_notifications: boolean; sms_notifications: boolean };
  setFormData: (data: any) => void;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function NotificationSection({
  formData,
  setFormData,
  saving,
  onSubmit,
}: NotificationSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card id="notifications" className="overflow-hidden border-2 border-gold/20 shadow-xl">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-gold/10 via-amber-50/30 to-gold/10 p-6 border-b border-gold/20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl" />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <motion.div
              className="p-3 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100/30 border border-gold/30 shadow-md"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Bell className="h-6 w-6 text-gold" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl mb-1">Notification Preferences</CardTitle>
              <CardDescription className="text-base">
                Choose how you want to be notified
              </CardDescription>
            </div>
          </div>
        </div>
        <CardContent className="p-6 pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Enhanced Email Notifications */}
            <motion.div
              className={`relative p-6 border-2 rounded-2xl transition-all group shadow-sm hover:shadow-lg overflow-hidden ${
                formData.email_notifications
                  ? "border-gold/50 bg-gradient-to-br from-gold/10 via-amber-50/20 to-gold/5"
                  : "border-gray-200 hover:border-gold/30 bg-gradient-to-br from-white to-gray-50/50"
              }`}
              whileHover={{ scale: 1.01, y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Background glow when enabled */}
              {formData.email_notifications && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5"
                />
              )}

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <motion.div
                    className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                      formData.email_notifications
                        ? "bg-gradient-to-br from-blue-100 to-blue-50 border-blue-300"
                        : "bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200"
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{ scale: formData.email_notifications ? 1.05 : 1 }}
                  >
                    <Mail className={`h-6 w-6 transition-colors ${
                      formData.email_notifications ? "text-blue-600" : "text-blue-400"
                    }`} />
                  </motion.div>
                  <div className="flex-1">
                    <label className="font-bold text-black text-lg cursor-pointer block mb-1">
                      Email Notifications
                    </label>
                    <p className="text-sm text-gray-600">
                      Bills, credits, and important updates
                    </p>
                    {formData.email_notifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">Active</span>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div
                  role="switch"
                  aria-checked={formData.email_notifications}
                  tabIndex={0}
                  onClick={() => setFormData({ ...formData, email_notifications: !formData.email_notifications })}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFormData({ ...formData, email_notifications: !formData.email_notifications }); } }}
                  className={`ml-4 w-12 h-7 rounded-full transition-all duration-300 relative shadow-inner cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
                    formData.email_notifications
                      ? "bg-gradient-to-r from-gold to-amber-500"
                      : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md pointer-events-none"
                    animate={{ left: formData.email_notifications ? "calc(100% - 1.625rem)" : "0.125rem" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Enhanced SMS Notifications */}
            <motion.div
              className={`relative p-6 border-2 rounded-2xl transition-all group shadow-sm hover:shadow-lg overflow-hidden ${
                formData.sms_notifications
                  ? "border-gold/50 bg-gradient-to-br from-gold/10 via-amber-50/20 to-gold/5"
                  : "border-gray-200 hover:border-gold/30 bg-gradient-to-br from-white to-gray-50/50"
              }`}
              whileHover={{ scale: 1.01, y: -2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {/* Background glow when enabled */}
              {formData.sms_notifications && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5"
                />
              )}

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <motion.div
                    className={`p-4 rounded-xl border-2 transition-all shadow-md ${
                      formData.sms_notifications
                        ? "bg-gradient-to-br from-green-100 to-green-50 border-green-300"
                        : "bg-gradient-to-br from-green-50 to-green-100/50 border-green-200"
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{ scale: formData.sms_notifications ? 1.05 : 1 }}
                  >
                    <Smartphone className={`h-6 w-6 transition-colors ${
                      formData.sms_notifications ? "text-green-600" : "text-green-400"
                    }`} />
                  </motion.div>
                  <div className="flex-1">
                    <label className="font-bold text-black text-lg cursor-pointer block mb-1">
                      SMS Notifications
                    </label>
                    <p className="text-sm text-gray-600">
                      Payment reminders and alerts
                    </p>
                    {formData.sms_notifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-xs font-semibold text-green-700">Active</span>
                      </motion.div>
                    )}
                  </div>
                </div>
                <div
                  role="switch"
                  aria-checked={formData.sms_notifications}
                  tabIndex={0}
                  onClick={() => setFormData({ ...formData, sms_notifications: !formData.sms_notifications })}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFormData({ ...formData, sms_notifications: !formData.sms_notifications }); } }}
                  className={`ml-4 w-12 h-7 rounded-full transition-all duration-300 relative shadow-inner cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold/50 ${
                    formData.sms_notifications
                      ? "bg-gradient-to-r from-gold to-amber-500"
                      : "bg-gray-300"
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md pointer-events-none"
                    animate={{ left: formData.sms_notifications ? "calc(100% - 1.625rem)" : "0.125rem" }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Enhanced Save Button */}
            <motion.div
              className="pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={saving}
                  className="w-full sm:w-auto h-12 rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 px-8 text-base font-semibold"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Save Preferences
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
