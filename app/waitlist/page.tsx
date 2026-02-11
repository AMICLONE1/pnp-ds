"use client";

import { LandingHeader } from "@/components/layout/LandingHeader";
import { Footer } from "@/components/layout/footer";
import ComingSoon from "@/components/waitlist/ComingSoon";
import Hero from "@/components/waitlist/Hero";
import { useWaitlist } from "@/lib/utils/waitlist/useWaitlist";

export default function WaitlistPage() {
  const{
      email,
      setEmail,
      name,
      setName,
      isLoading,
      setIsLoading,
      isSuccess,
      setIsSuccess,
      error,
      setError,
      position,
      setPosition,
      waitlistCount,
      setWaitlistCount,
      handleSubmit
  } = useWaitlist();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingHeader />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <Hero
          email={email}
          setEmail={setEmail}
          name={name}
          setName={setName}
          isLoading={isLoading}
          isSuccess={isSuccess}
          error={error}
          position={position}
          waitlistCount={waitlistCount}
          onSubmit={handleSubmit}
        />

        {/* Coming Soon Features */}
        <ComingSoon />
      </main>

      <Footer />
    </div>
  );
}
