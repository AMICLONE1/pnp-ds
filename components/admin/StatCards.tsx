import {
  Zap,
  Users,
  FolderKanban,
  Wallet,
} from "lucide-react";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

export default function StatCards(){
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminStatCard
            icon={Zap}
            label="Deployed Capacity"
            value={stats.totalDeployedCapacity}
            suffix=" kW"
            color="text-gold-dark"
            bgColor="bg-gold/10"
            delay={0}
            trend={stats.capacityUtilization}
            trendLabel={`${stats.capacityUtilization}% utilization`}
            />
            <AdminStatCard
            icon={Users}
            label="Active Users"
            value={stats.activeUsers}
            color="text-green-600"
            bgColor="bg-green-100"
            delay={0.1}
            />
            <AdminStatCard
            icon={FolderKanban}
            label="Active Projects"
            value={stats.activeProjects}
            color="text-blue-600"
            bgColor="bg-blue-100"
            delay={0.2}
            />
            <AdminStatCard
            icon={Wallet}
            label="Total Revenue"
            value={stats.totalRevenue}
            prefix="₹"
            color="text-purple-600"
            bgColor="bg-purple-100"
            delay={0.3}
            />
        </div>    
    )
}