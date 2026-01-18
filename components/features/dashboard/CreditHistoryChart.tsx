"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, BarChart3, ArrowRight, Sparkles, Clock } from "lucide-react";
import Link from "next/link";

interface CreditData {
  month: number;
  year: number;
  amount: number;
}

export function CreditHistoryChart() {
  const [credits, setCredits] = useState<CreditData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/credits", { credentials: "include" });
        
        if (!response.ok) {
          throw new Error("Failed to fetch credits");
        }
        
        const result = await response.json();
        if (result.success) {
          // Group by month/year and sum amounts
          const grouped = result.data.reduce((acc: any, credit: any) => {
            // Handle both credit_ledgers and credits table structures
            const month = credit.month || credit.credit_month;
            const year = credit.year || credit.credit_year;
            if (!month || !year) return acc;
            
            const key = `${year}-${month}`;
            if (!acc[key]) {
              acc[key] = { month, year, amount: 0 };
            }
            acc[key].amount += Number(credit.amount || 0);
            return acc;
          }, {});

          const sorted = Object.values(grouped)
            .sort((a: any, b: any) => {
              if (a.year !== b.year) return b.year - a.year;
              return b.month - a.month;
            })
            .slice(0, 6) as CreditData[];

          setCredits(sorted);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, []);

  const maxAmount = Math.max(...credits.map((c) => c.amount), 1);

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle>Credit History</CardTitle>
              <CardDescription>Monthly solar credits</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex flex-col items-center justify-center">
            <motion.div
              className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-4 text-sm text-gray-500">Loading credit history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (credits.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-black" />
            </div>
            <div>
              <CardTitle>Credit History</CardTitle>
              <CardDescription>Monthly solar credits</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 text-center"
          >
            {/* Animated chart placeholder */}
            <div className="flex items-end justify-center gap-2 h-24 mb-6">
              {[40, 65, 45, 80, 55, 70].map((height, i) => (
                <motion.div
                  key={i}
                  className="w-8 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                />
              ))}
            </div>
            
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Clock className="h-8 w-8 text-green-600" />
            </motion.div>
            
            <h3 className="text-lg font-semibold text-black mb-2">No Credits Yet</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Your solar credits will appear here once you reserve capacity and start generating energy.
            </p>
            
            <Link href="/reserve">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Earning Credits
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Credit History</CardTitle>
            <CardDescription>Monthly solar credits</CardDescription>
          </div>
          <TrendingUp className="h-5 w-5 text-gold" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {credits.map((credit, index) => {
            const monthName = new Date(credit.year, credit.month - 1).toLocaleDateString(
              "en-IN",
              { month: "short" }
            );
            const percentage = (credit.amount / maxAmount) * 100;

            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-black">
                    {monthName} {credit.year}
                  </span>
                  <span className="font-semibold text-black">
                    {formatCurrency(credit.amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-white to-white-light h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

