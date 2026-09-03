'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Instance, Instances, Line, RoundedBox } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { Locale } from '@/lib/content';

type Point3 = [number, number, number];
type SurfaceStyle = 'steel' | 'paint' | 'rubber';
type SceneTransform = {
  position: Point3;
  rotation: Point3;
  scale: number;
};

const ROOT_HOME_TRANSFORMS = {
  chassisRoot: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
  processRoot: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
  driveRoot: { position: [-0.36, 0, 0.06], rotation: [0, 0, 0], scale: 1 },
  controlRoot: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
  digitalRoot: { position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
  optimizationRoot: { position: [0, 0, 0], rotation: [0, 0, 0.35], scale: 0.001 },
} satisfies Record<string, SceneTransform>;

const ASSEMBLY_TRANSFORMS = {
  homeTransform: { position: [0, 0, 0], rotation: [-0.015, 0.18, 0], scale: 0.95 },
  inspectionTransform: { position: [0, 0, 0], rotation: [0.015, 0.08, 0], scale: 0.945 },
  focusTransform: { position: [0, 0, 0], rotation: [0.02, -0.06, 0], scale: 0.95 },
  digitalTransform: { position: [0, 0, 0], rotation: [-0.01, 0.12, 0], scale: 0.955 },
  optimizedTransform: { position: [0, 0, 0], rotation: [-0.025, 0.22, 0], scale: 0.96 },
} satisfies Record<string, SceneTransform>;

const NARRATIVE_TRANSFORMS = [
  ASSEMBLY_TRANSFORMS.homeTransform,
  ASSEMBLY_TRANSFORMS.inspectionTransform,
  ASSEMBLY_TRANSFORMS.focusTransform,
  ASSEMBLY_TRANSFORMS.digitalTransform,
  ASSEMBLY_TRANSFORMS.optimizedTransform,
];

const NARRATIVE_ANCHORS = [0, 0.2, 0.42, 0.76, 1];

function smoothstep(value: number, start: number, end: number) {
  const normalized = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}

function progressWindow(value: number, start: number, end: number) {
  return smoothstep(value, start, end);
}

function dampScale(group: THREE.Object3D, target: number, lambda: number, delta: number) {
  const scale = THREE.MathUtils.damp(group.scale.x, target, lambda, delta);
  group.scale.setScalar(scale);
}

function sampleNarrativeTransform(progress: number, target: SceneTransform) {
  let index = 0;
  while (index < NARRATIVE_ANCHORS.length - 2 && progress > NARRATIVE_ANCHORS[index + 1]) index += 1;
  const start = NARRATIVE_ANCHORS[index];
  const end = NARRATIVE_ANCHORS[index + 1];
  const mix = smoothstep(progress, start, end);
  const from = NARRATIVE_TRANSFORMS[index];
  const to = NARRATIVE_TRANSFORMS[index + 1];

  for (let axis = 0; axis < 3; axis += 1) {
    target.position[axis] = THREE.MathUtils.lerp(from.position[axis], to.position[axis], mix);
    target.rotation[axis] = THREE.MathUtils.lerp(from.rotation[axis], to.rotation[axis], mix);
  }
  target.scale = THREE.MathUtils.lerp(from.scale, to.scale, mix);
}

const sensorNodes: Point3[] = [
  [-1.42, -0.48, 0.28],
  [0.58, 1.18, 0.42],
  [1.28, 0.38, 0.22],
  [0.7, -1.15, 0.54],
  [-0.48, -0.92, 0.32],
];

function pseudoRandom(x: number, y: number, seed: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233 + seed * 19.19) * 43758.5453;
  return value - Math.floor(value);
}

function createSurfaceTexture(style: SurfaceStyle, heightMap: boolean, seed: number) {
  const size = 128;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const noise = pseudoRandom(x, y, seed);
      const fineNoise = pseudoRandom(x * 3, y * 5, seed + 7);
      const scratch = x % 31 === 0 || x % 47 === 0 ? -30 : 0;
      const brushed = Math.sin(x * 1.8) * 7 + Math.sin(x * 0.23) * 10;
      const speckle = noise > 0.975 ? -36 : 0;

      let value = 128;
      if (style === 'steel') value = 182 + brushed + fineNoise * 18 + scratch;
      if (style === 'paint') value = 112 + (noise - 0.5) * 22 + speckle;
      if (style === 'rubber') value = 88 + (noise - 0.5) * 36 + Math.sin((x + y) * 0.8) * 4;
      if (heightMap) value = 128 + (value - 128) * 0.72;

      const clamped = THREE.MathUtils.clamp(Math.round(value), 0, 255);
      data[index] = clamped;
      data[index + 1] = clamped;
      data[index + 2] = clamped;
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(style === 'steel' ? 3 : 5, style === 'steel' ? 9 : 5);
  texture.anisotropy = 4;
  texture.colorSpace = heightMap ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createScreenTexture() {
  const width = 160;
  const height = 96;
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const grid = x % 20 === 0 || y % 16 === 0;
      const curveY = 51 + Math.round(Math.sin(x * 0.12) * 12 + Math.cos(x * 0.035) * 8);
      const chart = Math.abs(y - curveY) < 2;
      const alert = x > 118 && x < 148 && y > 16 && y < 31;
      const base = 10 + Math.round(pseudoRandom(x, y, 31) * 5);

      data[index] = chart || alert ? 235 : base;
      data[index + 1] = chart || alert ? 91 : grid ? 58 : 25;
      data[index + 2] = chart || alert ? 24 : grid ? 82 : 54;
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function useIndustrialTextures() {
  const textures = useMemo(
    () => ({
      steel: createSurfaceTexture('steel', false, 4),
      steelHeight: createSurfaceTexture('steel', true, 4),
      paint: createSurfaceTexture('paint', false, 9),
      paintHeight: createSurfaceTexture('paint', true, 9),
      rubber: createSurfaceTexture('rubber', false, 17),
      rubberHeight: createSurfaceTexture('rubber', true, 17),
      screen: createScreenTexture(),
    }),
    [],
  );

  useEffect(
    () => () => {
      Object.values(textures).forEach((texture) => texture.dispose());
    },
    [textures],
  );

  return textures;
}

type IndustrialTextures = ReturnType<typeof useIndustrialTextures>;

function BoltRing({ y, radius, textures }: { y: number; radius: number; textures: IndustrialTextures }) {
  const boltCount = 12;

  return (
    <group position={[0, y, 0]}>
      <mesh>
        <cylinderGeometry args={[radius + 0.14, radius + 0.14, 0.13, 48]} />
        <meshPhysicalMaterial
          color="#C8D5DF"
          map={textures.steel}
          bumpMap={textures.steelHeight}
          bumpScale={0.015}
          metalness={0.94}
          roughness={0.24}
          clearcoat={0.3}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.08, 14, 64]} />
        <meshStandardMaterial color="#E7F0F6" metalness={0.95} roughness={0.18} />
      </mesh>
      <Instances limit={boltCount}>
        <cylinderGeometry args={[0.045, 0.045, 0.1, 6]} />
        <meshStandardMaterial color="#53697A" metalness={0.96} roughness={0.2} />
        {Array.from({ length: boltCount }, (_, index) => {
          const angle = (index / boltCount) * Math.PI * 2;
          return <Instance key={index} position={[Math.cos(angle) * radius, 0.1, Math.sin(angle) * radius]} />;
        })}
      </Instances>
      <Instances limit={boltCount}>
        <boxGeometry args={[0.022, 0.006, 0.075]} />
        <meshBasicMaterial color="#203A50" />
        {Array.from({ length: boltCount }, (_, index) => {
          const angle = (index / boltCount) * Math.PI * 2;
          return (
            <Instance
              key={index}
              position={[Math.cos(angle) * radius, 0.156, Math.sin(angle) * radius]}
              rotation={[0, -angle, 0]}
            />
          );
        })}
      </Instances>
    </group>
  );
}

