"use client";

export const dynamic = 'force-dynamic';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { DISCOMS_BY_STATE } from "@/lib/constants";
import {
  CheckCircle,
  Zap,
} from "lucide-react";
import BenefitsSidebar from "@/components/connect/BenefitsSidebar";
import { UtilityFormCard } from "@/components/connect/UtilityFormCard";
import { validateUtilityForm, connectUtility } from "@/lib/utils/connect";


export default function ConnectPage() {
  const router = useRouter();
  const [state, setState] = useState("");
  const [discom, setDiscom] = useState("");
  const [consumerNumber, setConsumerNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [availableDiscoms, setAvailableDiscoms] = useState<string[]>([]);

  useEffect(() => {
    if (state && DISCOMS_BY_STATE[state]) {
      setAvailableDiscoms(DISCOMS_BY_STATE[state]);
      setDiscom(""); // Reset discom when state changes
    } else {
      setAvailableDiscoms([]);
    }
  }, [state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validationError = validateUtilityForm({ state, discom, consumerNumber });
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const result = await connectUtility({ state, discom, consumerNumber });
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center container mx-auto px-4 pt-28 pb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Card className="max-w-md w-full overflow-hidden">
              <div className="bg-gradient-to-br from-energy-green to-green-500 p-8 text-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="h-12 w-12 text-black" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-heading font-bold text-black"
                >
                  Utility Connected!
                </motion.h2>
              </div>
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <p className="text-black mb-4">
                    Your utility provider has been linked successfully. Credits will
                    now be applied to your bills automatically.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-black">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Redirecting to dashboard...
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-black text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              Quick Setup • Takes 2 minutes
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3 text-black">
              Connect Your <span className="text-black">Utility</span>
            </h1>
            <p className="text-black max-w-xl mx-auto">
              Link your electricity provider to start receiving solar credits on your bills automatically
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Benefits Sidebar */}
            <BenefitsSidebar/>

            {/* Form Card */}
            <UtilityFormCard
              state={state}
              setState={setState}
              discom={discom}
              setDiscom={setDiscom}
              consumerNumber={consumerNumber}
              setConsumerNumber={setConsumerNumber}
              availableDiscoms={availableDiscoms}
              loading={loading}
              error={error}
              onSubmit={handleSubmit}
              onSkip={() => router.push("/dashboard")}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

