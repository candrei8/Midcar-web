'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Float, Environment, ContactShadows, Lightformer } from '@react-three/drei'
import { useEffect, useRef, useState, Suspense, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import * as THREE from 'three'
import { getHeroContent, HeroContent } from '@/lib/content-service'

// Ensure we only register ScrollTrigger on client-side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

useGLTF.preload('/models/car.glb')

// ============================================
// 3D Scene - Premium Minimalist Autohaus
// ============================================

function CarModel({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) {
  const { scene } = useGLTF('/models/car.glb')
  const groupRef = useRef<THREE.Group>(null!)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Setup the model materials to look ULTRA premium but realistic
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const center = new THREE.Vector3()
    box.getCenter(center)

    const maxDim = Math.max(size.x, size.y, size.z)
    const scale = 5.5 / maxDim
    scene.scale.setScalar(scale)

    // Center geometry exactly at origin
    scene.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Deep gloss, physically accurate metalness
        child.material.envMapIntensity = 2.0 // Boosted for better reflections
        if (child.material.name.toLowerCase().includes('paint') || child.material.name.toLowerCase().includes('body')) {
          child.material.color.setRGB(0.04, 0.04, 0.04) // Graphite grey so it doesn't blend into black bg
          child.material.roughness = 0.1
          child.material.metalness = 0.7
          child.material.clearcoat = 1.0
          child.material.clearcoatRoughness = 0.1
        }
        child.material.needsUpdate = true
      }
    })
  }, [scene])

  // GSAP ScrollTrigger Animation for the 3D Model
  useLayoutEffect(() => {
    if (!groupRef.current || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Set initial state (ACT 0 -> 1: Abstract Macro close up on the front wheel / chassis)
      const baseScale = isMobile ? 0.7 : 1.2


      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5, // Super smooth scrubbing stable
        }
      })

      // Lock initial state directly into the timeline at progress 0 to prevent React mount desyncs
      tl.set(groupRef.current.scale, { x: baseScale * 4.5, y: baseScale * 4.5, z: baseScale * 4.5 })
      tl.set(groupRef.current.position, { x: isMobile ? 0 : -4.5, y: isMobile ? -0.8 : -1.2, z: 6 })
      tl.set(groupRef.current.rotation, { y: Math.PI / 4.5 })

      // Set explicit duration to 100 for perfect percentage-based syncing
      tl.to({}, { duration: 100 }, 0)

      // 15% to 35% - Acto 1 (Perfil lateral)
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
          y: -Math.PI / 2, // pure side profile
          ease: 'power2.inOut',
          duration: 20
        }, 15)

      // 40% to 55% - Acto 2 (Angulo diagonal clasico)
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
          y: isMobile ? -Math.PI / 3 : -Math.PI / 3.5, // 3/4 front
          ease: 'power2.inOut',
          duration: 15
        }, 40)

      // 60% to 70% - Acto Final (Angulo Showroom)
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

    })

    return () => ctx.revert()
  }, [containerRef, isMobile])

  return (
    <group ref={groupRef}>

      <primitive object={scene} />

    </group>
  )
}

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-[#000000]">
      <div className="relative flex flex-col items-center justify-center">
        <div className="w-[120px] h-[1px] bg-white/10 overflow-hidden relative mb-4">
          <div className="absolute top-0 left-0 h-full w-full bg-white origin-left animate-[scale-x_2s_infinite_ease-in-out]" />
        </div>
        <span className="text-white/40 text-[9px] tracking-[0.4em] uppercase font-light">
          Preparando Experiencia
        </span>
      </div>
    </div>
  )
}

// ============================================
// Hero Component (The Scroll Container)
// ============================================

