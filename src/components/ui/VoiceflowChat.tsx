'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    voiceflow?: {
      chat: {
        load: (config: Record<string, unknown>) => void
      }
    }
  }
}

const IDLE_TIMEOUT_MS = 8000
const INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
  'pointerdown',
  'keydown',
  'scroll',
  'touchstart',
]

export function VoiceflowChat() {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return

    function loadWidget() {
      if (loaded.current) return
      loaded.current = true

      cleanup()

      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('voiceflow')) {
            localStorage.removeItem(key)
          }
        })
      } catch {
        // localStorage may not be available
      }

      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://cdn.voiceflow.com/widget-next/bundle.mjs'
      script.onload = () => {
        window.voiceflow?.chat.load({
          verify: { projectID: '69aef4aa38a8bcf88cc9d455' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          voice: {
            url: 'https://runtime-api.voiceflow.com',
          },
        })
      }
      document.body.appendChild(script)
    }

    let idleTimer: number | undefined
    const w = window as any
    const idleId = typeof w.requestIdleCallback === 'function'
      ? w.requestIdleCallback(() => {
          idleTimer = window.setTimeout(loadWidget, IDLE_TIMEOUT_MS)
        }, { timeout: 12000 })
      : window.setTimeout(() => {
          idleTimer = window.setTimeout(loadWidget, IDLE_TIMEOUT_MS)
        }, 2500)

    function onInteraction() {
      loadWidget()
    }

    INTERACTION_EVENTS.forEach((ev) =>
      window.addEventListener(ev, onInteraction, { once: true, passive: true })
    )

    function cleanup() {
      if (idleTimer !== undefined) window.clearTimeout(idleTimer)
      if (typeof w.cancelIdleCallback === 'function' && typeof idleId === 'number') {
        w.cancelIdleCallback(idleId)
      } else if (typeof idleId === 'number') {
        window.clearTimeout(idleId)
      }
      INTERACTION_EVENTS.forEach((ev) =>
        window.removeEventListener(ev, onInteraction)
      )
    }

    return cleanup
  }, [])

  return null
}
