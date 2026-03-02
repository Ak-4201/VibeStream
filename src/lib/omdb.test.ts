import { describe, expect, it, vi } from 'vitest'
import { searchMovies } from './omdb'

describe('omdb', () => {
  it('calls OMDb search and returns parsed items', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        Response: 'True',
        Search: [{ Title: 'X', Year: '2020', imdbID: 'tt1', Type: 'movie', Poster: 'https://img.test/x.jpg' }],
        totalResults: '1'
      })
    }))

    vi.stubGlobal('fetch', fetchMock as any)

    const res = await searchMovies('x', 1)
    expect(res.items).toHaveLength(1)
    expect(res.items[0]?.imdbID).toBe('tt1')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