export function HeroSection() {
  const [content, setContent] = useState<HeroContent | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  // Refs for HTML sections
  const introRef = useRef<HTMLDivElement>(null)
  const act1Ref = useRef<HTMLDivElement>(null)
  const act2Ref = useRef<HTMLDivElement>(null)
  const act3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getHeroContent()
        setContent(data)
      } catch (e) {
        console.error('Failed to load hero content', e)
      }
    }
    fetch()
    // Small delay to ensure smooth mounting before animations hook
    setTimeout(() => setIsLoaded(true), 100)
  }, [])

  useLayoutEffect(() => {
    if (!isLoaded || !containerRef.current) return

    const ctx = gsap.context(() => {
      // Unified Scrubbing Timeline for Text Layers
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5, // Tighter and smoother scrubbing
        }
      })

      // Force explicit 100 duration to match 3D Model perfectly
      tl.to({}, { duration: 100 }, 0)

      // 0% a 15% - Intro "fade out"
      tl.to(introRef.current, {
        opacity: 0,
        filter: 'blur(15px)',
        pointerEvents: 'none',
        duration: 15,
        ease: 'power2.inOut'
      }, 0)

      // 15% a 35% - Acto 1
      tl.fromTo(act1Ref.current,
        { opacity: 0, y: 30, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 7, ease: 'power2.out' }, // Appears 15-22
        15
      ).to(act1Ref.current, {
        opacity: 0, y: -30, filter: 'blur(10px)', duration: 7, ease: 'power2.in' // Fades out 28-35
      }, 28)

      // 40% a 55% - Acto 2
      tl.fromTo(act2Ref.current,
        { opacity: 0, y: 30, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 5, ease: 'power2.out' }, // Appears 40-45
        40
      ).to(act2Ref.current, {
        opacity: 0, y: -30, filter: 'blur(10px)', duration: 5, ease: 'power2.in' // Fades out 50-55
      }, 50)

      // 60% a 70% - Acto Final
      tl.fromTo(act3Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 6, ease: 'power2.out' }, // Appears 60-66
        60
      )
    })

    return () => ctx.revert()
  }, [isLoaded])

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scale-x {
          0% { transform: scaleX(0); transform-origin: left; }
          50% { transform: scaleX(1); transform-origin: left; }
          50.1% { transform: scaleX(1); transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        @keyframes slide-down {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}} />

      {/* The 350vh scrolling container (Reduced from 450vh to make the exit faster) */}
      <section ref={containerRef} className="relative h-[350vh] w-full bg-[#000000]">

        {/* Sticky Viewport (100vh) */}
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#020202]">

          {/* ── 3D Scene ── */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Suspense fallback={<SceneLoader />}>
              <Canvas
                shadows={false}
                dpr={[1, 1.2]} // Lowered DPR for drastic performance gain
                camera={{ position: [0, 1.5, 8], fov: 30 }}
                gl={{
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.1, // Slightly darker, more dramatic
                  powerPreference: 'high-performance',
                  antialias: false,
                }}
              >
                <color attach="background" args={['#050505']} />
                <fog attach="fog" args={['#050505', 8, 30]} />

                {/* Ultra Premium Cinematic Lighting */}
                <ambientLight intensity={0.4} color="#ffffff" />
                <spotLight position={[0, 15, 0]} intensity={2.5} angle={0.8} penumbra={1} color="#ffffff" />
                <directionalLight position={[-10, 5, -5]} intensity={3} color="#ffffff" />
                {/* Front fill light so the car isn't totally black */}
                <directionalLight position={[0, 2, 10]} intensity={1.5} color="#ffffff" />

                {/* Minimalist Rim Light */}
                <pointLight position={[5, 2, -5]} intensity={4} color="#ffffff" distance={20} />

                {/* CRITICAL: Synthetic Environment provides reflections. Disabled blur to prevent WebGL Feedback Loop Error */}
                <Environment resolution={256}>
                  <group rotation={[-Math.PI / 2, 0, 0]}>
                    <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
                    <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.5, 1]} />
                    <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[5, 1, -1]} scale={[20, 0.5, 1]} />
                    <Lightformer intensity={2} rotation-x={Math.PI / 2} position={[0, 4, 0]} scale={[5, 5, 1]} />
                  </group>
                </Environment>

                <CarModel containerRef={containerRef} />

                {/* Highly Performant Showroom Floor */}
                <mesh position={[0, -0.85, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[100, 100]} />
                  <meshStandardMaterial
                    color="#020202"
                    roughness={0.15}
                    metalness={0.8}
                  />
                </mesh>

                {/* Fake shadow plane underneath the car */}
                <mesh position={[0, -0.84, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[4, 64]} />
                  <meshBasicMaterial color="#000000" transparent opacity={0.6} />
                </mesh>

              </Canvas>
            </Suspense>
          </div>

          {/* ── UI Layers (Tied to Scroll) ── */}

          {/* Noise overlay for premium texture (Reduced opacity so it's truly subtle) */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          <div className="absolute inset-0 z-10 pointer-events-none">

            {/* ACT 0: True Intro (Black screen + Minimal Typography) */}
            <div ref={introRef} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#000000] ">
              <div className="flex flex-col items-center w-full px-4">
                <span className="text-white/40 text-[10px] md:text-[11px] tracking-[0.5em] md:tracking-[0.6em] uppercase font-light mb-8 md:mb-12 text-center w-full">
                  La Nueva Era
                </span>

                {/* Pure, clean text - no cheesy outlines or colors */}
                <div className="relative mb-6 select-none w-full flex justify-center">
                  <h1 className="text-white text-[15vw] sm:text-[12vw] md:text-[9vw] font-light font-display tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] leading-none uppercase drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] text-center">
                    MIDCAR
                  </h1>
                </div>

                {/* Intro scroll indicator */}
                <div className="absolute flex flex-col items-center gap-4 bottom-16 md:bottom-20 opacity-50">
                  <span className="text-white/40 text-[9px] uppercase tracking-[0.4em] font-light">Descubrir</span>
                  <div className="w-[1px] h-12 md:h-16 bg-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[slide-down_2s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACT 1: Intro */}
            <div ref={act1Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0 px-4 md:px-0 ">
              <span className="text-white/50 text-[9px] md:text-[11px] tracking-[0.4em] uppercase font-light mb-2 md:mb-6 text-center w-full">Ingeniería</span>
              <h1 className="text-white text-[10vw] sm:text-[8vw] md:text-[6vw] font-light tracking-widest leading-none uppercase text-center w-full">
                SIN LÍMITES
              </h1>
            </div>

            {/* ACT 2: Profile */}
            <div ref={act2Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0 px-4 md:px-0 ">
              <span className="text-white/50 text-[9px] md:text-[11px] tracking-[0.4em] uppercase font-light mb-2 md:mb-6 text-center w-full">Diseño</span>
              <h1 className="text-white text-[10vw] sm:text-[8vw] md:text-[6vw] font-light tracking-widest leading-none uppercase text-center w-full">
                PURA ELEGANCIA
              </h1>
            </div>

            {/* ACT 3: Final Landing & Content */}
            <div ref={act3Ref} className="absolute inset-0 flex flex-col justify-end pb-24 md:pb-0 md:justify-center px-6 md:px-12 lg:px-[8%] opacity-0 pointer-events-auto z-10 ">
              {content && (
                <div className="max-w-4xl w-full mx-auto md:mx-auto lg:mx-0">
                  <div className="inline-flex items-center gap-3 md:gap-4 mb-6 md:mb-10">
                    <div className="w-8 md:w-16 h-[1px] bg-white/50"></div>
                    <span className="text-white/70 font-light tracking-[0.4em] md:tracking-[0.5em] text-[9px] md:text-[10px] uppercase">
                      Colección Premium
                    </span>
                  </div>

                  {/* Clean, massive, airy typography */}
                  <h1 className="text-[14vw] sm:text-[10vw] md:text-7xl lg:text-[100px] font-light font-display text-white tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.15em] leading-[1.1] uppercase mb-1">
                    {content.titulo1 || 'EXCELENCIA'}
                  </h1>
                  <h1 className="text-[14vw] sm:text-[10vw] md:text-7xl lg:text-[100px] font-medium text-white/90 tracking-[0.05em] sm:tracking-[0.1em] md:tracking-[0.15em] leading-[1.1] uppercase mb-6 md:mb-12">
                    {content.titulo2 || 'EN ESPERA'}
                  </h1>

                  <p className="text-white/60 text-[11px] sm:text-[12px] md:text-[13px] font-light leading-relaxed sm:leading-loose tracking-widest max-w-[280px] sm:max-w-[340px] md:max-w-[420px] mb-8 md:mb-14">
                    {content.subtitulo || 'Concesionario de alta gama. Descubra nuestra exclusiva selección de vehículos y experimente un estándar de servicio inigualable.'}
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 md:gap-8">
                    <Link
                      href="/vehiculos"
                      className="group relative inline-flex items-center justify-center border border-white/20 hover:border-white/80 bg-black/20 backdrop-blur-md text-white px-10 md:px-14 py-4 md:py-5 overflow-hidden w-full sm:w-auto transition-colors duration-500"
                    >
                      <span className="relative z-10 text-[9px] md:text-[10px] font-medium uppercase tracking-[0.4em] transition-colors duration-500 group-hover:text-black">
                        {content.ctaPrimario || 'Explorar Stock'}
                      </span>
                      <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.3,1)]"></div>
                    </Link>

                    <Link
                      href="/contacto"
                      className="group flex items-center justify-center sm:justify-start gap-4 text-white/50 hover:text-white transition-colors py-3 md:py-0"
                    >
                      <span className="w-8 h-[1px] bg-white/30 group-hover:bg-white transition-colors"></span>
                      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-light">
                        {content.ctaSecundario || 'Agendar Cita'}
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Global Scroll Indicator for this section */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 md:gap-4 opacity-70 z-20 mix-blend-difference pointer-events-none">
              <span className="text-white/40 text-[7px] md:text-[8px] uppercase tracking-[0.5em]">Scroll</span>
              <div className="w-[1px] h-10 md:h-12 bg-white/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/3 bg-white animate-[slide-down_2s_ease-in-out_infinite]"></div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
