"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency, calculateSavings } from "@/lib/utils";
import { MapPin, Zap, TrendingUp, Calendar } from "lucide-react";
import { ProjectComparison } from "@/components/features/projects/ProjectComparison";

interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  state: string;
  price_per_kw: number;
  available_capacity_kw: number;
  image_url?: string;
  commission_date?: string;
  operational_until?: string;
  rate_per_kwh?: number;
}

export const dynamic = 'force-dynamic';

export default function ReservePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [capacity, setCapacity] = useState(5);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch("/api/projects");
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);
      }
      setLoading(false);
    };

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchProjects();
    getUser();
  }, [supabase]);

  const handleReserve = () => {
    if (!selectedProject) return;

    if (!user) {
      router.push("/signup?redirect=/reserve");
      return;
    }

    const monthlyFee = capacity * selectedProject.price_per_kw;
    router.push(
      `/reserve/payment?project=${selectedProject.id}&capacity=${capacity}&amount=${monthlyFee}`
    );
  };

  const monthlyFee = selectedProject ? capacity * selectedProject.price_per_kw : 0;
  const estimatedSavings = selectedProject ? calculateSavings(capacity, selectedProject.price_per_kw) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-charcoal">
              Join Solar Projects
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select a solar project and reserve capacity to start saving on your
              electricity bills
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-forest"></div>
            </div>
          ) : (
            <>
              {projects.length > 1 && (
                <Card className="mb-12">
                  <CardContent className="p-6">
                    <ProjectComparison projects={projects} />
                  </CardContent>
                </Card>
              )}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Project Selection */}
                <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-charcoal mb-4">
                  Available Projects
                </h2>
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className={`cursor-pointer transition-all ${
                      selectedProject?.id === project.id
                        ? "ring-2 ring-forest border-forest"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => setSelectedProject(project)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {project.location}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-forest">
                            ₹{project.price_per_kw}
                          </div>
                          <div className="text-sm text-gray-600">per kW/month</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <Zap className="h-4 w-4 mr-1" />
                          {Number(project.available_capacity_kw).toLocaleString()} kW
                          available
                        </div>
                        {project.commission_date && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Commissioned: {new Date(project.commission_date).toLocaleDateString()}
                          </div>
                        )}
                        {project.operational_until && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Operational until {new Date(project.operational_until).getFullYear()}
                          </div>
                        )}
                        {project.rate_per_kwh && (
                          <div className="text-sm font-medium text-forest">
                            ₹{project.rate_per_kwh}/kWh credit value
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Capacity Selection & Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Capacity</CardTitle>
                    <CardDescription>
                      Choose how much solar capacity you want to reserve
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedProject ? (
                      <>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-charcoal">
                              Capacity (kW)
                            </label>
                            <span className="text-lg font-semibold text-forest">
                              {capacity} kW
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={capacity}
                            onChange={(e) => setCapacity(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1 kW</span>
                            <span>100 kW</span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-4 border-t">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Fee</span>
                            <span className="font-semibold text-charcoal">
                              {formatCurrency(monthlyFee)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 flex items-center">
                              <TrendingUp className="h-4 w-4 mr-1" />
                              Est. Savings
                            </span>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(estimatedSavings)}/month
                            </span>
                          </div>
                          <div className="pt-3 border-t">
                            <div className="flex justify-between text-lg font-bold">
                              <span>First Payment</span>
                              <span className="text-forest">
                                {formatCurrency(monthlyFee)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full"
                          onClick={handleReserve}
                        >
                          Reserve Now
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Select a project to continue
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

