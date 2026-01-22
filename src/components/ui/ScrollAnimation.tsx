'use client'

import { useRef, ReactNode, useState, useEffect, useLayoutEffect } from 'react'

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  variant?: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scale' | 'blur'
  once?: boolean
}

const variantStyles: Record<string, { initial: string; animate: string }> = {
  fadeUp: {
    initial: 'opacity-0 translate-y-10',
    animate: 'opacity-100 translate-y-0'
  },
  fadeDown: {
    initial: 'opacity-0 -translate-y-10',
    animate: 'opacity-100 translate-y-0'
  },
  fadeLeft: {
    initial: 'opacity-0 -translate-x-10',
    animate: 'opacity-100 translate-x-0'
  },
  fadeRight: {
    initial: 'opacity-0 translate-x-10',
    animate: 'opacity-100 translate-x-0'
  },
  scale: {
    initial: 'opacity-0 scale-95',
    animate: 'opacity-100 scale-100'
  },
  blur: {
    initial: 'opacity-0 blur-sm',
    animate: 'opacity-100 blur-0'
  }
}

// Use useLayoutEffect on client, useEffect on server
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function ScrollAnimation({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  variant = 'fadeUp',
  once = true
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Start visible to match SSR
  const [isVisible, setIsVisible] = useState(true)
  const hasAnimatedRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    // Check if element is in viewport immediately
    const rect = element.getBoundingClientRect()
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0

    if (isInViewport) {
      // Already visible, keep it that way
      setIsVisible(true)
      hasAnimatedRef.current = true
      if (once) return
    } else {
      // Not in viewport, start animation sequence
      setIsVisible(false)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          hasAnimatedRef.current = true
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once && hasAnimatedRef.current) {
          setIsVisible(false)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [once])

  const styles = variantStyles[variant]
  const transitionStyle = {
    transitionProperty: 'opacity, transform, filter',
    transitionDuration: `${duration}s`,
    transitionDelay: `${delay}s`,
    transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
  }

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? styles.animate : styles.initial}`}
      style={transitionStyle}
    >
      {children}
    </div>
  )
}

// Stagger children animation container
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  once?: boolean
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  once = true
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const hasAnimatedRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0

    if (isInViewport) {
      setIsVisible(true)
      hasAnimatedRef.current = true
      if (once) return
    } else {
      setIsVisible(false)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          hasAnimatedRef.current = true
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once && hasAnimatedRef.current) {
          setIsVisible(false)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [once])

  return (
    <div ref={ref} className={className} data-stagger-visible={isVisible} data-stagger-delay={staggerDelay}>
      {children}
    </div>
  )
}

// Stagger item
export function StaggerItem({
  children,
  className = '',
  index = 0
}: {
  children: ReactNode
  className?: string
  index?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [delay, setDelay] = useState(0)

  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    if (!element) return

    // Find parent StaggerContainer
    const parent = element.closest('[data-stagger-visible]')
    if (parent) {
      const staggerDelay = parseFloat(parent.getAttribute('data-stagger-delay') || '0.1')

      // Get index among siblings
      const siblings = parent.querySelectorAll(':scope > [data-stagger-item]')
      let itemIndex = 0
      siblings.forEach((sibling, i) => {
        if (sibling === element) itemIndex = i
      })

      setDelay(itemIndex * staggerDelay)

      const observer = new MutationObserver(() => {
        const visible = parent.getAttribute('data-stagger-visible') === 'true'
        setIsVisible(visible)
      })

      observer.observe(parent, { attributes: true, attributeFilter: ['data-stagger-visible'] })

      // Check initial state
      setIsVisible(parent.getAttribute('data-stagger-visible') === 'true')

      return () => observer.disconnect()
    }
  }, [])

  const transitionStyle = {
    transitionProperty: 'opacity, transform',
    transitionDuration: '0.5s',
    transitionDelay: `${delay}s`,
    transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
  }

  return (
    <div
      ref={ref}
      data-stagger-item
      className={`${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={transitionStyle}
    >
      {children}
    </div>
  )
}

// Parallax effect - simplified
interface ParallaxProps {
  children: ReactNode
  className?: string
  speed?: number
}

export function Parallax({ children, className = '' }: ParallaxProps) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Counter animation for numbers
interface CounterProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}

export function Counter({
  value,
  duration = 2,
  className = '',
  prefix = '',
  suffix = ''
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)

          const startTime = Date.now()
          const endTime = startTime + duration * 1000

          const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / (duration * 1000), 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setDisplayValue(Math.round(eased * value))

            if (now < endTime) {
              requestAnimationFrame(animate)
            } else {
              setDisplayValue(value)
            }
          }

          requestAnimationFrame(animate)
          observer.unobserve(element)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [value, duration, hasAnimated])

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}
