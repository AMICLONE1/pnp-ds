import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Zap } from "lucide-react";

export default function SuccessContent(){
  const router = useRouter();
  const searchParams = useSearchParams();
  const [project, setProject] = useState<any>(null);

  const allocationId = searchParams.get("allocation");
  const projectId = searchParams.get("project");

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      const response = await fetch("/api/projects");
      const result = await response.json();
      if (result.success) {
        const found = result.data.find((p: any) => p.id === projectId);
        setProject(found);
      }
    };

    fetchProject();
  }, [projectId]);
    return(
        <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-12">
            <Card className="max-w-2xl w-full">
            <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                </div>
                <h1 className="text-3xl font-heading font-bold mb-4 text-black">
                Reservation Successful! 🎉
                </h1>
                <p className="text-lg text-black mb-8">
                Your solar capacity has been reserved successfully. You&apos;re now
                part of the clean energy revolution!
                </p>

                {project && (
                <div className="bg-white rounded-lg p-6 mb-8 text-left">
                    <div className="flex items-center mb-4">
                    <Zap className="h-5 w-5 text-gold mr-2" />
                    <h3 className="font-semibold text-lg">{project.name}</h3>
                    </div>
                    <p className="text-black">{project.location}</p>
                </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/connect">
                    <Button variant="primary" size="lg">
                    Connect Utility
                    <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
                <Link href="/dashboard">
                    <Button variant="outline" size="lg">
                    Go to Dashboard
                    </Button>
                </Link>
                </div>

                <p className="text-sm text-gray-500 mt-6">
                Next step: Link your electricity provider to start receiving credits
                on your bills.
                </p>
            </CardContent>
            </Card>
        </main>
        <Footer />
        </div>
    )
}