'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, ContactShadows } from '@react-three/drei'
import { useEffect, useRef, useState, Suspense } from 'react'
import gsap from 'gsap'
import { ArrowRight, Shield, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import * as THREE from 'three'
import { getHeroContent, HeroContent } from '@/lib/content-service'

useGLTF.preload('/models/car.glb')

// ============================================
// 3D Scene
// ============================================

function CarModel() {
  const { scene } = useGLTF('/models/car.glb')
  const groupRef = useRef<THREE.Group>(null!)

  useEffect(() => {
    if (!groupRef.current) return

    // Auto-fit: normalize any model to ~4.5 units
    const box = new THREE.Box3().setFromObject(scene)
    const size = new THREE.Vector3()
    box.getSize(size)
    const autoScale = 4.5 / Math.max(size.x, size.y, size.z)
    scene.scale.setScalar(autoScale)

    // Center on ground
    const fitted = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    fitted.getCenter(center)
    scene.position.set(-center.x, -fitted.min.y, -center.z)

    // Cinematic drop — visible but fast (0.8s)
    groupRef.current.position.y = 5
    groupRef.current.scale.setScalar(0.93)
    groupRef.current.rotation.y = -0.3

    gsap.to(groupRef.current.position, {
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.1,
    })
    gsap.to(groupRef.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.1,
    })
    gsap.to(groupRef.current.rotation, {
      y: 0,
      duration: 1.0,
      ease: 'power2.out',
      delay: 0.1,
    })
  }, [])

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  )
}

function Platform() {
  const ref = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    if (!ref.current) return
    ref.current.scale.set(0, 0, 0)
    gsap.to(ref.current.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.2,
    })
  }, [])

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <circleGeometry args={[4, 64]} />
      <meshStandardMaterial
        color="#6b7a94"
        metalness={0.6}
        roughness={0.3}
      />
    </mesh>
  )
}

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-amber-200/10 border-t-amber-200/50 rounded-full animate-spin" />
        <p className="text-amber-100/20 text-[11px] tracking-[0.25em] uppercase">
          Cargando
        </p>
      </div>
    </div>
  )
}

// ============================================
// Content defaults
// ============================================

const defaultContent: HeroContent = {
  badge: 'Concesionario de confianza en Madrid',
  titulo1: 'Tu próximo coche',
  titulo2: 'está aquí',
  subtitulo:
    'Más de 15 años ofreciendo vehículos de ocasión certificados, garantizados y al mejor precio en Torrejón de Ardoz, Madrid.',
  ctaPrimario: 'Ver vehículos',
  ctaSecundario: 'Contactar',
  stats: [
    { valor: '15+', label: 'años de experiencia' },
    { valor: '1 año', label: 'de garantía' },
    { valor: '80+', label: 'vehículos en stock' },
  ],
  precioDesde: '7.900€',
  garantiaBadge: 'Garantía 12 meses',
  imagenUrl: '',
}

