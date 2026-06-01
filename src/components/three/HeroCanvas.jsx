import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial, Float, Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Suppress THREE.Clock deprecation warning from @react-three/fiber
const originalWarn = console.warn
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) return
  originalWarn(...args)
}

function TechCore() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15
      meshRef.current.rotation.x += delta * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      {/* Outer Wireframe Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 2]} />
        <meshStandardMaterial
          color="#00a3f5"
          wireframe={true}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Inner Solid Core */}
      <mesh>
        <icosahedronGeometry args={[1.8, 1]} />
        <meshStandardMaterial
          color="#80cbf4"
          wireframe={true}
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Data Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#80cbf4" transparent opacity={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0.2, 0]}>
        <torusGeometry args={[4, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00a3f5" transparent opacity={0.1} />
      </mesh>
    </Float>
  )
}

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#80cbf4" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#00a3f5" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#00a3f5" />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <TechCore />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  )
}
