'use client'

import React, { Suspense, useLayoutEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

useGLTF.preload('/models/car.glb')

// Pose final del coche (la que dejaba la antigua animación de scroll al terminar),
// ahora fija. Sin ScrollTrigger ni timeline: el coche se renderiza una vez y se queda.
const FINAL_SCALE = 0.85
const FINAL_POSITION: [number, number, number] = [1.9, -0.9, 0]
const FINAL_ROTATION: [number, number, number] = [0, -Math.PI / 6, 0]

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
          // Pintura negra glossy realista (no cromo)
          mat.color.setHex(0x0a0a0a)
          mat.metalness = 0.85
          mat.roughness = 0.3
          mat.clearcoat = 1.0
          mat.clearcoatRoughness = 0.15
          mat.envMapIntensity = 0.9
        } else {
          mat.envMapIntensity = 0.9
        }
        // Apagar materiales emisivos del modelo (las luces brillaban en rojo en el parabrisas)
        const std = mat as THREE.MeshStandardMaterial
        if (std.emissive) {
          std.emissive.setHex(0x000000)
          std.emissiveIntensity = 0
        }
        mat.needsUpdate = true
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
        dpr={[1, 2]}
        camera={{ position: [0, 1.5, 8], fov: 30 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: 'high-performance',
        }}
      >
        {/* Estudio neutro con softboxes blancos -> reflejos limpios en blanco/gris (sin arcoíris del HDR) */}
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={1.8} position={[0, 5, 1]} scale={[10, 4, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[-5, 1.5, 1]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
          <Lightformer form="rect" intensity={1.2} position={[5, 1.5, 1]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[0, 1.5, -6]} scale={[10, 5, 1]} />
        </Environment>

        <ambientLight intensity={0.35} />
        <spotLight position={[6, 9, 5]} angle={0.35} penumbra={1} intensity={1.5} castShadow color="#ffffff" />
        <directionalLight position={[-6, 5, -3]} intensity={0.5} color="#ffffff" />

        <CarModel />

        <ContactShadows
          position={[FINAL_POSITION[0], FINAL_POSITION[1], FINAL_POSITION[2]]}
          opacity={0.65}
          scale={12}
          blur={2.2}
          far={3}
          color="#000000"
        />
      </Canvas>
    </Suspense>
  )
}
