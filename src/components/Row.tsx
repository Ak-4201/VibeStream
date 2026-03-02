import { useEffect, useRef, useState } from 'react'
import type { TmdbMovieLite } from '../lib/tmdb'
import { discoverMovies, getTrendingMovies } from '../lib/tmdb'
import { PosterCard } from './PosterCard'
import './row.css'

export type RowFetchType =
  | { type: 'trending'; timeWindow?: 'day' | 'week' }
  | { type: 'discover'; sortBy?: string; withGenres?: number; year?: number; voteCountGte?: number }

type RowProps = {
  title: string
  fetchConfig: RowFetchType
  variant?: 'poster' | 'backdrop'
}

export function Row({ title, fetchConfig, variant = 'poster' }: RowProps) {
  const [items, setItems] = useState<TmdbMovieLite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setLoading(true)
      setError(null)
      try {
        if (fetchConfig.type === 'trending') {
          const [p1, p2] = await Promise.all([
            getTrendingMovies(fetchConfig.timeWindow ?? 'day', 1, controller.signal),
            getTrendingMovies(fetchConfig.timeWindow ?? 'day', 2, controller.signal)
          ])
          const merged = [...(p1.items ?? []), ...(p2.items ?? [])]
          const byId = new Map<number, TmdbMovieLite>()
          for (const m of merged) byId.set(m.id, m)
          setItems(Array.from(byId.values()).slice(0, 18))
        } else {
          const [p1, p2] = await Promise.all([
            discoverMovies({
              sort_by: fetchConfig.sortBy ?? 'popularity.desc',
              page: 1,
              with_genres: fetchConfig.withGenres,
              primary_release_year: fetchConfig.year,
              'vote_count.gte': fetchConfig.voteCountGte,
              signal: controller.signal
            }),
            discoverMovies({
              sort_by: fetchConfig.sortBy ?? 'popularity.desc',
              page: 2,
              with_genres: fetchConfig.withGenres,
              primary_release_year: fetchConfig.year,
              'vote_count.gte': fetchConfig.voteCountGte,
              signal: controller.signal
            })
          ])
          const merged = [...(p1.items ?? []), ...(p2.items ?? [])]
          const byId = new Map<number, TmdbMovieLite>()
          for (const m of merged) byId.set(m.id, m)
          setItems(Array.from(byId.values()).slice(0, 18))
        }
      } catch (e) {
        if (controller.signal.aborted) return
        setError(e instanceof Error ? e.message : 'Failed to load row')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => controller.abort()
  }, [fetchConfig])

  function scrollByCards(direction: -1 | 1) {
    const el = scrollerRef.current
    if (!el) return
    const amount = Math.round(el.clientWidth * 0.9)
    el.scrollBy({ left: amount * direction, behavior: 'smooth' })
  }

  return (
    <div className="row" aria-label={title}>
      <div className="row__top">
        <h2 className="row__title">{title}</h2>
        <div className="row__controls">
          <button className="row__arrow" type="button" aria-label={`Scroll ${title} left`} onClick={() => scrollByCards(-1)}>
            ‹
          </button>
          <button className="row__arrow" type="button" aria-label={`Scroll ${title} right`} onClick={() => scrollByCards(1)}>
            ›
          </button>
        </div>
      </div>

      {loading ? (
        <div className="row__skeleton" aria-label={`Loading ${title}`}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`row__sk row__sk--${variant}`} />
          ))}
        </div>
      ) : error ? (
        <div className="row__error" role="alert">
          Failed to load &ldquo;{title}&rdquo;: {error}
        </div>
      ) : (
        <div className="row__scroller" ref={scrollerRef}>
          {items.map((it) => (
            <PosterCard key={it.id} item={it} variant={variant} />
          ))}
        </div>
      )}
    </div>
  )
}
