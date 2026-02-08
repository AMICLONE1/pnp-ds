import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type Project } from "@/components/reserve/ProjectCard";
import { createClient } from "@/lib/supabase/client";
import { calculateSolarSavings } from "@/lib/solar-constants";
import {
  Zap,
  TrendingUp,
  Sun,
  Shield,
  ChevronRight,
  Info,
  Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BenefitsBar from "@/components/reserve/BenefitsBar";
import { ProjectListSkeleton } from "@/components/ui/skeletons/ProjectListSkeleton";
import { Header } from "@/components/layout/header";
import { ProjectCard } from "@/components/reserve/ProjectCard";
import CapacitySelector from "@/components/reserve/CapacitySelector";
import { cn } from "@/lib/utils";
import Link from "next/link";
import PageHero from "@/components/reserve/PageHero";
import { Footer } from "@/components/layout/footer";
import { LandingHeader } from "@/components/layout/LandingHeader";


export default function ReservePageContent(){
    const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [capacity, setCapacity] = useState(5);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Get URL params from hero section
  const urlCapacity = searchParams.get('capacity');
  const urlProject = searchParams.get('project');

  // Fetch projects and user data
  useEffect(() => {

    const fetchProjects = async () => {
      const response = await fetch("/api/projects");
      const result = await response.json();
      if (result.success) {
        setProjects(result.data);

        // Check if URL has project param - also select that project
        if (urlProject && result.data.length > 0) {
          const targetProject = result.data.find((p: Project) =>
            p.name.toLowerCase().includes(urlProject.toLowerCase()) || p.id === urlProject
          );
          if (targetProject) {
            setSelectedProject(targetProject);
          } else {
            setSelectedProject(result.data[0]);
          }
        } else if (result.data.length > 0) {
          // Auto-select first project if available
          setSelectedProject(result.data[0]);
        }
      }
      // Show skeleton for minimum 10 seconds
      setTimeout(() => {
        setLoading(false);
      }, 3500);
    };

    const getUser = async () => {
      try {
        // Use getSession() to ensure session is refreshed if needed
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (!sessionError && session?.user) {
          setUser(session.user);
        } else {
          // Fallback to getUser() if getSession() fails
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (!userError && user) {
            setUser(user);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error getting user:", error);
        setUser(null);
      }
    };

    // Set up auth state listener to track session changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    fetchProjects();
    getUser();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, urlProject]);

  // Set capacity from URL params (from hero calculator)
  useEffect(() => {
    if (urlCapacity) {
      const cap = parseFloat(urlCapacity);
      if (!isNaN(cap) && cap >= 1 && cap <= 100) {
        setCapacity(cap);
      }
    }
  }, [urlCapacity]);

  const handleReserve = () => {
    if (!selectedProject) return;

    if (!user) {
      router.push("/signup?redirect=/reserve");
      return;
    }

    // Use shared calculation for reservation fee
    const savings = calculateSolarSavings(capacity);
    router.push(
      `/reserve/payment?project=${selectedProject.id}&capacity=${capacity}&amount=${savings.reservationFee}`
    );
  };

  // Use shared solar constants for all calculations
  const savings = calculateSolarSavings(capacity);
  const reservationFee = savings.reservationFee;
  const estimatedSavings = savings.monthlySavings;
    return(
        <div className="min-h-screen flex flex-col bg-white">
      {user ? <Header /> : <LandingHeader />}

      {/* Hero */}
      <PageHero />

      {/* Benefits bar */}
      <BenefitsBar />

      {/* Main content */}
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <ProjectListSkeleton />
          ) : (
            <>
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl md:text-3xl font-heading font-bold text-black mb-2">
                  Available Projects
                </h2>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-black">
                  {projects.length} verified solar project{projects.length !== 1 ? 's' : ''} available for reservation
                </p>
              </motion.div>

              {/* Main grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Projects list */}
                <div className="lg:col-span-2 space-y-4">
                  <AnimatePresence>
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        isSelected={selectedProject?.id === project.id}
                        onSelect={() => setSelectedProject(project)}
                      />
                    ))}
                  </AnimatePresence>

                  {projects.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Sun className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl font-semibold text-black mb-2">
                        No Projects Available
                      </h3>
                      <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-500 max-w-md mx-auto">
                        We&apos;re adding new solar projects soon. Check back later or contact us for updates.
                      </p>
                    </div>
                  )}
                </div>

                {/* Capacity selector */}
                <div className="lg:col-span-1">
                  <CapacitySelector
                    selectedProject={selectedProject}
                    capacity={capacity}
                    setCapacity={setCapacity}
                    monthlyFee={estimatedSavings}
                    estimatedSavings={estimatedSavings}
                    onReserve={handleReserve}
                    isLoggedIn={!!user}
                  />
                </div>
              </div>

              {/* Enhanced FAQ section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 bg-gradient-to-br from-white via-gold/5 to-amber-50/20 rounded-3xl border-2 border-gold/20 shadow-xl p-8 md:p-10"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/20 to-amber-100 flex items-center justify-center border border-gold/30">
                      <Info className="w-6 h-6 text-gold" />
                    </div>
                    <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl md:text-3xl font-heading font-bold text-black">
                      Frequently Asked Questions
                    </h3>
                  </div>
                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-gray-600 ml-[3.75rem]">
                    Everything you need to know about solar reservations
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    {
                      q: "How does solar reservation work?",
                      a: "You reserve capacity in our solar projects. The energy generated is credited to your electricity bill as savings.",
                      icon: Zap,
                      color: "from-blue-50 to-cyan-50",
                      borderColor: "border-blue-200"
                    },
                    {
                      q: "Do I need any installation?",
                      a: "No! Digital solar requires zero installation. No roof access, no permits, no technicians.",
                      icon: Building2,
                      color: "from-green-50 to-emerald-50",
                      borderColor: "border-green-200"
                    },
                    {
                      q: "What is the 75% guarantee?",
                      a: "We guarantee at least 75% of forecasted generation. You're protected even during monsoon.",
                      icon: Shield,
                      color: "from-amber-50 to-orange-50",
                      borderColor: "border-amber-200"
                    },
                    {
                      q: "Can I change my capacity later?",
                      a: "Yes, you can upgrade or downgrade your capacity anytime without any penalties.",
                      icon: TrendingUp,
                      color: "from-purple-50 to-pink-50",
                      borderColor: "border-purple-200"
                    }
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className={cn(
                        "p-5 rounded-2xl border-2 transition-all duration-300 shadow-md hover:shadow-lg",
                        `bg-gradient-to-br ${faq.color} ${faq.borderColor}`
                      )}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          `bg-gradient-to-br ${faq.color} border ${faq.borderColor}`
                        )}>
                          <faq.icon className="w-5 h-5 text-gray-700" />
                        </div>
                        <h4 style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-bold text-black text-base leading-tight">
                          {faq.q}
                        </h4>
                      </div>
                      <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-700 leading-relaxed ml-[3.25rem]">
                        {faq.a}
                      </p>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  className="mt-8 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    href="/help"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gold/30 rounded-xl text-gold font-semibold hover:bg-gold/10 hover:border-gold/50 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    View all FAQs
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
        </div>
    )
}