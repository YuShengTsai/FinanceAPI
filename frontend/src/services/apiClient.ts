const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5097'

type ApiErrorPayload = {
  message?: string
  resultMessage?: string
  title?: string
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? ((await response.json()) as T | ApiErrorPayload) : null

  if (!response.ok) {
    const errorPayload = data as ApiErrorPayload | null
    const message =
      errorPayload?.message ??
      errorPayload?.resultMessage ??
      errorPayload?.title ??
      `Request failed with status ${response.status}`

    throw new Error(message)
  }

  return data as T
}
