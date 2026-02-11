"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Zap, TrendingUp, Activity, Sun, Battery, Gauge, Sparkles } from "lucide-react";

interface RealTimeData {
  currentGeneration: number; // kW being generated right now
  todayGeneration: number; // kWh generated today
  monthlyGeneration: number; // kWh generated this month
  creditsGenerated: number; // Credits generated today
  efficiency: number; // Percentage efficiency
}

// Animated stat box component
function StatBox({ 
  icon: Icon, 
  label, 
  value, 
  suffix = "",
  prefix = "",
  bgColor, 
  borderColor,
  textColor,
  iconColor,
  subLabel,
  delay = 0,
  pulse = false
}: {
  icon: any;
  label: string;
  value: string | number;
  suffix?: string;
  prefix?: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  subLabel: string;
  delay?: number;
  pulse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, type: "spring" }}
      whileHover={{ y: -2, scale: 1.02 }}
      className={`relative p-4 ${bgColor} rounded-xl border ${borderColor} overflow-hidden group`}
    >
      {/* Animated gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Pulse effect for live data */}
      {pulse && (
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </motion.div>
          <span className="text-xs text-black font-medium">{label}</span>
        </div>
        <motion.p 
          className={`text-2xl font-bold ${textColor}`}
          key={value.toString()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {prefix}{typeof value === 'number' ? value.toFixed(value < 10 ? 2 : 0) : value}{suffix}
        </motion.p>
        <p className="text-xs text-gray-500 mt-1">{subLabel}</p>
      </div>
    </motion.div>
  );
}

// Animated efficiency gauge
function EfficiencyGauge({ efficiency }: { efficiency: number }) {
  return (
    <motion.div 
      className="mt-6 pt-4 border-t border-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-black" />
          <span className="text-sm font-medium text-black">System Efficiency</span>
        </div>
        <motion.span 
          className="text-lg font-bold text-black"
          key={efficiency}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
        >
          {efficiency.toFixed(1)}%
        </motion.span>
      </div>
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        {/* Background segments */}
        <div className="absolute inset-0 flex">
          <div className="w-1/3 border-r border-white/50" />
          <div className="w-1/3 border-r border-white/50" />
          <div className="w-1/3" />
        </div>
        
        {/* Animated progress */}
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{
            background: `linear-gradient(90deg, 
              ${efficiency < 30 ? '#EF4444' : efficiency < 60 ? '#F59E0B' : '#22C55E'} 0%, 
              ${efficiency < 30 ? '#F87171' : efficiency < 60 ? '#FBBF24' : '#4ADE80'} 100%)`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${efficiency}%` }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </motion.div>
      </div>
      
      {/* Efficiency labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-gray-400">Low</span>
        <span className="text-[10px] text-gray-400">Optimal</span>
        <span className="text-[10px] text-gray-400">Peak</span>
      </div>
    </motion.div>
  );
}

export function RealTimeMonitoring() {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In production, this would be a WebSocket or polling endpoint
        const response = await fetch("/api/monitoring/realtime", { credentials: "include" });
        
        if (!response.ok) {
          throw new Error("Failed to fetch real-time data");
        }
        
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setLastUpdated(new Date());
        } else {
          // Set default data to prevent blank component
          setData({
            currentGeneration: 0,
            todayGeneration: 0,
            monthlyGeneration: 0,
            creditsGenerated: 0,
            efficiency: 0,
          });
        }
      } catch (error) {
        console.error("Error fetching real-time data:", error);
        // Set default data on error
        setData({
          currentGeneration: 0,
          todayGeneration: 0,
          monthlyGeneration: 0,
          creditsGenerated: 0,
          efficiency: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Poll every 30 seconds for real-time updates
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center">
            <motion.div
              className="w-12 h-12 rounded-full border-4 border-gray-200/20 border-t-forest"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-4 text-sm text-gray-500">Loading real-time data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      {/* Header with gradient */}
      <CardHeader className="relative bg-gradient-to-r from-white/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-white-light flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Activity className="h-5 w-5 text-black" />
            </motion.div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Real-Time Solar Production
                <motion.span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  LIVE
                </motion.span>
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                Monitor your solar generation in real-time
                {lastUpdated && (
                  <span className="text-xs text-gray-400">
                    • Updated {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          
          {/* Decorative sun animation */}
          <motion.div
            className="hidden md:block"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Sun className="w-8 h-8 text-gold/30" />
          </motion.div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox
            icon={Zap}
            label="Current Generation"
            value={data.currentGeneration}
            suffix=" kW"
            bgColor="bg-gradient-to-br from-white/10 to-white/5"
            borderColor="border-gray-200/20"
            textColor="text-black"
            iconColor="text-black"
            subLabel="Right now"
            delay={0.1}
            pulse={data.currentGeneration > 0}
          />
          
          <StatBox
            icon={TrendingUp}
            label="Today's Generation"
            value={data.todayGeneration}
            suffix=" kWh"
            bgColor="bg-gradient-to-br from-green-100 to-green-50"
            borderColor="border-green-200"
            textColor="text-green-600"
            iconColor="text-green-600"
            subLabel="Energy produced"
            delay={0.2}
          />
          
          <StatBox
            icon={Battery}
            label="This Month"
            value={data.monthlyGeneration}
            suffix=" kWh"
            bgColor="bg-gradient-to-br from-blue-100 to-blue-50"
            borderColor="border-blue-200"
            textColor="text-blue-600"
            iconColor="text-blue-600"
            subLabel="Total generation"
            delay={0.3}
          />
          
          <StatBox
            icon={Sparkles}
            label="Credits Today"
            value={formatCurrency(data.creditsGenerated)}
            bgColor="bg-gradient-to-br from-gold/20 to-gold/10"
            borderColor="border-gold/30"
            textColor="text-amber-600"
            iconColor="text-gold"
            subLabel="Generated"
            delay={0.4}
          />
        </div>

        <EfficiencyGauge efficiency={data.efficiency} />
      </CardContent>
    </Card>
  );
}