function Impeller({ textures, scrollProgress }: { textures: IndustrialTextures; scrollProgress: MutableRefObject<number> }) {
  const rotor = useRef<THREE.Group>(null);
  const angularVelocity = useRef(0);

  useFrame((_, delta) => {
    if (!rotor.current) return;
    const progress = scrollProgress.current;
    const diagnostic = Math.sin(progressWindow(progress, 0.12, 0.38) * Math.PI);
    const operational = progressWindow(progress, 0.38, 0.64);
    const optimized = progressWindow(progress, 0.78, 0.96);
    const targetSpeed = operational * (0.75 + optimized * 0.55) + diagnostic * 0.16;
    angularVelocity.current = THREE.MathUtils.damp(angularVelocity.current, targetSpeed, 5.5, delta);
    rotor.current.rotation.y += delta * angularVelocity.current;
  });

  return (
    <group ref={rotor} position={[0, 0.08, 0]}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 1.72, 20]} />
        <meshStandardMaterial
          color="#E5EEF5"
          map={textures.steel}
          bumpMap={textures.steelHeight}
          bumpScale={0.01}
          metalness={0.92}
          roughness={0.18}
        />
      </mesh>
      {[-0.52, 0, 0.52].map((height, layer) => (
        <group key={height} position={[0, height, 0]} rotation={[0, layer * 0.55, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.25, 0.035, 10, 32]} />
            <meshStandardMaterial color="#D8E6F0" metalness={0.92} roughness={0.2} />
          </mesh>
          {[0, 1, 2].map((blade) => {
            const angle = (blade / 3) * Math.PI * 2;
            return (
              <mesh
                key={blade}
                rotation={[0, -angle, 0]}
                position={[Math.cos(angle) * 0.25, 0, Math.sin(angle) * 0.25]}
              >
                <boxGeometry args={[0.46, 0.055, 0.16]} />
                <meshPhysicalMaterial
                  color={layer === 1 ? '#E96A19' : '#168CD7'}
                  map={textures.paint}
                  bumpMap={textures.paintHeight}
                  bumpScale={0.014}
                  emissive={layer === 1 ? '#7A2100' : '#004D86'}
                  emissiveIntensity={0.6}
                  metalness={0.66}
                  roughness={0.25}
                  clearcoat={0.7}
                />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
}

function PressureGauge({ textures, scrollProgress }: { textures: IndustrialTextures; scrollProgress: MutableRefObject<number> }) {
  const needle = useRef<THREE.Group>(null);
  const ticks = Array.from({ length: 14 }, (_, index) => {
    const angle = -Math.PI * 0.72 + (index / 13) * Math.PI * 1.44;
    return { angle, index, major: index % 3 === 0, alert: index > 10 };
  });

  useFrame(({ clock }, delta) => {
    if (!needle.current) return;
    const progress = scrollProgress.current;
    const diagnostic = Math.sin(progressWindow(progress, 0.08, 0.42) * Math.PI);
    const stable = progressWindow(progress, 0.4, 0.7);
    const jitter = diagnostic * Math.sin(clock.getElapsedTime() * 7.5) * 0.12;
    const target = THREE.MathUtils.lerp(-0.88, 0.28, stable) + jitter;
    needle.current.rotation.z = THREE.MathUtils.damp(needle.current.rotation.z, target, 7, delta);
  });

  return (
    <group position={[0.76, 1.52, 0.5]} rotation={[-0.08, -0.18, 0]} scale={0.78}>
      <mesh position={[0, -0.28, -0.03]}>
        <cylinderGeometry args={[0.055, 0.055, 0.36, 16]} />
        <meshStandardMaterial color="#8FA4B3" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.13, 40]} />
        <meshPhysicalMaterial
          color="#7E919F"
          map={textures.steel}
          bumpMap={textures.steelHeight}
          bumpScale={0.012}
          metalness={0.94}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 0, 0.072]}>
        <circleGeometry args={[0.25, 40]} />
        <meshPhysicalMaterial color="#E9F1F5" roughness={0.32} clearcoat={0.8} />
      </mesh>
      <Instances limit={ticks.filter((tick) => tick.major).length}>
        <boxGeometry args={[0.012, 0.055, 0.008]} />
        <meshBasicMaterial color="#26475D" />
        {ticks.filter((tick) => tick.major).map(({ angle, index }) => (
          <Instance
            key={index}
            position={[Math.sin(angle) * 0.205, Math.cos(angle) * 0.205, 0.082]}
            rotation={[0, 0, -angle]}
          />
        ))}
      </Instances>
      <Instances limit={ticks.filter((tick) => !tick.major).length}>
        <boxGeometry args={[0.012, 0.035, 0.008]} />
        <meshBasicMaterial color="#516D80" />
        {ticks.filter((tick) => !tick.major).map(({ angle, index }) => (
          <Instance
            key={index}
            position={[Math.sin(angle) * 0.205, Math.cos(angle) * 0.205, 0.082]}
            rotation={[0, 0, -angle]}
          />
        ))}
      </Instances>
      <group ref={needle} position={[0, 0, 0.095]} rotation={[0, 0, -0.88]}>
        <mesh position={[0, 0.095, 0]}>
          <boxGeometry args={[0.018, 0.19, 0.012]} />
          <meshBasicMaterial color="#D95F0F" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.035, 0.035, 0.025, 16]} />
          <meshStandardMaterial color="#263A48" metalness={0.7} roughness={0.24} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.115]}>
        <circleGeometry args={[0.247, 40]} />
        <meshPhysicalMaterial color="#D7F2FF" transparent opacity={0.12} roughness={0.05} transmission={0.7} />
      </mesh>
    </group>
  );
}

