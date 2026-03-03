import { useState } from 'react'
import './AuthBackground.css'

// Reliable placeholder service (allows embedding, no hotlink block). Poster-like aspect ~2/3.
const POSTER_SEEDS = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12', 'm13', 'm14', 'm15', 'm16', 'm17', 'm18', 'm19', 'm20', 'm21', 'm22', 'm23', 'm24']

function posterUrl(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

const FALLBACK_PLACEHOLDER = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="180" viewBox="0 0 120 180"><rect fill="%23333" width="120" height="180"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="14">Image</text></svg>'
)}`

export function AuthBackground() {
  const [failed, setFailed] = useState<Set<number>>(() => new Set())

  const handleError = (index: number) => {
    setFailed((prev) => new Set(prev).add(index))
  }

  return (
    <div className="auth-bg" aria-hidden="true">
      <div className="auth-bg__grid">
        {POSTER_SEEDS.map((seed, i) => {
          const w = 120
          const h = 180
          const src = failed.has(i) ? FALLBACK_PLACEHOLDER : posterUrl(seed, w, h)
          return (
            <div key={i} className="auth-bg__poster">
              <img
                src={src}
                alt=""
                loading="eager"
                referrerPolicy="no-referrer"
                onError={() => handleError(i)}
              />
            </div>
          )
        })}
      </div>
      <div className="auth-bg__overlay" />
    </div>
  )
}
