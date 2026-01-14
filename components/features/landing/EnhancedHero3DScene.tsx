'use client';

import { useRef, useEffect, useMemo, memo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Float, 
  MeshDistortMaterial, 
  Sparkles, 
  Stars 
} from '@react-three/drei';
import * as THREE from 'three';

// Color constants for consistent theming
const COLORS = {
  gold: "#FFB800",
  goldLight: "#FFD54F",
  green: "#4CAF50",
  greenLight: "#81C784",
  blue: "#00BCD4",
  blueLight: "#4DD0E1",
  forest: "#0D2818",
  forestLight: "#1B4332",
};

// Check for reduced motion preference
const prefersReducedMotion = typeof window !== 'undefined'
  ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
  : false;

// Solar Panel Component with glowing effect
const SolarPanel = memo(function SolarPanel({ 
  position, 
  delay = 0 
}: { 
  position: [number, number, number]; 
  delay?: number; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current || prefersReducedMotion) return;

    const time = state.clock.getElapsedTime();

    // Gentle rotation
    meshRef.current.rotation.y = Math.sin(time * 0.2 + delay) * 0.1;

    // Pulsing glow effect
    const glowIntensity = 0.5 + Math.sin(time * 2 + delay) * 0.3;
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity = glowIntensity;
    
    // Check if generating (for visual feedback)
    const generating = Math.sin(time * 2 + delay * 5) > 0.5;
    if (generating !== isGenerating) setIsGenerating(generating);
  });

  return (
    <group position={position}>
      {/* Solar panel */}
      <mesh ref={meshRef} rotation={[Math.PI / 6, 0, 0]}>
        <boxGeometry args={[1.5, 0.05, 1]} />
        <meshStandardMaterial
          color={isGenerating ? "#1a237e" : "#1a3a52"}
          metalness={0.9}
          roughness={0.15}
          emissive={isGenerating ? "#3949ab" : "#00BCD4"}
          emissiveIntensity={isGenerating ? 0.6 : 0.2}
        />
      </mesh>

      {/* Grid lines on panel */}
      <mesh rotation={[Math.PI / 6, 0, 0]} position={[0, 0.026, 0]}>
        <planeGeometry args={[1.5, 1]} />
        <meshBasicMaterial
          color={COLORS.gold}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      {/* Glow effect */}
      <mesh ref={glowRef} rotation={[Math.PI / 6, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[1.6, 1.1]} />
        <meshBasicMaterial
          color={COLORS.green}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Panel point light when generating */}
      {isGenerating && (
        <pointLight
          position={[0, 0.3, 0]}
          color={COLORS.green}
          intensity={1.5}
          distance={2}
        />
      )}
    </group>
  );
});

// Energy Particle flowing from panel to home
const EnergyParticle = memo(function EnergyParticle({
  startPos,
  endPos,
  delay = 0,
  color = COLORS.gold
}: {
  startPos: [number, number, number];
  endPos: [number, number, number];
  delay?: number;
  color?: string;
}) {
  const particleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!particleRef.current || prefersReducedMotion) return;

    const time = (state.clock.getElapsedTime() + delay) % 3;
    const progress = time / 3;

    // Cubic bezier curve for smooth path
    const t = progress;
    const midPoint: [number, number, number] = [
      (startPos[0] + endPos[0]) / 2,
      (startPos[1] + endPos[1]) / 2 + 2,
      (startPos[2] + endPos[2]) / 2,
    ];

    const x = (1 - t) * (1 - t) * startPos[0] + 2 * (1 - t) * t * midPoint[0] + t * t * endPos[0];
    const y = (1 - t) * (1 - t) * startPos[1] + 2 * (1 - t) * t * midPoint[1] + t * t * endPos[1];
    const z = (1 - t) * (1 - t) * startPos[2] + 2 * (1 - t) * t * midPoint[2] + t * t * endPos[2];

    particleRef.current.position.set(x, y, z);

    // Fade in/out
    const opacity = t < 0.1 ? t * 10 : t > 0.9 ? (1 - t) * 10 : 1;
    (particleRef.current.material as THREE.MeshBasicMaterial).opacity = opacity;

    // Scale based on progress
    const scale = 0.1 + Math.sin(t * Math.PI) * 0.05;
    particleRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={1}
      />
      {/* Glow trail */}
      <pointLight color={color} intensity={2} distance={2} />
    </mesh>
  );
});