function ValveWheel({ textures, scrollProgress }: { textures: IndustrialTextures; scrollProgress: MutableRefObject<number> }) {
  const wheel = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!wheel.current) return;
    const intervention = progressWindow(scrollProgress.current, 0.25, 0.5);
    wheel.current.rotation.y = THREE.MathUtils.damp(wheel.current.rotation.y, intervention * Math.PI * 0.72, 6, delta);
  });

  return (
    <group position={[1.24, 0.48, 0.02]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.42, 20]} />
        <meshStandardMaterial color="#728A9B" metalness={0.92} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.1, 0.16, 0.18, 20]} />
        <meshStandardMaterial color="#8FA1AD" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.32, 14]} />
        <meshStandardMaterial color="#C8D4DA" metalness={0.94} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.27, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.105, 0.025, 10, 28]} />
        <meshStandardMaterial color="#1C2930" map={textures.rubber} roughness={0.76} metalness={0.12} />
      </mesh>
      <group ref={wheel} position={[0, 0.26, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.34, 0.055, 12, 40]} />
          <meshPhysicalMaterial
            color="#E06416"
            map={textures.paint}
            bumpMap={textures.paintHeight}
            bumpScale={0.018}
            metalness={0.62}
            roughness={0.28}
            clearcoat={0.55}
          />
        </mesh>
        {[0, 1, 2, 3].map((spoke) => (
          <group key={spoke} rotation={[0, (spoke / 4) * Math.PI * 2, 0]}>
            <mesh position={[0, 0, 0.16]}>
              <boxGeometry args={[0.04, 0.04, 0.32]} />
              <meshStandardMaterial color="#E06416" metalness={0.65} roughness={0.26} />
            </mesh>
          </group>
        ))}
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 20]} />
          <meshStandardMaterial color="#7B8F9C" metalness={0.94} roughness={0.18} />
        </mesh>
      </group>
    </group>
  );
}

function ProcessFlowParticles({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) {
  const cyan = useRef<THREE.InstancedMesh>(null);
  const orange = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 8;

  useFrame(({ clock }) => {
    const progress = scrollProgress.current;
    const automated = progressWindow(progress, 0.34, 0.62);
    const optimized = progressWindow(progress, 0.78, 0.98);
    const time = clock.getElapsedTime();

    [cyan.current, orange.current].forEach((mesh, lane) => {
      if (!mesh) return;
      for (let index = 0; index < count; index += 1) {
        const phase = (time * (0.07 + optimized * 0.035) + index / count + lane * 0.16) % 1;
        const angle = phase * Math.PI * 3.2 + lane * Math.PI;
        const radius = 0.2 + Math.sin(phase * Math.PI) * 0.08;
        dummy.position.set(Math.cos(angle) * radius, -0.74 + phase * 1.48, Math.sin(angle) * radius);
        dummy.scale.setScalar(Math.max(0.001, automated) * (0.62 + Math.sin(phase * Math.PI) * 0.28));
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group position={[0, 0.06, 0]}>
      <instancedMesh ref={cyan} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshBasicMaterial color="#54CBFF" transparent opacity={0.86} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={orange} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.027, 8, 8]} />
        <meshBasicMaterial color="#FF8B3D" transparent opacity={0.78} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function AuditScanner({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) {
  const ring = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }, delta) => {
    if (!ring.current || !material.current) return;
    const audit = 1 - progressWindow(scrollProgress.current, 0.14, 0.34);
    const sweep = (Math.sin(clock.getElapsedTime() * 0.72) + 1) * 0.5;
    ring.current.position.y = THREE.MathUtils.lerp(-1.04, 1.04, sweep);
    ring.current.rotation.z += delta * 0.08 * audit;
    material.current.opacity = THREE.MathUtils.damp(material.current.opacity, audit * 0.48, 6, delta);
  });

  return (
    <group position={[0.08, 0.12, 0]}>
      <mesh ref={ring} position={[0, -1.04, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.78, 0.012, 8, 64]} />
        <meshBasicMaterial ref={material} color="#55C8FF" transparent opacity={0.48} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function ProcessVessel({ textures, scrollProgress }: { textures: IndustrialTextures; scrollProgress: MutableRefObject<number> }) {
  const pulse = useRef<THREE.Mesh>(null);
  const coreMaterial = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const operational = smoothstep(scrollProgress.current, 0.42, 0.68);
    const optimization = smoothstep(scrollProgress.current, 0.76, 1);
    const scale = 1 + Math.sin(clock.getElapsedTime() * (0.8 + optimization * 0.6)) * operational * (0.006 + optimization * 0.008);
    pulse.current.scale.setScalar(scale);
    if (coreMaterial.current) coreMaterial.current.emissiveIntensity = 0.08 + operational * 0.15 + optimization * 0.1;
  });

  return (
    <group position={[0.08, 0.12, 0]}>
      <mesh>
        <cylinderGeometry args={[0.68, 0.68, 2.25, 56, 1, true]} />
        <meshPhysicalMaterial
          ref={coreMaterial}
          color="#A9DFFF"
          emissive="#0A496F"
          emissiveIntensity={0.08}
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0.02}
          transmission={0.5}
          thickness={0.45}
          ior={1.45}
          clearcoat={0.72}
          clearcoatRoughness={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={pulse} position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 1.64, 36]} />
        <meshPhysicalMaterial
          color="#087FD2"
          map={textures.paint}
          bumpMap={textures.paintHeight}
          bumpScale={0.012}
          emissive="#06497E"
          emissiveIntensity={0.42}
          metalness={0.7}
          roughness={0.19}
          clearcoat={0.72}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Impeller textures={textures} scrollProgress={scrollProgress} />
      <ProcessFlowParticles scrollProgress={scrollProgress} />
      <BoltRing y={-1.18} radius={0.75} textures={textures} />
      <BoltRing y={1.18} radius={0.75} textures={textures} />

      {[-1.105, 1.105].map((y) => (
        <mesh key={`gasket-${y}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.69, 0.032, 10, 56]} />
          <meshStandardMaterial color="#18232B" map={textures.rubber} bumpMap={textures.rubberHeight} bumpScale={0.012} roughness={0.78} metalness={0.08} />
        </mesh>
      ))}

      {[-0.92, 0.92].map((y) => (
        <mesh key={`weld-${y}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.685, 0.018, 8, 56]} />
          <meshStandardMaterial color="#8196A5" metalness={0.9} roughness={0.34} />
        </mesh>
      ))}

      {[-0.72, -0.36, 0, 0.36, 0.72].map((height, index) => (
        <mesh key={height} position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, index === 2 ? 0.034 : 0.024, 12, 56]} />
          <meshPhysicalMaterial
            color={index === 2 ? '#E36A1B' : '#8CCFF6'}
            emissive={index === 2 ? '#752500' : '#07558B'}
            emissiveIntensity={index === 2 ? 0.55 : 0.3}
            metalness={0.48}
            roughness={0.2}
            clearcoat={0.7}
          />
        </mesh>
      ))}

      <mesh position={[0, 1.56, 0]}>
        <cylinderGeometry args={[0.17, 0.17, 0.68, 24]} />
        <meshStandardMaterial
          color="#CBD9E2"
          map={textures.steel}
          bumpMap={textures.steelHeight}
          bumpScale={0.012}
          metalness={0.93}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 1.91, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.27, 0.055, 14, 36]} />
        <meshPhysicalMaterial color="#E46B1A" metalness={0.64} roughness={0.25} clearcoat={0.6} />
      </mesh>

      <mesh position={[0.88, 0.46, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.16, 0.16, 0.56, 24]} />
        <meshStandardMaterial
          color="#AFC2CF"
          map={textures.steel}
          bumpMap={textures.steelHeight}
          bumpScale={0.012}
          metalness={0.94}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[1.15, 0.46, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.23, 0.052, 12, 32]} />
        <meshStandardMaterial color="#D7E3EB" metalness={0.94} roughness={0.19} />
      </mesh>

      <group position={[0.55, -0.7, 0.67]} rotation={[0, 0.08, 0]}>
        <mesh>
          <boxGeometry args={[0.3, 0.16, 0.018]} />
          <meshStandardMaterial color="#D9E2E7" metalness={0.62} roughness={0.38} />
        </mesh>
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[0.25, 0.11]} />
          <meshBasicMaterial color="#28475D" />
        </mesh>
      </group>

      <PressureGauge textures={textures} scrollProgress={scrollProgress} />
      <ValveWheel textures={textures} scrollProgress={scrollProgress} />
    </group>
  );
}

