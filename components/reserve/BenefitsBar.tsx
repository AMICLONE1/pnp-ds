import {
  Zap,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";


export default function BenefitsBar(){
    const benefits = [
    { icon: Clock, label: "5-min setup", description: "Quick & easy" },
    { icon: Shield, label: "75% guaranteed", description: "Protected returns" },
    { icon: Zap, label: "Zero installation", description: "No roof needed" },
    { icon: Users, label: "10,000+ users", description: "Trusted platform" },
  ];
    return (
        <div className="bg-gradient-to-r from-offwhite to-white py-8 border-b border-gray-100">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
                >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-black" />
                </div>
                <div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-semibold text-black">{benefit.label}</div>
                    <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs text-gray-500">{benefit.description}</div>
                </div>
                </motion.div>
            ))}
            </div>
        </div>
        </div>
    )
}