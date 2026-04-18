import { useState } from 'react'
import { SectionCard } from '../components/SectionCard'
import {
  deposit,
  getAccount,
  getAccountTransactions,
  getBalance,
  withdraw,
} from '../services/accountService'
import type { Account, BalanceResponse, OperationResult, Transaction } from '../types/banking'

export function AccountsPage() {
  const [accountIdInput, setAccountIdInput] = useState('1')
  const [amountInput, setAmountInput] = useState('')
  const [account, setAccount] = useState<Account | null>(null)
  const [balance, setBalance] = useState<BalanceResponse | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [operationResult, setOperationResult] = useState<OperationResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const accountId = Number(accountIdInput)

  async function loadAccountBundle() {
    if (accountId <= 0) {
      setErrorMessage('請輸入有效的帳戶 ID。')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setOperationResult(null)

    try {
      const [accountResponse, balanceResponse, transactionsResponse] = await Promise.all([
        getAccount(accountId),
        getBalance(accountId),
        getAccountTransactions(accountId),
      ])

      setAccount(accountResponse)
      setBalance(balanceResponse)
      setTransactions(transactionsResponse)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '查詢帳戶資料失敗。')
      setAccount(null)
      setBalance(null)
      setTransactions([])
    } finally {
      setIsLoading(false)
    }
  }

  async function handleOperation(type: 'deposit' | 'withdraw') {
    if (accountId <= 0 || Number(amountInput) <= 0) {
      setErrorMessage('請輸入有效的帳戶 ID 與金額。')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setOperationResult(null)

    try {
      const action = type === 'deposit' ? deposit : withdraw
      const result = await action(accountId, { amount: Number(amountInput) })
      setOperationResult(result)
      await loadAccountBundle()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '交易處理失敗。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="d-grid gap-4">
      <SectionCard
        title="帳戶服務"
        description="整合帳戶查詢、餘額查詢、交易明細、存款與提款功能。"
      >
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">帳戶 ID</label>
            <input
              className="form-control form-control-lg"
              type="number"
              min="1"
              value={accountIdInput}
              onChange={(event) => setAccountIdInput(event.target.value)}
              placeholder="例如 1"
            />
          </div>

          <div className="col-12 col-lg-8 d-flex align-items-end">
            <button className="btn btn-primary btn-lg px-4" type="button" onClick={loadAccountBundle}>
              {isLoading ? '處理中...' : '查詢帳戶資料'}
            </button>
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">操作金額</label>
            <input
              className="form-control form-control-lg"
              type="number"
              min="0.01"
              step="0.01"
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              placeholder="例如 500"
            />
          </div>

          <div className="col-12 col-lg-8 d-flex align-items-end gap-2 flex-wrap">
            <button className="btn btn-outline-primary btn-lg px-4" type="button" onClick={() => handleOperation('deposit')}>
              存款
            </button>
            <button className="btn btn-outline-dark btn-lg px-4" type="button" onClick={() => handleOperation('withdraw')}>
              提款
            </button>
          </div>
        </div>
      </SectionCard>

      {errorMessage ? (
        <section className="alert alert-danger shadow-sm mb-0" role="alert">
          <h2 className="h5 mb-2">處理失敗</h2>
          <p className="mb-0">{errorMessage}</p>
        </section>
      ) : null}

      {operationResult ? (
        <section className="alert alert-info shadow-sm mb-0" role="alert">
          <h2 className="h5 mb-2">交易結果</h2>
          <p className="mb-1">訊息: {operationResult.message}</p>
          <p className="mb-1">交易編號: {operationResult.transactionId ?? '-'}</p>
          <p className="mb-0">最新餘額: {operationResult.balance ?? '-'}</p>
        </section>
      ) : null}

      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <SectionCard title="帳戶資訊">
            {account ? (
              <dl className="result-list mb-0">
                <div className="d-flex justify-content-between gap-3 py-2 border-top">
                  <dt className="mb-0 text-secondary">Account ID</dt>
                  <dd className="mb-0 fw-bold">{account.accountId}</dd>
                </div>
                <div className="d-flex justify-content-between gap-3 py-2 border-top">
                  <dt className="mb-0 text-secondary">Customer ID</dt>
                  <dd className="mb-0 fw-bold">{account.customerId}</dd>
                </div>
                <div className="d-flex justify-content-between gap-3 py-2 border-top">
                  <dt className="mb-0 text-secondary">Account Number</dt>
                  <dd className="mb-0 fw-bold">{account.accountNumber}</dd>
                </div>
                <div className="d-flex justify-content-between gap-3 py-2 border-top">
                  <dt className="mb-0 text-secondary">Created At</dt>
                  <dd className="mb-0 fw-bold text-end">{new Date(account.createdAt).toLocaleString()}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-secondary mb-0">請先查詢帳戶資料。</p>
            )}
          </SectionCard>
        </div>

        <div className="col-12 col-xl-6">
          <SectionCard title="餘額資訊">
            {balance ? (
              <div>
                <p className="service-kicker mb-2">Current Balance</p>
                <p className="display-6 fw-bold mb-2">
                  {balance.currency} {balance.balance.toLocaleString()}
                </p>
                <p className="text-secondary mb-0">{balance.accountNumber}</p>
              </div>
            ) : (
              <p className="text-secondary mb-0">尚未載入餘額資料。</p>
            )}
          </SectionCard>
        </div>
      </div>

      <SectionCard title="帳戶交易明細">
        {transactions.length > 0 ? (
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
          <p className="text-secondary mb-0">查詢後會在此顯示該帳戶的交易明細。</p>
        )}
      </SectionCard>
    </main>
  )
}
