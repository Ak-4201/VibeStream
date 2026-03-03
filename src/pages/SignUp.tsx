import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthBackground } from '../components/AuthBackground'
import { useAuth } from '../context/AuthContext'
import { signUp } from '../lib/authApi'
import './auth.css'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD = 8

export function SignUp() {
  const navigate = useNavigate()
  const { loginSuccess } = useAuth()
  const [userId, setUserId] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: Record<string, string> = {}
    if (!userId.trim()) next.userId = 'User ID is required.'
    if (!username.trim()) next.username = 'User name is required.'
    if (!email.trim()) next.email = 'Email is required.'
    else if (!EMAIL_REGEX.test(email)) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Password is required.'
    else if (password.length < MIN_PASSWORD) next.password = `Password must be at least ${MIN_PASSWORD} characters.`
    if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setErrors({})
    try {
      const res = await signUp({
        userId: userId.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phoneNumber.trim() || undefined,
        password,
        confirmPassword
      })
      loginSuccess(res.token, res.user)
      navigate('/', { replace: true })
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Sign up failed.' })
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
      <div className="auth-card auth-card--wide">
        <h1 className="auth-title">Sign Up</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          {errors.form && <div className="auth-error" role="alert">{errors.form}</div>}
          <input
            type="text"
            className="auth-input"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            autoComplete="username"
          />
          {errors.userId && <span className="auth-field-error">{errors.userId}</span>}
          <input
            type="text"
            className="auth-input"
            placeholder="User name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="name"
          />
          {errors.username && <span className="auth-field-error">{errors.username}</span>}
          <input
            type="email"
            className="auth-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {errors.email && <span className="auth-field-error">{errors.email}</span>}
          <input
            type="tel"
            className="auth-input"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            autoComplete="tel"
          />
          <input
            type="password"
            className="auth-input"
            placeholder="Create password (min 8 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {errors.password && <span className="auth-field-error">{errors.password}</span>}
          <input
            type="password"
            className="auth-input"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign Up'}
          </button>
          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Sign in.</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
