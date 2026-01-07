"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Zap, TrendingUp, Leaf, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CreditHistoryChart } from "@/components/features/dashboard/CreditHistoryChart";

export const dynamic = 'force-dynamic';

interface DashboardSummary {
  totalCapacity: number;
  totalSavings: number;
  co2Offset: string;
  recentActivity: any[];
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, allocationsRes] = await Promise.all([
          fetch("/api/dashboard/summary"),
          fetch("/api/allocations"),
        ]);

        const summaryData = await summaryRes.json();
        const allocationsData = await allocationsRes.json();

        if (summaryData.success) {
          setSummary(summaryData.data);
        }
        if (allocationsData.success) {
          setAllocations(allocationsData.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2 text-charcoal">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here&apos;s your solar energy summary.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Capacity</p>
                    <p className="text-3xl font-bold text-charcoal">
                      {summary?.totalCapacity.toFixed(1) || "0"} kW
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-forest" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Saved</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(summary?.totalSavings || 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">CO₂ Offset</p>
                    <p className="text-3xl font-bold text-forest">
                      {summary?.co2Offset || "0"} tons
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-forest" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your solar journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/reserve">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add More Capacity
                  </Button>
                </Link>
                <Link href="/connect">
                  <Button variant="outline" className="w-full justify-start">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Connect Utility
                  </Button>
                </Link>
                <Link href="/bills">
                  <Button variant="outline" className="w-full justify-start">
                    View Bills
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Allocations</CardTitle>
                <CardDescription>Active solar capacity</CardDescription>
              </CardHeader>
              <CardContent>
                {allocations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="mb-4">No allocations yet</p>
                    <Link href="/reserve">
                      <Button variant="primary" size="sm">
                        Reserve Capacity
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allocations.map((allocation) => (
                      <div
                        key={allocation.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-charcoal">
                              {allocation.project?.name || "Unknown Project"}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {allocation.capacity_kw} kW •{" "}
                              {formatCurrency(allocation.monthly_fee)}/month
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              allocation.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {allocation.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Credit History Chart */}
          <CreditHistoryChart />

          {/* Recent Activity */}
          {summary?.recentActivity && summary.recentActivity.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest solar credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {summary.recentActivity.map((activity: any) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-charcoal">
                          Credit Applied
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          +{formatCurrency(activity.amount)}
                        </p>
                        {activity.generation_kwh && (
                          <p className="text-xs text-gray-500">
                            {activity.generation_kwh} kWh
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