function PipeRun({ points, radius, textures, accent = false }: { points: Point3[]; radius: number; textures: IndustrialTextures; accent?: boolean }) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)), false, 'catmullrom', 0.18),
    [points],
  );

  return (
    <mesh>
      <tubeGeometry args={[curve, 72, radius, 12, false]} />
      <meshPhysicalMaterial
        color={accent ? '#D95F0F' : '#9BAFBD'}
        map={accent ? textures.paint : textures.steel}
        bumpMap={accent ? textures.paintHeight : textures.steelHeight}
        bumpScale={accent ? 0.014 : 0.01}
        metalness={accent ? 0.68 : 0.92}
        roughness={accent ? 0.27 : 0.21}
        clearcoat={accent ? 0.5 : 0.2}
      />
    </mesh>
  );
}

function PumpMotor({ textures, scrollProgress }: { textures: IndustrialTextures; scrollProgress: MutableRefObject<number> }) {
  const motor = useRef<THREE.Group>(null);
  const shaft = useRef<THREE.Group>(null);
  const angularVelocity = useRef(0);

  useFrame(({ clock }, delta) => {
    const progress = scrollProgress.current;
    const diagnostic = Math.sin(progressWindow(progress, 0.1, 0.4) * Math.PI);
    const operational = progressWindow(progress, 0.38, 0.64);
    angularVelocity.current = THREE.MathUtils.damp(angularVelocity.current, operational * 1.45 + diagnostic * 0.18, 5.5, delta);
    if (shaft.current) shaft.current.rotation.x += delta * angularVelocity.current;
    if (motor.current) {
      const vibration = diagnostic * Math.sin(clock.getElapsedTime() * 15) * 0.012;
      motor.current.position.y = THREE.MathUtils.damp(motor.current.position.y, vibration, 9, delta);
    }
  });

  return (
    <group ref={motor} position={[-1.15, -0.72, 0.05]} rotation={[0, 0, -0.08]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.42, 0.42, 1.05, 40]} />
        <meshPhysicalMaterial
          color="#073B7D"
          map={textures.paint}
          bumpMap={textures.paintHeight}
          bumpScale={0.025}
          metalness={0.72}
          roughness={0.27}
          clearcoat={0.62}
        />
      </mesh>

      <Instances limit={9}>
        <torusGeometry args={[0.44, 0.025, 8, 36]} />
        <meshStandardMaterial color="#0A4B91" metalness={0.74} roughness={0.25} />
        {Array.from({ length: 9 }, (_, index) => (
          <Instance key={index} position={[-0.42 + index * 0.105, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        ))}
      </Instances>

      <mesh position={[-0.58, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.43, 0.2, 40]} />
        <meshStandardMaterial color="#294F72" metalness={0.86} roughness={0.24} />
      </mesh>
      <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.08, 32]} />
        <meshStandardMaterial color="#101F2E" metalness={0.58} roughness={0.4} />
      </mesh>

      <group ref={shaft} position={[0.66, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 0.46, 20]} />
          <meshStandardMaterial color="#DCE7ED" metalness={0.96} roughness={0.16} />
        </mesh>
        <mesh position={[0, 0.23, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.12, 24]} />
          <meshPhysicalMaterial color="#E26A1A" metalness={0.67} roughness={0.24} clearcoat={0.5} />
        </mesh>
      </group>

      <group position={[0.88, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.22, 28]} />
          <meshStandardMaterial color="#263B49" metalness={0.78} roughness={0.36} />
        </mesh>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.145, 0.145, 0.08, 24]} />
          <meshStandardMaterial color="#E06A1B" map={textures.paint} roughness={0.3} metalness={0.62} />
        </mesh>
        <mesh position={[0, -0.12, 0]}>
          <cylinderGeometry args={[0.145, 0.145, 0.08, 24]} />
          <meshStandardMaterial color="#B7C7D1" metalness={0.9} roughness={0.22} />
        </mesh>
      </group>

      <RoundedBox args={[0.36, 0.28, 0.3]} radius={0.035} smoothness={3} position={[-0.05, 0.42, 0.03]}>
        <meshStandardMaterial color="#173E67" map={textures.paint} bumpMap={textures.paintHeight} bumpScale={0.012} metalness={0.58} roughness={0.34} />
      </RoundedBox>
      <mesh position={[0.02, 0.42, 0.19]}>
        <planeGeometry args={[0.18, 0.08]} />
        <meshStandardMaterial color="#C9D5DA" metalness={0.7} roughness={0.38} />
      </mesh>

      <mesh position={[0, -0.47, 0]}>
        <boxGeometry args={[0.82, 0.18, 0.72]} />
        <meshStandardMaterial
          color="#172C3D"
          map={textures.rubber}
          bumpMap={textures.rubberHeight}
          bumpScale={0.02}
          metalness={0.42}
          roughness={0.52}
        />
      </mesh>
      {[-0.3, 0.3].flatMap((x) => [-0.24, 0.24].map((z) => (
        <group key={`${x}-${z}`} position={[x, -0.58, z]}>
          <mesh>
            <cylinderGeometry args={[0.075, 0.075, 0.12, 16]} />
            <meshStandardMaterial color="#1A2730" map={textures.rubber} roughness={0.75} metalness={0.08} />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
            <meshStandardMaterial color="#8699A6" metalness={0.9} roughness={0.28} />
          </mesh>
        </group>
      )))}
    </group>
  );
}

