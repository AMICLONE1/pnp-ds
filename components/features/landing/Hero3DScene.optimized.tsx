"use client";

import { useRef, useMemo, useState, useEffect, useCallback, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sphere, Environment, Stars, Sparkles } from "@react-three/drei";
// Optimized: Import only specific Three.js classes instead of entire library
import { 
  Mesh, 
  Color, 
  Vector3, 
  SphereGeometry, 
  MeshStandardMaterial,
  PointLight,
  Group,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  AdditiveBlending
} from "three";
import type { MeshProps, GroupProps } from "@react-three/fiber";

// ============================================
// PERFORMANCE UTILITIES
// ============================================

// Check for reduced motion preference
const prefersReducedMotion = typeof window !== "undefined" 
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches 
  : false;

// Limit FPS for consistent performance
const TARGET_FPS = 60;
const FRAME_TIME = 1000 / TARGET_FPS;

// ============================================
// OPTIMIZED SUN COMPONENT
// ============================================
const OptimizedSun = memo(function OptimizedSun() {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  
  useFrame((state, delta) => {
    if (prefersReducedMotion) return;
    if (delta > 0.1) return; // Skip frame if > 100ms
    
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      glowRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
      {/* Main sun sphere */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshStandardMaterial
            color="#FFB800"
            emissive="#FF8C00"
            emissiveIntensity={0.8}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      </Float>
      
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.8, 24, 24]} />
        <meshStandardMaterial
          color="#FFB800"
          transparent
          opacity={0.3}
          emissive="#FF6B00"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Light source */}
      <pointLight
        position={[0, 0, 0]}
        color="#FFB800"
        intensity={3}
        distance={20}
      />
    </group>
  );
});

// ============================================
// OPTIMIZED PARTICLES
// ============================================
const OptimizedParticles = memo(function OptimizedParticles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<Points>(null);
  
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spread particles in a sphere
      const radius = 3 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Random velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }
    
    return { positions, velocities };
  }, [count]);
  
  useFrame((state, delta) => {
    if (prefersReducedMotion || !pointsRef.current) return;
    if (delta > 0.1) return;
    
    const posAttr = pointsRef.current.geometry.attributes.position;
    const posArray = posAttr.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3] * delta * 60;
      posArray[i3 + 1] += velocities[i3 + 1] * delta * 60;
      posArray[i3 + 2] += velocities[i3 + 2] * delta * 60;
      
      // Reset particles that go too far
      const dist = Math.sqrt(
        posArray[i3] ** 2 + posArray[i3 + 1] ** 2 + posArray[i3 + 2] ** 2
      );
      if (dist > 10) {
        const radius = 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        posArray[i3] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i3 + 2] = radius * Math.cos(phi);
      }
    }
    posAttr.needsUpdate = true;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#4CAF50"
        size={0.05}
        transparent
        opacity={0.6}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
});

// ============================================
// ORBITING OBJECTS
// ============================================
const OrbitingObject = memo(function OrbitingObject({
  radius,
  speed,
  color,
  size = 0.2,
  delay = 0,
}: {
  radius: number;
  speed: number;
  color: string;
  size?: number;
  delay?: number;
}) {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current || prefersReducedMotion) return;
    
    const time = state.clock.elapsedTime + delay;
    meshRef.current.position.x = Math.cos(time * speed) * radius;
    meshRef.current.position.z = Math.sin(time * speed) * radius;
    meshRef.current.position.y = Math.sin(time * speed * 0.5) * 0.5;
  });
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.3}
      />
    </mesh>
  );
});

// ============================================
// SOLAR PANEL (Simplified)
// ============================================
const SolarPanel = memo(function SolarPanel({ 
  position, 
  delay = 0 
}: { 
  position: [number, number, number]; 
  delay?: number;
}) {
  const meshRef = useRef<Mesh>(null);
  const [active, setActive] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current || prefersReducedMotion) return;
    const time = state.clock.elapsedTime;
    
    // Subtle tracking motion
    meshRef.current.rotation.x = -0.3 + Math.sin(time * 0.2 + delay) * 0.03;
    
    // Check if generating
    const generatePulse = Math.sin(time * 2 + delay * 10) > 0.9;
    if (generatePulse !== active) setActive(generatePulse);
  });
  
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.6, 0.04, 0.4]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[0.55, 0.015, 0.35]} />
        <meshStandardMaterial
          color={active ? "#1a237e" : "#0d1b4c"}
          metalness={0.8}
          roughness={0.2}
          emissive={active ? "#3949ab" : "#1a237e"}
          emissiveIntensity={active ? 0.4 : 0.1}
        />
      </mesh>
    </group>
  );
});

