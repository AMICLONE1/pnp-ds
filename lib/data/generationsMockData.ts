// Generation types and mock data for admin generations page

export type ProjectStatus = "active" | "maintenance" | "offline";
export type AlertSeverity = "warning" | "critical" | "info";
export type ChartPeriod = "daily" | "weekly" | "monthly";

export interface GenerationProject {
    id: string;
    name: string;
    location: string;
    state: string;
    installedCapacity: number; // kW
    todayGeneration: number; // kWh
    monthlyGeneration: number; // kWh
    lifetimeGeneration: number; // MWh
    performanceRatio: number; // %
    cuf: number; // %
    downtime: number; // %
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
    totalEnergy: number; // MWh
    totalEnergyChange: number;
    todayGeneration: number; // kWh
    todayChange: number;
    monthGeneration: number; // MWh
    monthChange: number;
    totalRevenue: number;
    revenueChange: number;
    activeProjects: number;
    activeChange: number;
    avgPerformanceRatio: number;
    prChange: number;
}

export interface EnvironmentalImpact {
    co2Offset: number; // tons
    treesPlanted: number;
    cleanEnergyPercent: number;
}

export const generationStats: GenerationStats = {
    totalEnergy: 4852,
    totalEnergyChange: 14.2,
    todayGeneration: 18450,
    todayChange: 5.8,
    monthGeneration: 412,
    monthChange: 8.3,
    totalRevenue: 38_56_000,
    revenueChange: 11.5,
    activeProjects: 8,
    activeChange: 0,
    avgPerformanceRatio: 78.4,
    prChange: 2.1,
};

export const environmentalImpact: EnvironmentalImpact = {
    co2Offset: 3845,
    treesPlanted: 17520,
    cleanEnergyPercent: 94.6,
};

// Chart trend data for different periods
function generateDailyData(): { label: string; value: number; prev: number }[] {
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
        days.push({
            label,
            value: 500 + Math.floor(Math.random() * 400),
            prev: 450 + Math.floor(Math.random() * 350),
        });
    }
    return days;
}

function generateWeeklyData(): { label: string; value: number; prev: number }[] {
    const weeks = [];
    for (let i = 11; i >= 0; i--) {
        weeks.push({
            label: `Week ${12 - i}`,
            value: 3500 + Math.floor(Math.random() * 2500),
            prev: 3200 + Math.floor(Math.random() * 2200),
        });
    }
    return weeks;
}

function generateMonthlyData(): { label: string; value: number; prev: number }[] {
    const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];
    return months.map((m, i) => ({
        label: m,
        value: 280 + Math.floor(Math.random() * 150),
        prev: 250 + Math.floor(Math.random() * 130),
    }));
}

export const trendData = {
    daily: generateDailyData(),
    weekly: generateWeeklyData(),
    monthly: generateMonthlyData(),
};

// Project-level daily/monthly data generators
function projectDailyData(): { date: string; value: number }[] {
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        data.push({
            date: d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
            value: 60 + Math.floor(Math.random() * 80),
        });
    }
    return data;
}

function projectMonthlyData(): { month: string; value: number }[] {
    return ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"].map((m) => ({
        month: m,
        value: 1800 + Math.floor(Math.random() * 1200),
    }));
}