// ============================================
// Hero
// ============================================

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)
  const guaranteeRef = useRef<HTMLDivElement>(null)
  const stat0Ref = useRef<HTMLDivElement>(null)
  const stat1Ref = useRef<HTMLDivElement>(null)
  const stat2Ref = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState<HeroContent>(defaultContent)

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await getHeroContent()
        setContent(data)
      } catch {
        // defaults
      }
    }
    fetchContent()
  }, [])

  // Auto-reveal timeline — plays after car lands
  useEffect(() => {
    const statRefs = [stat0Ref, stat1Ref, stat2Ref]
    const ctx = gsap.context(() => {
      // Delay = car drop (0.8s) + small pause
      const tl = gsap.timeline({ delay: 1.0 })

      // Horizontal accent line draws
      tl.fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power2.inOut' }
      )

      // Title reveals with clip-path
      .fromTo(titleRef.current,
        { y: 25, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.6, ease: 'power3.out' },
        0.15
      )

      // Subtitle
      .fromTo(subtitleRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.35
      )

      // Price (right side)
      .fromTo(priceRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.45
      )

      // Stats staggered from left
      statRefs.forEach((ref, i) => {
        tl.fromTo(ref.current,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
          0.55 + i * 0.1
        )
      })

      // Guarantee badge
      tl.fromTo(guaranteeRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' },
        0.85
      )

      // Mobile panel
      tl.fromTo(mobilePanelRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.4
      )

      // CTA
      tl.fromTo(ctaRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        0.95
      )
    })

    return () => ctx.revert()
  }, [])

  const stats = [
    { value: content.stats[0]?.valor || '15+', label: content.stats[0]?.label || 'años de experiencia' },
    { value: content.stats[1]?.valor || '1 año', label: content.stats[1]?.label || 'de garantía' },
    { value: content.stats[2]?.valor || '80+', label: content.stats[2]?.label || 'vehículos en stock' },
  ]
  const statRefs = [stat0Ref, stat1Ref, stat2Ref]

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      style={{ background: '#0c1220' }}
    >
      {/* ── Background with warm spotlight center ── */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% 48%, #1e2d42 0%, #121a2a 45%, #0c1220 80%)',
          }}
        />
        {/* Subtle warm glow behind car position */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 45% 40% at 52% 50%, rgba(200, 180, 140, 0.08) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ── 3D Canvas ── */}
      <div className="absolute inset-0 z-10">
        <Suspense fallback={<SceneLoader />}>
          <Canvas
            camera={{ position: [5.5, 2, 5.5], fov: 38 }}
            shadows
            dpr={[1, 2]}
          >
            <fog attach="fog" args={['#0c1220', 16, 35]} />

            {/* Bright showroom lighting */}
            <ambientLight intensity={0.9} />
            {/* Key light — warm, strong */}
            <spotLight
              position={[7, 12, 5]}
              angle={0.5}
              penumbra={1}
              intensity={5}
              castShadow
              shadow-mapSize={[1024, 1024]}
              color="#ffe8cc"
            />
            {/* Fill light — cool, adds dimension */}
            <spotLight
              position={[-6, 8, -3]}
              angle={0.6}
              penumbra={1}
              intensity={2.5}
              color="#b0cce8"
            />
            {/* Rim light — outlines the car from behind */}
            <spotLight
              position={[0, 5, -9]}
              angle={0.7}
              penumbra={0.8}
              intensity={3}
              color="#d0d8e8"
            />
            {/* Top-down fill — opens up the shadows */}
            <spotLight
              position={[0, 14, 0]}
              angle={0.8}
              penumbra={1}
              intensity={1.5}
              color="#e0e4f0"
            />
            <hemisphereLight args={['#e8ecf4', '#2a3548', 0.8]} />
            <directionalLight
              position={[3, 10, -4]}
              intensity={0.8}
              color="#f0e8dc"
            />

            <CarModel />
            <Platform />
            <ContactShadows
              position={[0, -0.01, 0]}
              opacity={0.5}
              scale={14}
              blur={2.5}
              far={5}
            />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.3}
              minPolarAngle={Math.PI / 3.5}
              maxPolarAngle={Math.PI / 2.2}
              makeDefault
            />
          </Canvas>
        </Suspense>
      </div>

      {/* ── UI Overlay ── */}
      <div className="absolute inset-0 z-20 pointer-events-none">

        {/* Brand mark — top left */}
        <div className="absolute top-7 left-8 lg:left-12">
          <p className="text-slate-400/30 text-[11px] tracking-[0.3em] uppercase font-medium">
            MID Car · Madrid
          </p>
        </div>

        {/* Horizontal accent line */}
        <div
          ref={lineRef}
          className="absolute top-[63%] left-[5%] right-[5%] h-px origin-left"
          style={{
            transform: 'scaleX(0)',
            background: 'linear-gradient(90deg, transparent, rgba(180, 160, 120, 0.12) 20%, rgba(180, 160, 120, 0.12) 80%, transparent)',
          }}
        />

        {/* ═══ DESKTOP ═══ */}

        {/* Left column — title, subtitle, stats */}
        <div className="absolute left-8 xl:left-16 bottom-[18%] hidden lg:block max-w-xs">
          <div ref={titleRef} className="opacity-0 mb-3">
            <h1 className="text-3xl xl:text-4xl font-bold font-display text-white leading-[1.15] tracking-tight">
              {content.titulo1}
              <br />
              <span className="text-white/50">{content.titulo2}</span>
            </h1>
          </div>

          <div ref={subtitleRef} className="opacity-0 mb-8">
            <p className="text-white/25 text-sm leading-relaxed max-w-[280px]">
              {content.subtitulo}
            </p>
          </div>

          <div className="space-y-3">
            {stats.map((stat, i) => (
              <div
                ref={statRefs[i]}
                key={stat.label}
                className="opacity-0 flex items-baseline gap-3"
              >
                <span className="text-xl font-bold text-white tabular-nums tracking-tight">
                  {stat.value}
                </span>
                <span className="text-white/20 text-xs uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — price, guarantee */}
        <div className="absolute right-8 xl:right-16 bottom-[18%] hidden lg:block text-right">
          <div ref={priceRef} className="opacity-0 mb-5">
            <p className="text-white/20 text-[10px] tracking-[0.25em] uppercase mb-1">
              Desde
            </p>
            <p className="text-5xl xl:text-6xl font-extrabold text-white tracking-tighter">
              {content.precioDesde}
            </p>
          </div>

          <div ref={guaranteeRef} className="opacity-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08]">
              <Shield className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs text-white/40 font-medium tracking-wide">
                {content.garantiaBadge}
              </span>
            </div>
          </div>
        </div>

        {/* ═══ MOBILE ═══ */}
        <div
          ref={mobilePanelRef}
          className="absolute bottom-24 left-4 right-4 opacity-0 lg:hidden pointer-events-auto"
        >
          <div className="bg-white/[0.05] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-5 space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase">Desde</p>
                <p className="text-3xl font-extrabold text-white tracking-tight">
                  {content.precioDesde}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.08] rounded-full">
                <Shield className="w-3 h-3 text-white/30" />
                <span className="text-[10px] text-white/30 font-medium">
                  {content.garantiaBadge}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex-1 text-center">
                  <p className="text-base font-bold text-white">{stat.value}</p>
                  <p className="text-[9px] text-white/25 leading-tight mt-0.5 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div
          ref={ctaRef}
          className="absolute bottom-7 lg:bottom-10 left-1/2 -translate-x-1/2 opacity-0 pointer-events-auto"
        >
          <div className="flex items-center gap-3">
            <Link
              href="/vehiculos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary-900 text-sm font-semibold rounded-xl hover:bg-white/90 transition-all duration-200"
            >
              {content.ctaPrimario}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 px-6 py-3 text-white/60 text-sm font-medium rounded-xl border border-white/[0.08] hover:border-white/20 hover:text-white transition-all duration-200"
            >
              {content.ctaSecundario}
            </Link>
          </div>
        </div>

        {/* ── Scroll hint ── */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-4 h-4 text-slate-500/25 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
