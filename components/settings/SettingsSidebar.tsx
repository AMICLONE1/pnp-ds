import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Bell,
  Shield,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

interface SettingsSidebarProps {
  name: string;
  email: string;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function SettingsSidebar({
  name,
  email,
  activeSection,
  setActiveSection,
}: SettingsSidebarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="md:col-span-1"
    >
      <Card className="sticky top-28 overflow-hidden border-2 border-gold/20 shadow-xl">
        {/* Enhanced User Profile Header */}
        <div className="relative bg-gradient-to-br from-gold/10 via-amber-50/30 to-gold/5 p-5 border-b border-gold/20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full blur-2xl" />
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-amber-100/30 border-2 border-gold/30 flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <User className="h-7 w-7 text-gold" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-black truncate text-base">{name || "User"}</p>
              <p className="text-xs text-gray-600 truncate mt-0.5">{email}</p>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveSection(item.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-gold/20 via-amber-50/30 to-gold/20 text-black border-2 border-gold/30 shadow-md"
                    : "text-black hover:bg-gray-50 border-2 border-transparent hover:border-gray-200"
                }`}
              >
                {activeSection === item.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`h-5 w-5 relative z-10 ${activeSection === item.id ? "text-gold" : "text-gray-400 group-hover:text-gold"}`} />
                <span className="font-semibold relative z-10">{item.label}</span>
                <ChevronRight className={`h-4 w-4 ml-auto relative z-10 transition-transform ${activeSection === item.id ? "text-gold translate-x-1" : "text-gray-300 group-hover:translate-x-1"}`} />
              </motion.a>
            ))}
          </nav>
        </CardContent>
      </Card>
    </motion.div>
  );
}
