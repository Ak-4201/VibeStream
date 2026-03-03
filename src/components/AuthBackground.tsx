import './AuthBackground.css'

const POSTER_URLS = [
  'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGc@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BMTM4OGJmNWMtOTM4Ni00NTRjLWEwNTgtYjk5MCkyMGExYmVhXkEyXkFqcGc@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BYTYxNGNiZGMtMjVjNS00NjJiLTkxOTUtMjQzODMxNjM0MmIyXkEyXkFqcGc@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BMTkzNjEzMDEzMF5BMl5BanBnXkFtZTgwMDI0MjE4MjE@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGc@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BODk4ZjU0NDUtYjdlOS00OTljLTgwZTUtYjljZDI0M2U1NGZjXkEyXkFqcGc@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGc@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BMTM3NjA5NDc3Ml5BMl5BanBnXkFtZTcwODk2OTE4Mg@@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BMTk4ODQ5NDY3Ml5BMl5BanBnXkFtZTcwODA5NTcyMw@@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkODNjYzkzXkEyXkFqcGc@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BZjU5OWVlN2EtODNlYS00NDdiLThlODEtZTMwMzM0NzNiZTEyXkEyXkFqcGc@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BMTk2MDMzMTc0MF5BMl5BanBnXkFtZTgwMTA5MzU1MDI@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2OTQzMjM@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BNjE5MzY3MzktMTNgNi00YjA1LTk0NTUtNjg2YmY4NjE2NDMxXkEyXkFqcGc@._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BMTY4NjQ5NDc0Nl5BMl5BanBnXkFtZTYwNjk4NDM3._V1_SX300.jpg',
  'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg'
]

export function AuthBackground() {
  return (
    <div className="auth-bg" aria-hidden="true">
      <div className="auth-bg__grid">
        {POSTER_URLS.map((src, i) => (
          <div key={i} className="auth-bg__poster">
            <img src={src} alt="" loading="eager" />
          </div>
        ))}
      </div>
      <div className="auth-bg__overlay" />
    </div>
  )
}
