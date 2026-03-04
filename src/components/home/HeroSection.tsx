'use client'

import React, { useEffect, useRef, useState, Suspense, useLayoutEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows, AdaptiveDpr } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import * as THREE from 'three'
import { getHeroContent, HeroContent } from '@/lib/content-service'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ============================================
// 3D Scene - Premium Rendering with Original Animations
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

  // Setup the model materials to look ULTRA premium (Enhanced Lighting & Physical Materials)
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
        // Upgrade to Physical Material for premium reflections
        const mat = child.material as THREE.MeshPhysicalMaterial
        
        if (mat.name.toLowerCase().includes('paint') || mat.name.toLowerCase().includes('body')) {
          mat.color.setHex(0x0a0a0a) // Deeper Obsidian
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
  }, [scene])

  // RESTORED ORIGINAL ANIMATION LOGIC
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
        }
      })

      // Lock initial state
      tl.set(groupRef.current.scale, { x: baseScale * 4.5, y: baseScale * 4.5, z: baseScale * 4.5 })
      tl.set(groupRef.current.position, { x: isMobile ? 0 : -4.5, y: isMobile ? -0.8 : -1.2, z: 6 })
      tl.set(groupRef.current.rotation, { y: Math.PI / 4.5 })

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
          y: -Math.PI / 2,
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
          y: isMobile ? -Math.PI / 3 : -Math.PI / 3.5,
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
// Hero Component
// ============================================

