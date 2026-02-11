import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface EmptyStateProps{
    icon: any;
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
}


export default function EmptyState({icon: Icon,title,description,actionLabel,actionHref} : EmptyStateProps){ 
    return(
        <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      <motion.div 
        className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-gold/10 flex items-center justify-center"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Icon className="h-10 w-10 text-black" />
      </motion.div>
      <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-xs mx-auto">{description}</p>
      <Link href={actionHref}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="primary" className="bg-gradient-to-r from-white to-white-light">
            <Sparkles className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        </motion.div>
      </Link>
        </motion.div>
    )
}