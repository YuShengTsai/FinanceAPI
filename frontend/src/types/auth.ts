export type LoginRequest = {
  username: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  expiresAt: string
  username: string
  displayName: string
  role: string
}

export type AuthSession = LoginResponse
