"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  Sphere, 
  MeshTransmissionMaterial,
  Environment,
  Stars,
  Trail,
  Sparkles,
  useTexture,
  GradientTexture,
  Edges,
  MeshWobbleMaterial,
  shaderMaterial,
  Billboard,
  Text
} from "@react-three/drei";
import * as THREE from "three";

// ============================================
// CUSTOM SHADERS
// ============================================

// Solar Corona Shader
const SolarCoronaMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color("#FFB800"),
    uColor2: new THREE.Color("#FF6B00"),
    uColor3: new THREE.Color("#FF4400"),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      // Create turbulent noise pattern
      vec3 noiseCoord = vPosition * 2.0 + uTime * 0.5;
      float noise1 = snoise(noiseCoord);
      float noise2 = snoise(noiseCoord * 2.0 + 100.0);
      float noise3 = snoise(noiseCoord * 4.0 + 200.0);
      
      float combinedNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
      
      // Create solar flare effect
      float flare = pow(max(0.0, combinedNoise + 0.3), 2.0);
      
      // Color mixing based on noise
      vec3 color = mix(uColor1, uColor2, smoothstep(-0.2, 0.5, noise1));
      color = mix(color, uColor3, smoothstep(0.3, 0.8, noise2) * 0.5);
      
      // Edge glow (fresnel effect)
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      color += uColor1 * fresnel * 0.5;
      
      // Pulsing intensity
      float pulse = 0.8 + 0.2 * sin(uTime * 3.0);
      
      float alpha = (0.6 + flare * 0.4) * pulse;
      
      gl_FragColor = vec4(color * (1.0 + flare * 0.5), alpha);
    }
  `
);

// Extend Three.js with custom material
extend({ SolarCoronaMaterial });

// Energy Flow Shader
const EnergyFlowMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#4CAF50"),
    uSpeed: 1.0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uSpeed;
    varying vec2 vUv;
    
    void main() {
      float flow = fract(vUv.x * 10.0 - uTime * uSpeed);
      float pulse = smoothstep(0.0, 0.3, flow) * smoothstep(1.0, 0.7, flow);
      float glow = pulse * 0.8 + 0.2;
      gl_FragColor = vec4(uColor * glow, glow);
    }
  `
);

extend({ EnergyFlowMaterial });

// ============================================
// SOLAR PANEL GRID SYSTEM
// ============================================

function SolarPanel({ position, rotation, delay = 0 }: { 
  position: [number, number, number]; 
  rotation?: [number, number, number];
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    
    // Subtle tracking motion (following the sun)
    meshRef.current.rotation.x = -0.3 + Math.sin(time * 0.2 + delay) * 0.05;
    
    // Pulse when generating energy
    const generatePulse = Math.sin(time * 2 + delay * 10) > 0.8;
    setActive(generatePulse);
  });
  
  return (
    <group position={position} rotation={rotation}>
      {/* Panel frame */}
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          metalness={0.8} 
          roughness={0.2}
        />
      </mesh>
      
      {/* Solar cells */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.75, 0.02, 0.45]} />
        <meshStandardMaterial
          color={active ? "#1a237e" : "#0d1b4c"}
          metalness={0.9}
          roughness={0.1}
          emissive={active ? "#3949ab" : "#1a237e"}
          emissiveIntensity={active ? 0.5 : 0.1}
        />
      </mesh>
      
      {/* Grid lines on panel */}
      {[-0.2, 0, 0.2].map((x, i) => (
        <mesh key={`v-${i}`} position={[x, 0.04, 0]}>
          <boxGeometry args={[0.01, 0.01, 0.45]} />
          <meshBasicMaterial color="#4a5568" />
        </mesh>
      ))}
      {[-0.15, 0, 0.15].map((z, i) => (
        <mesh key={`h-${i}`} position={[0, 0.04, z]}>
          <boxGeometry args={[0.75, 0.01, 0.01]} />
          <meshBasicMaterial color="#4a5568" />
        </mesh>
      ))}
      
      {/* Energy emission when active */}
      {active && (
        <pointLight
          position={[0, 0.2, 0]}
          color="#4CAF50"
          intensity={2}
          distance={1}
        />
      )}
    </group>
  );
}

