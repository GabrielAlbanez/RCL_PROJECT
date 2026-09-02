'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Instance, Instances, Line, RoundedBox } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE from 'three';
import type { Locale } from '@/lib/content';

type Point3 = [number, number, number];
type SurfaceStyle = 'steel' | 'paint' | 'rubber';

function smoothstep(value: number, start: number, end: number) {
  const normalized = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
  return normalized * normalized * (3 - 2 * normalized);
}
const sensorNodes: Point3[] = [
  [-2.05, 1.15, -0.6],
  [1.85, 1.55, -0.75],
  [2.25, 0.05, -0.35],
  [1.45, -1.55, -0.55],
  [-1.95, -1.35, -0.35],
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

function Impeller({ textures }: { textures: IndustrialTextures }) {
  const rotor = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (rotor.current) rotor.current.rotation.y += delta * 0.72;
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
                <boxGeometry args={[0.5, 0.06, 0.18]} />
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

function PressureGauge({ textures }: { textures: IndustrialTextures }) {
  const ticks = Array.from({ length: 14 }, (_, index) => {
    const angle = -Math.PI * 0.72 + (index / 13) * Math.PI * 1.44;
    return { angle, index, major: index % 3 === 0, alert: index > 10 };
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
      <group position={[0, 0, 0.095]} rotation={[0, 0, -0.82]}>
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

function ValveWheel({ textures }: { textures: IndustrialTextures }) {
  return (
    <group position={[1.24, 0.48, 0.02]} rotation={[0, Math.PI / 2, 0]}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.42, 20]} />
        <meshStandardMaterial color="#728A9B" metalness={0.92} roughness={0.2} />
      </mesh>
      <group position={[0, 0.26, 0]}>
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

function ProcessVessel({ textures, scrollProgress }: { textures: IndustrialTextures; scrollProgress: MutableRefObject<number> }) {
  const pulse = useRef<THREE.Mesh>(null);
  const coreMaterial = useRef<THREE.MeshPhysicalMaterial>(null);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const optimization = smoothstep(scrollProgress.current, 0.76, 1);
    const scale = 1 + Math.sin(clock.getElapsedTime() * (1.2 + optimization * 1.8)) * (0.018 + optimization * 0.035);
    pulse.current.scale.setScalar(scale);
    if (coreMaterial.current) coreMaterial.current.emissiveIntensity = 0.42 + optimization * 1.25;
  });

  return (
    <group position={[0.08, 0.12, 0]}>
      <mesh>
        <cylinderGeometry args={[0.68, 0.68, 2.25, 56, 1, true]} />
        <meshPhysicalMaterial
          ref={coreMaterial}
          color="#A9DFFF"
          transparent
          opacity={0.21}
          roughness={0.045}
          metalness={0.02}
          transmission={0.72}
          thickness={0.72}
          clearcoat={1}
          clearcoatRoughness={0.05}
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

      <Impeller textures={textures} />
      <BoltRing y={-1.18} radius={0.75} textures={textures} />
      <BoltRing y={1.18} radius={0.75} textures={textures} />

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

      <PressureGauge textures={textures} />
      <ValveWheel textures={textures} />
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

function PumpMotor({ textures }: { textures: IndustrialTextures }) {
  const shaft = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (shaft.current) shaft.current.rotation.x += delta * 1.45;
  });

  return (
    <group position={[-1.15, -0.72, 0.05]} rotation={[0, 0, -0.08]}>
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
    </group>
  );
}

function ControlCabinet({ textures }: { textures: IndustrialTextures }) {
  return (
    <group position={[0.93, -1.02, 0.82]} rotation={[-0.04, -0.17, 0]}>
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
        <meshBasicMaterial map={textures.screen} toneMapped={false} />
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
    </group>
  );
}

function ControlBase({ textures }: { textures: IndustrialTextures }) {
  return (
    <group position={[0.05, -1.47, 0]}>
      <mesh>
        <cylinderGeometry args={[1.34, 1.5, 0.28, 64]} />
        <meshPhysicalMaterial
          color="#052B67"
          map={textures.paint}
          bumpMap={textures.paintHeight}
          bumpScale={0.025}
          metalness={0.75}
          roughness={0.27}
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
    </group>
  );
}

function SupportFrame({ textures }: { textures: IndustrialTextures }) {
  const posts: Point3[] = [
    [-0.92, -0.12, -0.82],
    [0.92, -0.12, -0.82],
    [-0.92, -0.12, 0.82],
    [0.92, -0.12, 0.82],
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
    </group>
  );
}

function SignalParticles() {
  const cyan = useRef<THREE.InstancedMesh>(null);
  const orange = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 8;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    [cyan.current, orange.current].forEach((mesh, lane) => {
      if (!mesh) return;
      for (let index = 0; index < count; index += 1) {
        const angle = time * (0.32 + lane * 0.08) + (index / count) * Math.PI * 2;
        const radius = 1.72 + lane * 0.37;
        dummy.position.set(Math.cos(angle) * radius, Math.sin(angle * 2 + lane) * 0.5, Math.sin(angle) * radius * 0.62);
        dummy.scale.setScalar(0.65 + Math.sin(angle * 3) * 0.14);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <>
      <instancedMesh ref={cyan} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.052, 12, 12]} />
        <meshBasicMaterial color="#45C3FF" toneMapped={false} />
      </instancedMesh>
      <instancedMesh ref={orange} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#FF7B27" toneMapped={false} />
      </instancedMesh>
    </>
  );
}

function SensorNetwork({ textures }: { textures: IndustrialTextures }) {
  return (
    <group>
      {sensorNodes.map((point, index) => (
        <group key={point.join('-')} position={point}>
          <Float speed={1 + index * 0.07} floatIntensity={0.18} rotationIntensity={0.12}>
            <mesh rotation={[Math.PI / 4, 0, Math.PI / 4]}>
              <dodecahedronGeometry args={[0.16, 0]} />
              <meshPhysicalMaterial
                color={index === 4 ? '#E96B1B' : '#BFE8FF'}
                map={index === 4 ? textures.paint : textures.steel}
                bumpMap={index === 4 ? textures.paintHeight : textures.steelHeight}
                bumpScale={0.012}
                emissive={index === 4 ? '#722000' : '#075584'}
                emissiveIntensity={0.72}
                metalness={0.72}
                roughness={0.2}
                clearcoat={0.6}
              />
            </mesh>
            <mesh scale={1.55}>
              <icosahedronGeometry args={[0.16, 1]} />
              <meshBasicMaterial color="#2AA8FF" transparent opacity={0.1} wireframe />
            </mesh>
          </Float>
        </group>
      ))}
      {sensorNodes.map((point, index) => (
        <Line
          key={`line-${point.join('-')}`}
          points={[point, [0.08, index % 2 ? 0.5 : -0.45, 0]]}
          color={index === 4 ? '#F27B2A' : '#2AA8FF'}
          transparent
          opacity={0.5}
          lineWidth={0.8}
        />
      ))}
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
    const reveal = smoothstep(progress, 0, 0.18);
    const resolve = smoothstep(progress, 0.36, 0.52);
    const pulse = 0.82 + Math.sin(clock.getElapsedTime() * 4.2) * 0.12;
    const scale = Math.max(0.001, (0.35 + reveal * 0.65) * (1 - resolve) * pulse);
    group.current.scale.setScalar(scale);
    group.current.rotation.y = clock.getElapsedTime() * 0.08;
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
      {hotspots.slice(1).map((point, index) => (
        <Line
          key={`diagnostic-${index}`}
          points={[hotspots[0], point]}
          color="#FF6330"
          transparent
          opacity={0.38}
          lineWidth={0.7}
          dashed
          dashSize={0.06}
          gapSize={0.04}
        />
      ))}
    </group>
  );
}

function DetailedProcessUnit({
  scrollProgress,
  layoutOffset,
}: {
  scrollProgress: MutableRefObject<number>;
  layoutOffset: number;
}) {
  const textures = useIndustrialTextures();
  const assembly = useRef<THREE.Group>(null);
  const machineLayer = useRef<THREE.Group>(null);
  const baseLayer = useRef<THREE.Group>(null);
  const frameLayer = useRef<THREE.Group>(null);
  const vesselLayer = useRef<THREE.Group>(null);
  const motorLayer = useRef<THREE.Group>(null);
  const controlLayer = useRef<THREE.Group>(null);
  const networkLayer = useRef<THREE.Group>(null);
  const optimizationLayer = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const rearPipe: Point3[] = useMemo(() => [[-0.78, 0.7, -0.48], [-1.3, 0.7, -0.55], [-1.55, 0.2, -0.55], [-1.55, -0.35, -0.2]], []);
  const topPipe: Point3[] = useMemo(() => [[0.08, 1.62, -0.05], [0.08, 2.05, -0.05], [0.85, 2.05, -0.05], [1.15, 1.64, -0.05]], []);
  const cableOne: Point3[] = useMemo(() => [[0.7, -1.15, 0.65], [0.2, -1.28, 0.65], [-0.5, -1.22, 0.5], [-0.92, -0.7, 0.25]], []);
  const cableTwo: Point3[] = useMemo(() => [[1.05, -1.15, 0.62], [0.75, -1.42, 0.35], [0.1, -1.38, 0.28], [-0.4, -1.16, 0.18]], []);

  useFrame(({ clock, pointer }, delta) => {
    const time = clock.getElapsedTime();
    const progress = scrollProgress.current;
    const assemblyProgress = smoothstep(progress, 0.03, 0.72);
    const exploded = 1 - assemblyProgress;
    const diagnostic = Math.sin(smoothstep(progress, 0.08, 0.48) * Math.PI);
    const retrofit = smoothstep(progress, 0.2, 0.62);
    const connect = smoothstep(progress, 0.53, 0.79);
    const optimize = smoothstep(progress, 0.76, 1);

    if (assembly.current) {
      assembly.current.rotation.x = THREE.MathUtils.damp(
        assembly.current.rotation.x,
        THREE.MathUtils.lerp(0.1, -0.035, progress) + pointer.y * 0.045,
        3,
        delta,
      );
      assembly.current.rotation.y = THREE.MathUtils.damp(
        assembly.current.rotation.y,
        THREE.MathUtils.lerp(-0.58, 0.34, progress) + Math.sin(time * 0.12) * 0.06 + pointer.x * 0.08,
        2.2,
        delta,
      );
      const assemblyScale = THREE.MathUtils.lerp(0.82, 0.99, assemblyProgress);
      assembly.current.scale.setScalar(assemblyScale);
      assembly.current.position.x = THREE.MathUtils.damp(assembly.current.position.x, layoutOffset, 3, delta);
    }

    if (machineLayer.current) {
      machineLayer.current.position.y = exploded * 0.12;
      machineLayer.current.rotation.z = exploded * -0.05;
    }
    if (baseLayer.current) {
      baseLayer.current.position.y = exploded * -0.5;
    }
    if (frameLayer.current) {
      frameLayer.current.position.y = exploded * 0.5;
      frameLayer.current.rotation.y = exploded * 0.12;
    }
    if (vesselLayer.current) {
      vesselLayer.current.position.set(
        exploded * 0.72 + diagnostic * 0.12,
        exploded * 0.62 + diagnostic * 0.06,
        exploded * 0.34,
      );
      vesselLayer.current.rotation.z = exploded * 0.12 + diagnostic * -0.035;
    }
    if (motorLayer.current) {
      motorLayer.current.position.set(
        exploded * -0.9 + diagnostic * -0.22,
        exploded * 0.68 + diagnostic * 0.08,
        exploded * -0.42,
      );
      motorLayer.current.rotation.y = exploded * -0.38 + diagnostic * 0.15;
    }
    if (controlLayer.current) {
      const scale = THREE.MathUtils.lerp(0.72, 1, retrofit);
      controlLayer.current.scale.setScalar(scale);
      controlLayer.current.position.set((1 - retrofit) * 1.65, (1 - retrofit) * 0.68, (1 - retrofit) * 0.85);
      controlLayer.current.rotation.y = (1 - retrofit) * -0.45;
    }
    if (networkLayer.current) {
      const scale = THREE.MathUtils.lerp(0.7, 1, connect);
      networkLayer.current.scale.setScalar(scale);
      networkLayer.current.position.y = (1 - connect) * 1.15;
      networkLayer.current.position.z = (1 - connect) * -0.35;
      networkLayer.current.rotation.y = (1 - connect) * -0.45;
    }
    if (optimizationLayer.current) {
      const scale = Math.max(0.001, optimize);
      optimizationLayer.current.scale.setScalar(scale);
      optimizationLayer.current.rotation.y = (1 - optimize) * 0.6;
    }
    if (ringA.current) ringA.current.rotation.z += delta * (0.04 + optimize * 0.16);
    if (ringB.current) ringB.current.rotation.x -= delta * (0.035 + optimize * 0.12);
  });

  return (
    <group ref={assembly} rotation={[0.1, -0.58, 0]} scale={0.82}>
      <Float speed={0.72} floatIntensity={0.1} rotationIntensity={0.025}>
        <group ref={machineLayer} position={[0, 0.12, 0]} rotation={[0, 0, -0.05]}>
          <group ref={baseLayer} position={[0, -0.5, 0]}>
            <ControlBase textures={textures} />
          </group>
          <group ref={frameLayer} position={[0, 0.5, 0]} rotation={[0, 0.12, 0]}>
            <SupportFrame textures={textures} />
          </group>
          <PipeRun points={rearPipe} radius={0.075} textures={textures} />
          <group ref={vesselLayer} position={[0.72, 0.62, 0.34]} rotation={[0, 0, 0.12]}>
            <ProcessVessel textures={textures} scrollProgress={scrollProgress} />
          </group>
          <group ref={motorLayer} position={[-0.9, 0.68, -0.42]} rotation={[0, -0.38, 0]}>
            <PumpMotor textures={textures} />
          </group>
        </group>

        <DiagnosticHotspots scrollProgress={scrollProgress} />

        <group ref={controlLayer} scale={0.72} position={[1.65, 0.68, 0.85]} rotation={[0, -0.45, 0]}>
          <ControlCabinet textures={textures} />
          <PipeRun points={topPipe} radius={0.07} textures={textures} accent />
          <PipeRun points={cableOne} radius={0.025} textures={textures} />
          <PipeRun points={cableTwo} radius={0.021} textures={textures} accent />
        </group>

        <group ref={networkLayer} scale={0.7} position={[0, 1.15, -0.35]} rotation={[0, -0.45, 0]}>
          <SensorNetwork textures={textures} />
          <SignalParticles />
        </group>

        <group ref={optimizationLayer} scale={0.001} rotation={[0, 0.6, 0]}>
          <mesh ref={ringA} rotation={[1.18, 0.24, 0.12]}>
            <torusGeometry args={[1.83, 0.014, 8, 96]} />
            <meshBasicMaterial color="#2AA8FF" transparent opacity={0.36} toneMapped={false} />
          </mesh>
          <mesh ref={ringB} rotation={[0.25, 0.42, 1.12]}>
            <torusGeometry args={[2.08, 0.012, 8, 96]} />
            <meshBasicMaterial color="#F27B2A" transparent opacity={0.3} toneMapped={false} />
          </mesh>
        </group>
      </Float>
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
        camera={{ position: [4.85, 2.55, 6.75], fov: 38 }}
        dpr={isCompact ? 1 : [1, 1.4]}
        frameloop={prefersReducedMotion || isCompact || !isVisible ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }}
        onCreated={({ camera }) => camera.lookAt(0, -0.08, 0)}
      >
        <ambientLight intensity={1.15} />
        <hemisphereLight args={['#E1F5FF', '#061A35', 1.5]} />
        <directionalLight position={[4, 7, 5]} intensity={3.8} color="#FFFFFF" />
        <directionalLight position={[-4, 2, -3]} intensity={1.4} color="#70C7FF" />
        <pointLight position={[-3, 0, 3]} intensity={24} distance={9} color="#2AA8FF" />
        <pointLight position={[3, 1, 2]} intensity={16} distance={7} color="#F27B2A" />
        <DetailedProcessUnit scrollProgress={scrollProgress} layoutOffset={overlayLayout ? 0.78 : 0} />
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
