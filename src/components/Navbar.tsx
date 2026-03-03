import './navbar.css'

export function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__left">
          <div className="nav__logo" aria-label="VibeStream">
            VIBESTREAM
          </div>
          <nav className="nav__links" aria-label="Primary">
            <a className="nav__link nav__link--active" href="#">
              Home
            </a>
            <a className="nav__link" href="#">
              TV Shows
            </a>
            <a className="nav__link" href="#">
              Movies
            </a>
            <a className="nav__link" href="#">
              New &amp; Popular
            </a>
            <a className="nav__link" href="#">
              My List
            </a>
          </nav>
        </div>

        <div className="nav__right" aria-label="Actions">
          <button className="nav__iconBtn" type="button" aria-label="Search">
            <span aria-hidden="true">⌕</span>
          </button>
          <button className="nav__iconBtn" type="button" aria-label="Notifications">
            <span aria-hidden="true">⏷</span>
          </button>
          <div className="nav__avatar" aria-label="Profile">
            <span aria-hidden="true">K</span>
          </div>
        </div>
      </div>
    </header>
  )
}

