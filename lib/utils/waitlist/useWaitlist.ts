import { useEffect, useState } from "react";


export function useWaitlist(){
        const [email, setEmail] = useState("");
        const [name, setName] = useState("");
        const [isLoading, setIsLoading] = useState(false);
        const [isSuccess, setIsSuccess] = useState(false);
        const [error, setError] = useState("");
        const [position, setPosition] = useState<number | null>(null);
        const [waitlistCount, setWaitlistCount] = useState(127);
    
      // Fetch waitlist count on mount
      useEffect(() => {
        const fetchCount = async () => {
          try {
            const res = await fetch("/api/waitlist");
            const data = await res.json();
            if (data.success) {
              setWaitlistCount(data.data.displayCount);
            }
          } catch {
            // Use default count
          }
        };
        fetchCount();
      }, []);
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
    
        try {
          const res = await fetch("/api/waitlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              name: name || undefined,
              source: "waitlist_page",
            }),
          });
    
          const data = await res.json();
    
          if (data.success) {
            setIsSuccess(true);
            setPosition(data.position);
            if (!data.alreadyExists) {
              setWaitlistCount((prev) => prev + 1);
            }
          } else {
            setError(data.error?.message || "Something went wrong. Please try again.");
          }
        } catch {
          setError("Unable to connect. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };
      return{
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
      }
}