function ControlCabinet({ textures, scrollProgress }: { textures: IndustrialTextures; scrollProgress: MutableRefObject<number> }) {
  const screenMaterial = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (!screenMaterial.current) return;
    const powered = progressWindow(scrollProgress.current, 0.4, 0.62);
    screenMaterial.current.emissiveIntensity = THREE.MathUtils.damp(screenMaterial.current.emissiveIntensity, powered * 0.82, 6, delta);
  });

  return (
    <group position={[1.05, -1.02, 0.96]} rotation={[-0.04, 0.24, 0]}>
      <RoundedBox args={[1.12, 0.94, 0.34]} radius={0.07} smoothness={4}>
        <meshPhysicalMaterial
          color="#092C5A"
          map={textures.paint}
          bumpMap={textures.paintHeight}
          bumpScale={0.02}
          metalness={0.68}
          roughness={0.27}
          clearcoat={0.72}
        />
      </RoundedBox>

      <mesh position={[0, 0.15, 0.181]}>
        <planeGeometry args={[0.72, 0.4]} />
        <meshStandardMaterial ref={screenMaterial} map={textures.screen} emissiveMap={textures.screen} emissive="#E7681B" emissiveIntensity={0} roughness={0.32} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.15, 0.19]}>
        <planeGeometry args={[0.76, 0.44]} />
        <meshPhysicalMaterial color="#A6DFFF" transparent opacity={0.09} roughness={0.06} transmission={0.75} />
      </mesh>

      {[-0.31, -0.1, 0.11, 0.32].map((x, index) => (
        <group key={x} position={[x, -0.26, 0.205]}>
          <mesh>
            <cylinderGeometry args={[0.055, 0.055, 0.035, 20]} />
            <meshStandardMaterial color={index === 2 ? '#E36B1A' : '#7CCBEE'} metalness={0.58} roughness={0.22} />
          </mesh>
          <mesh position={[0, 0, 0.022]}>
            <circleGeometry args={[0.027, 20]} />
            <meshBasicMaterial color={index === 2 ? '#FF8C3D' : '#B9EDFF'} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {[-0.47, 0.47].flatMap((x) =>
        [-0.37, 0.37].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.195]}>
            <cylinderGeometry args={[0.025, 0.025, 0.018, 6]} />
            <meshStandardMaterial color="#9BAEBA" metalness={0.95} roughness={0.2} />
          </mesh>
        )),
      )}

      {Array.from({ length: 6 }, (_, index) => (
        <mesh key={index} position={[-0.37 + index * 0.145, -0.41, 0.19]}>
          <boxGeometry args={[0.085, 0.018, 0.015]} />
          <meshBasicMaterial color="#5E7D94" />
        </mesh>
      ))}

      {[-0.32, 0, 0.32].map((x) => (
        <group key={`gland-${x}`} position={[x, -0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.07, 0.08, 0.12, 16]} />
            <meshStandardMaterial color="#1D2A32" map={textures.rubber} roughness={0.72} metalness={0.18} />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.12, 12]} />
            <meshStandardMaterial color="#253A47" roughness={0.66} metalness={0.22} />
          </mesh>
        </group>
      ))}

      <group position={[0.43, -0.25, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.075, 0.075, 0.04, 20]} />
          <meshStandardMaterial color="#D14920" roughness={0.3} metalness={0.35} />
        </mesh>
        <mesh position={[0, 0.027, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.035, 20]} />
          <meshStandardMaterial color="#FF7A2A" emissive="#7A2100" emissiveIntensity={0.25} />
        </mesh>
      </group>
    </group>
  );
}

function ControlBase({ textures }: { textures: IndustrialTextures }) {
  return (
    <group position={[0.05, -1.47, 0]}>
      <mesh>
        <cylinderGeometry args={[1.34, 1.5, 0.28, 64]} />
        <meshPhysicalMaterial
          color="#0B4078"
          map={textures.paint}
          bumpMap={textures.paintHeight}
          bumpScale={0.025}
          metalness={0.75}
          roughness={0.34}
          clearcoat={0.56}
        />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.18, 0.038, 12, 64]} />
        <meshBasicMaterial color="#2AA8FF" toneMapped={false} />
      </mesh>
      <Instances limit={18}>
        <boxGeometry args={[0.08, 0.16, 0.035]} />
        <meshStandardMaterial color="#2A4B67" metalness={0.76} roughness={0.25} />
        {Array.from({ length: 18 }, (_, index) => {
          const angle = (index / 18) * Math.PI * 2;
          return (
            <Instance
              key={index}
              position={[Math.cos(angle) * 1.37, -0.06, Math.sin(angle) * 1.37]}
              rotation={[0, -angle, 0]}
            />
          );
        })}
      </Instances>
      <Instances limit={4}>
        <cylinderGeometry args={[0.1, 0.13, 0.16, 20]} />
        <meshStandardMaterial color="#263844" map={textures.rubber} roughness={0.72} metalness={0.14} />
        {[[-0.92, -0.2, -0.92], [0.92, -0.2, -0.92], [-0.92, -0.2, 0.92], [0.92, -0.2, 0.92]].map((position) => (
          <Instance key={position.join('-')} position={position as Point3} />
        ))}
      </Instances>
      <mesh position={[0, -0.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.52, 64]} />
        <meshBasicMaterial color="#03152C" transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  );
}

function SupportFrame({ textures }: { textures: IndustrialTextures }) {
  const posts: Point3[] = [
    [-1.02, -0.12, -0.78],
    [1.02, -0.12, -0.78],
    [-1.18, -0.12, 0.72],
    [1.18, -0.12, 0.72],
  ];

  return (
    <group>
      <Instances limit={posts.length}>
        <boxGeometry args={[0.09, 2.65, 0.09]} />
        <meshStandardMaterial
          color="#879BA9"
          map={textures.steel}
          bumpMap={textures.steelHeight}
          bumpScale={0.012}
          metalness={0.92}
          roughness={0.24}
        />
        {posts.map((position) => <Instance key={position.join('-')} position={position} />)}
      </Instances>
      {[-1.18, 1.15].map((y) => (
        <group key={y} position={[0, y, 0]}>
          <mesh>
            <boxGeometry args={[1.92, 0.09, 0.09]} />
            <meshStandardMaterial color="#7E95A6" metalness={0.9} roughness={0.24} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[1.72, 0.09, 0.09]} />
            <meshStandardMaterial color="#7E95A6" metalness={0.9} roughness={0.24} />
          </mesh>
        </group>
      ))}
      <Instances limit={posts.length}>
        <boxGeometry args={[0.24, 0.045, 0.24]} />
        <meshStandardMaterial color="#6E8391" metalness={0.86} roughness={0.3} />
        {posts.map(([x, , z]) => <Instance key={`foot-${x}-${z}`} position={[x, -1.5, z]} />)}
      </Instances>
    </group>
  );
}

