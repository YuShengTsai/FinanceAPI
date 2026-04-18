import { useState } from 'react'
import { SectionCard } from '../components/SectionCard'
import { transferMoney } from '../services/transferService'
import type { TransferRequest, TransferResult } from '../types/banking'

const initialForm: TransferRequest = {
  fromAccountId: 0,
  toAccountId: 0,
  amount: 0,
}

export function TransferPage() {
  const [form, setForm] = useState<TransferRequest>(initialForm)
  const [result, setResult] = useState<TransferResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      setErrorMessage('請輸入有效的轉出帳號、轉入帳號與金額。')
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
        description="這一頁已經具備最基本的表單、驗證、API 呼叫與結果顯示流程。"
      >
        <form className="row g-3" onSubmit={handleSubmit}>
          <label className="col-12 form-field">
            <span className="form-label fw-semibold mb-2">轉出帳號 ID</span>
            <input
              className="form-control form-control-lg"
              type="number"
              min="1"
              value={form.fromAccountId || ''}
              onChange={(event) => updateField('fromAccountId', Number(event.target.value))}
              placeholder="例如 1"
            />
          </label>

          <label className="col-12 form-field">
            <span className="form-label fw-semibold mb-2">轉入帳號 ID</span>
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

      {errorMessage ? (
        <section className="alert alert-danger shadow-sm mb-0" role="alert">
          <h2 className="h5 mb-2">轉帳失敗</h2>
          <p className="mb-0">{errorMessage}</p>
        </section>
      ) : null}

      {result ? (
        <section className="alert alert-success shadow-sm mb-0" role="alert">
          <h2 className="h5 mb-3">轉帳完成</h2>
          <dl className="result-list mb-0">
            <div className="d-flex justify-content-between gap-3 py-2 border-top">
              <dt className="mb-0 text-secondary">Result Code</dt>
              <dd className="mb-0 fw-bold">{result.resultCode}</dd>
            </div>
            <div className="d-flex justify-content-between gap-3 py-2 border-top">
              <dt className="mb-0 text-secondary">Result Message</dt>
              <dd className="mb-0 fw-bold text-end">{result.resultMessage}</dd>
            </div>
          </dl>
        </section>
      ) : null}
    </main>
  )
}
