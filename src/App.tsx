import { useEffect, useState } from 'react'
import type { TmdbMovieLite } from './lib/tmdb'
import { discoverMovies, getImageUrl, getMovieDetails } from './lib/tmdb'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Row } from './components/Row'
import type { RowFetchType } from './components/Row'
import './styles/app.css'

type RowConfig = {
  title: string
  fetchConfig: RowFetchType
  variant?: 'poster' | 'backdrop'
}

const ROWS: RowConfig[] = [
  { title: 'Trending Now', fetchConfig: { type: 'trending', timeWindow: 'day' }, variant: 'backdrop' },
  { title: 'Popular on Kodflix', fetchConfig: { type: 'discover', sortBy: 'popularity.desc' } },
  { title: 'Top Rated', fetchConfig: { type: 'discover', sortBy: 'vote_average.desc', voteCountGte: 1000 } },
  { title: 'Action Movies', fetchConfig: { type: 'discover', sortBy: 'popularity.desc', withGenres: 28 } },
  { title: 'Comedy', fetchConfig: { type: 'discover', sortBy: 'popularity.desc', withGenres: 35 } },
  { title: 'Drama', fetchConfig: { type: 'discover', sortBy: 'popularity.desc', withGenres: 18 } },
  { title: 'Horror', fetchConfig: { type: 'discover', sortBy: 'popularity.desc', withGenres: 27 } },
  { title: 'New Releases', fetchConfig: { type: 'discover', sortBy: 'primary_release_date.desc', year: new Date().getFullYear() }, variant: 'backdrop' }
]

export default function App() {
  const [hero, setHero] = useState<TmdbMovieLite | null>(null)
  const [heroPlot, setHeroPlot] = useState<string | null>(null)
  const [heroLoading, setHeroLoading] = useState(true)
  const [heroError, setHeroError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadHero() {
      setHeroLoading(true)
      setHeroError(null)
      try {
        const { items } = await discoverMovies({ sort_by: 'popularity.desc', page: 1 })
        const pick = items.find((m) => m.backdrop_path) ?? items[0]
        if (!pick) throw new Error(items.length === 0 ? 'No results' : 'No backdrop for featured title')

        const full = await getMovieDetails(pick.id)
        if (cancelled) return
        setHero(pick)
        setHeroPlot(full?.overview ?? pick.overview ?? null)
      } catch (e) {
        if (cancelled) return
        setHeroError(e instanceof Error ? e.message : 'Failed to load hero')
      } finally {
        if (!cancelled) setHeroLoading(false)
      }
    }
    void loadHero()
    return () => {
      cancelled = true
    }
  }, [])

  const heroTitle = hero?.title ?? ''
  const heroSubtitle = hero
    ? `${new Date(hero.release_date).getFullYear()}${hero.vote_average ? ` • ${Math.round(hero.vote_average * 10)}% Match` : ''}`
    : ''
  const heroBackdrop = hero?.backdrop_path ? getImageUrl(hero.backdrop_path, 'w1280') : ''

  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero
          loading={heroLoading}
          error={heroError}
          title={heroTitle}
          subtitle={heroSubtitle}
          plot={heroPlot ?? ''}
          backdropPosterUrl={heroBackdrop}
        />

        <section className="rows" aria-label="Movie rows">
          {ROWS.map((row) => (
            <Row
              key={row.title}
              title={row.title}
              fetchConfig={row.fetchConfig}
              variant={row.variant ?? 'poster'}
            />
          ))}
        </section>
      </main>
    </div>
  )
}
