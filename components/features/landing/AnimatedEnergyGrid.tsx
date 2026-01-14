'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated Energy Grid Background
 * Shows solar panels connecting to homes with flowing energy
 * Pure CSS + Canvas for maximum performance
 */
export function AnimatedEnergyGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Energy particles
    interface Particle {
      x: number;
      y: number;
      targetX: number;
      targetY: number;
      progress: number;
      speed: number;
      size: number;
      color: string;
    }

    const particles: Particle[] = [];

    // Solar panel positions (source)
    const solarPanels = [
      { x: canvas.offsetWidth * 0.2, y: canvas.offsetHeight * 0.3 },
      { x: canvas.offsetWidth * 0.5, y: canvas.offsetHeight * 0.25 },
      { x: canvas.offsetWidth * 0.8, y: canvas.offsetHeight * 0.3 },
    ];

    // Home positions (destination)
    const homes = [
      { x: canvas.offsetWidth * 0.25, y: canvas.offsetHeight * 0.7 },
      { x: canvas.offsetWidth * 0.5, y: canvas.offsetHeight * 0.75 },
      { x: canvas.offsetWidth * 0.75, y: canvas.offsetHeight * 0.7 },
    ];

    // Create particles
    const createParticle = () => {
      const panel = solarPanels[Math.floor(Math.random() * solarPanels.length)];
      const home = homes[Math.floor(Math.random() * homes.length)];

      return {
        x: panel.x,
        y: panel.y,
        targetX: home.x,
        targetY: home.y,
        progress: 0,
        speed: 0.002 + Math.random() * 0.003,
        size: 2 + Math.random() * 3,
        color: ['#FFB800', '#4CAF50', '#00BCD4'][Math.floor(Math.random() * 3)],
      };
    };

    // Initialize particles
    for (let i = 0; i < 30; i++) {
      particles.push(createParticle());
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw connection lines (faint)
      ctx.strokeStyle = 'rgba(0, 188, 212, 0.1)';
      ctx.lineWidth = 1;
      solarPanels.forEach((panel) => {
        homes.forEach((home) => {
          ctx.beginPath();
          ctx.moveTo(panel.x, panel.y);
          ctx.lineTo(home.x, home.y);
          ctx.stroke();
        });
      });

      // Draw and update particles
      particles.forEach((particle, index) => {
        // Update position using bezier curve
        particle.progress += particle.speed;

        if (particle.progress >= 1) {
          // Reset particle
          particles[index] = createParticle();
          return;
        }

        const t = particle.progress;
        // Cubic bezier for smooth arc
        const midX = (particle.x + particle.targetX) / 2;
        const midY = Math.min(particle.y, particle.targetY) - 50;

        const x =
          (1 - t) * (1 - t) * particle.x +
          2 * (1 - t) * t * midX +
          t * t * particle.targetX;
        const y =
          (1 - t) * (1 - t) * particle.y +
          2 * (1 - t) * t * midY +
          t * t * particle.targetY;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 3);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color + '80');
        gradient.addColorStop(1, particle.color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, particle.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Draw core
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f14] via-[#0D2818] to-[#061610]" />

      {/* Animated blobs */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 184, 0, 0.15) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, 10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(76, 175, 80, 0.15) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 188, 212, 0.1) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Canvas for particle animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.8 }}
      />

      {/* Solar panel icons (CSS) */}
      <style jsx>{`
        @keyframes pulse-panel {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        @keyframes float-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      {/* Solar panels (visual representation) */}
      <div className="absolute top-1/4 left-1/5 w-16 h-16 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg border-2 border-yellow-500/30 backdrop-blur-sm"
        style={{ animation: 'pulse-panel 3s ease-in-out infinite, float-gentle 4s ease-in-out infinite' }}
      >
        <div className="absolute inset-2 grid grid-cols-2 gap-1">
          <div className="bg-yellow-500/40 rounded-sm" />
          <div className="bg-yellow-500/40 rounded-sm" />
          <div className="bg-yellow-500/40 rounded-sm" />
          <div className="bg-yellow-500/40 rounded-sm" />
        </div>
      </div>

      <div className="absolute top-1/5 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg border-2 border-green-500/30 backdrop-blur-sm"
        style={{ animation: 'pulse-panel 3s ease-in-out 0.5s infinite, float-gentle 4.5s ease-in-out infinite' }}
      >
        <div className="absolute inset-2 grid grid-cols-2 gap-1">
          <div className="bg-green-500/40 rounded-sm" />
          <div className="bg-green-500/40 rounded-sm" />
          <div className="bg-green-500/40 rounded-sm" />
          <div className="bg-green-500/40 rounded-sm" />
        </div>
      </div>

      <div className="absolute top-1/4 right-1/5 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg border-2 border-blue-500/30 backdrop-blur-sm"
        style={{ animation: 'pulse-panel 3s ease-in-out 1s infinite, float-gentle 5s ease-in-out infinite' }}
      >
        <div className="absolute inset-2 grid grid-cols-2 gap-1">
          <div className="bg-blue-500/40 rounded-sm" />
          <div className="bg-blue-500/40 rounded-sm" />
          <div className="bg-blue-500/40 rounded-sm" />
          <div className="bg-blue-500/40 rounded-sm" />
        </div>
      </div>

      {/* Home icons */}
      <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-lg border-2 border-white/20 backdrop-blur-sm"
        style={{ animation: 'float-gentle 3s ease-in-out infinite' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-lg border-2 border-white/20 backdrop-blur-sm"
        style={{ animation: 'float-gentle 3.5s ease-in-out infinite' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-lg border-2 border-white/20 backdrop-blur-sm"
        style={{ animation: 'float-gentle 4s ease-in-out infinite' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
