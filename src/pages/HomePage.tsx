import { useEffect, useState } from 'react'
import { getMovieById, getHighResPosterUrl } from '../lib/omdb'
import type { OmdbMovieFull } from '../lib/omdb'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Row } from '../components/Row'
import '../styles/app.css'

const FEATURED_IMDB_ID = 'tt3896198'

const ROWS: { title: string; searchQuery: string; variant?: 'poster' | 'backdrop' }[] = [
  { title: 'Trending Now', searchQuery: 'avengers', variant: 'backdrop' },
  { title: 'Popular on VibeStream', searchQuery: 'marvel' },
  { title: 'Action', searchQuery: 'action' },
  { title: 'Comedy', searchQuery: 'comedy' },
  { title: 'Drama', searchQuery: 'drama' },
  { title: 'Horror', searchQuery: 'horror' },
  { title: 'Sci-Fi', searchQuery: 'sci-fi', variant: 'backdrop' }
]

export function HomePage() {
  const [hero, setHero] = useState<OmdbMovieFull | null>(null)
  const [heroLoading, setHeroLoading] = useState(true)
  const [heroError, setHeroError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadHero() {
      setHeroLoading(true)
      setHeroError(null)
      try {
        const full = await getMovieById(FEATURED_IMDB_ID)
        if (cancelled) return
        if (!full) throw new Error('Featured title not found')
        setHero(full)
      } catch (e) {
        if (cancelled) return
        setHeroError(e instanceof Error ? e.message : 'Failed to load hero')
      } finally {
        if (!cancelled) setHeroLoading(false)
      }
    }
    void loadHero()
    return () => { cancelled = true }
  }, [])

  const heroTitle = hero?.Title ?? ''
  const heroSubtitle = hero
    ? `${hero.Year ?? ''}${hero.Rated && hero.Rated !== 'N/A' ? ` • ${hero.Rated}` : ''}${hero.imdbRating ? ` • ${hero.imdbRating}/10` : ''}`
    : ''
  const heroPlot = hero?.Plot ?? ''
  const heroBackdropPosterUrl = getHighResPosterUrl(hero?.Poster)

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero
          loading={heroLoading}
          error={heroError}
          title={heroTitle}
          subtitle={heroSubtitle}
          plot={heroPlot}
          backdropPosterUrl={heroBackdropPosterUrl}
        />
        <section className="rows" aria-label="Movie rows">
          {ROWS.map((row) => (
            <Row
              key={row.title}
              title={row.title}
              searchQuery={row.searchQuery}
              variant={row.variant ?? 'poster'}
            />
          ))}
        </section>
      </main>
    </div>
  )
}