export function HeroSection() {
  const [content, setContent] = useState<HeroContent | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showCanvas, setShowCanvas] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  const introRef = useRef<HTMLDivElement>(null)
  const act1Ref = useRef<HTMLDivElement>(null)
  const act2Ref = useRef<HTMLDivElement>(null)
  const act3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    async function fetch() {
      try {
        const data = await getHeroContent()
        setContent(data)
      } catch (e) {
        console.error('Failed to load hero content', e)
      }
    }
    fetch()
    setTimeout(() => setIsLoaded(true), 100)
    requestAnimationFrame(() => setShowCanvas(true))
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // RESTORED ORIGINAL TEXT ANIMATIONS
  useLayoutEffect(() => {
    if (!isLoaded || !containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        }
      })

      tl.to({}, { duration: 100 }, 0)

      tl.to(introRef.current, {
        opacity: 0,
        filter: 'blur(15px)',
        pointerEvents: 'none',
        duration: 15,
        ease: 'power2.inOut'
      }, 0)

      tl.fromTo(act1Ref.current,
        { opacity: 0, y: 30, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 7, ease: 'power2.out' },
        15
      ).to(act1Ref.current, {
        opacity: 0, y: -30, filter: 'blur(10px)', duration: 7, ease: 'power2.in'
      }, 28)

      tl.fromTo(act2Ref.current,
        { opacity: 0, y: 30, filter: 'blur(5px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 5, ease: 'power2.out' },
        40
      ).to(act2Ref.current, {
        opacity: 0, y: -30, filter: 'blur(10px)', duration: 5, ease: 'power2.in'
      }, 50)

      tl.fromTo(act3Ref.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 6, ease: 'power2.out' },
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
        .hero-gradient { background: radial-gradient(circle at 50% 50%, rgba(20,20,20,1) 0%, rgba(2,2,2,1) 100%); }
      `}} />

      <section ref={containerRef} className="relative h-[350vh] w-full bg-[#000000]">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
          
          {/* Enhanced Background Contrast */}
          <div className="absolute inset-0 hero-gradient z-0" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-10 pointer-events-none" />

          {/* 3D Scene - ONLY DESKTOP AS REQUESTED */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {!showCanvas && <SceneLoader />}
            {showCanvas && !isMobile && (
              <Suspense fallback={<SceneLoader />}>
                <Canvas
                  shadows
                  dpr={[1, 2]}
                  camera={{ position: [0, 1.5, 8], fov: 30 }}
                  gl={{ 
                    antialias: true,
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2
                  }}
                >
                  <AdaptiveDpr pixelated />
                  <Environment files="/studio_small_03_1k.hdr" />
                  
                  {/* High Contrast Studio Lighting */}
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
            )}
          </div>

          {/* UI Layers */}
          <div className="absolute inset-0 z-30 pointer-events-none">

            {/* ACT 0 */}
            <div ref={introRef} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#000000]">
              <div className="flex flex-col items-center w-full px-4">
                <span className="text-white/40 text-[10px] md:text-[11px] tracking-[0.5em] md:tracking-[0.6em] uppercase font-light mb-8 md:mb-12">
                  La Nueva Era
                </span>
                <h1 className="text-white text-[15vw] md:text-[9vw] font-bold tracking-[0.3em] uppercase text-center">
                  MIDCAR
                </h1>
                <div className="absolute bottom-20 flex flex-col items-center gap-4 opacity-40">
                  <span className="text-white/40 text-[9px] uppercase tracking-[0.4em]">Descubrir</span>
                  <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[slide-down_2s_infinite]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* ACT 1 */}
            <div ref={act1Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0 px-4 text-center">
              <span className="text-white/50 text-[9px] md:text-[11px] tracking-[0.4em] uppercase font-light mb-2 md:mb-6">Exploración</span>
              <h1 className="text-white text-[10vw] md:text-[6vw] font-light tracking-widest uppercase mb-4">
                DESCUBRE
              </h1>
              <p className="text-white/40 text-[12px] md:text-[14px] font-light max-w-xs leading-relaxed">
                Una selección exclusiva de vehículos revisados al detalle en nuestro taller.
              </p>
            </div>

            {/* ACT 2 */}
            <div ref={act2Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0 px-4 text-center">
              <span className="text-white/50 text-[9px] md:text-[11px] tracking-[0.4em] uppercase font-light mb-2 md:mb-6">Experiencia</span>
              <h1 className="text-white text-[10vw] md:text-[6vw] font-light tracking-widest uppercase mb-4">
                SIENTE
              </h1>
              <p className="text-white/40 text-[12px] md:text-[14px] font-light max-w-xs leading-relaxed">
                La tranquilidad de conducir un coche garantizado por expertos mecánicos.
              </p>
            </div>


            {/* ACT 3: Final Landing */}
            <div ref={act3Ref} className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-[8%] opacity-0 pointer-events-auto">
              {content && (
                <div className="max-w-4xl w-full mx-auto lg:mx-0">
                  <div className="inline-flex items-center gap-4 mb-10">
                    <div className="w-12 h-[1px] bg-white/50"></div>
                    <span className="text-white/70 font-light tracking-[0.5em] text-[10px] uppercase">
                      Calidad y Confianza
                    </span>
                  </div>

                  <h1 className="text-[14vw] md:text-7xl lg:text-[100px] font-bold text-white tracking-tight uppercase leading-[0.9]">
                    {content.titulo1 || 'EXCELENCIA'}
                  </h1>
                  <h1 className="text-[14vw] md:text-7xl lg:text-[100px] font-light text-white/30 tracking-tight uppercase leading-[0.9] mb-12 text-outline">
                    {content.titulo2 || 'EN ESPERA'}
                  </h1>


                  <p className="text-white/50 text-[14px] font-light leading-relaxed max-w-sm mb-14 border-l border-white/10 pl-6">
                    {content.subtitulo || 'Vehículos de ocasión revisados en nuestro taller propio. Encuentre calidad y transparencia en su próxima compra.'}
                  </p>


                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-8">
                    <Link
                      href="/vehiculos"
                      className="group relative bg-white text-black px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-center overflow-hidden"
                    >
                      <span className="relative z-10 group-hover:text-white transition-colors duration-500">Ver Inventario</span>
                      <div className="absolute inset-0 bg-black translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)]"></div>
                    </Link>

                    <Link
                      href="/contacto"
                      className="group flex items-center justify-center gap-4 text-white/40 hover:text-white transition-colors"
                    >
                      <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Contactar</span>
                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-all">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
