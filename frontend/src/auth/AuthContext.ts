import { createContext } from 'react'
import type { LoginRequest, AuthSession } from '../types/auth'

export type AuthContextValue = {
  session: AuthSession | null
  isAuthenticated: boolean
  login: (request: LoginRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
