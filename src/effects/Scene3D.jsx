import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';



// Distant Glowing Planet or Nebula Core
const GlowingCore = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[15, 8, -25]}>
      <sphereGeometry args={[4, 64, 64]} />
      <meshBasicMaterial color="#1a0b2e" transparent opacity={0.9} />
      {/* Glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial color="#7b2ff7" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </mesh>
  );
};

const Scene3D = () => {

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 1.5]}>

        
        {/* Realistic Starfield */}
        <Stars radius={50} depth={50} count={7000} factor={4} saturation={0.5} fade speed={1.5} />
        
        {/* Glowing dust/sparkles floating around */}
        <Sparkles count={200} scale={20} size={2} speed={0.4} opacity={0.3} color="#00d4ff" />

        {/* Distant Planet / Nebula */}
        <GlowingCore />


      </Canvas>
    </div>
  );
};

export default Scene3D;
