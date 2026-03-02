import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { Row } from './Row'

function mockTmdbResponse(items: { id: number; title: string; poster_path: string | null; backdrop_path: string | null; overview: string; release_date: string; vote_average: number }[]) {
  return vi.fn(async () => ({
    ok: true,
    json: async () => ({
      page: 1,
      results: items,
      total_pages: 1,
      total_results: items.length
    })
  }))
}

describe('Row', () => {
  it('fetches and renders movie cards from TMDB', async () => {
    const items = [
      {
        id: 123,
        title: 'Test Movie',
        poster_path: '/poster.jpg',
        backdrop_path: '/backdrop.jpg',
        overview: 'Test overview',
        release_date: '2024-01-01',
        vote_average: 8.5
      }
    ]
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(mockTmdbResponse(items))
      .mockImplementationOnce(mockTmdbResponse(items))

    vi.stubGlobal('fetch', fetchMock as any)

    render(
      <Row
        title="Trending Now"
        fetchConfig={{ type: 'trending', timeWindow: 'day' }}
      />
    )

    expect(await screen.findByRole('heading', { name: 'Trending Now' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Test Movie' })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalled()
  })
})
