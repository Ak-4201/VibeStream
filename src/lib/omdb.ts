export type OmdbMovieLite = {
  Title: string
  Year: string
  imdbID: string
  Type: 'movie' | 'series' | 'episode' | string
  Poster: string
}

export type OmdbMovieFull = OmdbMovieLite & {
  Plot?: string
  Rated?: string
  Runtime?: string
  Genre?: string
  Director?: string
  Actors?: string
  imdbRating?: string
  Response?: string
  Error?: string
}

type OmdbSearchResponse =
  | {
      Search: OmdbMovieLite[]
      totalResults: string
      Response: 'True'
    }
  | {
      Response: 'False'
      Error: string
    }

// In dev we use a Vite proxy to avoid CORS; in production use OMDb directly (HTTPS).
const OMDB_BASE_URL =
  import.meta.env.DEV ? '/api/omdb' : 'https://www.omdbapi.com/'
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY ?? 'e7dc754e'

function toUrl(params: Record<string, string>): string {
  const url = OMDB_BASE_URL.startsWith('http')
    ? new URL(OMDB_BASE_URL)
    : new URL(OMDB_BASE_URL, window.location.origin)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  url.searchParams.set('apikey', OMDB_API_KEY)
  return url.toString()
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return (await res.json()) as T
}

export async function searchMovies(query: string, page = 1, signal?: AbortSignal) {
  if (!query.trim()) return { items: [], total: 0 }

  const url = toUrl({
    s: query,
    page: String(page)
  })

  const data = await fetchJson<OmdbSearchResponse>(url, { signal })
  if (data.Response === 'False') return { items: [], total: 0, error: data.Error }
  return {
    items: data.Search ?? [],
    total: Number(data.totalResults ?? 0)
  }
}

export async function getMovieById(imdbID: string, signal?: AbortSignal) {
  const url = toUrl({
    i: imdbID,
    plot: 'full'
  })
  const data = await fetchJson<OmdbMovieFull>(url, { signal })
  if ((data as any).Response === 'False') return null
  return data
}

