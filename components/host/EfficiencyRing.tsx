import { motion } from "framer-motion";


interface EfficiencyRingProps{
    value: number, 
    size?: number
}
export function EfficiencyRing({ value, size = 48 } : EfficiencyRingProps){
    const radius = (size - 6) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    const color = value >= 90 ? "#22C55E" : value >= 70 ? "#F59E0B" : "#EF4444";
    return(
        <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
            <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={4}
            />
            <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-800">{value}%</span>
        </div>
        </div>
    )
}