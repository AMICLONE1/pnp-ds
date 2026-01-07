"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

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
        const response = await fetch("/api/credits");
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
      <Card>
        <CardHeader>
          <CardTitle>Credit History</CardTitle>
          <CardDescription>Monthly solar credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (credits.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credit History</CardTitle>
          <CardDescription>Monthly solar credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center text-gray-500">
            <p>No credits yet</p>
          </div>
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
                  <span className="text-gray-600">
                    {monthName} {credit.year}
                  </span>
                  <span className="font-semibold text-charcoal">
                    {formatCurrency(credit.amount)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-forest to-forest-light h-2 rounded-full transition-all"
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

