import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionCard } from '../components/SectionCard'
import { getBalance, getAccountTransactions } from '../services/accountService'
import type { BalanceResponse, Transaction } from '../types/banking'

const DEFAULT_DASHBOARD_ACCOUNT_ID = 1

export function HomePage() {
  const [balance, setBalance] = useState<BalanceResponse | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const [balanceResponse, transactionsResponse] = await Promise.all([
          getBalance(DEFAULT_DASHBOARD_ACCOUNT_ID),
          getAccountTransactions(DEFAULT_DASHBOARD_ACCOUNT_ID),
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
        setErrorMessage(error instanceof Error ? error.message : '首頁資料載入失敗。')
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="d-grid gap-4">
      <section className="hero-banner rounded-4 p-4 p-lg-5 text-white shadow">
        <p className="app-eyebrow text-warning-emphasis mb-2">Secure Banking Access</p>
        <h2 className="display-6 fw-bold mb-3">快速完成日常金融操作</h2>
        <p className="mb-4 hero-copy">
          這裡是 Finance ATM 的前台入口。使用者可在單一介面中完成帳戶查詢、存提款、轉帳與紀錄查詢，
          並透過一致的流程確認處理結果。
        </p>

        <div className="d-flex flex-wrap gap-3">
          <Link className="btn btn-warning fw-semibold px-4 py-2" to="/accounts">
            前往帳戶服務
          </Link>
          <Link className="btn btn-outline-light px-4 py-2" to="/transfer">
            立即轉帳
          </Link>
        </div>
      </section>

      {errorMessage ? (
        <section className="alert alert-warning shadow-sm mb-0" role="alert">
          <strong className="d-block mb-1">首頁資料載入提醒</strong>
          <span>{errorMessage}</span>
        </section>
      ) : null}

      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <SectionCard
            title="常用服務"
            description="依照實際操作頻率整理主要入口，避免首頁只剩導覽功能。"
          >
            <div className="row g-3">
              <div className="col-12 col-sm-6">
                <div className="service-tile h-100 rounded-4 border p-3">
                  <p className="service-kicker">Service 01</p>
                  <h3 className="h5 mb-2">帳戶查詢</h3>
                  <p className="text-secondary mb-3">查詢帳戶資訊、目前餘額與交易明細。</p>
                  <Link className="btn btn-sm btn-outline-primary" to="/accounts">
                    立即使用
                  </Link>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="service-tile h-100 rounded-4 border p-3">
                  <p className="service-kicker">Service 02</p>
                  <h3 className="h5 mb-2">存款與提款</h3>
                  <p className="text-secondary mb-3">在同一頁完成金額輸入與交易結果確認。</p>
                  <Link className="btn btn-sm btn-outline-primary" to="/accounts">
                    立即使用
                  </Link>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="service-tile h-100 rounded-4 border p-3">
                  <p className="service-kicker">Service 03</p>
                  <h3 className="h5 mb-2">轉帳作業</h3>
                  <p className="text-secondary mb-3">支援帳戶間轉帳，並即時顯示處理結果。</p>
                  <Link className="btn btn-sm btn-primary" to="/transfer">
                    立即使用
                  </Link>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <div className="service-tile h-100 rounded-4 border p-3">
                  <p className="service-kicker">Service 04</p>
                  <h3 className="h5 mb-2">紀錄查詢</h3>
                  <p className="text-secondary mb-3">依條件查詢交易列表與轉帳紀錄。</p>
                  <div className="d-flex gap-2 flex-wrap">
                    <Link className="btn btn-sm btn-outline-primary" to="/transactions">
                      交易查詢
                    </Link>
                    <Link className="btn btn-sm btn-outline-primary" to="/transfers">
                      轉帳紀錄
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="col-12 col-xl-5">
          <SectionCard
            title="我的帳戶摘要"
            description={`預設顯示帳戶 ID ${DEFAULT_DASHBOARD_ACCOUNT_ID} 的摘要資料，可作為首頁 dashboard 範例。`}
          >
            {isLoading ? (
              <div className="py-3 text-secondary">載入中...</div>
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
                      <p className="text-secondary mb-0">目前可進行查詢、存提款與轉帳作業。</p>
                    </div>
                    <span className="badge text-bg-success">Online</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-secondary mb-0">目前無法載入帳戶摘要。</p>
            )}
          </SectionCard>
        </div>
      </div>

      <SectionCard title="最近交易" description="顯示預設帳戶最近 5 筆交易，讓首頁更接近實際 dashboard。">
        {isLoading ? (
          <div className="py-3 text-secondary">載入中...</div>
        ) : transactions.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transactionId}>
                    <td>{transaction.transactionId}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.amount.toLocaleString()}</td>
                    <td>{transaction.status}</td>
                    <td>{new Date(transaction.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-secondary mb-0">目前沒有可顯示的交易資料。</p>
        )}
      </SectionCard>
    </main>
  )
}
