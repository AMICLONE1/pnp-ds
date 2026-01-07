"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileText, CheckCircle, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function BillsPage() {
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch("/api/bills");
        const result = await response.json();
        if (result.success) {
          setBills(result.data);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2 text-charcoal">
              Your Bills
            </h1>
            <p className="text-gray-600">
              View your electricity bills and applied solar credits
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
            </div>
          ) : bills.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-charcoal">
                  No Bills Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Once you connect your utility, your bills will appear here.
                </p>
                <Link href="/connect">
                  <Button variant="primary">Connect Utility</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bills.map((bill) => (
                <Card key={bill.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-charcoal">
                            {bill.bill_number}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                              bill.status === "PAID" || bill.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : bill.status === "OVERDUE" || bill.status === "overdue"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {bill.status === "PAID" || bill.status === "paid" ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {bill.status === "PAID" || bill.status === "paid"
                              ? "Paid"
                              : bill.status === "OVERDUE" || bill.status === "overdue"
                              ? "Overdue"
                              : "Pending"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {bill.bill_month && bill.bill_year
                            ? new Date(bill.bill_year, bill.bill_month - 1).toLocaleDateString(
                                "en-IN",
                                { month: "long", year: "numeric" }
                              )
                            : "N/A"}{" "}
                          • Due: {bill.due_date ? formatDate(bill.due_date) : "N/A"}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Bill Amount</span>
                            <span className="font-medium">{formatCurrency(Number(bill.amount))}</span>
                          </div>
                          {Number(bill.credits_applied || 0) > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 text-green-600">
                                Solar Credits Applied
                              </span>
                              <span className="font-medium text-green-600">
                                -{formatCurrency(Number(bill.credits_applied || 0))}
                              </span>
                            </div>
                          )}
                          <div className="pt-2 border-t flex justify-between">
                            <span className="font-semibold text-charcoal">Final Amount</span>
                            <span className="font-bold text-lg text-charcoal">
                              {formatCurrency(
                                Number(bill.final_amount || bill.amount) -
                                  Number(bill.credits_applied || 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

