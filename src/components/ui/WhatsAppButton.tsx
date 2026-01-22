'use client'

import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)

  const phoneNumber = '34695055555'
  const defaultMessage = 'Hola MID Car, me gustaría información sobre vuestros vehículos.'

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Bubble */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl shadow-secondary-900/20 border border-secondary-100 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">MID Car</p>
                <p className="text-xs text-green-100">Normalmente responde en minutos</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-secondary-50">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-sm text-secondary-700">
                ¡Hola! 👋 ¿En qué podemos ayudarte? Escríbenos y te responderemos lo antes posible.
              </p>
              <p className="text-xs text-secondary-400 mt-2">Hace un momento</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-secondary-100">
            <a
              href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Iniciar conversación
            </a>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-16 h-16 bg-green-500 text-white rounded-full shadow-lg shadow-green-500/30',
          'flex items-center justify-center transition-all duration-300',
          'hover:bg-green-600 hover:shadow-xl hover:shadow-green-500/40 hover:scale-105',
          isOpen && 'rotate-90'
        )}
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </button>
    </div>
  )
}
