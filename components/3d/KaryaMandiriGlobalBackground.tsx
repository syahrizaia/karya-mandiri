"use client";

import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Central Optical Prism - The Escrow & Smart-Contract Core of Karya Mandiri
 */
function OpticalCrystalCore() {
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.x += delta * 0.25;
      crystalRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <mesh ref={crystalRef}>
      {/* High-poly faceted geometry */}
      <octahedronGeometry args={[1.6, 2]} />
      <meshPhysicalMaterial
        color="#38bdf8"
        emissive="#0284c7"
        emissiveIntensity={0.25}
        roughness={0.05}
        metalness={0.1}
        transmission={0.92}
        ior={1.52}
        thickness={2.4}
        transparent
        opacity={0.95}
        reflectivity={0.9}
        clearcoat={1}
        clearcoatRoughness={0.06}
      />
    </mesh>
  );
}

/**
 * Precision Mechanical Orbital Rings - High-poly engineered parts representing industrial precision
 */
function MechanicalGimbalEngine() {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.18;
      ring1Ref.current.rotation.x += delta * 0.08;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.22;
      ring2Ref.current.rotation.z -= delta * 0.12;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.15;
      ring3Ref.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Outer Titanium Orbital Ring (High Poly) */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[3.2, 0.08, 64, 128]} />
          <meshStandardMaterial
            color="#94a3b8"
            metalness={0.95}
            roughness={0.18}
          />
        </mesh>

        {/* Precision Fasteners / Cylinders along Ring 1 */}
        {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((angle, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 3.2,
              Math.sin(angle) * 3.2,
              0
            ]}
            rotation={[0, 0, angle]}
          >
            <cylinderGeometry args={[0.07, 0.07, 0.24, 32]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.8} roughness={0.2} emissive="#0284c7" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>

      {/* Mid Concentric High-Poly Ring with Beveled Machined Teeth */}
      <group ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.5, 0.065, 64, 128]} />
          <meshStandardMaterial
            color="#64748b"
            metalness={0.92}
            roughness={0.22}
          />
        </mesh>
        
        {/* Micro-piston hubs */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 2.5,
              Math.sin(angle) * 2.5,
              0
            ]}
          >
            <sphereGeometry args={[0.13, 32, 32]} />
            <meshStandardMaterial color="#818cf8" metalness={0.9} roughness={0.1} emissive="#6366f1" emissiveIntensity={0.5} />
          </mesh>
        ))}
      </group>

      {/* Inner Precision Cyan Axis Ring */}
      <group ref={ring3Ref} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <mesh>
          <torusGeometry args={[1.9, 0.05, 64, 128]} />
          <meshPhysicalMaterial
            color="#0ea5e9"
            metalness={0.85}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.1}
            emissive="#0284c7"
            emissiveIntensity={0.25}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Orbiting Task & Freelance Network Nodes - representing crowdsourcing micro-tasks
 */
function SatelliteNetworkNodes() {
  const groupRef = useRef<THREE.Group>(null);

  // Generate 12 high-precision floating nodes
  const nodes = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const radius = 3.8 + (i % 3) * 0.7;
      const speed = (0.2 + (i % 4) * 0.1) * (i % 2 === 0 ? 1 : -1);
      const angle = (i / 12) * Math.PI * 2;
      const height = ((i % 5) - 2) * 0.9;
      const color = i % 3 === 0 ? "#38bdf8" : i % 3 === 1 ? "#818cf8" : "#34d399";
      return { radius, speed, angle, height, color };
    });
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        const node = nodes[index];
        if (node) {
          node.angle += delta * node.speed * 0.5;
          child.position.x = Math.cos(node.angle) * node.radius;
          child.position.z = Math.sin(node.angle) * node.radius;
          child.position.y = node.height + Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.2;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i} position={[Math.cos(node.angle) * node.radius, node.height, Math.sin(node.angle) * node.radius]}>
          <mesh>
            <sphereGeometry args={[0.09, 32, 32]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
          {/* Subtle outer energy halo */}
          <mesh>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.18}
              wireframe
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Ambient background dust / economic node stream
 */
function AmbientDataParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const particleData = useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particleData, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#38bdf8"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}

/**
 * Main Interactive 3D Scene Assembly
 */
function SceneContent() {
  const mainGroupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.current.x = normalizedY * 0.28;
      targetRotation.current.y = normalizedX * 0.35;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  useFrame((state, delta) => {
    if (mainGroupRef.current) {
      // Smooth lerp to cursor position
      mainGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        mainGroupRef.current.rotation.x,
        targetRotation.current.x,
        delta * 2.5
      );
      mainGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        mainGroupRef.current.rotation.y,
        targetRotation.current.y,
        delta * 2.5
      );
    }
  });

  return (
    <group ref={mainGroupRef} position={[0, 0, 0]}>
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <OpticalCrystalCore />
        <MechanicalGimbalEngine />
        <SatelliteNetworkNodes />
      </Float>
      <AmbientDataParticles />
    </group>
  );
}

/**
 * Global Background Component mounted in RootLayout
 */
export default function KaryaMandiriGlobalBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className="fixed inset-0 -z-10 pointer-events-none bg-radial from-slate-900/60 via-slate-950/90 to-slate-950" 
        aria-hidden="true" 
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Dynamic ambient gradients for liquid glass light bi-refraction */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 dark:bg-blue-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-120 h-120 bg-indigo-600/10 dark:bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-600/10 dark:bg-teal-600/10 rounded-full blur-[140px] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        className="w-full h-full"
      >
        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 6]} intensity={1.4} color="#ffffff" />
        <pointLight position={[-6, -4, 4]} intensity={2.0} color="#38bdf8" />
        <spotLight position={[0, 6, 4]} intensity={2.5} angle={0.6} penumbra={0.8} color="#818cf8" />
        <pointLight position={[6, 3, -2]} intensity={1.6} color="#34d399" />

        <SceneContent />
      </Canvas>
    </div>
  );
}
