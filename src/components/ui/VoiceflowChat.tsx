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

export function VoiceflowChat() {
  const loaded = useRef(false)

  useEffect(() => {
    if (loaded.current) return
    loaded.current = true

    // Clear stale Voiceflow session to prevent "Session is stale" errors
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
  }, [])

  return null
}
