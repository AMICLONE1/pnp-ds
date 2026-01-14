"use client";

import { useMemo, memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// SIMPLE LINE CHART (No external dependencies)
// ============================================
interface DataPoint {
  label: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  height?: number;
  className?: string;
  color?: string;
  showLabels?: boolean;
  showDots?: boolean;
  animated?: boolean;
}

export const SimpleLineChart = memo(function SimpleLineChart({
  data,
  height = 200,
  className,
  color = "#4CAF50",
  showLabels = true,
  showDots = true,
  animated = true,
}: SimpleLineChartProps) {
  const { path, points, minValue, maxValue, range } = useMemo(() => {
    if (!data.length) return { path: "", points: [], minValue: 0, maxValue: 0, range: 0 };
    
    const values = data.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;
    
    const width = 100; // percentage
    const padding = 5;
    const chartWidth = width - padding * 2;
    const chartHeight = height - 40; // Leave room for labels
    
    const points = data.map((point, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((point.value - minValue) / range) * (chartHeight - 20) + 10;
      return { x, y, ...point };
    });
    
    // Generate SVG path
    const path = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
      .join(' ');
    
    return { path, points, minValue, maxValue, range };
  }, [data, height]);
  
  if (!data.length) {
    return (
      <div className={cn("flex items-center justify-center text-gray-400", className)} style={{ height }}>
        No data available
      </div>
    );
  }
  
  return (
    <div className={cn("relative", className)} style={{ height }}>
      <svg 
        viewBox={`0 0 100 ${height}`} 
        preserveAspectRatio="none" 
        className="w-full h-full"
      >
        {/* Grid lines */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Area fill */}
        <motion.path
          d={`${path} L ${points[points.length - 1]?.x || 0} ${height - 30} L ${points[0]?.x || 0} ${height - 30} Z`}
          fill="url(#areaGradient)"
          initial={animated ? { opacity: 0 } : undefined}
          animate={animated ? { opacity: 1 } : undefined}
          transition={{ duration: 1 }}
        />
        
        {/* Line */}
        <motion.path
          d={path}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0 } : undefined}
          animate={animated ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Data points */}
        {showDots && points.map((point, i) => (
          <motion.circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="1"
            fill={color}
            initial={animated ? { scale: 0 } : undefined}
            animate={animated ? { scale: 1 } : undefined}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          />
        ))}
      </svg>
      
      {/* Labels */}
      {showLabels && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500">
          {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((point, i) => (
            <span key={i}>{point.label}</span>
          ))}
        </div>
      )}
    </div>
  );
});

// ============================================
// SAVINGS CHART COMPONENT
// ============================================
interface SavingsChartProps {
  data: Array<{ month: string; savings: number }>;
  className?: string;
}

export const SavingsChart = memo(function SavingsChart({ data, className }: SavingsChartProps) {
  const chartData = data.map(d => ({ label: d.month, value: d.savings }));
  
  return (
    <div className={cn("bg-white rounded-xl p-6 shadow-sm", className)}>
      <h3 className="text-lg font-semibold text-charcoal mb-4">Monthly Savings Trend</h3>
      <SimpleLineChart 
        data={chartData} 
        height={250} 
        color="#4CAF50"
        showLabels 
        showDots 
      />
    </div>
  );
});

// ============================================
// COMPARISON WIDGET
// ============================================
interface ComparisonWidgetProps {
  currentMonth: number;
  lastMonth: number;
  label?: string;
  className?: string;
}

