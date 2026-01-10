"use client";

import { useState, useEffect, Suspense, lazy } from "react";

// Lazy load the 3D canvas component to avoid webpack issues with Three.js
const Canvas3D = lazy(() => import("./Hero3DCanvas"));

export function Hero3D() {
  const [mounted, setMounted] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check for WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setWebGLSupported(!!gl);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  // Only render on client and if WebGL is supported
  if (!mounted || !webGLSupported) {
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none hidden md:block">
      <Suspense fallback={null}>
        <Canvas3D />
      </Suspense>
    </div>
  );
}

