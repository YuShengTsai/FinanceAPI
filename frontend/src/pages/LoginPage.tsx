import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { SectionCard } from '../components/SectionCard'

export function LoginPage() {
  const { login, isAuthenticated, session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = (location.state as { from?: string } | null)?.from || '/'

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login({
        username,
        password,
      })

      navigate(redirectTo, { replace: true })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '登入失敗，請稍後再試。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="row justify-content-center">
      <div className="col-12 col-lg-6 col-xl-5">
        <SectionCard
          title="登入"
          description="請輸入帳號密碼以使用帳戶、交易與轉帳相關功能。"
        >
          {isAuthenticated && session ? (
            <div className="alert alert-success mb-4" role="alert">
              目前已登入為 {session.displayName}。
            </div>
          ) : null}

          {errorMessage ? (
            <div className="alert alert-danger mb-4" role="alert">
              {errorMessage}
            </div>
          ) : null}

          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-12">
              <label className="form-label fw-semibold">使用者名稱</label>
              <input
                className="form-control form-control-lg"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="請輸入使用者名稱"
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">密碼</label>
              <input
                className="form-control form-control-lg"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="請輸入密碼"
              />
            </div>

            <div className="col-12 d-flex justify-content-between align-items-center gap-3 flex-wrap">
              <small className="text-secondary">請輸入 Users 資料表中的帳號與密碼。</small>
              <button className="btn btn-primary btn-lg px-4" type="submit" disabled={isSubmitting}>
                {isSubmitting ? '登入中...' : '登入'}
              </button>
            </div>
          </form>
        </SectionCard>
      </div>
    </main>
  )
}
