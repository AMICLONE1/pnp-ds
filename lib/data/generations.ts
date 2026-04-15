export type ProjectStatus = "active" | "maintenance" | "offline";
export type AlertSeverity = "warning" | "critical" | "info";
export type ChartPeriod = "daily" | "weekly" | "monthly";

export interface GenerationProject {
    id: string;
    name: string;
    location: string;
    state: string;
    installedCapacity: number;
    todayGeneration: number;
    monthlyGeneration: number;
    lifetimeGeneration: number;
    performanceRatio: number;
    cuf: number;
    downtime: number;
    status: ProjectStatus;
    revenue: number;
    installDate: string;
    alerts: GenerationAlert[];
    maintenanceHistory: MaintenanceEntry[];
    dailyData: { date: string; value: number }[];
    monthlyData: { month: string; value: number }[];
}

export interface GenerationAlert {
    id: string;
    projectName: string;
    message: string;
    severity: AlertSeverity;
    timestamp: string;
}

export interface MaintenanceEntry {
    id: string;
    date: string;
    type: string;
    description: string;
    status: "completed" | "scheduled" | "in-progress";
}

export interface GenerationStats {
    totalEnergy: number;
    totalEnergyChange: number;
    todayGeneration: number;
    todayChange: number;
    monthGeneration: number;
    monthChange: number;
    totalRevenue: number;
    revenueChange: number;
    activeProjects: number;
    activeChange: number;
    avgPerformanceRatio: number;
    prChange: number;
}

export interface EnvironmentalImpact {
    co2Offset: number;
    treesPlanted: number;
    cleanEnergyPercent: number;
}