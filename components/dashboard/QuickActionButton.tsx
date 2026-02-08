import { motion } from "framer-motion";
import { 
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface QuickActionButtonProps{
    href: string;
  icon: any;
  label: string;
  description: string;
  color: string;
  delay?: number;
}

export default function QuickActionButton({ href, 
  icon: Icon, 
  label, 
  description,
  color,
  delay = 0} : QuickActionButtonProps){ 
    return(
        <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Link href={href}>
        <motion.div 
          className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-200/30 hover:shadow-lg transition-all cursor-pointer"
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6 text-black" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-black group-hover:text-black transition-colors">{label}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
        </motion.div>
      </Link>
        </motion.div>
    )
}