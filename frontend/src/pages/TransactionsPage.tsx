import { useState } from 'react'
import { useAccessibleAccounts } from '../hooks/useAccessibleAccounts'
import { SectionCard } from '../components/SectionCard'
import { getTransactions } from '../services/transactionService'
import type { Transaction } from '../types/banking'
import { formatTransactionType } from '../utils/transactionFormat'

export function TransactionsPage() {
  const { accounts, isLoading: isAccountsLoading, errorMessage: accountsErrorMessage } =
    useAccessibleAccounts()
  const [accountIdInput, setAccountIdInput] = useState('')
  const [type, setType] = useState('All')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const effectiveErrorMessage = errorMessage || accountsErrorMessage

  async function handleSearch() {
    const accountId = Number(accountIdInput)

    if (accountId <= 0) {
      setErrorMessage('請選擇帳戶。')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await getTransactions(accountId, type)
      setTransactions(response)
    } catch (error) {
      setTransactions([])
      setErrorMessage(error instanceof Error ? error.message : '查詢交易資料失敗。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="d-grid gap-4">
      <SectionCard title="交易明細查詢" description="可依帳戶與交易類型查詢交易列表。">
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">帳戶</label>
            <select
              className="form-select form-select-lg"
              value={accountIdInput}
              onChange={(event) => setAccountIdInput(event.target.value)}
              disabled={isAccountsLoading || accounts.length === 0}
            >
              <option value="">請選擇帳戶</option>
              {accounts.map((accountItem) => (
                <option key={accountItem.accountId} value={accountItem.accountId}>
                  {accountItem.accountNumber} | {accountItem.currency} | {accountItem.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">交易類型</label>
            <select
              className="form-select form-select-lg"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="All">全部</option>
              <option value="Deposit">存款</option>
              <option value="Withdraw">提款</option>
              <option value="Transfer">轉帳</option>
            </select>
          </div>

          <div className="col-12 col-lg-4 d-flex align-items-end">
            <button className="btn btn-primary btn-lg px-4" type="button" onClick={handleSearch}>
              {isLoading ? '查詢中...' : '查詢交易'}
            </button>
          </div>
        </div>
      </SectionCard>

      {effectiveErrorMessage ? (
        <section className="alert alert-danger shadow-sm mb-0" role="alert">
          <p className="mb-0">{effectiveErrorMessage}</p>
        </section>
      ) : null}

      <SectionCard title="交易結果">
        {transactions.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>交易編號</th>
                  <th>帳戶 ID</th>
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
                    <td>{transaction.accountId}</td>
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
          <p className="text-secondary mb-0">查詢後會在此顯示符合條件的交易列表。</p>
        )}
      </SectionCard>
    </main>
  )
}
