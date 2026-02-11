"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface AdminStatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  color: string;
  bgColor: string;
  delay?: number;
  trend?: number;
  trendLabel?: string;
  decimals?: number;
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (hasAnimated && value === displayValue) return;

    const duration = 1500;
    const startTime = performance.now();
    const startValue = hasAnimated ? displayValue : 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const newValue = startValue + (value - startValue) * easeOutQuart;
      setDisplayValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setHasAnimated(true);
      }
    };
    requestAnimationFrame(animate);
  }, [value, hasAnimated, displayValue]);

  const formattedValue = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.round(displayValue).toLocaleString();

  return (
    <span>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}

export function AdminStatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  prefix = "",
  color,
  bgColor,
  delay = 0,
  trend,
  trendLabel,
  decimals = 0,
}: AdminStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all group"
    >
      <div className="flex items-start justify-between">
        <div
          className={`p-3 rounded-xl ${bgColor} transition-transform group-hover:scale-110`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>

        {typeof trend === "number" && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              trend >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-black font-medium">{label}</p>
        <p className={`text-3xl font-bold mt-1 ${color}`}>
          <AnimatedNumber
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
          />
        </p>
        {trendLabel && (
          <p className="text-xs text-gray-500 mt-1">{trendLabel}</p>
        )}
      </div>
    </motion.div>
  );
}