export const mockGenerationProjects: GenerationProject[] = [
    {
        id: "gp-1", name: "Kutch Solar Farm", location: "Kutch", state: "Gujarat",
        installedCapacity: 500, todayGeneration: 2340, monthlyGeneration: 52000,
        lifetimeGeneration: 624, performanceRatio: 82.3, cuf: 21.5, downtime: 1.2,
        status: "active", revenue: 468000, installDate: "2023-06-15",
        alerts: [], maintenanceHistory: [
            { id: "m1", date: "2026-01-10", type: "Preventive", description: "Panel cleaning and inspection", status: "completed" },
            { id: "m2", date: "2026-03-15", type: "Scheduled", description: "Inverter firmware update", status: "scheduled" },
        ],
        dailyData: projectDailyData(), monthlyData: projectMonthlyData(),
    },
    {
        id: "gp-2", name: "Jaisalmer Solar Park", location: "Jaisalmer", state: "Rajasthan",
        installedCapacity: 750, todayGeneration: 3180, monthlyGeneration: 71000,
        lifetimeGeneration: 890, performanceRatio: 80.1, cuf: 22.8, downtime: 0.8,
        status: "active", revenue: 625000, installDate: "2023-03-22",
        alerts: [], maintenanceHistory: [
            { id: "m3", date: "2026-02-01", type: "Corrective", description: "String combiner box replacement", status: "completed" },
        ],
        dailyData: projectDailyData(), monthlyData: projectMonthlyData(),
    },
    {
        id: "gp-3", name: "Anantapur Solar Hub", location: "Anantapur", state: "Andhra Pradesh",
        installedCapacity: 400, todayGeneration: 1890, monthlyGeneration: 42500,
        lifetimeGeneration: 510, performanceRatio: 79.5, cuf: 20.1, downtime: 2.1,
        status: "active", revenue: 382000, installDate: "2023-09-10",
        alerts: [], maintenanceHistory: [
            { id: "m4", date: "2026-01-25", type: "Preventive", description: "Tracker alignment calibration", status: "completed" },
        ],
        dailyData: projectDailyData(), monthlyData: projectMonthlyData(),
    },
    {
        id: "gp-4", name: "Pavagada Solar Plant", location: "Pavagada", state: "Karnataka",
        installedCapacity: 600, todayGeneration: 2650, monthlyGeneration: 59000,
        lifetimeGeneration: 720, performanceRatio: 81.7, cuf: 23.1, downtime: 0.5,
        status: "active", revenue: 540000, installDate: "2022-12-01",
        alerts: [], maintenanceHistory: [],
        dailyData: projectDailyData(), monthlyData: projectMonthlyData(),
    },
    {
        id: "gp-5", name: "Bhadla Solar Complex", location: "Bhadla", state: "Rajasthan",
        installedCapacity: 1000, todayGeneration: 4520, monthlyGeneration: 98000,
        lifetimeGeneration: 1180, performanceRatio: 83.2, cuf: 24.5, downtime: 0.3,
        status: "active", revenue: 890000, installDate: "2022-08-15",
        alerts: [], maintenanceHistory: [
            { id: "m5", date: "2025-12-20", type: "Preventive", description: "Annual inverter maintenance", status: "completed" },
            { id: "m6", date: "2026-04-01", type: "Scheduled", description: "Module thermography test", status: "scheduled" },
        ],
        dailyData: projectDailyData(), monthlyData: projectMonthlyData(),
    },
    {
        id: "gp-6", name: "Charanka Solar Park", location: "Charanka", state: "Gujarat",
        installedCapacity: 350, todayGeneration: 0, monthlyGeneration: 28000,
        lifetimeGeneration: 380, performanceRatio: 72.4, cuf: 18.9, downtime: 8.5,
        status: "maintenance", revenue: 285000, installDate: "2023-11-05",
        alerts: [], maintenanceHistory: [
            { id: "m7", date: "2026-02-05", type: "Corrective", description: "Inverter replacement — unit #3 failure", status: "in-progress" },
        ],
        dailyData: projectDailyData(), monthlyData: projectMonthlyData(),
    },
    {
        id: "gp-7", name: "Kamuthi Solar Farm", location: "Kamuthi", state: "Tamil Nadu",
        installedCapacity: 450, todayGeneration: 2100, monthlyGeneration: 46000,
        lifetimeGeneration: 560, performanceRatio: 77.8, cuf: 19.7, downtime: 1.8,
        status: "active", revenue: 415000, installDate: "2023-05-20",
        alerts: [], maintenanceHistory: [],
        dailyData: projectDailyData(), monthlyData: projectMonthlyData(),
    },
    {
        id: "gp-8", name: "Rewa Solar Plant", location: "Rewa", state: "Madhya Pradesh",
        installedCapacity: 550, todayGeneration: 2480, monthlyGeneration: 54000,
        lifetimeGeneration: 660, performanceRatio: 80.6, cuf: 21.9, downtime: 1.0,
        status: "active", revenue: 498000, installDate: "2023-01-12",
        alerts: [], maintenanceHistory: [
            { id: "m8", date: "2026-01-18", type: "Preventive", description: "Wiring insulation check", status: "completed" },
        ],
        dailyData: projectDailyData(), monthlyData: projectMonthlyData(),
    },
    {
        id: "gp-9", name: "Kurnool Solar Park", location: "Kurnool", state: "Andhra Pradesh",
        installedCapacity: 300, todayGeneration: 0, monthlyGeneration: 0,
        lifetimeGeneration: 210, performanceRatio: 0, cuf: 0, downtime: 100,
        status: "offline", revenue: 158000, installDate: "2024-02-28",
        alerts: [], maintenanceHistory: [
            { id: "m9", date: "2026-02-08", type: "Corrective", description: "Grid connection fault — awaiting utility response", status: "in-progress" },
        ],
        dailyData: projectDailyData(), monthlyData: projectMonthlyData(),
    },
    {
        id: "gp-10", name: "Neemuch Solar Hub", location: "Neemuch", state: "Madhya Pradesh",
        installedCapacity: 420, todayGeneration: 1950, monthlyGeneration: 43000,
        lifetimeGeneration: 490, performanceRatio: 76.9, cuf: 20.3, downtime: 2.5,
        status: "active", revenue: 370000, installDate: "2023-07-08",
        alerts: [], maintenanceHistory: [],
        dailyData: projectDailyData(), monthlyData: projectMonthlyData(),
    },
];

export const mockAlerts: GenerationAlert[] = [
    { id: "a1", projectName: "Charanka Solar Park", message: "Inverter #3 offline — replacement in progress", severity: "critical", timestamp: "2026-02-10T08:15:00Z" },
    { id: "a2", projectName: "Kurnool Solar Park", message: "Grid connection failure — zero generation", severity: "critical", timestamp: "2026-02-10T06:30:00Z" },
    { id: "a3", projectName: "Anantapur Solar Hub", message: "Generation 15% below expected — possible soiling", severity: "warning", timestamp: "2026-02-10T10:45:00Z" },
    { id: "a4", projectName: "Neemuch Solar Hub", message: "Data sync delay — last update 2 hours ago", severity: "info", timestamp: "2026-02-10T11:00:00Z" },
    { id: "a5", projectName: "Kamuthi Solar Farm", message: "Low generation detected during peak hours", severity: "warning", timestamp: "2026-02-09T14:20:00Z" },
    { id: "a6", projectName: "Bhadla Solar Complex", message: "Scheduled maintenance reminder — April 2026", severity: "info", timestamp: "2026-02-09T09:00:00Z" },
];