function SolarPanelArray() {
  const panels = useMemo(() => {
    const result = [];
    const rows = 3;
    const cols = 4;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        result.push({
          id: `panel-${row}-${col}`,
          position: [
            (col - cols / 2 + 0.5) * 1.2 - 4,
            -1.5 + row * 0.3,
            (row - rows / 2 + 0.5) * 0.8 + 2,
          ] as [number, number, number],
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
}

// ============================================
// DIGITAL SUN CORE
// ============================================

function DigitalSunCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<any>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.1;
      coreRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;
    }
    
    if (coronaRef.current) {
      coronaRef.current.uTime = time;
    }
    
    if (innerGlowRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      innerGlowRef.current.scale.setScalar(pulse);
    }
  });
  
  return (
    <group position={[3, 1, -2]}>
      {/* Core sun sphere */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh ref={coreRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#FFB800"
            emissive="#FF6B00"
            emissiveIntensity={0.8}
            distort={0.2}
            speed={3}
            roughness={0}
            metalness={0.3}
          />
        </mesh>
        
        {/* Inner pulsing glow */}
        <mesh ref={innerGlowRef}>
          <sphereGeometry args={[1.1, 32, 32]} />
          <meshBasicMaterial
            color="#FFB800"
            transparent
            opacity={0.3}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Solar corona effect */}
        <mesh>
          <sphereGeometry args={[1.4, 64, 64]} />
          {/* @ts-ignore */}
          <solarCoronaMaterial ref={coronaRef} transparent side={THREE.BackSide} />
        </mesh>
        
        {/* Outer glow layers */}
        {[1.6, 1.9, 2.2, 2.6].map((radius, i) => (
          <mesh key={i}>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshBasicMaterial
              color="#FFB800"
              transparent
              opacity={0.08 - i * 0.015}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </Float>
      
      {/* Sun rays / God rays effect */}
      <SunRays />
      
      {/* Orbiting energy points */}
      <OrbitingEnergyPoints />
    </group>
  );
}

function SunRays() {
  const raysRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!raysRef.current) return;
    raysRef.current.rotation.z = state.clock.elapsedTime * 0.1;
  });
  
  const rays = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (i / 12) * Math.PI * 2,
      length: 2 + Math.random() * 1.5,
      width: 0.02 + Math.random() * 0.02,
    })),
  []);
  
  return (
    <group ref={raysRef}>
      {rays.map((ray) => (
        <mesh
          key={ray.id}
          position={[
            Math.cos(ray.angle) * 1.5,
            Math.sin(ray.angle) * 1.5,
            0,
          ]}
          rotation={[0, 0, ray.angle + Math.PI / 2]}
        >
          <planeGeometry args={[ray.width, ray.length]} />
          <meshBasicMaterial
            color="#FFB800"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrbitingEnergyPoints() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
  });
  
  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 1.8;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              0,
            ]}
          >
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#FFB800" : "#FF6B00"}
              transparent
              opacity={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ============================================
// ENERGY FLOW NETWORK
// ============================================

function EnergyFlowLine({ 
  start, 
  end, 
  color = "#4CAF50",
  delay = 0 
}: { 
  start: [number, number, number]; 
  end: [number, number, number];
  color?: string;
  delay?: number;
}) {
  const lineRef = useRef<any>(null);
  
  useFrame((state) => {
    if (!lineRef.current) return;
    lineRef.current.uTime = state.clock.elapsedTime + delay;
  });
  
  // Create curved path
  const curve = useMemo(() => {
    const midPoint = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2 + 0.5,
      (start[2] + end[2]) / 2,
    ];
    
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(midPoint[0], midPoint[1], midPoint[2]),
      new THREE.Vector3(...end)
    );
  }, [start, end]);
  
  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, 0.02, 8, false);
  }, [curve]);
  
  return (
    <mesh geometry={tubeGeometry}>
      {/* @ts-ignore */}
      <energyFlowMaterial 
        ref={lineRef}
        transparent
        uColor={new THREE.Color(color)}
        uSpeed={2}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function EnergyNetwork() {
  const connections = useMemo(() => [
    // From sun to central hub
    { start: [3, 1, -2] as [number, number, number], end: [0, 0, 0] as [number, number, number], color: "#FFB800" },
    // From central hub to panels
    { start: [0, 0, 0] as [number, number, number], end: [-3, -1, 2] as [number, number, number], color: "#4CAF50" },
    // To smart home 1
    { start: [0, 0, 0] as [number, number, number], end: [-2, -0.5, -1] as [number, number, number], color: "#00BCD4" },
    // To smart home 2
    { start: [0, 0, 0] as [number, number, number], end: [1, -1, 3] as [number, number, number], color: "#00BCD4" },
    // Grid connections
    { start: [-3, -1, 2] as [number, number, number], end: [-2, -0.5, -1] as [number, number, number], color: "#4CAF50", delay: 0.5 },
    { start: [-2, -0.5, -1] as [number, number, number], end: [1, -1, 3] as [number, number, number], color: "#4CAF50", delay: 1 },
  ], []);
  
  return (
    <group>
      {connections.map((conn, i) => (
        <EnergyFlowLine
          key={i}
          start={conn.start}
          end={conn.end}
          color={conn.color}
          delay={conn.delay || i * 0.3}
        />
      ))}
    </group>
  );
}

// ============================================
// SMART HOME VISUALIZATION
// ============================================

function SmartHome({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const [energyLevel, setEnergyLevel] = useState(0);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    setEnergyLevel((Math.sin(time * 2 + position[0]) + 1) / 2);
    
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* House base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.3]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.3}
          roughness={0.7}
          emissive="#4CAF50"
          emissiveIntensity={energyLevel * 0.3}
        />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 0.35, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.35, 0.2, 4]} />
        <meshStandardMaterial
          color="#1a202c"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      {/* Solar panel on roof */}
      <mesh position={[0, 0.42, 0.08]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.2, 0.02, 0.15]} />
        <meshStandardMaterial
          color="#1a237e"
          metalness={0.9}
          roughness={0.1}
          emissive="#3949ab"
          emissiveIntensity={energyLevel * 0.5}
        />
      </mesh>
      
      {/* Energy indicator light */}
      <pointLight
        position={[0, 0.3, 0.2]}
        color="#4CAF50"
        intensity={energyLevel * 3}
        distance={0.5}
      />
      
      {/* Window glow */}
      <mesh position={[0, 0.15, 0.16]}>
        <boxGeometry args={[0.08, 0.1, 0.01]} />
        <meshBasicMaterial
          color="#FFF9C4"
          transparent
          opacity={0.5 + energyLevel * 0.5}
        />
      </mesh>
    </group>
  );
}

