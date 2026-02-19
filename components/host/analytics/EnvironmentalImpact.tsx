import { motion } from "framer-motion";
import {
  Leaf,
  TreePine,
  Home,
} from "lucide-react";
import { ENV_IMPACT } from "@/lib/utils/host/analytics/data";
import { AnimatedNumber } from "@/components/host/analytics/AnimatedNumber";


export function EnvironmentalImpact(){
    const impacts = [
    {
        icon: Leaf,
        label: "CO₂ Offset",
        value: ENV_IMPACT.co2Tons,
        suffix: " tons",
        description: "Carbon dioxide prevented",
        decimals: 1,
    },
    {
        icon: TreePine,
        label: "Trees Equivalent",
        value: ENV_IMPACT.treesEquivalent,
        suffix: "",
        description: "Trees planted equivalent",
        decimals: 0,
    },
    {
        icon: Home,
        label: "Homes Powered",
        value: ENV_IMPACT.homesPowered,
        suffix: "",
        description: "Average Indian households",
        decimals: 0,
    },
    ];

    return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
    >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest via-forest to-forest-light p-6 sm:p-8 border border-forest/20">
        <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none">
            <div className="absolute top-4 right-4 w-56 h-56 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-3xl" />
            <motion.div
            className="absolute top-8 right-8"
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
            <Leaf className="w-24 h-24 text-white/5" strokeWidth={1} />
            </motion.div>
        </div>

        <div className="relative z-10">
            <h2 className="text-lg sm:text-xl font-bold text-white font-heading flex items-center gap-2 mb-1">
            <Leaf className="w-5 h-5 text-gold" />
            Environmental Impact
            </h2>
            <p className="text-white/60 text-sm mb-6">
            Your contribution to a sustainable future this month
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {impacts.map((item, i) => {
                const Icon = item.icon;
                return (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:bg-white/15 transition-all"
                >
                    <div className="p-2 rounded-lg bg-gold/20 w-fit mb-3">
                    <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-white font-heading">
                    <AnimatedNumber
                        value={item.value}
                        suffix={item.suffix}
                        decimals={item.decimals}
                    />
                    </p>
                    <p className="text-sm font-medium text-white/90 mt-1">{item.label}</p>
                    <p className="text-xs text-white/50 mt-0.5">{item.description}</p>
                </motion.div>
                );
            })}
            </div>
        </div>
        </div>
    </motion.div>
    );
}