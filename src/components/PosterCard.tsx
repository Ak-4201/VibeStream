import { useState } from 'react'
import type { TmdbMovieLite } from '../lib/tmdb'
import { getImageUrl } from '../lib/tmdb'
import './posterCard.css'

type PosterCardProps = {
  item: TmdbMovieLite
  variant?: 'poster' | 'backdrop'
}

export function PosterCard({ item, variant = 'poster' }: PosterCardProps) {
  const imagePath = variant === 'poster' ? item.poster_path : item.backdrop_path
  const imageUrl = imagePath ? getImageUrl(imagePath, variant === 'poster' ? 'w342' : 'w780') : ''
  const [imageFailed, setImageFailed] = useState(false)
  const showPlaceholder = !imageUrl || imageFailed

  return (
    <button className={`card card--${variant}`} type="button" aria-label={item.title}>
      <div className="card__media">
        {showPlaceholder ? (
          <div className="card__placeholder" aria-hidden="true">
            {item.title}
          </div>
        ) : (
          <img
            className="card__img"
            src={imageUrl}
            alt={item.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
    </button>
  )
}
