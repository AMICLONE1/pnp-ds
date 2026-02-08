"use client";

export const dynamic = 'force-dynamic';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SettingsSkeleton } from "@/components/ui/skeletons/SettingsSkeleton";
import ProfileSection from "@/components/settings/ProfileSection";
import NotificationSection from "@/components/settings/NotificationSection";
import SecuritySection from "@/components/settings/SecuritySection";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsSidebar from "@/components/settings/SettingsSidebar";
import { useSettings } from "@/lib/utils/settings/useSettings";


export default function SettingsPage() {
  const {
    loading,
    saving,
    profile,
    formData,
    setFormData,
    error,
    success,
    activeSection,
    setActiveSection,
    handleSubmit,
  } = useSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <main className="flex-1 pt-20">
          <SettingsSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Page Header */}
          <SettingsHeader />

          <div className="grid md:grid-cols-4 gap-6">
            {/* Navigation Sidebar */}
            <SettingsSidebar
              name={formData.name}
              email={profile?.email || ""}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />

            {/* Main Content */}
            <div className="md:col-span-3 space-y-6">
              {/* Profile Section */}
              <ProfileSection
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                saving={saving}
                email={profile?.email || ""}
                error={error}
                success={success}
                onSubmit={handleSubmit}
              />

              {/* Notifications Section */}
              <NotificationSection
                formData={formData}
                setFormData={setFormData}
                saving={saving}
                onSubmit={handleSubmit}
              />

              {/* Security Section */}
              <SecuritySection profile={profile} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