// Central Energy Sun component
const EnergySun = memo(function EnergySun() {
  const sunRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (prefersReducedMotion) return;
    const time = state.clock.getElapsedTime();

    if (sunRef.current) {
      sunRef.current.rotation.y += 0.002;
    }
    if (glowRef.current) {
      const scale = 1.2 + Math.sin(time * 2) * 0.1;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={[0, 4, -3]}>
        {/* Main sun */}
        <mesh ref={sunRef}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <MeshDistortMaterial
            color={COLORS.gold}
            emissive={COLORS.gold}
            emissiveIntensity={0.5}
            distort={0.15}
            speed={2}
            roughness={0.2}
          />
        </mesh>

        {/* Outer glow */}
        <mesh ref={glowRef}>
          <sphereGeometry args={[0.9, 24, 24]} />
          <meshBasicMaterial
            color={COLORS.goldLight}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Sun light */}
        <pointLight
          position={[0, 0, 0]}
          color={COLORS.gold}
          intensity={4}
          distance={20}
        />
      </group>
    </Float>
  );
});

// Simple house model
const House = memo(function House({ 
  position, 
  powered = true 
}: { 
  position: [number, number, number];
  powered?: boolean;
}) {
  const houseRef = useRef<THREE.Group>(null);
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  useFrame((state) => {
    if (!houseRef.current || prefersReducedMotion) return;

    const time = state.clock.getElapsedTime();
    // Gentle float
    houseRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.1;
    
    // Window glow pulsing
    if (powered) {
      setGlowIntensity(0.4 + Math.sin(time * 2) * 0.2);
    }
  });

  return (
    <group ref={houseRef} position={position}>
      {/* House base */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#e8e8e8"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.8, 0.6, 4]} />
        <meshStandardMaterial
          color="#8b4513"
          metalness={0.2}
          roughness={0.8}
        />
      </mesh>

      {/* Window glow (powered by solar) */}
      <mesh position={[0.35, 0.5, 0.51]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial 
          color={powered ? COLORS.gold : "#87CEEB"}
          emissive={powered ? COLORS.gold : "#000000"}
          emissiveIntensity={powered ? glowIntensity : 0}
        />
      </mesh>
      <mesh position={[-0.35, 0.5, 0.51]}>
        <planeGeometry args={[0.2, 0.2]} />
        <meshStandardMaterial 
          color={powered ? COLORS.gold : "#87CEEB"}
          emissive={powered ? COLORS.gold : "#000000"}
          emissiveIntensity={powered ? glowIntensity : 0}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.25, 0.51]}>
        <planeGeometry args={[0.2, 0.4]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>

      {/* Glowing base (energy received) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
        <meshBasicMaterial
          color={COLORS.green}
          transparent
          opacity={powered ? 0.3 : 0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Point light when powered */}
      {powered && (
        <pointLight
          position={[0, 0.5, 0.8]}
          color={COLORS.gold}
          intensity={glowIntensity * 1.5}
          distance={1.5}
        />
      )}
    </group>
  );
});

// Connection lines between panels and homes
const ConnectionLines = memo(function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (!linesRef.current || prefersReducedMotion) return;

    const time = state.clock.getElapsedTime();
    (linesRef.current.material as THREE.LineBasicMaterial).opacity =
      0.2 + Math.sin(time * 2) * 0.1;
  });

  const positions = new Float32Array([
    // Panel 1 to House 1
    -3, 1, 2,
    2, 0, -2,

    // Panel 2 to House 2
    0, 1, 2,
    2, 0, 0,

    // Panel 3 to House 3
    3, 1, 2,
    2, 0, 2,
  ]);

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={COLORS.blue}
        transparent
        opacity={0.3}
        linewidth={2}
      />
    </lineSegments>
  );
});

