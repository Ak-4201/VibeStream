import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { Row } from './Row'

function mockOmdbSearchResponse(
  items: { Title: string; Year: string; imdbID: string; Type: string; Poster: string }[]
) {
  return vi.fn(async () => ({
    ok: true,
    json: async () => ({
      Response: 'True',
      Search: items,
      totalResults: String(items.length)
    })
  }))
}

describe('Row', () => {
  it('fetches and renders movie cards from OMDB', async () => {
    const items = [
      {
        Title: 'Test Movie',
        Year: '2024',
        imdbID: 'tt123',
        Type: 'movie',
        Poster: 'https://example.com/poster.jpg'
      }
    ]
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(mockOmdbSearchResponse(items))
      .mockImplementationOnce(mockOmdbSearchResponse(items))

    vi.stubGlobal('fetch', fetchMock as any)

    render(
      <Row
        title="Trending Now"
        searchQuery="avengers"
      />
    )

    expect(await screen.findByRole('heading', { name: 'Trending Now' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'Test Movie' })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalled()
  })
})
