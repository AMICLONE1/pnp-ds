import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Calendar,
  BadgeCheck,
  Lock,
} from "lucide-react";

interface SecuritySectionProps {
  profile: {
    created_at: string;
    kyc_status?: string;
  } | null;
}

export default function SecuritySection({ profile }: SecuritySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card id="security" className="overflow-hidden border-2 border-gold/20 shadow-xl">
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
              <Shield className="h-6 w-6 text-gold" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl mb-1">Security</CardTitle>
              <CardDescription className="text-base">
                Manage your account security
              </CardDescription>
            </div>
          </div>
        </div>
        <CardContent className="p-6 pt-6 space-y-5">
          {/* Enhanced Change Password */}
          <motion.div
            className="p-6 border-2 border-gray-200 rounded-2xl hover:border-gold/50 hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-gold/5 transition-all shadow-sm hover:shadow-md"
            whileHover={{ scale: 1.01 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-start gap-4">
              <motion.div
                className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200 shadow-sm"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Lock className="h-6 w-6 text-amber-600" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold text-black mb-2 text-lg">
                  Change Password
                </h3>
                <p className="text-sm text-gray-600 mb-5">
                  Update your password regularly to keep your account secure
                </p>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" className="rounded-xl border-2 hover:border-gold/50 px-4 py-2 font-semibold">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Account Information */}
          {profile && (
            <motion.div
              className="p-6 border-2 border-gray-200 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 shadow-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-gradient-to-br from-gold/20 to-amber-100/30 border border-gold/30">
                  <BadgeCheck className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-bold text-black text-lg">
                  Account Information
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <motion.div
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gold/30 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Member since</p>
                    <p className="font-bold text-black">
                      {new Date(profile.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gold/30 transition-all"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`p-2.5 rounded-lg border ${
                    profile.kyc_status?.toLowerCase() === "verified"
                      ? "bg-gradient-to-br from-green-100 to-green-50 border-green-200"
                      : "bg-gradient-to-br from-amber-100 to-amber-50 border-amber-200"
                  }`}>
                    <BadgeCheck className={`h-5 w-5 ${
                      profile.kyc_status?.toLowerCase() === "verified"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">KYC Status</p>
                    <p className={`font-bold capitalize ${
                      profile.kyc_status?.toLowerCase() === "verified"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}>
                      {profile.kyc_status || "Pending"}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