export const ComparisonWidget = memo(function ComparisonWidget({
  currentMonth,
  lastMonth,
  label = "This Month vs Last",
  className,
}: ComparisonWidgetProps) {
  const percentChange = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;
  const isPositive = percentChange > 0;
  const isNeutral = percentChange === 0;
  
  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  
  return (
    <motion.div 
      className={cn(
        "bg-gradient-to-br from-energy-green to-energy-blue p-6 rounded-xl text-white",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm opacity-90">{label}</span>
        <span className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
          isPositive ? "bg-white/20" : isNeutral ? "bg-white/10" : "bg-red-500/30"
        )}>
          <TrendIcon className="w-3 h-3" />
          {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
        </span>
      </div>
      <div className="text-3xl font-bold">
        ₹{currentMonth.toLocaleString('en-IN')}
      </div>
      <div className="text-sm opacity-75 mt-1">
        Last month: ₹{lastMonth.toLocaleString('en-IN')}
      </div>
    </motion.div>
  );
});

// ============================================
// CARBON IMPACT WIDGET
// ============================================
interface CarbonImpactWidgetProps {
  totalCO2Offset: number; // in kg
  className?: string;
}

export const CarbonImpactWidget = memo(function CarbonImpactWidget({
  totalCO2Offset,
  className,
}: CarbonImpactWidgetProps) {
  const equivalents = useMemo(() => ({
    trees: Math.floor(totalCO2Offset / 20), // 1 tree absorbs ~20kg CO2/year
    cars: (totalCO2Offset / 4600).toFixed(1), // 1 car emits ~4600kg CO2/year
    homes: (totalCO2Offset / 6000).toFixed(1), // 1 home emits ~6000kg CO2/year
  }), [totalCO2Offset]);
  
  return (
    <motion.div 
      className={cn(
        "bg-gradient-to-br from-forest to-forest-light p-6 rounded-xl text-white",
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-4">Your Environmental Impact</h3>
      
      <div className="text-center mb-6">
        <motion.div 
          className="text-5xl font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          {totalCO2Offset.toLocaleString()}
        </motion.div>
        <div className="text-sm opacity-90">kg CO₂ offset this year</div>
      </div>
      
      <div className="space-y-3">
        <ImpactComparison emoji="🌳" value={equivalents.trees} label="trees planted equivalent" />
        <ImpactComparison emoji="🚗" value={equivalents.cars} label="cars off the road" />
        <ImpactComparison emoji="🏠" value={equivalents.homes} label="homes powered cleanly" />
      </div>
    </motion.div>
  );
});

function ImpactComparison({ 
  emoji, 
  value, 
  label 
}: { 
  emoji: string; 
  value: number | string; 
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-white/10 rounded-lg px-3 py-2">
      <span className="text-2xl">{emoji}</span>
      <div>
        <span className="font-bold">{value}</span>
        <span className="text-sm opacity-80 ml-1">{label}</span>
      </div>
    </div>
  );
}

// ============================================
// STATS CARD
// ============================================
interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "green" | "blue" | "gold" | "purple";
  className?: string;
}

const colorClasses = {
  green: "from-energy-green/10 to-energy-green/5 border-energy-green/20",
  blue: "from-energy-blue/10 to-energy-blue/5 border-energy-blue/20",
  gold: "from-gold/10 to-gold/5 border-gold/20",
  purple: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
};

const iconColorClasses = {
  green: "bg-energy-green/20 text-energy-green",
  blue: "bg-energy-blue/20 text-energy-blue",
  gold: "bg-gold/20 text-gold",
  purple: "bg-purple-500/20 text-purple-500",
};

export const StatsCard = memo(function StatsCard({
  icon,
  title,
  value,
  subtitle,
  trend,
  color = "green",
  className,
}: StatsCardProps) {
  return (
    <motion.div
      className={cn(
        "bg-gradient-to-br border rounded-xl p-5 transition-shadow hover:shadow-md",
        colorClasses[color],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn("p-2 rounded-lg", iconColorClasses[color])}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend.isPositive 
              ? "bg-energy-green/20 text-energy-green" 
              : "bg-red-500/20 text-red-500"
          )}>
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}%
          </span>
        )}
      </div>
      
      <div className="text-2xl font-bold text-charcoal mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
      {subtitle && (
        <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
      )}
    </motion.div>
  );
});

// ============================================
// MINI BAR CHART
// ============================================
interface MiniBarChartProps {
  data: Array<{ label: string; value: number }>;
  className?: string;
  color?: string;
}

export const MiniBarChart = memo(function MiniBarChart({
  data,
  className,
  color = "#4CAF50",
}: MiniBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className={cn("flex items-end gap-1 h-16", className)}>
      {data.map((item, i) => {
        const heightPercent = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        return (
          <motion.div
            key={i}
            className="flex-1 rounded-t"
            style={{ 
              backgroundColor: color,
              minHeight: '4px',
            }}
            initial={{ height: 0 }}
            animate={{ height: `${heightPercent}%` }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            title={`${item.label}: ${item.value}`}
          />
        );
      })}
    </div>
  );
});

// ============================================
// PROGRESS RING
// ============================================
interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ProgressRing = memo(function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "#4CAF50",
  className,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
});
