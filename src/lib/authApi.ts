// In dev, use relative URL so Vite proxy forwards to backend (avoids CORS / "Failed to fetch")
const AUTH_API_BASE =
  import.meta.env.VITE_AUTH_API_URL ||
  (import.meta.env.DEV ? '' : 'http://localhost:8080')

export type SignUpPayload = {
  userId: string
  username: string
  email: string
  phoneNumber?: string
  password: string
  confirmPassword: string
}

export type LoginPayload = {
  usernameOrEmail: string
  password: string
}

export type UserResponse = {
  id: number
  userId: string
  username: string
  email: string
  phoneNumber: string | null
  role: string
  createdAt: string
}

export type AuthResponse = {
  token: string
  type: string
  user: UserResponse
}

function getToken(): string | null {
  return localStorage.getItem('vibestream_token')
}

function authHeaders(): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

function handleAuthError(e: unknown, fallback: string): never {
  const msg = e instanceof Error ? e.message : ''
  if (e instanceof TypeError || msg.includes('fetch') || msg.includes('Network')) {
    throw new Error('Cannot reach server. Make sure the backend is running on port 8080.')
  }
  throw e instanceof Error ? e : new Error(fallback)
}

export async function signUp(payload: SignUpPayload): Promise<AuthResponse> {
  const url = `${AUTH_API_BASE}/api/auth/signup`
  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    handleAuthError(e, 'Sign up failed.')
  }
  const data = await res!.json().catch(() => ({}))
  if (!res!.ok) {
    const msg =
      (data.error ?? data.message ?? Object.values(data).flat().join(' ')) ||
      (res!.status === 500
        ? 'Sign up failed. Ensure the backend is running and, if using Aiven, the database is reachable.'
        : `Sign up failed (${res!.status})`)
    throw new Error(typeof msg === 'string' ? msg : msg[0] ?? 'Sign up failed')
  }
  return data as AuthResponse
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const url = `${AUTH_API_BASE}/api/auth/login`
  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    handleAuthError(e, 'Sign in failed.')
  }
  const data = await res!.json().catch(() => ({}))
  if (!res!.ok) {
    const msg = data.error ?? data.message ?? `Invalid username or password`
    throw new Error(typeof msg === 'string' ? msg : 'Invalid username or password')
  }
  return data as AuthResponse
}

export async function me(): Promise<UserResponse> {
  const url = `${AUTH_API_BASE}/api/auth/me`
  const res = await fetch(url, {
    headers: authHeaders()
  })
  if (res.status === 401) throw new Error('Unauthorized')
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? 'Failed to load user')
  return data as UserResponse
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem('vibestream_token', token)
  else localStorage.removeItem('vibestream_token')
}

export { getToken }