function SignalParticles({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const cyan = useRef<THREE.InstancedMesh>(null);
  const orange = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const point = useMemo(() => new THREE.Vector3(), []);
  const fieldRoute = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.42, -0.48, 0.28),
    new THREE.Vector3(-1.08, -0.82, 0.36),
    new THREE.Vector3(-0.28, -1.18, 0.56),
    new THREE.Vector3(0.72, -1.16, 0.88),
    new THREE.Vector3(1.05, -1.02, 0.96),
  ]), []);
  const supervisoryRoute = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.05, -0.9, 0.96),
    new THREE.Vector3(0.98, -0.42, 0.82),
    new THREE.Vector3(1.05, 0.12, 0.55),
    new THREE.Vector3(1.12, 0.58, 0.1),
    new THREE.Vector3(1.18, 0.92, -0.32),
  ]), []);
  const count = 7;

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();
    const connectivity = progressWindow(scrollProgress.current, 0.58, 0.8);
    if (group.current) dampScale(group.current, Math.max(0.001, connectivity), 6, delta);
    [cyan.current, orange.current].forEach((mesh, lane) => {
      if (!mesh) return;
      const route = lane === 0 ? fieldRoute : supervisoryRoute;
      for (let index = 0; index < count; index += 1) {
        const routeProgress = (time * (0.12 + lane * 0.025) + index / count) % 1;
        route.getPointAt(routeProgress, point);
        dummy.position.copy(point);
        dummy.scale.setScalar(0.58 + Math.sin(routeProgress * Math.PI) * 0.18);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group ref={group} scale={0.001}>
      <instancedMesh ref={cyan} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshBasicMaterial color="#45C3FF" transparent opacity={0.84} toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={orange} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.027, 8, 8]} />
        <meshBasicMaterial color="#FF7B27" transparent opacity={0.78} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function SensorNetwork({ textures, scrollProgress }: { textures: IndustrialTextures; scrollProgress: MutableRefObject<number> }) {
  const digitalOverlay = useRef<THREE.Group>(null);
  const gatewayLight = useRef<THREE.MeshStandardMaterial>(null);
  const sensorLights = useRef<THREE.MeshStandardMaterial[]>([]);

  useFrame((_, delta) => {
    const automated = progressWindow(scrollProgress.current, 0.36, 0.62);
    const connected = progressWindow(scrollProgress.current, 0.57, 0.82);
    if (digitalOverlay.current) dampScale(digitalOverlay.current, Math.max(0.001, connected), 6, delta);
    if (gatewayLight.current) gatewayLight.current.emissiveIntensity = THREE.MathUtils.damp(gatewayLight.current.emissiveIntensity, connected * 1.1, 6, delta);
    sensorLights.current.forEach((material) => {
      material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, 0.08 + automated * 0.64, 6, delta);
    });
  });

  return (
    <group>
      {sensorNodes.map((point, index) => (
        <group key={point.join('-')} position={point}>
          <mesh position={[0, -0.13, 0]}>
            <cylinderGeometry args={[0.035, 0.045, 0.22, 12]} />
            <meshStandardMaterial color="#8799A4" metalness={0.86} roughness={0.3} />
          </mesh>
          <group rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <mesh>
              <boxGeometry args={[0.18, 0.18, 0.18]} />
              <meshPhysicalMaterial
                ref={(material) => {
                  if (material) sensorLights.current[index] = material;
                }}
                color={index === 4 ? '#E96B1B' : '#BFE8FF'}
                map={index === 4 ? textures.paint : textures.steel}
                bumpMap={index === 4 ? textures.paintHeight : textures.steelHeight}
                bumpScale={0.012}
                emissive={index === 4 ? '#722000' : '#075584'}
                emissiveIntensity={0.08}
                metalness={0.72}
                roughness={0.2}
                clearcoat={0.6}
              />
            </mesh>
          </group>
          <mesh position={[0, 0, 0.105]}>
            <circleGeometry args={[0.045, 16]} />
            <meshStandardMaterial color={index === 4 ? '#6F3525' : '#476A7C'} roughness={0.3} metalness={0.28} />
          </mesh>
        </group>
      ))}
      <group ref={digitalOverlay} scale={0.001}>
        <group position={[1.18, 0.92, -0.42]} rotation={[0, -0.18, 0]}>
          <RoundedBox args={[0.46, 0.58, 0.18]} radius={0.035} smoothness={3}>
            <meshStandardMaterial color="#173B5C" map={textures.paint} bumpMap={textures.paintHeight} bumpScale={0.012} metalness={0.58} roughness={0.35} />
          </RoundedBox>
          <mesh position={[0, 0.1, 0.095]}>
            <planeGeometry args={[0.28, 0.16]} />
            <meshStandardMaterial color="#16364B" emissive="#1897D1" emissiveIntensity={0.28} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.14, 0.105]}>
            <circleGeometry args={[0.035, 16]} />
            <meshStandardMaterial ref={gatewayLight} color="#8CDFFF" emissive="#24B9FF" emissiveIntensity={0} toneMapped={false} />
          </mesh>
          {[-0.14, 0, 0.14].map((x) => (
            <mesh key={`gateway-gland-${x}`} position={[x, -0.34, 0]}>
              <cylinderGeometry args={[0.035, 0.045, 0.1, 12]} />
              <meshStandardMaterial color="#202C33" map={textures.rubber} roughness={0.76} metalness={0.12} />
            </mesh>
          ))}
        </group>
        {sensorNodes.map((point, index) => (
          <Line
            key={`line-${point.join('-')}`}
            points={[point, [0.92, -0.82 + index * 0.08, 0.72]]}
            color={index === 4 ? '#F27B2A' : '#2AA8FF'}
            transparent
            opacity={0.34}
            lineWidth={0.65}
          />
        ))}
        <Line points={[[0.92, -0.42, 0.72], [1.18, 0.3, 0.12], [1.18, 0.92, -0.32]]} color="#2AA8FF" transparent opacity={0.42} lineWidth={0.7} />
      </group>
    </group>
  );
}

