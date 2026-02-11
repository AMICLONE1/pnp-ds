import { motion } from "framer-motion";
import { 
  Sun,
  Activity,
  Calendar,
  
} from "lucide-react";

export default function WelcomeBanner(){
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    const emoji = hour < 12 ? "🌅" : hour < 17 ? "☀️" : "🌙";
    return(
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gold/5 to-amber-50/30 p-8 md:p-10 mb-8 border border-gold/20 shadow-lg shadow-gold/5"
        >
            {/* Enhanced decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-gold/20 via-gold/10 to-transparent rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-100/30 via-transparent to-transparent rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
            
            {/* Animated sun with glow effect */}
            <motion.div 
            className="absolute top-6 right-6 md:top-8 md:right-8 opacity-30"
            animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
            }}
            transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            >
            <div className="relative">
                <Sun className="w-28 h-28 md:w-32 md:h-32 text-gold drop-shadow-lg" />
                <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl" />
            </div>
            </motion.div>
            
            <div className="relative z-10">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                <div className="flex items-center gap-3 mb-3">
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="text-2xl"
                >
                    {emoji}
                </motion.span>
                <p className="text-gold font-semibold text-sm md:text-base tracking-wide uppercase">
                    {greeting}!
                </p>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-black mb-3 leading-tight">
                Welcome to Your{" "}
                <span className="bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent">
                    Dashboard
                </span>
                </h1>
                
                <p className="text-gray-700 text-base md:text-lg max-w-2xl leading-relaxed">
                Track your solar energy production, savings, and environmental impact all in one place.
                </p>
            </motion.div>
            
            {/* Enhanced status indicators */}
            <motion.div 
                className="flex flex-wrap gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
            >
                <motion.div 
                className="flex items-center gap-2.5 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl shadow-sm"
                whileHover={{ scale: 1.05, shadow: "md" }}
                transition={{ type: "spring", stiffness: 300 }}
                >
                <div className="relative">
                    <Activity className="w-5 h-5 text-green-600" />
                    <motion.div
                    className="absolute inset-0 bg-green-400 rounded-full blur-sm opacity-50"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Status</span>
                    <span className="text-sm font-semibold text-green-700">System Online</span>
                </div>
                </motion.div>
                
                <motion.div 
                className="flex items-center gap-2.5 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm"
                whileHover={{ scale: 1.05, shadow: "md" }}
                transition={{ type: "spring", stiffness: 300 }}
                >
                <Calendar className="w-5 h-5 text-blue-600" />
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">Today</span>
                    <span className="text-sm font-semibold text-blue-700">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </span>
                </div>
                </motion.div>
            </motion.div>
            </div>
        </motion.div>
    )
}