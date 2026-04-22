import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { SectionCard } from '../components/SectionCard'
import { useAccessibleAccounts } from '../hooks/useAccessibleAccounts'
import { getAccountTransactions, getBalance } from '../services/accountService'
import type { BalanceResponse, Transaction } from '../types/banking'
import { formatTransactionType } from '../utils/transactionFormat'

export function HomePage() {
  const { isAuthenticated, session } = useAuth()
  const {
    accounts,
    isLoading: isAccountsLoading,
    errorMessage: accountsErrorMessage,
  } = useAccessibleAccounts()

  const [balance, setBalance] = useState<BalanceResponse | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [dashboardErrorMessage, setDashboardErrorMessage] = useState('')
  const [isDashboardLoading, setIsDashboardLoading] = useState(false)

  const dashboardAccount = useMemo(() => accounts[0] ?? null, [accounts])
  const effectiveErrorMessage = dashboardErrorMessage || accountsErrorMessage
  const isAdmin = session?.role === 'Admin'

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      if (!isAuthenticated) {
        setBalance(null)
        setTransactions([])
        setDashboardErrorMessage('')
        setIsDashboardLoading(false)
        return
      }

      if (isAccountsLoading) {
        setIsDashboardLoading(true)
        return
      }

      if (!dashboardAccount) {
        setBalance(null)
        setTransactions([])
        setDashboardErrorMessage('')
        setIsDashboardLoading(false)
        return
      }

      setIsDashboardLoading(true)
      setDashboardErrorMessage('')

      try {
        const [balanceResponse, transactionsResponse] = await Promise.all([
          getBalance(dashboardAccount.accountId),
          getAccountTransactions(dashboardAccount.accountId),
        ])

        if (cancelled) {
          return
        }

        setBalance(balanceResponse)
        setTransactions(transactionsResponse.slice(0, 5))
      } catch (error) {
        if (cancelled) {
          return
        }

        setBalance(null)
        setTransactions([])
        setDashboardErrorMessage(error instanceof Error ? error.message : '首頁資料載入失敗。')
      } finally {
        if (!cancelled) {
          setIsDashboardLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [dashboardAccount, isAccountsLoading, isAuthenticated])

  return (
    <main className="d-grid gap-4">
      <section className="hero-banner rounded-4 p-4 p-lg-5 text-white shadow">
        <p className="app-eyebrow text-warning-emphasis mb-2">Secure Banking Access</p>
        <h2 className="display-6 fw-bold mb-3">金融服務操作入口</h2>
        <p className="mb-4 hero-copy">
          這個首頁整合帳戶查詢、餘額檢視、交易查詢與轉帳操作，讓你可以用單一入口快速操作 Finance API。
        </p>

        <div className="d-flex flex-wrap gap-3">
          {isAuthenticated ? (
            <>
              <Link className="btn btn-warning fw-semibold px-4 py-2" to="/accounts">
                前往帳戶查詢
              </Link>
              <Link className="btn btn-outline-light px-4 py-2" to="/transfer">
                前往轉帳
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-warning fw-semibold px-4 py-2" to="/login">
                前往登入
              </Link>
              <span className="align-self-center text-light-emphasis">登入後即可使用個人帳戶相關功能。</span>
            </>
          )}
        </div>
      </section>

      {effectiveErrorMessage ? (
        <section className="alert alert-warning shadow-sm mb-0" role="alert">
          <strong className="d-block mb-1">首頁資料載入失敗</strong>
          <span>{effectiveErrorMessage}</span>
        </section>
      ) : null}

      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <SectionCard
            title="功能總覽"
            description="提供帳戶查詢、餘額檢視、交易查詢與轉帳操作入口，依登入權限顯示可用功能。"
          >
            {isAuthenticated && session ? (
              <div className="alert alert-light border mb-4" role="alert">
                目前登入身份：{session.displayName}（{session.role}）
              </div>
            ) : (
              <div className="alert alert-warning mb-4" role="alert">
                尚未登入。登入後可使用帳戶、交易與轉帳等功能。
              </div>
            )}

            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <div className="service-tile h-100 rounded-4 border p-3">
                  <p className="service-kicker">Service 01</p>
                  <h3 className="h5 mb-2">帳戶查詢</h3>
                  <p className="text-secondary mb-3">查看可存取帳戶、帳號資訊與目前餘額。</p>
                  <Link className="btn btn-sm btn-outline-primary" to={isAuthenticated ? '/accounts' : '/login'}>
                    前往功能
                  </Link>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="service-tile h-100 rounded-4 border p-3">
                  <p className="service-kicker">Service 02</p>
                  <h3 className="h5 mb-2">交易查詢</h3>
                  <p className="text-secondary mb-3">依帳戶與交易類型查詢交易明細。</p>
                  <Link
                    className="btn btn-sm btn-outline-primary"
                    to={isAuthenticated ? '/transactions' : '/login'}
                  >
                    前往功能
                  </Link>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="service-tile h-100 rounded-4 border p-3">
                  <p className="service-kicker">Service 03</p>
                  <h3 className="h5 mb-2">轉帳作業</h3>
                  <p className="text-secondary mb-3">從本人可操作帳戶發起轉帳，輸入目標帳戶與金額完成交易。</p>
                  <Link className="btn btn-sm btn-primary" to={isAuthenticated ? '/transfer' : '/login'}>
                    前往功能
                  </Link>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="service-tile h-100 rounded-4 border p-3">
                  <p className="service-kicker">Service 04</p>
                  <h3 className="h5 mb-2">管理查詢</h3>
                  <p className="text-secondary mb-3">管理者可查詢全站轉帳紀錄，一般使用者不顯示此功能。</p>
                  {isAuthenticated && isAdmin ? (
                    <Link className="btn btn-sm btn-outline-primary" to="/transfers">
                      轉帳紀錄
                    </Link>
                  ) : (
                    <span className="text-secondary small">此功能僅限管理者使用。</span>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="col-12 col-xl-5">
          <SectionCard
            title="帳戶摘要"
            description={
              dashboardAccount
                ? `目前顯示帳戶 ${dashboardAccount.accountNumber} 的餘額資訊。`
                : '登入後會依你的權限自動載入可用帳戶摘要。'
            }
          >
            {!isAuthenticated ? (
              <p className="text-secondary mb-0">登入後即可查看個人帳戶餘額與最近交易摘要。</p>
            ) : isAccountsLoading || isDashboardLoading ? (
              <div className="py-3 text-secondary">資料載入中...</div>
            ) : balance ? (
              <div className="d-grid gap-3">
                <div className="border rounded-4 p-3">
                  <p className="service-kicker mb-1">Current Balance</p>
                  <p className="display-6 fw-bold mb-1">
                    {balance.currency} {balance.balance.toLocaleString()}
                  </p>
                  <p className="text-secondary mb-0">{balance.accountNumber}</p>
                </div>

                <div className="border rounded-4 p-3">
                  <p className="service-kicker mb-1">System Status</p>
                  <div className="d-flex justify-content-between align-items-center gap-3">
                    <div>
                      <h3 className="h5 mb-1">交易服務正常</h3>
                      <p className="text-secondary mb-0">目前可正常執行帳戶查詢、交易查詢與轉帳作業。</p>
                    </div>
                    <span className="badge text-bg-success">Online</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary mb-0">目前沒有可顯示的帳戶摘要。</p>
            )}
          </SectionCard>
        </div>
      </div>

      <SectionCard title="最近交易" description="顯示目前摘要帳戶最近 5 筆交易資料。">
        {!isAuthenticated ? (
          <p className="text-secondary mb-0">登入後即可查看最近交易紀錄。</p>
        ) : isAccountsLoading || isDashboardLoading ? (
          <div className="py-3 text-secondary">資料載入中...</div>
        ) : transactions.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>交易編號</th>
                  <th>交易類型</th>
                  <th>金額</th>
                  <th>狀態</th>
                  <th>建立時間</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transactionId}>
                    <td>{transaction.transactionId}</td>
                    <td>{formatTransactionType(transaction.type)}</td>
                    <td>{transaction.amount.toLocaleString()}</td>
                    <td>{transaction.status}</td>
                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-secondary mb-0">目前沒有最近交易資料。</p>
        )}
      </SectionCard>
    </main>
  )
}
