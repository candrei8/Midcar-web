import { Star } from 'lucide-react'

interface GoogleReviewsBadgeProps {
  rating: string
  reviews: string
  url: string
}

// Fijo a nivel de página (no dentro de secciones con `isolate`) para que
// nunca quede por debajo de imágenes u otros stacking contexts al hacer scroll.
export function GoogleReviewsBadge({ rating, reviews, url }: GoogleReviewsBadgeProps) {
  const ratingValue = parseFloat(rating.replace(',', '.')) || 4.5

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${rating} estrellas en Google, ${reviews} reseñas`}
      className="fixed left-4 bottom-4 z-[70] hidden md:flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur-md pl-2.5 pr-4 py-2 shadow-[0_8px_30px_rgba(2,6,23,0.18)] ring-1 ring-secondary-900/5 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(2,6,23,0.25)] hover:bg-white"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-secondary-900">
          {rating}
          <span className="flex" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i <= Math.round(ratingValue) ? 'fill-amber-400 text-amber-400' : 'fill-secondary-200 text-secondary-200'}`}
              />
            ))}
          </span>
        </span>
        <span className="text-[11px] text-secondary-500 mt-1">+{reviews} reseñas en Google</span>
      </span>
    </a>
  )
}