// Network nodes showing digital connectivity
const NetworkNode = memo(function NetworkNode({ 
  position, 
  delay = 0,
  color = COLORS.gold
}: { 
  position: [number, number, number]; 
  delay?: number;
  color?: string;
}) {
  const nodeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!nodeRef.current || prefersReducedMotion) return;

    const time = state.clock.getElapsedTime() + delay;

    // Pulsing effect
    const scale = 0.15 + Math.sin(time * 3) * 0.05;
    nodeRef.current.scale.setScalar(scale);

    // Rotation
    nodeRef.current.rotation.y = time;
  });

  return (
    <group position={position}>
      <mesh ref={nodeRef}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Node glow */}
      <pointLight
        color={color}
        intensity={0.5}
        distance={1}
      />
    </group>
  );
});

// Main scene component
function Scene() {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color={COLORS.gold} />
      <directionalLight position={[-10, 5, -5]} intensity={0.5} color={COLORS.blue} />
      <pointLight position={[0, 5, 0]} intensity={1} color={COLORS.green} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={50} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
      
      {/* Central Energy Sun */}
      <EnergySun />

      {/* Solar Panels in a row */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <SolarPanel position={[-3, 1, 2]} delay={0} />
      </Float>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <SolarPanel position={[0, 1, 2]} delay={0.5} />
      </Float>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        <SolarPanel position={[3, 1, 2]} delay={1} />
      </Float>

      {/* Houses/Buildings receiving energy */}
      <House position={[2, 0, -2]} powered={true} />
      <House position={[2, 0, 0]} powered={true} />
      <House position={[2, 0, 2]} powered={true} />

      {/* Energy particles flowing from panels to houses */}
      <EnergyParticle startPos={[-3, 1, 2]} endPos={[2, 0.5, -2]} delay={0} color={COLORS.green} />
      <EnergyParticle startPos={[-3, 1, 2]} endPos={[2, 0.5, -2]} delay={1} color={COLORS.green} />
      <EnergyParticle startPos={[0, 1, 2]} endPos={[2, 0.5, 0]} delay={0.5} color={COLORS.gold} />
      <EnergyParticle startPos={[0, 1, 2]} endPos={[2, 0.5, 0]} delay={1.5} color={COLORS.gold} />
      <EnergyParticle startPos={[3, 1, 2]} endPos={[2, 0.5, 2]} delay={1} color={COLORS.blue} />
      <EnergyParticle startPos={[3, 1, 2]} endPos={[2, 0.5, 2]} delay={2} color={COLORS.blue} />

      {/* Connection lines */}
      <ConnectionLines />

      {/* Network nodes showing digital connectivity */}
      <NetworkNode position={[-1.5, 2, 0]} delay={0} color={COLORS.blue} />
      <NetworkNode position={[1.5, 2, 0]} delay={0.5} color={COLORS.green} />
      <NetworkNode position={[0, 3, 1]} delay={1} color={COLORS.gold} />

      {/* Ground plane with grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          color={COLORS.forest}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Sparkles for magical effect */}
      <Sparkles
        count={50}
        scale={15}
        size={2}
        speed={0.3}
        color={COLORS.gold}
        opacity={0.5}
      />
      
      {/* Background Stars */}
      <Stars
        radius={50}
        depth={30}
        count={200}
        factor={2}
        saturation={0}
        fade
        speed={0.3}
      />

      {/* Ambient particles */}
      {[...Array(20)].map((_, i) => (
        <Float key={i} speed={2 + i * 0.1} rotationIntensity={0} floatIntensity={1}>
          <mesh
            position={[
              (Math.random() - 0.5) * 15,
              Math.random() * 5,
              (Math.random() - 0.5) * 15,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? COLORS.gold : i % 3 === 1 ? COLORS.green : COLORS.blue}
              transparent
              opacity={0.6}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// Canvas wrapper with error handling
function EnhancedHero3DSceneInner() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback to gradient if WebGL fails
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-light to-forest-dark" />
    );
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onError={() => setHasError(true)}
    >
      <Scene />
    </Canvas>
  );
}

// Main export component with delayed mount
export default memo(function EnhancedHero3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set up performance optimization
    if (typeof window !== 'undefined') {
      // Limit animation frame rate on mobile
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        document.documentElement.style.setProperty('--canvas-fps', '30');
      }
    }
    
    // Delay mount slightly to prioritize other content
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest-light to-forest-dark" />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <EnhancedHero3DSceneInner />
    </div>
  );
});
