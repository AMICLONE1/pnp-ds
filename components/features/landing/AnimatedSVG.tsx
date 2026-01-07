"use client";

import { useEffect, useRef } from "react";

export function SolarIcon() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const rays = svg.querySelectorAll(".ray");
    rays.forEach((ray, index) => {
      const element = ray as SVGElement;
      element.style.animation = `pulse 2s ease-in-out ${index * 0.1}s infinite`;
    });
  }, []);

  return (
    <svg
      ref={svgRef}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      className="drop-shadow-2xl"
    >
      <defs>
        <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A03A" />
          <stop offset="100%" stopColor="#E8C468" />
        </linearGradient>
        <animate
          attributeName="opacity"
          values="1;0.7;1"
          dur="3s"
          repeatCount="indefinite"
        />
      </defs>
      
      {/* Sun center */}
      <circle
        cx="60"
        cy="60"
        r="25"
        fill="url(#sunGradient)"
        className="animate-pulse"
      />
      
      {/* Rays */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 60 + 35 * Math.cos(angle);
        const y1 = 60 + 35 * Math.sin(angle);
        const x2 = 60 + 45 * Math.cos(angle);
        const y2 = 60 + 45 * Math.sin(angle);
        
        return (
          <line
            key={i}
            className="ray"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#D4A03A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }
      `}</style>
    </svg>
  );
}

export function EnergyWave() {
  return (
    <svg
      width="100%"
      height="200"
      viewBox="0 0 1200 200"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 w-full"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1B4332" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1B4332" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z"
        fill="url(#waveGradient)"
      >
        <animate
          attributeName="d"
          values="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z;M0,120 Q300,70 600,120 T1200,120 L1200,200 L0,200 Z;M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z"
          dur="8s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}

