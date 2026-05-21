'use client'

import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, AdaptiveDpr } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

useGLTF.preload('/models/car.glb')

function CarModel({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const { scene } = useGLTF('/models/car.glb')
  const invalidate = useThree(state => state.invalidate)
  const groupRef = useRef<THREE.Group>(null!)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  useLayoutEffect(() => {
    if (!groupRef.current || !containerRef.current) return

    const ctx = gsap.context(() => {
      const baseScale = isMobile ? 0.7 : 1.2

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          onUpdate: () => invalidate(),
          onRefresh: () => invalidate(),
        }
      })

      tl.set(groupRef.current.scale, { x: baseScale * 4.5, y: baseScale * 4.5, z: baseScale * 4.5 })
      tl.set(groupRef.current.position, { x: isMobile ? 0 : -4.5, y: isMobile ? -0.8 : -1.2, z: 6 })
      tl.set(groupRef.current.rotation, { y: Math.PI / 4.5 })

      tl.to({}, { duration: 100 }, 0)

      tl.to(groupRef.current.scale, {
        x: baseScale * 1.5,
        y: baseScale * 1.5,
        z: baseScale * 1.5,
        ease: 'power2.inOut',
        duration: 20
      }, 15)
        .to(groupRef.current.position, {
          x: 0,
          y: -0.8,
          z: 0,
          ease: 'power2.inOut',
          duration: 20
        }, 15)
        .to(groupRef.current.rotation, {
          y: -Math.PI / 2,
          ease: 'power2.inOut',
          duration: 20
        }, 15)

      tl.to(groupRef.current.scale, {
        x: isMobile ? baseScale * 1.1 : baseScale * 1.3,
        y: isMobile ? baseScale * 1.1 : baseScale * 1.3,
        z: isMobile ? baseScale * 1.1 : baseScale * 1.3,
        ease: 'power2.inOut',
        duration: 15
      }, 40)
        .to(groupRef.current.position, {
          x: isMobile ? 0 : 1.5,
          y: isMobile ? -0.3 : -0.8,
          z: 0,
          ease: 'power2.inOut',
          duration: 15
        }, 40)
        .to(groupRef.current.rotation, {
          y: isMobile ? -Math.PI / 3 : -Math.PI / 3.5,
          ease: 'power2.inOut',
          duration: 15
        }, 40)

      tl.to(groupRef.current.scale, {
        x: isMobile ? baseScale * 0.85 : baseScale,
        y: isMobile ? baseScale * 0.85 : baseScale,
        z: isMobile ? baseScale * 0.85 : baseScale,
        ease: 'power2.out',
        duration: 10
      }, 60)
        .to(groupRef.current.position, {
          x: isMobile ? 0 : 2,
          y: isMobile ? 0.2 : -0.8,
          z: 0,
          ease: 'power2.out',
          duration: 10
        }, 60)
        .to(groupRef.current.rotation, {
          y: isMobile ? -Math.PI / 5 : -Math.PI / 7,
          ease: 'power2.out',
          duration: 10
        }, 60)

      invalidate()
    })

    return () => ctx.revert()
  }, [containerRef, isMobile, invalidate])

  return (
    <group ref={groupRef}>
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
        Preparando Experiencia
      </span>
    </div>
  )
}

export function HeroScene({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
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

        <CarModel containerRef={containerRef} />

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
