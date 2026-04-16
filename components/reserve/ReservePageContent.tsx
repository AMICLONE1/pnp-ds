import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type Project } from "@/components/reserve/ProjectCard";
import { createClient } from "@/lib/supabase/client";
import { calculateSolarSavings } from "@/lib/solar-constants";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Sparkles,
  Zap,
  TrendingUp,
  MapPin,
  Sun,
  Shield,
  ChevronRight,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BenefitsBar from "@/components/reserve/BenefitsBar";
import { ProjectListSkeleton } from "@/components/ui/skeletons/ProjectListSkeleton";
import { Header } from "@/components/layout/header";
import { ProjectCard } from "@/components/reserve/ProjectCard";
import { cn, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import PageHero from "@/components/reserve/PageHero";
import { Footer } from "@/components/layout/footer";
import { LandingHeader } from "@/components/layout/LandingHeader";
import AllocationCard from "@/components/dashboard/AllocationCard";


export default function ReservePageContent(){
    const router = useRouter();
  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [capacity, setCapacity] = useState(5);
  const [user, setUser] = useState<any>(null);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [allocationsLoading, setAllocationsLoading] = useState(false);
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
      setLoading(false);
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

  // Load the user's existing allocations once we know who they are.
  useEffect(() => {
    if (!user) {
      setAllocations([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setAllocationsLoading(true);
      try {
        const res = await fetch("/api/allocations", { credentials: "include" });
        const result = await res.json();
        if (!cancelled && result.success) setAllocations(result.data || []);
      } catch {
        // Silently ignore — the dashboard handles the error surface.
      } finally {
        if (!cancelled) setAllocationsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Set capacity from URL params (from hero calculator)
  useEffect(() => {
    if (urlCapacity) {
      const cap = parseFloat(urlCapacity);
      if (!isNaN(cap) && cap >= 1 && cap <= 100) {
        setCapacity(cap);
      }
    }
  }, [urlCapacity]);

  const featuredProject = selectedProject ?? projects[0] ?? null;
  const galleryProjects = projects.filter((project) => project.id !== featuredProject?.id);
  const reserveButtonLabel = user ? `Reserve ${capacity} kW` : "Sign up to reserve";

  const handleReserve = () => {
    const activeProject = featuredProject;
    if (!activeProject) return;

    if (!user) {
      router.push("/signup?redirect=/reserve");
      return;
    }

    // Use shared calculation for reservation fee
    const savings = calculateSolarSavings(capacity);
    router.push(
      `/reserve/payment?project=${activeProject.id}&capacity=${capacity}&amount=${savings.reservationFee}`
    );
  };

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
              {/* Your reservations (logged-in users only) */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-10"
                >
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h2
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                        className="text-2xl md:text-3xl font-heading font-bold text-black"
                      >
                        Your Reservations
                      </h2>
                      <p
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                        className="text-sm text-gray-600 mt-1"
                      >
                        {allocationsLoading
                          ? "Loading your projects…"
                          : allocations.length === 0
                          ? "You haven't reserved any capacity yet."
                          : `${allocations.length} active reservation${allocations.length === 1 ? "" : "s"} · ${formatCurrency(
                              Math.round(
                                allocations.reduce(
                                  (sum, a: any) =>
                                    sum +
                                    Number(a.capacity_kw || 0) *
                                      120 *
                                      Number(
                                        a.project?.rate_per_kwh ||
                                          a.capacity_block?.project?.rate_per_kwh ||
                                          7
                                      ),
                                  0
                                )
                              )
                            )}/mo estimated savings`}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="text-sm font-semibold text-gold hover:underline"
                    >
                      Open dashboard →
                    </Link>
                  </div>

                  {allocations.length > 0 && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {allocations.map((alloc: any, i: number) => (
                        <AllocationCard key={alloc.id} allocation={alloc} index={i} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-2xl md:text-3xl font-heading font-bold text-black mb-2">
                  {user && allocations.length > 0 ? "Reserve more capacity" : "Available Projects"}
                </h2>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-black">
                  {projects.length} verified solar project{projects.length !== 1 ? 's' : ''} available for reservation
                </p>
              </motion.div>

              {projects.length === 0 ? (
                <div className="mx-auto max-w-2xl text-center py-16 px-6 bg-white rounded-[2rem] border border-gray-200 shadow-sm">
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
              ) : (
                <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_360px]">
                  <div className="space-y-6">
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-gradient-to-br from-white via-amber-50/40 to-white shadow-[0_24px_80px_rgba(255,180,0,0.12)]"
                    >
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-amber-400 to-gold" />
                      <div className="absolute -right-24 top-0 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
                      <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-amber-100/50 blur-3xl" />

                      <div className="relative p-6 md:p-8">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                            className="rounded-full border border-gold/20 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-gold"
                          >
                            Featured project
                          </span>
                          <span
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                            className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-semibold text-gray-600"
                          >
                            Currently not operational
                          </span>
                        </div>

                        <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                          <div className="max-w-3xl">
                            <h3
                              style={{ fontFamily: "'Montserrat', sans-serif" }}
                              className="text-3xl md:text-4xl font-heading font-bold text-black"
                            >
                              {featuredProject?.name}
                            </h3>

                            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 border border-gray-200">
                                <MapPin className="w-4 h-4 text-gold" />
                                {featuredProject?.location}
                              </span>
                              <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">
                                {featuredProject?.state}
                              </span>
                              {featuredProject?.commission_date && (
                                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 border border-emerald-100">
                                  Since {new Date(featuredProject.commission_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                                </span>
                              )}
                            </div>

                            <p
                              style={{ fontFamily: "'Montserrat', sans-serif" }}
                              className="mt-5 max-w-3xl text-sm md:text-base text-gray-700 leading-relaxed"
                            >
                              {featuredProject?.description}
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                              {[
                                {
                                  label: "Available capacity",
                                  value: `${Number(featuredProject?.available_capacity_kw || 0).toLocaleString()} kW`,
                                  icon: Zap,
                                },
                                {
                                  label: "Credit rate",
                                  value: featuredProject?.rate_per_kwh ? `₹${featuredProject.rate_per_kwh}/unit` : "Contact team",
                                  icon: TrendingUp,
                                },
                                {
                                  label: "Generation guarantee",
                                  value: "75%",
                                  icon: Shield,
                                },
                              ].map((stat) => (
                                <div
                                  key={stat.label}
                                  className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm"
                                >
                                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                                    <stat.icon className="w-4 h-4 text-gold" />
                                    {stat.label}
                                  </div>
                                  <div className="mt-2 text-lg font-bold text-black">
                                    {stat.value}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                              <motion.button
                                type="button"
                                onClick={handleReserve}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold via-amber-500 to-gold px-6 py-3 text-sm font-bold text-black shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-gold/25"
                              >
                                <Sparkles className="w-4 h-4" />
                                {reserveButtonLabel}
                                <ArrowRight className="w-4 h-4" />
                              </motion.button>
                              <button
                                type="button"
                                onClick={() => document.getElementById("project-gallery")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gold/30 hover:text-gold"
                              >
                                Browse gallery
                              </button>
                            </div>
                          </div>

                          <div className="w-full max-w-sm rounded-[1.75rem] border border-gold/15 bg-white/90 p-5 shadow-lg shadow-gold/10">
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] font-bold uppercase tracking-[0.22em] text-gray-500">
                                Spotlight
                              </p>
                              <div className="mt-2 text-3xl font-bold text-gold">
                                {Number(featuredProject?.available_capacity_kw || 0).toLocaleString()}
                                <span className="text-base text-gray-400 ml-1">kW</span>
                              </div>
                              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-2 text-sm text-gray-600">
                                Capacity currently visible for this verified project.
                              </p>
                            </div>

                            <div className="mt-4 space-y-3">
                              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm">
                                <span className="text-gray-500">Location</span>
                                <span className="font-semibold text-black">{featuredProject?.location}</span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm">
                                <span className="text-gray-500">State</span>
                                <span className="font-semibold text-black">{featuredProject?.state}</span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm">
                                <span className="text-gray-500">Credit rate</span>
                                <span className="font-semibold text-gold">
                                  {featuredProject?.rate_per_kwh ? `₹${featuredProject.rate_per_kwh}/unit` : "TBD"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.section>

                    <section id="project-gallery" className="space-y-4">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xl md:text-2xl font-heading font-bold text-black">
                            Other verified projects
                          </h3>
                          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-600 mt-1">
                            Click any card to update the spotlight above.
                          </p>
                        </div>
                        <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                          {galleryProjects.length} remaining
                        </p>
                      </div>

                      {galleryProjects.length > 0 ? (
                        <AnimatePresence>
                          <div className="grid gap-5 md:grid-cols-2">
                            {galleryProjects.map((project) => (
                              <ProjectCard
                                key={project.id}
                                project={project}
                                isSelected={false}
                                onSelect={() => setSelectedProject(project)}
                              />
                            ))}
                          </div>
                        </AnimatePresence>
                      ) : (
                        <div className="rounded-[1.75rem] border border-dashed border-gray-200 bg-white/80 px-6 py-10 text-center shadow-sm">
                          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-lg font-semibold text-black">
                            This is the only verified project currently available.
                          </p>
                          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-2 text-sm text-gray-600">
                            More projects will appear here as soon as they are approved.
                          </p>
                        </div>
                      )}
                    </section>
                  </div>

                  <aside className="space-y-4 xl:sticky xl:top-24 self-start">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl"
                    >
                      <div className="border-b border-gold/15 bg-gradient-to-br from-gold/10 via-amber-50 to-white px-5 py-4">
                        <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold">
                          Project overview
                        </p>
                        <h3 style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-2 text-2xl font-bold text-black">
                          {featuredProject?.name || "Select a project"}
                        </h3>
                        <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-1 text-sm text-gray-600">
                          {featuredProject?.location || "Choose a project from the gallery to continue"}
                        </p>
                      </div>

                      <div className="space-y-4 p-5">
                        {featuredProject ? (
                          <>
                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                              <div className="flex items-center justify-between gap-3">
                                <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-600">
                                  Available capacity
                                </span>
                                <span className="text-2xl font-bold text-gold">
                                  {Number(featuredProject.available_capacity_kw || 0).toLocaleString()} kW
                                </span>
                              </div>
                              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-2 text-xs text-gray-500">
                                A verified project is ready to be reviewed and reserved.
                              </p>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm">
                                <span className="text-gray-500">Credit rate</span>
                                <span className="font-semibold text-gold">
                                  {featuredProject.rate_per_kwh ? `₹${featuredProject.rate_per_kwh}/unit` : "TBD"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm">
                                <span className="text-gray-500">State</span>
                                <span className="font-semibold text-black">{featuredProject.state}</span>
                              </div>
                              <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="font-semibold text-amber-600">Coming soon</span>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                              <div className="flex items-center gap-2 font-semibold text-emerald-800">
                                <BadgeCheck className="w-4 h-4" />
                                Verified listing
                              </div>
                              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-2 text-sm text-emerald-900/90 leading-relaxed">
                                Only vetted solar projects with available capacity blocks are shown here.
                              </p>
                            </div>

                            <motion.button
                              type="button"
                              onClick={handleReserve}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold via-amber-500 to-gold px-6 py-4 text-base font-bold text-black shadow-xl shadow-gold/20 transition-all duration-300 hover:shadow-2xl hover:shadow-gold/25"
                            >
                              <Sparkles className="w-5 h-5" />
                              {reserveButtonLabel}
                              <ArrowRight className="w-5 h-5" />
                            </motion.button>

                            {!user && (
                              <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-center text-xs text-gray-600 font-medium">
                                Already have an account?{" "}
                                <Link style={{ fontFamily: "'Montserrat', sans-serif" }} href="/login?redirect=/reserve" className="text-gold hover:underline font-semibold">
                                  Log in
                                </Link>
                              </p>
                            )}
                          </>
                        ) : (
                          <div className="py-10 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                              <Sun className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-lg font-semibold text-black mb-2">
                              Select a project
                            </h4>
                            <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-sm text-gray-500">
                              Choose a solar project from the gallery to continue.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 }}
                      className="rounded-[2rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-white p-5 shadow-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                          <BadgeCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="font-semibold text-emerald-900">
                            Reservation flow is curated
                          </p>
                          <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-1 text-sm text-emerald-900/80 leading-relaxed">
                            We only surface verified projects and keep the next step simple: pick a project, review the summary, and continue.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </aside>
                </div>
              )}

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