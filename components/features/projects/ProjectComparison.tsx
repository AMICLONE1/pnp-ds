"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Zap, Calendar, CheckCircle } from "lucide-react";

interface Project {
  id: string;
  name: string;
  location: string;
  state: string;
  price_per_kw: number;
  available_capacity_kw: number;
  description?: string;
  commission_date?: string;
  operational_until?: string;
}

interface ProjectComparisonProps {
  projects: Project[];
}

export function ProjectComparison({ projects }: ProjectComparisonProps) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const toggleProject = (projectId: string) => {
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : prev.length < 3
        ? [...prev, projectId]
        : prev
    );
  };

  const selectedProjectsData = projects.filter((p) => selectedProjects.includes(p.id));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-heading font-bold mb-4 text-charcoal">
          Compare Projects
        </h3>
        <p className="text-gray-600 mb-6">
          Select up to 3 projects to compare side-by-side
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`cursor-pointer transition-all ${
                selectedProjects.includes(project.id)
                  ? "ring-2 ring-forest border-forest"
                  : "hover:shadow-lg"
              }`}
              onClick={() => toggleProject(project.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-charcoal">{project.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {project.location}
                    </p>
                  </div>
                  {selectedProjects.includes(project.id) && (
                    <CheckCircle className="h-5 w-5 text-forest flex-shrink-0" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {Number(project.available_capacity_kw).toLocaleString()} kW available
                  </div>
                  <div className="mt-1 font-semibold text-forest">
                    ₹{project.price_per_kw}/kW/month
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedProjectsData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-forest/10">
                <th className="border border-gray-300 p-4 text-left font-semibold text-charcoal">
                  Feature
                </th>
                {selectedProjectsData.map((project) => (
                  <th
                    key={project.id}
                    className="border border-gray-300 p-4 text-center font-semibold text-charcoal"
                  >
                    {project.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-4 font-medium">Location</td>
                {selectedProjectsData.map((project) => (
                  <td key={project.id} className="border border-gray-300 p-4 text-center">
                    {project.location}, {project.state}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-4 font-medium">Price per kW/month</td>
                {selectedProjectsData.map((project) => (
                  <td key={project.id} className="border border-gray-300 p-4 text-center">
                    {formatCurrency(project.price_per_kw)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-300 p-4 font-medium">Available Capacity</td>
                {selectedProjectsData.map((project) => (
                  <td key={project.id} className="border border-gray-300 p-4 text-center">
                    {Number(project.available_capacity_kw).toLocaleString()} kW
                  </td>
                ))}
              </tr>
              {selectedProjectsData.some((p) => p.operational_until) && (
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4 font-medium">Operational Until</td>
                  {selectedProjectsData.map((project) => (
                    <td key={project.id} className="border border-gray-300 p-4 text-center">
                      {project.operational_until
                        ? new Date(project.operational_until).getFullYear()
                        : "N/A"}
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

