'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function NetworkCore() {
  const group = useRef<THREE.Group>(null);
  const nodes = [[-1.9, 0.8, 0], [-0.7, -0.7, 0.1], [0.7, 0.8, -0.2], [1.8, -0.45, 0.1], [0, 0, 0.4]] as const;
  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * 0.09; });
  return (
    <group ref={group}>
      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.35}>
        <mesh position={[0, 0, 0.4]}>
          <icosahedronGeometry args={[0.65, 2]} />
          <meshStandardMaterial color="#2AA8FF" metalness={0.7} roughness={0.22} transparent opacity={0.88} />
        </mesh>
        <mesh position={[0, 0, 0.4]} scale={1.12}>
          <icosahedronGeometry args={[0.65, 1]} />
          <meshBasicMaterial color="#D95F0F" wireframe transparent opacity={0.5} />
        </mesh>
      </Float>
      {nodes.map((p, i) => <mesh key={i} position={p}><sphereGeometry args={[0.12, 20, 20]} /><meshStandardMaterial color={i === 4 ? '#D95F0F' : '#A7B0BA'} emissive={i === 4 ? '#D95F0F' : '#042D7B'} emissiveIntensity={0.45} /></mesh>)}
      {nodes.slice(0, 4).map((p, i) => <Line key={i} points={[p, nodes[4]]} color={i % 2 ? '#2AA8FF' : '#D95F0F'} transparent opacity={0.8} lineWidth={1.2} />)}
      <Line points={[nodes[0], nodes[2], nodes[3], nodes[1], nodes[0]]} color="#042D7B" transparent opacity={0.7} lineWidth={1} />
    </group>
  );
}

export default function ThreeScene() {
  return <div className="three-shell" aria-hidden="true"><Canvas camera={{ position: [0, 0.4, 5.2], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true }}><ambientLight intensity={1.1} /><directionalLight position={[3, 4, 5]} intensity={2.4} color="#ffffff" /><pointLight position={[-3, -2, 2]} intensity={18} distance={9} color="#2AA8FF" /><NetworkCore /><OrbitControls enablePan={false} enableZoom={false} autoRotate={false} /></Canvas><div className="scanline" /></div>;
}
