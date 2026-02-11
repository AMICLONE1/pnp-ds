import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Sun,
  Shield,
  ChevronRight,
  Info,
  Clock,
  Building2,
  BadgeCheck
} from "lucide-react";

export default function PageHero(){
    return(
        <section className="relative bg-gradient-to-br from-white via-gold/5 to-amber-50/30 overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-br from-gold/20 via-gold/10 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100/30 via-transparent to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,184,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,184,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="pt-32 pb-20 md:pt-40 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Enhanced badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-gold/20 via-gold/15 to-gold/20 border border-gold/30 rounded-full text-sm font-semibold mb-8 shadow-lg shadow-gold/10 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="w-4 h-4 text-gold" />
              </motion.div>
              <span className="text-gold font-bold tracking-wide">Solar Projects Available</span>
            </motion.div>

            {/* Enhanced heading */}
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-black mb-6 leading-tight"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Reserve Your{" "}
              <motion.span 
                className="bg-gradient-to-r from-gold via-amber-500 to-gold bg-clip-text text-transparent relative inline-block"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                Solar Capacity
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-gold via-amber-500 to-gold rounded-full opacity-50"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                />
              </motion.span>
            </motion.h1>

            {/* Enhanced description */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10 leading-relaxed font-medium"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Choose from verified solar projects across India. Start saving on electricity bills with just a few clicks.
            </motion.p>

            {/* Enhanced trust indicators */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 md:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <motion.div 
                className="flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm border border-gold/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center border border-green-200">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">Guarantee</p>
                  <p className="text-sm font-bold text-black">75% Generation</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm border border-gold/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center border border-blue-200">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">Setup Time</p>
                  <p className="text-sm font-bold text-black">5 Minutes</p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm border border-gold/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center border border-amber-200">
                  <BadgeCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500 font-medium">Verification</p>
                  <p className="text-sm font-bold text-black">Verified Projects</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path
            d="M0,96L48,85.3C96,75,192,53,288,48C384,43,480,53,576,69.3C672,85,768,107,864,106.7C960,107,1056,85,1152,74.7C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
            className="drop-shadow-lg"
          />
        </svg>
      </div>
    </section>
    )
}