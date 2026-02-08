import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  Search,
  HelpCircle,
} from "lucide-react";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultCount: number;
}

export default function Hero({ searchQuery, setSearchQuery, resultCount }: HeroProps){
    return(
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-white to-white-light py-16 mb-12">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }} />
          </div>

          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-black/90 text-sm font-medium mb-6"
              >
                <HelpCircle className="h-4 w-4" />
                We&apos;re here to help
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-black">
                Help Center
              </h1>
              <p className="text-lg text-black/70 mb-8">
                Find answers to common questions and learn how to use PowerNetPro
              </p>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative max-w-2xl mx-auto"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 h-14 text-lg rounded-2xl border-0 shadow-xl shadow-black/10 focus:ring-2 focus:ring-gold"
                />
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400"
                  >
                    {resultCount} results
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
    )
}
