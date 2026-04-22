import { requestJson } from './apiClient'
import { clearStoredAuthSession, setStoredAuthSession } from './authStorage'
import type { AuthSession, LoginRequest, LoginResponse } from '../types/auth'

export async function login(request: LoginRequest): Promise<AuthSession> {
  const response = await requestJson<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  })

  setStoredAuthSession(response)
  return response
}

export function logout() {
  clearStoredAuthSession()
}
