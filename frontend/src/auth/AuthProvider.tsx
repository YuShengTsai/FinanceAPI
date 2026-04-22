import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { getStoredAuthSession } from '../services/authStorage'
import { login as loginRequest, logout as logoutRequest } from '../services/authService'
import type { LoginRequest, AuthSession } from '../types/auth'

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredAuthSession())

  async function login(request: LoginRequest) {
    const response = await loginRequest(request)
    setSession(response)
  }

  function logout() {
    logoutRequest()
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: Boolean(session?.accessToken),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
