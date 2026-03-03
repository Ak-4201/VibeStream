import { useState } from 'react'
import type { OmdbMovieLite } from '../lib/omdb'
import './posterCard.css'

type PosterCardProps = {
  item: OmdbMovieLite
  variant?: 'poster' | 'backdrop'
}

export function PosterCard({ item, variant = 'poster' }: PosterCardProps) {
  const posterUrl = item.Poster && item.Poster !== 'N/A' ? item.Poster : ''
  const [imageFailed, setImageFailed] = useState(false)
  const showPlaceholder = !posterUrl || imageFailed

  return (
    <button className={`card card--${variant}`} type="button" aria-label={item.Title}>
      <div className="card__media">
        {showPlaceholder ? (
          <div className="card__placeholder" aria-hidden="true">
            {item.Title}
          </div>
        ) : (
          <img
            className="card__img"
            src={posterUrl}
            alt={item.Title}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
    </button>
  )
}
