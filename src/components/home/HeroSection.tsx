'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'
import type { HeroContent } from '@/lib/content-service'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const HeroScene = dynamic(
  () => import('./HeroScene').then(m => ({ default: m.HeroScene })),
  { ssr: false, loading: () => <HeroLoaderBar /> }
)

function HeroLoaderBar() {
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

function HeroAmbient() {
  return (
    <div className="absolute inset-0 z-[15] pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[820px] aspect-[2.6/1]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(130,135,150,0.18) 0%, rgba(50,52,60,0.10) 35%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <div className="absolute left-[12%] right-[12%] top-[58%] h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute left-[14%] top-[40%] w-px h-[22vh] bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />
      <div className="absolute right-[14%] top-[40%] w-px h-[22vh] bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />
    </div>
  )
}

function detectLiteMode(): boolean {
  if (typeof window === 'undefined') return false
  const nav = navigator as any

  const conn = nav.connection || nav.mozConnection || nav.webkitConnection
  if (conn?.saveData) return true
  if (conn?.effectiveType && ['slow-2g', '2g'].includes(conn.effectiveType)) return true

  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2) return true

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true

  return false
}

interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldMount3D, setShouldMount3D] = useState(false)
  const [isLiteMode, setIsLiteMode] = useState(false)
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

    setIsLiteMode(detectLiteMode())

    const loadTimeout = window.setTimeout(() => setIsLoaded(true), 100)

    const w = window as any
    const idleCb = typeof w.requestIdleCallback === 'function'
      ? (cb: () => void) => w.requestIdleCallback(cb, { timeout: 1500 })
      : (cb: () => void) => window.setTimeout(cb, 1)
    const cancelIdle = typeof w.cancelIdleCallback === 'function'
      ? (id: number) => w.cancelIdleCallback(id)
      : (id: number) => window.clearTimeout(id)
    const idleId: number = idleCb(() => setShouldMount3D(true))

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.clearTimeout(loadTimeout)
      cancelIdle(idleId)
    }
  }, [])

  const canRender3D = !isMobile && !isLiteMode
  const show3D = canRender3D && shouldMount3D

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
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden" style={{ contain: 'layout paint', willChange: 'transform' }}>

          {/* Enhanced Background Contrast */}
          <div className="absolute inset-0 hero-gradient z-0" />
          <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.svg')] z-10 pointer-events-none" />

          {/* Static ambient fallback — always visible so the hero never looks empty */}
          <HeroAmbient />

          {/* 3D Scene — desktop, capable devices, deferred until idle */}
          {show3D && (
            <div className="absolute inset-0 z-20 pointer-events-none">
              <HeroScene containerRef={containerRef} />
            </div>
          )}

          {/* UI Layers */}
          <div className="absolute inset-0 z-30 pointer-events-none">

            {/* ACT 0 */}
            <div ref={introRef} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#000000]">
              <div className="flex flex-col items-center w-full px-4">
                <span className="text-white/60 text-[10px] md:text-[11px] tracking-[0.5em] md:tracking-[0.6em] uppercase font-light mb-8 md:mb-12">
                  La Nueva Era
                </span>
                <h1 className="text-white text-[15vw] md:text-[9vw] font-bold tracking-[0.3em] uppercase text-center">
                  MIDCAR
                </h1>
                <div className="absolute bottom-20 flex flex-col items-center gap-4">
                  <span className="text-white/60 text-[9px] uppercase tracking-[0.4em]">Descubrir</span>
                  <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
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
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
