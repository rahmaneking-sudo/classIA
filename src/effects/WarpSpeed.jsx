import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Starfield = () => {
  const pointsRef = useRef();
  
  // 5000 stars
  const starCount = 5000;
  
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    const spd = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      // Spread stars widely in a tunnel
      pos[i * 3] = (Math.random() - 0.5) * 200; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 200; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 400; // z (depth)
      
      // Random speeds for parallax effect
      spd[i] = 0.5 + Math.random() * 2;
    }
    return [pos, spd];
  }, []);

  useFrame((state, delta) => {
    const positions = pointsRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < starCount; i++) {
      // Move star towards the camera (positive Z)
      positions[i * 3 + 2] += speeds[i] * delta * 50; // warp speed factor
      
      // If star goes past the camera, reset it far back
      if (positions[i * 3 + 2] > 50) {
        positions[i * 3 + 2] = -300;
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Slight rotation of the entire field for cinematic feel
    pointsRef.current.rotation.z += delta * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00d4ff" // Glowing blue stars
        size={0.6}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const WarpSpeed = () => {
  return (
    <div className="absolute inset-0 z-0 bg-[#020205] overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 0], fov: 75 }}>
        <fog attach="fog" args={['#020205', 10, 200]} />
        <Starfield />
      </Canvas>
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]/80" />
      <div className="absolute inset-0 bg-[#7b2ff7]/5 mix-blend-overlay" />
    </div>
  );
};

export default WarpSpeed;
