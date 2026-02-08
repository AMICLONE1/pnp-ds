import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Phone,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface ProfileSectionProps {
  formData: { name: string; phone: string };
  setFormData: (data: any) => void;
  loading: boolean;
  saving: boolean;
  email: string;
  error: string;
  success: string;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProfileSection({
  formData,
  setFormData,
  loading,
  saving,
  email,
  error,
  success,
  onSubmit,
}: ProfileSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card id="profile" className="overflow-hidden border-2 border-gold/20 shadow-xl">
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
              <User className="h-6 w-6 text-gold" />
            </motion.div>
            <div>
              <CardTitle className="text-2xl mb-1">Profile Information</CardTitle>
              <CardDescription className="text-base">
                Update your personal information
              </CardDescription>
            </div>
          </div>
        </div>
        <CardContent className="p-6 pt-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                  <User className="h-4 w-4 text-gold" />
                  Full Name
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={loading}
                  className="h-12 rounded-xl border-2 border-gray-200 focus:border-gold focus:ring-gold/50 transition-all"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                  <Phone className="h-4 w-4 text-gold" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={loading}
                  className="h-12 rounded-xl border-2 border-gray-200 focus:border-gold focus:ring-gold/50 transition-all"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-black mb-2">
                <Mail className="h-4 w-4 text-gold" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  disabled
                  className="flex h-12 w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 cursor-not-allowed pr-24"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-700 font-medium">
                  <Lock className="h-3.5 w-3.5" />
                  Locked
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1.5">
                <Shield className="h-3 w-3" />
                Email cannot be changed for security reasons
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={saving}
                className="h-12 rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/30 px-6 text-base font-semibold"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Save Changes
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
