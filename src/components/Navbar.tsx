import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './navbar.css'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__left">
          <Link to="/" className="nav__logo" aria-label="VibeStream">
            VIBESTREAM
          </Link>
          <nav className="nav__links" aria-label="Primary">
            <Link to="/" className="nav__link nav__link--active">Home</Link>
            <a className="nav__link" href="#">TV Shows</a>
            <a className="nav__link" href="#">Movies</a>
            <a className="nav__link" href="#">New &amp; Popular</a>
            <a className="nav__link" href="#">My List</a>
          </nav>
        </div>

        <div className="nav__right" aria-label="Actions">
          {user ? (
            <>
              <span className="nav__user" title={user.email}>
                {user.username}
              </span>
              <div className="nav__avatar" aria-label="Profile" title={user.email}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <button
                type="button"
                className="nav__iconBtn nav__iconBtn--text"
                onClick={handleLogout}
                aria-label="Sign out"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav__authLink">Sign In</Link>
              <Link to="/signup" className="nav__authLink nav__authLink--primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
