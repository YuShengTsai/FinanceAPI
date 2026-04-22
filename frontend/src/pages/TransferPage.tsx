import { useState } from 'react'
import { useAccessibleAccounts } from '../hooks/useAccessibleAccounts'
import { SectionCard } from '../components/SectionCard'
import { transferMoney } from '../services/transferService'
import type { TransferRequest, TransferResult } from '../types/banking'

const initialForm: TransferRequest = {
  fromAccountId: 0,
  toAccountId: 0,
  amount: 0,
}

export function TransferPage() {
  const { accounts, isLoading: isAccountsLoading, errorMessage: accountsErrorMessage } =
    useAccessibleAccounts()
  const [form, setForm] = useState<TransferRequest>(initialForm)
  const [result, setResult] = useState<TransferResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const effectiveErrorMessage = errorMessage || accountsErrorMessage

  function updateField<K extends keyof TransferRequest>(field: K, value: TransferRequest[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setResult(null)
    setErrorMessage('')

    if (form.fromAccountId <= 0 || form.toAccountId <= 0 || form.amount <= 0) {
      setErrorMessage('請選擇轉出帳戶，並輸入有效的轉入帳戶 ID 與金額。')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await transferMoney(form)
      setResult(response)
    } catch (error) {
      const message = error instanceof Error ? error.message : '轉帳失敗，請稍後再試。'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="d-grid gap-4">
      <SectionCard
        title="轉帳作業"
        description="轉出帳戶可從下拉選單選擇自己的帳戶，轉入帳戶可輸入其他帳戶 ID。"
      >
        <form className="row g-3" onSubmit={handleSubmit}>
          <label className="col-12 form-field">
            <span className="form-label fw-semibold mb-2">轉出帳戶</span>
            <select
              className="form-select form-select-lg"
              value={form.fromAccountId || ''}
              onChange={(event) => updateField('fromAccountId', Number(event.target.value))}
              disabled={isAccountsLoading || accounts.length === 0}
            >
              <option value="">請選擇轉出帳戶</option>
              {accounts.map((accountItem) => (
                <option key={accountItem.accountId} value={accountItem.accountId}>
                  {accountItem.accountNumber} | {accountItem.currency} | {accountItem.balance.toLocaleString()}
                </option>
              ))}
            </select>
          </label>

          <label className="col-12 form-field">
            <span className="form-label fw-semibold mb-2">轉入帳戶 ID</span>
            <input
              className="form-control form-control-lg"
              type="number"
              min="1"
              value={form.toAccountId || ''}
              onChange={(event) => updateField('toAccountId', Number(event.target.value))}
              placeholder="例如 2"
            />
          </label>

          <label className="col-12 form-field">
            <span className="form-label fw-semibold mb-2">金額</span>
            <input
              className="form-control form-control-lg"
              type="number"
              min="1"
              step="0.01"
              value={form.amount || ''}
              onChange={(event) => updateField('amount', Number(event.target.value))}
              placeholder="例如 500"
            />
          </label>

          <div className="col-12">
            <button className="btn btn-primary btn-lg px-4" type="submit" disabled={isSubmitting}>
              {isSubmitting ? '送出中...' : '確認轉帳'}
            </button>
          </div>
        </form>
      </SectionCard>

      {effectiveErrorMessage ? (
        <section className="alert alert-danger shadow-sm mb-0" role="alert">
          <h2 className="h5 mb-2">轉帳失敗</h2>
          <p className="mb-0">{effectiveErrorMessage}</p>
        </section>
      ) : null}

      {result ? (
        <section className="alert alert-success shadow-sm mb-0" role="alert">
          <h2 className="h5 mb-3">轉帳完成</h2>
          <dl className="result-list mb-0">
            <div className="d-flex justify-content-between gap-3 py-2 border-top">
              <dt className="mb-0 text-secondary">結果代碼</dt>
              <dd className="mb-0 fw-bold">{result.resultCode}</dd>
            </div>
            <div className="d-flex justify-content-between gap-3 py-2 border-top">
              <dt className="mb-0 text-secondary">結果訊息</dt>
              <dd className="mb-0 fw-bold text-end">{result.resultMessage}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </main>
  )
}