function DiagnosticHotspots({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const hotspots: Point3[] = [
    [-1.48, -0.72, 0.38],
    [0.92, 0.46, 0.42],
    [0.72, 1.5, 0.55],
  ];

  useFrame(({ clock }) => {
    if (!group.current) return;
    const progress = scrollProgress.current;
    const audit = 1 - smoothstep(progress, 0.16, 0.34);
    const diagnose = Math.sin(progressWindow(progress, 0.08, 0.44) * Math.PI);
    const resolve = smoothstep(progress, 0.36, 0.52);
    const pulse = 0.9 + Math.sin(clock.getElapsedTime() * 3.4) * 0.08;
    const scale = Math.max(0.001, Math.max(audit * 0.5, diagnose) * (1 - resolve) * pulse);
    group.current.scale.setScalar(scale);
    group.current.rotation.y = 0;
  });

  return (
    <group ref={group}>
      {hotspots.map((point, index) => (
        <group key={point.join('-')} position={point} rotation={[index * 0.5, index * 0.3, 0]}>
          <mesh>
            <torusGeometry args={[0.18, 0.024, 10, 36]} />
            <meshBasicMaterial color="#FF4D22" transparent opacity={0.9} toneMapped={false} />
          </mesh>
          <mesh scale={0.52}>
            <icosahedronGeometry args={[0.11, 1]} />
            <meshBasicMaterial color="#FF8A3D" transparent opacity={0.7} wireframe toneMapped={false} />
          </mesh>
        </group>
      ))}
      {hotspots.map((point, index) => (
        <Line
          key={`inspection-guide-${index}`}
          points={[point, [point[0] + 0.22, point[1] + 0.12, point[2]]]}
          color="#FF6330"
          transparent
          opacity={0.32}
          lineWidth={0.7}
          dashed
          dashSize={0.06}
          gapSize={0.04}
        />
      ))}
    </group>
  );
}

function NarrativeLighting({ scrollProgress, staticPresentation }: { scrollProgress: MutableRefObject<number>; staticPresentation: boolean }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const intervention = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const progress = staticPresentation ? 1 : scrollProgress.current;
    const diagnosis = Math.sin(progressWindow(progress, 0.08, 0.43) * Math.PI);
    const connected = progressWindow(progress, 0.55, 0.82);
    if (key.current) key.current.intensity = THREE.MathUtils.damp(key.current.intensity, 3.2 + connected * 0.35, 5, delta);
    if (fill.current) fill.current.intensity = THREE.MathUtils.damp(fill.current.intensity, 1.15 + connected * 0.45, 5, delta);
    if (rim.current) rim.current.intensity = THREE.MathUtils.damp(rim.current.intensity, 15 + connected * 5, 5, delta);
    if (intervention.current) intervention.current.intensity = THREE.MathUtils.damp(intervention.current.intensity, 5 + diagnosis * 13, 5, delta);
  });

  return (
    <>
      <ambientLight intensity={0.78} />
      <hemisphereLight args={['#E7F5FC', '#17314B', 1.3]} />
      <directionalLight ref={key} position={[4.5, 7, 5.5]} intensity={3.2} color="#FFFDF8" />
      <directionalLight ref={fill} position={[-4, 2.5, -3]} intensity={1.15} color="#70BEEA" />
      <pointLight ref={rim} position={[-3, 1, 3.5]} intensity={15} distance={9} color="#2AA8FF" />
      <pointLight ref={intervention} position={[3, 1.2, 2]} intensity={5} distance={6.5} color="#F27B2A" />
    </>
  );
}

function DetailedProcessUnit({
  scrollProgress,
  layoutOffset,
  layoutScale,
  reducedMotion,
  pointerEnabled,
}: {
  scrollProgress: MutableRefObject<number>;
  layoutOffset: number;
  layoutScale: number;
  reducedMotion: boolean;
  pointerEnabled: boolean;
}) {
  const textures = useIndustrialTextures();
  const visualProgress = useRef(reducedMotion ? 1 : scrollProgress.current);
  const assembly = useRef<THREE.Group>(null);
  const optimizationLayer = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const cameraLook = useRef(new THREE.Vector3(0, -0.08, 0));
  const narrativeTarget = useRef<SceneTransform>({
    position: [...ASSEMBLY_TRANSFORMS.homeTransform.position],
    rotation: [...ASSEMBLY_TRANSFORMS.homeTransform.rotation],
    scale: ASSEMBLY_TRANSFORMS.homeTransform.scale,
  });
  const pumpPipe: Point3[] = useMemo(() => [[-0.64, -0.72, 0.11], [-0.56, -0.72, 0.11], [-0.53, -0.58, 0.06], [-0.58, -0.48, 0]], []);
  const topPipe: Point3[] = useMemo(() => [[0.08, 1.62, -0.05], [0.08, 2.05, -0.05], [1.18, 2.05, -0.05], [1.24, 0.48, 0.02]], []);
  const cableOne: Point3[] = useMemo(() => [[0.78, -1.18, 0.92], [0.22, -1.3, 0.72], [-0.62, -1.12, 0.48], [-1.25, -0.72, 0.25]], []);
  const cableTwo: Point3[] = useMemo(() => [[1.08, -1.18, 0.92], [0.78, -1.42, 0.52], [0.1, -1.38, 0.28], [-0.62, -1.18, 0.18]], []);
  const initialAssemblyTransform = reducedMotion
    ? ASSEMBLY_TRANSFORMS.optimizedTransform
    : ASSEMBLY_TRANSFORMS.homeTransform;

  useFrame(({ camera, pointer }, delta) => {
    const progress = reducedMotion
      ? 1
      : THREE.MathUtils.damp(visualProgress.current, scrollProgress.current, 7.5, delta);
    visualProgress.current = progress;
    const retrofit = smoothstep(progress, 0.34, 0.63);
    const optimize = smoothstep(progress, 0.78, 0.98);
    const pointerX = pointerEnabled ? pointer.x : 0;
    const pointerY = pointerEnabled ? pointer.y : 0;

    if (assembly.current) {
      sampleNarrativeTransform(progress, narrativeTarget.current);
      assembly.current.rotation.x = THREE.MathUtils.damp(
        assembly.current.rotation.x,
        narrativeTarget.current.rotation[0] + pointerY * 0.018,
        5,
        delta,
      );
      assembly.current.rotation.y = THREE.MathUtils.damp(
        assembly.current.rotation.y,
        narrativeTarget.current.rotation[1] + pointerX * 0.03,
        4.5,
        delta,
      );
      assembly.current.rotation.z = THREE.MathUtils.damp(assembly.current.rotation.z, narrativeTarget.current.rotation[2], 5, delta);
      dampScale(assembly.current, narrativeTarget.current.scale * layoutScale, 5, delta);
      assembly.current.position.x = THREE.MathUtils.damp(assembly.current.position.x, narrativeTarget.current.position[0] + layoutOffset, 5, delta);
      assembly.current.position.y = THREE.MathUtils.damp(assembly.current.position.y, narrativeTarget.current.position[1], 5, delta);
      assembly.current.position.z = THREE.MathUtils.damp(assembly.current.position.z, narrativeTarget.current.position[2], 5, delta);
    }
    if (optimizationLayer.current) {
      dampScale(optimizationLayer.current, Math.max(0.001, optimize), 5, delta);
      optimizationLayer.current.rotation.y = THREE.MathUtils.damp(optimizationLayer.current.rotation.y, (1 - optimize) * 0.35, 5, delta);
    }
    if (ringA.current) ringA.current.rotation.z += delta * optimize * 0.08;
    if (ringB.current) ringB.current.rotation.x -= delta * optimize * 0.06;

    const diagnoseCamera = Math.sin(progressWindow(progress, 0.12, 0.42) * Math.PI);
    const connectCamera = progressWindow(progress, 0.58, 0.82);
    const targetCameraX = 4.72 - diagnoseCamera * 0.28 + connectCamera * 0.18;
    const targetCameraY = 2.42 + retrofit * 0.08 - connectCamera * 0.05;
    const targetCameraZ = 6.78 - diagnoseCamera * 0.32 + connectCamera * 0.22;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCameraX, 4.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCameraY, 4.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCameraZ, 4.2, delta);
    cameraLook.current.x = THREE.MathUtils.damp(cameraLook.current.x, retrofit * 0.12, 4.2, delta);
    cameraLook.current.y = THREE.MathUtils.damp(cameraLook.current.y, -0.08 + retrofit * 0.05, 4.2, delta);
    camera.lookAt(cameraLook.current);
  });

  return (
    <group
      ref={assembly}
      position={[initialAssemblyTransform.position[0] + layoutOffset, initialAssemblyTransform.position[1], initialAssemblyTransform.position[2]]}
      rotation={initialAssemblyTransform.rotation}
      scale={initialAssemblyTransform.scale * layoutScale}
    >
        <group {...ROOT_HOME_TRANSFORMS.chassisRoot}>
          <ControlBase textures={textures} />
          <SupportFrame textures={textures} />
        </group>

        <group {...ROOT_HOME_TRANSFORMS.processRoot}>
          <ProcessVessel textures={textures} scrollProgress={visualProgress} />
          <AuditScanner scrollProgress={visualProgress} />
          <PipeRun points={pumpPipe} radius={0.075} textures={textures} />
          <PipeRun points={topPipe} radius={0.07} textures={textures} accent />
        </group>

        <group {...ROOT_HOME_TRANSFORMS.driveRoot}>
          <PumpMotor textures={textures} scrollProgress={visualProgress} />
        </group>

        <group {...ROOT_HOME_TRANSFORMS.controlRoot}>
          <ControlCabinet textures={textures} scrollProgress={visualProgress} />
          <PipeRun points={cableOne} radius={0.025} textures={textures} />
          <PipeRun points={cableTwo} radius={0.021} textures={textures} accent />
        </group>

        <DiagnosticHotspots scrollProgress={visualProgress} />

        <group {...ROOT_HOME_TRANSFORMS.digitalRoot}>
          <SensorNetwork textures={textures} scrollProgress={visualProgress} />
          <SignalParticles scrollProgress={visualProgress} />
        </group>

        <group
          ref={optimizationLayer}
          position={ROOT_HOME_TRANSFORMS.optimizationRoot.position}
          rotation={reducedMotion ? [0, 0, 0] : ROOT_HOME_TRANSFORMS.optimizationRoot.rotation}
          scale={reducedMotion ? 1 : ROOT_HOME_TRANSFORMS.optimizationRoot.scale}
        >
          <mesh ref={ringA} rotation={[1.18, 0.24, 0.12]}>
            <torusGeometry args={[1.78, 0.01, 8, 72]} />
            <meshBasicMaterial color="#2AA8FF" transparent opacity={0.14} toneMapped={false} />
          </mesh>
          <mesh ref={ringB} rotation={[0.25, 0.42, 1.12]}>
            <torusGeometry args={[1.98, 0.009, 8, 72]} />
            <meshBasicMaterial color="#F27B2A" transparent opacity={0.1} toneMapped={false} />
          </mesh>
        </group>
    </group>
  );
}