// ============================================
// CENTRAL ENERGY HUB
// ============================================

function CentralEnergyHub() {
  const hubRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (hubRef.current) {
      hubRef.current.rotation.y = time * 0.5;
    }
    
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        ring.rotation.x = Math.PI / 2 + Math.sin(time + i) * 0.2;
        ring.rotation.z = time * (0.3 + i * 0.1) * (i % 2 === 0 ? 1 : -1);
      });
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
      {/* Core sphere */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={hubRef}>
          <icosahedronGeometry args={[0.4, 2]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={128}
            transmission={0.9}
            roughness={0}
            thickness={0.3}
            ior={1.5}
            chromaticAberration={0.05}
            color="#4CAF50"
          />
        </mesh>
        
        {/* Inner glow */}
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color="#4CAF50" transparent opacity={0.6} />
        </mesh>
      </Float>
      
      {/* Rotating rings */}
      <group ref={ringsRef}>
        {[0.6, 0.75, 0.9].map((radius, i) => (
          <mesh key={i}>
            <torusGeometry args={[radius, 0.01, 16, 64]} />
            <meshBasicMaterial
              color={i === 0 ? "#4CAF50" : i === 1 ? "#00BCD4" : "#FFB800"}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
      
      {/* Data points floating around */}
      <DataPoints />
    </group>
  );
}

function DataPoints() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
  });
  
  const points = useMemo(() => 
    Array.from({ length: 6 }, (_, i) => ({
      angle: (i / 6) * Math.PI * 2,
      radius: 0.8 + Math.random() * 0.3,
      y: (Math.random() - 0.5) * 0.4,
      color: i % 3 === 0 ? "#FFB800" : i % 3 === 1 ? "#4CAF50" : "#00BCD4",
    })),
  []);
  
  return (
    <group ref={groupRef}>
      {points.map((point, i) => (
        <group
          key={i}
          position={[
            Math.cos(point.angle) * point.radius,
            point.y,
            Math.sin(point.angle) * point.radius,
          ]}
        >
          <mesh>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshBasicMaterial color={point.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================
// ADVANCED PARTICLE SYSTEMS
// ============================================

function EnergyPhotons({ count = 100 }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, velocities, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const colorGold = new THREE.Color("#FFB800");
    const colorGreen = new THREE.Color("#4CAF50");
    const colorCyan = new THREE.Color("#00BCD4");
    
    for (let i = 0; i < count; i++) {
      // Start from sun position
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.5;
      
      positions[i * 3] = 3 + Math.cos(angle) * radius;
      positions[i * 3 + 1] = 1 + Math.sin(angle) * radius;
      positions[i * 3 + 2] = -2 + (Math.random() - 0.5) * radius;
      
      // Velocity towards center
      const targetX = (Math.random() - 0.5) * 8;
      const targetY = (Math.random() - 0.5) * 4;
      const targetZ = (Math.random() - 0.5) * 8;
      
      velocities[i * 3] = (targetX - positions[i * 3]) * 0.01;
      velocities[i * 3 + 1] = (targetY - positions[i * 3 + 1]) * 0.01;
      velocities[i * 3 + 2] = (targetZ - positions[i * 3 + 2]) * 0.01;
      
      // Random color
      const colorChoice = Math.random();
      const color = colorChoice < 0.5 ? colorGold : colorChoice < 0.8 ? colorGreen : colorCyan;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.08 + 0.02;
    }
    
    return { positions, velocities, colors, sizes };
  }, [count]);
  
  useFrame(() => {
    if (!pointsRef.current) return;
    
    const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];
      
      // Reset if too far from center
      const dist = Math.sqrt(
        posArray[i3] ** 2 + posArray[i3 + 1] ** 2 + posArray[i3 + 2] ** 2
      );
      
      if (dist > 8 || dist < 0.5) {
        // Reset to sun position
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.5;
        
        posArray[i3] = 3 + Math.cos(angle) * radius;
        posArray[i3 + 1] = 1 + Math.sin(angle) * radius;
        posArray[i3 + 2] = -2 + (Math.random() - 0.5) * radius;
        
        // New velocity
        const targetX = (Math.random() - 0.5) * 8;
        const targetY = (Math.random() - 0.5) * 4;
        const targetZ = (Math.random() - 0.5) * 8;
        
        velocities[i3] = (targetX - posArray[i3]) * 0.01;
        velocities[i3 + 1] = (targetY - posArray[i3 + 1]) * 0.01;
        velocities[i3 + 2] = (targetZ - posArray[i3 + 2]) * 0.01;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
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
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Ambient floating particles
function AmbientParticles({ count = 500 }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      const brightness = Math.random() * 0.5 + 0.5;
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness;
    }
    
    return { positions, colors };
  }, [count]);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ============================================
// GRID VISUALIZATION
// ============================================

function PowerGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!gridRef.current) return;
    const time = state.clock.elapsedTime;
    
    gridRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshBasicMaterial;
        material.opacity = 0.1 + Math.sin(time * 2 + i * 0.5) * 0.05;
      }
    });
  });
  
  return (
    <group ref={gridRef} position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Horizontal lines */}
      {Array.from({ length: 21 }, (_, i) => (
        <mesh key={`h-${i}`} position={[0, (i - 10) * 0.5, 0]}>
          <boxGeometry args={[10, 0.01, 0.01]} />
          <meshBasicMaterial
            color="#4CAF50"
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
      
      {/* Vertical lines */}
      {Array.from({ length: 21 }, (_, i) => (
        <mesh key={`v-${i}`} position={[(i - 10) * 0.5, 0, 0]}>
          <boxGeometry args={[0.01, 10, 0.01]} />
          <meshBasicMaterial
            color="#4CAF50"
            transparent
            opacity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================
// MOUSE INTERACTION
// ============================================

function MouseParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  useFrame(() => {
    if (!groupRef.current) return;
    
    // Smooth interpolation
    groupRef.current.rotation.y += (mouse.x * 0.15 - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (mouse.y * 0.1 - groupRef.current.rotation.x) * 0.05;
  });
  
  return <group ref={groupRef}>{children}</group>;
}

// ============================================
// MAIN SCENE
// ============================================

function Scene() {
  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.15} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={0.3} 
        color="#ffffff"
        castShadow
      />
      <pointLight position={[3, 1, -2]} intensity={3} color="#FFB800" distance={15} />
      <pointLight position={[-3, 0, 2]} intensity={1} color="#4CAF50" distance={10} />
      <pointLight position={[0, -1, 3]} intensity={0.5} color="#00BCD4" distance={8} />
      
      {/* Stars background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={2000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5} 
      />
      
      {/* Ambient particles */}
      <AmbientParticles count={300} />
      
      {/* Interactive content with mouse parallax */}
      <MouseParallax>
        {/* Digital Sun */}
        <DigitalSunCore />
        
        {/* Central Energy Hub */}
        <CentralEnergyHub />
        
        {/* Solar Panel Array */}
        <SolarPanelArray />
        
        {/* Energy Network Connections */}
        <EnergyNetwork />
        
        {/* Smart Homes */}
        <SmartHome position={[-2, -0.5, -1]} scale={0.8} />
        <SmartHome position={[1, -1, 3]} scale={0.7} />
        <SmartHome position={[-3.5, -0.8, 0.5]} scale={0.6} />
        
        {/* Energy photons flowing through system */}
        <EnergyPhotons count={80} />
        
        {/* Power grid visualization */}
        <PowerGrid />
        
        {/* Sparkles effect */}
        <Sparkles
          count={50}
          scale={10}
          size={2}
          speed={0.3}
          color="#FFB800"
        />
      </MouseParallax>
      
      {/* Fog for depth */}
      <fog attach="fog" args={["#0a1510", 5, 30]} />
    </>
  );
}

// ============================================
// MAIN EXPORT
// ============================================

export default function Hero3DScene() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  
  useEffect(() => {
    setMounted(true);
    
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);
  
  if (!mounted || !hasWebGL) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f14] via-[#0D2818] to-[#061610]">
        {/* Fallback gradient with CSS animations */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full animate-pulse"
            style={{
              background: "radial-gradient(circle, rgba(255,184,0,0.3) 0%, transparent 60%)",
              filter: "blur(40px)",
            }}
          />
          <div 
            className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full animate-pulse"
            style={{
              background: "radial-gradient(circle, rgba(76,175,80,0.2) 0%, transparent 60%)",
              filter: "blur(30px)",
              animationDelay: "1s",
            }}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ 
          position: [0, 0, 8], 
          fov: 50,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        dpr={[1, 1.5]} // Limit DPR for performance
        performance={{ min: 0.5 }}
        onCreated={(state) => {
          state.gl.setClearColor("#0a1510", 1);
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
