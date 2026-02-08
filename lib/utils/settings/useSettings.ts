import { useEffect, useState } from "react";
import { profileUpdateSchema } from "@/lib/validations";

export function useSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email_notifications: true,
    sms_notifications: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeSection, setActiveSection] = useState("profile");

  // Update active section based on scroll position
  useEffect(() => {
    const sectionIds = ["profile", "notifications", "security"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [loading]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/profile", { credentials: "include" });

        if (!response.ok) {
          if (response.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const result = await response.json();
        if (result.success) {
          setProfile(result.data);
          setFormData({
            name: result.data.name || "",
            phone: result.data.phone || "",
            email_notifications: result.data.email_notifications ?? true,
            sms_notifications: result.data.sms_notifications ?? true,
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        // Show skeleton for minimum time
        setTimeout(() => {
          setLoading(false);
        }, 3500);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const validated = profileUpdateSchema.parse(formData);
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Profile updated successfully!");
        setProfile(result.data);
      } else {
        setError(result.error?.message || "Failed to update profile");
      }
    } catch (err: any) {
      if (err.errors) {
        setError(err.errors[0]?.message || "Validation error");
      } else {
        setError(err.message || "Failed to update profile");
      }
    } finally {
      setSaving(false);
    }
  };

  return {
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
  };
}
