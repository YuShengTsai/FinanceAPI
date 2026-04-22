import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import { useAuth } from './auth/useAuth'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AccountsPage } from './pages/AccountsPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { TransferPage } from './pages/TransferPage'
import { TransfersPage } from './pages/TransfersPage'

function App() {
  const { isAuthenticated, logout, session } = useAuth()
  const isAdmin = session?.role === 'Admin'

  return (
    <div className="app-shell container py-4 py-lg-5">
      <header className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4 mb-4">
        <div className="mw-100">
          <p className="app-eyebrow mb-2">Finance ATM</p>
          <h1 className="display-5 fw-bold mb-3">Digital Banking Portal</h1>
          <p className="lead text-secondary mb-0 app-subtitle">
            整合帳戶、交易、轉帳與登入驗證的金融服務前台，串接 Finance API 提供即時資料操作。
          </p>
          {isAuthenticated && session ? (
            <p className="mt-2 mb-0 text-secondary">
              目前登入者：{session.displayName}（{session.role}）
            </p>
          ) : null}
        </div>

        <nav className="d-flex flex-wrap gap-2" aria-label="Main navigation">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'btn btn-primary rounded-pill px-4' : 'btn btn-outline-dark rounded-pill px-4'
            }
          >
            首頁
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink
                to="/accounts"
                className={({ isActive }) =>
                  isActive ? 'btn btn-primary rounded-pill px-4' : 'btn btn-outline-dark rounded-pill px-4'
                }
              >
                帳戶查詢
              </NavLink>
              <NavLink
                to="/transfer"
                className={({ isActive }) =>
                  isActive ? 'btn btn-primary rounded-pill px-4' : 'btn btn-outline-dark rounded-pill px-4'
                }
              >
                轉帳作業
              </NavLink>
              <NavLink
                to="/transactions"
                className={({ isActive }) =>
                  isActive ? 'btn btn-primary rounded-pill px-4' : 'btn btn-outline-dark rounded-pill px-4'
                }
              >
                交易查詢
              </NavLink>
              {isAdmin ? (
                <NavLink
                  to="/transfers"
                  className={({ isActive }) =>
                    isActive ? 'btn btn-primary rounded-pill px-4' : 'btn btn-outline-dark rounded-pill px-4'
                  }
                >
                  轉帳紀錄
                </NavLink>
              ) : null}
              <button className="btn btn-outline-danger rounded-pill px-4" type="button" onClick={logout}>
                登出
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? 'btn btn-primary rounded-pill px-4' : 'btn btn-outline-dark rounded-pill px-4'
              }
            >
              登入
            </NavLink>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/transfer" element={<TransferPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/transfers" element={<TransfersPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
