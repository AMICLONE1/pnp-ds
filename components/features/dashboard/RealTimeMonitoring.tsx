"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Zap, TrendingUp, Activity } from "lucide-react";

interface RealTimeData {
  currentGeneration: number; // kW being generated right now
  todayGeneration: number; // kWh generated today
  monthlyGeneration: number; // kWh generated this month
  creditsGenerated: number; // Credits generated today
  efficiency: number; // Percentage efficiency
}

export function RealTimeMonitoring() {
  const [data, setData] = useState<RealTimeData | null>(null);
  const [loading, setLoading] = useState(true);

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
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-forest" />
          Real-Time Solar Production
        </CardTitle>
        <CardDescription>
          Monitor your solar generation in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-forest/5 rounded-lg border border-forest/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-forest" />
              <span className="text-xs text-gray-600">Current Generation</span>
            </div>
            <p className="text-2xl font-bold text-forest">
              {data.currentGeneration.toFixed(2)} kW
            </p>
            <p className="text-xs text-gray-500 mt-1">Right now</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs text-gray-600">Today</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {data.todayGeneration.toFixed(1)} kWh
            </p>
            <p className="text-xs text-gray-500 mt-1">Energy produced</p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-600">This Month</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {data.monthlyGeneration.toFixed(0)} kWh
            </p>
            <p className="text-xs text-gray-500 mt-1">Total generation</p>
          </div>

          <div className="p-4 bg-gold/10 rounded-lg border border-gold/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-gold" />
              <span className="text-xs text-gray-600">Credits Today</span>
            </div>
            <p className="text-2xl font-bold text-gold">
              {formatCurrency(data.creditsGenerated)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Generated</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">System Efficiency</span>
            <span className="text-lg font-semibold text-forest">
              {data.efficiency.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-forest h-2 rounded-full transition-all duration-500"
              style={{ width: `${data.efficiency}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

