import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthBackground } from '../components/AuthBackground'
import { useAuth } from '../context/AuthContext'
import { login } from '../lib/authApi'
import './auth.css'

export function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const { loginSuccess } = useAuth()
  const fromSignUp = (location.state as { fromSignUp?: boolean } | null)?.fromSignUp ?? false
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!usernameOrEmail.trim()) {
      setError('Enter your username or email.')
      return
    }
    if (!password) {
      setError('Enter your password.')
      return
    }
    setSubmitting(true)
    try {
      const res = await login({ usernameOrEmail: usernameOrEmail.trim(), password })
      loginSuccess(res.token, res.user)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <AuthBackground />
      <header className="auth-header">
        <Link to="/" className="auth-logo">VIBESTREAM</Link>
      </header>
      <div className="auth-card">
        <h1 className="auth-title">Sign In</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          {fromSignUp && <div className="auth-success" role="status">Account created. Please sign in.</div>}
          {error && <div className="auth-error" role="alert">{error}</div>}
          <input
            type="text"
            className="auth-input"
            placeholder="Username or email"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            autoComplete="username"
            autoFocus
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
          <p className="auth-footer">
            New to VibeStream? <Link to="/signup" className="auth-link">Sign up now.</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
