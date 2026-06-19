'use client'

import React, { Suspense, useLayoutEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/car.glb')

// Pose final del coche (la que dejaba la antigua animación de scroll al terminar),
// ahora fija. Sin ScrollTrigger ni timeline: el coche se renderiza una vez y se queda.
const FINAL_SCALE = 1.2
const FINAL_POSITION: [number, number, number] = [2, -0.8, 0]
const FINAL_ROTATION: [number, number, number] = [0, -Math.PI / 7, 0]

function CarModel() {
  const { scene } = useGLTF('/models/car.glb')
  const invalidate = useThree((state) => state.invalidate)

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 5.5 / maxDim
    scene.scale.setScalar(scale)
    scene.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material as THREE.MeshPhysicalMaterial

        if (mat.name.toLowerCase().includes('paint') || mat.name.toLowerCase().includes('body')) {
          mat.color.setHex(0x0a0a0a)
          mat.roughness = 0.05
          mat.metalness = 1.0
          mat.clearcoat = 1.0
          mat.clearcoatRoughness = 0.03
          mat.envMapIntensity = 1.5
        } else {
          mat.envMapIntensity = 1.0
        }
      }
    })
    invalidate()
  }, [scene, invalidate])

  return (
    <group scale={FINAL_SCALE} position={FINAL_POSITION} rotation={FINAL_ROTATION}>
      <primitive object={scene} />
    </group>
  )
}

function SceneLoaderBar() {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
      <div className="w-[120px] h-[1px] bg-white/10 overflow-hidden relative mb-4">
        <div className="absolute top-0 left-0 h-full w-full bg-white origin-left animate-[scale-x_2s_infinite_ease-in-out]" />
      </div>
      <span className="text-white/40 text-[9px] tracking-[0.4em] uppercase font-light">
        Cargando
      </span>
    </div>
  )
}

export function HeroScene() {
  return (
    <Suspense fallback={<SceneLoaderBar />}>
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.5, 8], fov: 30 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          powerPreference: 'high-performance',
        }}
      >
        <AdaptiveDpr pixelated />
        <Environment files="/studio_small_03_1k.hdr" />

        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#4444ff" />

        <CarModel />

        <ContactShadows
          position={[0, -0.85, 0]}
          opacity={0.6}
          scale={20}
          blur={2.5}
          far={4}
          color="#000000"
        />
      </Canvas>
    </Suspense>
  )
}