const sceneLabels: Record<Locale, { description: string; stages: string[]; status: string }> = {
  en: {
    description: 'Scroll-driven industrial process cell showing audit, diagnosis, automation, connectivity and optimization',
    stages: ['LEGACY AUDIT', 'SYSTEM DIAGNOSIS', 'CONTROL RETROFIT', 'CONNECTED OPERATIONS', 'ADVANCED OPTIMIZATION'],
    status: 'SCROLL-DRIVEN SYSTEM',
  },
  fr: {
    description: 'Cellule industrielle animée par le défilement montrant audit, diagnostic, automatisation, connectivité et optimisation',
    stages: ['AUDIT DU SYSTÈME', 'DIAGNOSTIC', 'MODERNISATION DU CONTRÔLE', 'OPÉRATIONS CONNECTÉES', 'OPTIMISATION AVANCÉE'],
    status: 'SYSTÈME PILOTÉ PAR DÉFILEMENT',
  },
};

export default function ThreeScene({
  locale,
  scrollProgress,
  activeStage,
}: {
  locale: Locale;
  scrollProgress: MutableRefObject<number>;
  activeStage: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const shell = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [overlayLayout, setOverlayLayout] = useState(false);
  const labels = sceneLabels[locale];
  const staticPresentation = Boolean(prefersReducedMotion) || isCompact;

  useEffect(() => {
    const element = shell.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '160px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const compactQuery = window.matchMedia('(max-width: 700px)');
    const overlayQuery = window.matchMedia('(min-width: 701px) and (max-width: 1100px)');
    const update = () => {
      setIsCompact(compactQuery.matches);
      setOverlayLayout(overlayQuery.matches);
    };
    update();
    compactQuery.addEventListener('change', update);
    overlayQuery.addEventListener('change', update);
    return () => {
      compactQuery.removeEventListener('change', update);
      overlayQuery.removeEventListener('change', update);
    };
  }, []);

  return (
    <div
      ref={shell}
      className={`three-shell three-shell-detailed three-stage-${activeStage}`}
      role="img"
      aria-label={labels.description}
    >
      <Canvas
        camera={{ position: [4.72, 2.42, 6.78], fov: 38 }}
        dpr={isCompact ? 1 : [1, 1.4]}
        frameloop={staticPresentation || !isVisible ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ camera }) => camera.lookAt(0, -0.08, 0)}
      >
        <NarrativeLighting scrollProgress={scrollProgress} staticPresentation={staticPresentation} />
        <DetailedProcessUnit
          scrollProgress={scrollProgress}
          layoutOffset={overlayLayout ? 1.05 : 0}
          layoutScale={overlayLayout ? 0.82 : isCompact ? 0.9 : 1}
          reducedMotion={staticPresentation}
          pointerEnabled={!staticPresentation && !overlayLayout}
        />
      </Canvas>
      <div className="scanline" />
      <div className="three-caption" aria-hidden="true">
        <span>RCL / {labels.stages[activeStage]}</span>
        <i />
        <b>{labels.status}</b>
      </div>
      <div className="three-detail-index" aria-hidden="true">
        <span>PLC</span>
        <span>SCADA</span>
        <span>IIoT</span>
      </div>
    </div>
  );
}
