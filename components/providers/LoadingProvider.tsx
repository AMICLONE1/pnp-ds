"use client";

import { createContext, useContext, useState, useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { PageLoader } from "@/components/layout/PageLoader";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export function useLoading() {
  return useContext(LoadingContext);
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Initial page load - show briefly then hide
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1700);

    return () => clearTimeout(timer);
  }, []);

  // Route change loading - use useLayoutEffect to set state synchronously before paint
  useLayoutEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setIsNavigating(true);
    }
  }, [pathname]);

  // Clear navigation state after delay
  useEffect(() => {
    if (!isNavigating) return;
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isNavigating]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {(isLoading || isNavigating) && <PageLoader />}
      <div style={{ visibility: isLoading || isNavigating ? "hidden" : "visible" }}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}
