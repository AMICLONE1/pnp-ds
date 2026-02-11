"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnimatedNumber from "./AnimatedNumber";

interface StatCardProps{
        icon: any;
      label: string;
      value: number;
      suffix?: string;
      prefix?: string;
      color: string;
      bgColor: string;
      delay?: number;
      trend?: number;
      trendLabel?: string;
}
export default function StatCard({icon: Icon, 
      label, 
      value, 
      suffix = "",
      prefix = "",
      color,
      bgColor,
      delay = 0,
      trend,
      trendLabel} : StatCardProps){
    return(
      <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay, duration: 0.5, type: "spring" }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <Card className="relative overflow-hidden group">
            {/* Animated background gradient */}
            <div className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Decorative circles */}
            <div className={`absolute -top-8 -right-8 w-24 h-24 ${bgColor} rounded-full blur-2xl opacity-50`} />
            
            <CardContent className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-black mb-1 flex items-center gap-2">
                    {label}
                    {trend !== undefined && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {trend >= 0 ? '+' : ''}{trend}%
                      </span>
                    )}
                  </p>
                  <p className={`text-3xl font-bold ${color}`}>
                    <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={suffix === " kW" ? 1 : 0} />
                  </p>
                  {trendLabel && (
                    <p className="text-xs text-gray-500 mt-1">{trendLabel}</p>
                  )}
                </div>
                <motion.div 
                  className={`w-14 h-14 ${bgColor} rounded-2xl flex items-center justify-center`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Icon className={`h-7 w-7 ${color}`} />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>  
    )
}