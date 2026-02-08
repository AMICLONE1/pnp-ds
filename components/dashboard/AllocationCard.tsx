import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { 
  ArrowRight, 
  Sun,
} from "lucide-react";
import Link from "next/link";


interface AllocationCardProps{
    allocation: any; index: number
}
export default function AllocationCard({allocation, index} : AllocationCardProps){ 
    return(
        <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:border-gray-200/30 hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-orange-500 flex items-center justify-center">
            <Sun className="h-5 w-5 text-black" />
          </div>
          <div>
            <h4 className="font-semibold text-black">
              {allocation.project?.name || "Solar Project"}
            </h4>
            <p className="text-sm text-gray-500">
              {allocation.capacity_kw} kW capacity
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            allocation.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {allocation.status}
        </span>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Monthly</p>
            <p className="font-semibold text-black">{formatCurrency(allocation.monthly_fee || 0)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Savings</p>
            <p className="font-semibold text-green-600">~₹{Math.round((allocation.capacity_kw || 0) * 120 * 7)}</p>
          </div>
        </div>
        <Link href={`/reserve?project=${allocation.project_id}`}>
          <Button variant="ghost" size="sm" className="text-black hover:bg-white/10">
            Details
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>
        </motion.div>
    )
}