const TMDB_API_KEY = '92cc3d6c3f10821c7d7377b3ef3efdab'
const TMDB_BASE = import.meta.env.DEV
  ? '/api/tmdb'
  : 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export type TmdbMovieLite = {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  release_date: string
  vote_average: number
  genre_ids?: number[]
}

export type TmdbMovieFull = TmdbMovieLite & {
  runtime?: number
  genres?: { id: number; name: string }[]
  tagline?: string
}

type DiscoverResponse = {
  page: number
  results: TmdbMovieLite[]
  total_pages: number
  total_results: number
}

type TrendingResponse = {
  page: number
  results: TmdbMovieLite[]
  total_pages: number
  total_results: number
}

export function getImageUrl(path: string | null, size: 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'): string {
  if (!path) return ''
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${IMAGE_BASE}/${size}${clean}`
}

function buildUrl(path: string, params: Record<string, string> = {}): string {
  const url = new URL(path.startsWith('http') ? path : `${TMDB_BASE}${path}`, window.location.origin)
  url.searchParams.set('api_key', TMDB_API_KEY)
  url.searchParams.set('language', 'en-US')
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') url.searchParams.set(k, v)
  }
  return url.toString()
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`TMDB HTTP ${res.status}`)
  const data = await res.json()
  if (data?.status_code && data.status_code !== 1) throw new Error(data.status_message || 'TMDB API error')
  return data as T
}

export async function discoverMovies(params: {
  sort_by?: string
  page?: number
  with_genres?: number
  primary_release_year?: number
  'vote_count.gte'?: number
  signal?: AbortSignal
}): Promise<{ items: TmdbMovieLite[]; total: number }> {
  const search = new URLSearchParams()
  search.set('sort_by', params.sort_by ?? 'popularity.desc')
  search.set('page', String(params.page ?? 1))
  if (params.with_genres) search.set('with_genres', String(params.with_genres))
  if (params.primary_release_year) search.set('primary_release_year', String(params.primary_release_year))
  if (params['vote_count.gte']) search.set('vote_count.gte', String(params['vote_count.gte']))

  const url = buildUrl('/discover/movie', Object.fromEntries(search))
  const data = await fetchJson<DiscoverResponse>(url, params.signal)
  return { items: data.results ?? [], total: data.total_results ?? 0 }
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'day', page = 1, signal?: AbortSignal): Promise<{ items: TmdbMovieLite[]; total: number }> {
  const url = buildUrl(`/trending/movie/${timeWindow}`, { page: String(page) })
  const data = await fetchJson<TrendingResponse>(url, signal)
  return { items: data.results ?? [], total: data.total_results ?? 0 }
}

export async function getTopRatedMovies(page = 1, signal?: AbortSignal): Promise<{ items: TmdbMovieLite[]; total: number }> {
  return discoverMovies({ sort_by: 'vote_average.desc', page, 'vote_count.gte': 1000, signal })
}

export async function getMovieDetails(id: number, signal?: AbortSignal): Promise<TmdbMovieFull | null> {
  try {
    const url = buildUrl(`/movie/${id}`)
    return await fetchJson<TmdbMovieFull>(url, signal)
  } catch {
    return null
  }
}
