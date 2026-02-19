import { motion } from "framer-motion";
import {
  Gauge,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANTS } from "@/lib/utils/host/analytics/data";

export function PerformanceTable(){
    return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
    >
        <Card className="shadow-sm">
        <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
            <Gauge className="w-5 h-5 text-forest" />
            Performance Metrics
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plant</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Capacity</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Daily</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Peak Gen</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Efficiency</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">PR Ratio</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Availability</th>
                </tr>
                </thead>
                <tbody>
                {PLANTS.map((plant, i) => {
                    const effColor =
                    plant.efficiency >= 92
                        ? "text-green-600 bg-green-50"
                        : plant.efficiency >= 89
                        ? "text-amber-600 bg-amber-50"
                        : "text-red-500 bg-red-50";
                    return (
                    <motion.tr
                        key={plant.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.85 + i * 0.08 }}
                        className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer group"
                    >
                        <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                            <div
                            className="w-2 h-8 rounded-full shrink-0"
                            style={{ backgroundColor: plant.color }}
                            />
                            <div>
                            <p className="font-medium text-black group-hover:text-forest transition-colors">
                                {plant.name}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {plant.location}
                            </div>
                            </div>
                        </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-black">
                        {plant.capacityKw} kW
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-black">
                        {plant.avgDailyGen.toLocaleString("en-IN")} kWh
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-black">
                        {plant.peakGen.toLocaleString("en-IN")} kWh
                        </td>
                        <td className="py-3.5 px-4 text-right">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${effColor}`}>
                            {plant.efficiency}%
                        </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-black">
                        {plant.prRatio}%
                        </td>
                        <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                            <span className="font-medium text-black">{plant.availability}%</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-forest transition-colors" />
                        </div>
                        </td>
                    </motion.tr>
                    );
                })}
                </tbody>
            </table>
            </div>
        </CardContent>
        </Card>
    </motion.div>
    );
}