// ============================================
// SOLAR PANEL ARRAY
// ============================================
const SolarPanelArray = memo(function SolarPanelArray() {
  const panels = useMemo(() => {
    const result: { id: string; position: [number, number, number]; delay: number }[] = [];
    const rows = 2;
    const cols = 3;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        result.push({
          id: `panel-${row}-${col}`,
          position: [
            (col - cols / 2 + 0.5) * 0.9 - 3,
            -1.5 + row * 0.25,
            (row - rows / 2 + 0.5) * 0.6 + 1.5,
          ],
          delay: row * 0.5 + col * 0.3,
        });
      }
    }
    return result;
  }, []);
  
  return (
    <group rotation={[0.2, 0.3, 0]}>
      {panels.map((panel) => (
        <SolarPanel 
          key={panel.id} 
          position={panel.position} 
          delay={panel.delay}
        />
      ))}
    </group>
  );
});

// ============================================
// ENERGY FLOW LINES
// ============================================
const EnergyFlowLine = memo(function EnergyFlowLine({
  start,
  end,
  color = "#4CAF50",
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
}) {
  const lineRef = useRef<Points>(null);
  
  const { positions } = useMemo(() => {
    const points = 20;
    const positions = new Float32Array(points * 3);
    
    for (let i = 0; i < points; i++) {
      const t = i / (points - 1);
      positions[i * 3] = start[0] + (end[0] - start[0]) * t;
      positions[i * 3 + 1] = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.3;
      positions[i * 3 + 2] = start[2] + (end[2] - start[2]) * t;
    }
    
    return { positions };
  }, [start, end]);
  
  return (
    <points ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={20}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.03}
        transparent
        opacity={0.8}
        blending={AdditiveBlending}
      />
    </points>
  );
});

// ============================================
// MAIN SCENE
// ============================================
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {/* Main sun */}
      <OptimizedSun />
      
      {/* Orbiting objects */}
      <OrbitingObject radius={3} speed={0.5} color="#4CAF50" size={0.15} />
      <OrbitingObject radius={4} speed={0.3} color="#00BCD4" size={0.12} delay={2} />
      <OrbitingObject radius={5} speed={0.2} color="#9C27B0" size={0.1} delay={4} />
      
      {/* Particles */}
      <OptimizedParticles count={80} />
      
      {/* Solar panels */}
      <SolarPanelArray />
      
      {/* Energy flow lines */}
      <EnergyFlowLine start={[-2.5, -1.3, 2]} end={[0, 0, 0]} />
      <EnergyFlowLine start={[-3, -1.2, 2.5]} end={[0, 0, 0]} color="#00BCD4" />
      
      {/* Stars background */}
      <Stars 
        radius={50} 
        depth={30} 
        count={500} 
        factor={2} 
        saturation={0} 
        fade 
        speed={0.5}
      />
    </>
  );
}

// ============================================
// CANVAS WRAPPER WITH ERROR BOUNDARY
// ============================================
function Hero3DSceneInner() {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-light to-forest-dark" />
    );
  }
  
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]} // Limit pixel ratio for performance
      performance={{ min: 0.5 }}
      gl={{ 
        antialias: false, // Disable for performance
        powerPreference: "high-performance",
        alpha: true,
      }}
      onError={() => setHasError(true)}
    >
      <Scene />
    </Canvas>
  );
}

// ============================================
// EXPORT WITH MEMO
// ============================================
export default memo(function Hero3DScene() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Delay mount to prioritize other content
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-light to-forest-dark" />
    );
  }
  
  return <Hero3DSceneInner />;
});
