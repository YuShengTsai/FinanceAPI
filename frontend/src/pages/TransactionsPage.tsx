import { useState } from 'react'
import { SectionCard } from '../components/SectionCard'
import { getTransactions } from '../services/transactionService'
import type { Transaction } from '../types/banking'

export function TransactionsPage() {
  const [accountIdInput, setAccountIdInput] = useState('1')
  const [type, setType] = useState('All')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSearch() {
    const accountId = Number(accountIdInput)

    if (accountId <= 0) {
      setErrorMessage('請輸入有效的帳戶 ID。')
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
      <SectionCard title="交易明細查詢" description="依帳戶 ID 查詢交易列表，並可選擇交易類型。">
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">Account ID</label>
            <input
              className="form-control form-control-lg"
              type="number"
              min="1"
              value={accountIdInput}
              onChange={(event) => setAccountIdInput(event.target.value)}
              placeholder="例如 1"
            />
          </div>
          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">交易類型</label>
            <select
              className="form-select form-select-lg"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="All">全部</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdraw">Withdraw</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>
          <div className="col-12 col-lg-4 d-flex align-items-end">
            <button className="btn btn-primary btn-lg px-4" type="button" onClick={handleSearch}>
              {isLoading ? '查詢中...' : '查詢交易列表'}
            </button>
          </div>
        </div>
      </SectionCard>

      {errorMessage ? (
        <section className="alert alert-danger shadow-sm mb-0" role="alert">
          <p className="mb-0">{errorMessage}</p>
        </section>
      ) : null}

      <SectionCard title="交易結果">
        {transactions.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Account ID</th>
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
                    <td>{transaction.accountId}</td>
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
          <p className="text-secondary mb-0">查詢後會在此顯示符合條件的交易列表。</p>
        )}
      </SectionCard>
    </main>
  )
}
