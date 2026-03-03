import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { UserResponse } from '../lib/authApi'
import { getToken, setStoredToken, me as fetchMe } from '../lib/authApi'

type AuthContextValue = {
  user: UserResponse | null
  loading: boolean
  loginSuccess: (token: string, user: UserResponse) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const u = await fetchMe()
      setUser(u)
    } catch {
      setStoredToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const loginSuccess = useCallback((token: string, u: UserResponse) => {
    setStoredToken(token)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    setStoredToken(null)
    setUser(null)
  }, [])

  const value: AuthContextValue = { user, loading, loginSuccess, logout, refreshUser }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
