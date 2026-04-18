import { useState } from 'react'
import { SectionCard } from '../components/SectionCard'
import { getTransferDetails } from '../services/transferService'
import type { TransferDetail } from '../types/banking'

export function TransfersPage() {
  const [accountIdInput, setAccountIdInput] = useState('')
  const [fromAccountIdInput, setFromAccountIdInput] = useState('')
  const [toAccountIdInput, setToAccountIdInput] = useState('')
  const [transferDetails, setTransferDetails] = useState<TransferDetail[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSearch() {
    const accountId = Number(accountIdInput)
    const fromAccountId = Number(fromAccountIdInput)
    const toAccountId = Number(toAccountIdInput)

    const hasAnyFilter =
      (accountIdInput && accountId > 0) ||
      (fromAccountIdInput && fromAccountId > 0) ||
      (toAccountIdInput && toAccountId > 0)

    if (!hasAnyFilter) {
      setErrorMessage('請至少輸入一個查詢條件，例如帳戶 ID、轉出帳戶 ID 或轉入帳戶 ID。')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await getTransferDetails({
        accountId: accountIdInput ? accountId : undefined,
        fromAccountId: fromAccountIdInput ? fromAccountId : undefined,
        toAccountId: toAccountIdInput ? toAccountId : undefined,
      })
      setTransferDetails(response)
    } catch (error) {
      setTransferDetails([])
      setErrorMessage(error instanceof Error ? error.message : '查詢轉帳資料失敗。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="d-grid gap-4">
      <SectionCard title="轉帳紀錄查詢" description="可依帳戶 ID、轉出帳戶 ID 或轉入帳戶 ID 查詢轉帳列表。">
        <div className="row g-3">
          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">Account ID</label>
            <input
              className="form-control form-control-lg"
              type="number"
              value={accountIdInput}
              onChange={(event) => setAccountIdInput(event.target.value)}
              placeholder="例如 1"
            />
          </div>
          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">From Account ID</label>
            <input
              className="form-control form-control-lg"
              type="number"
              value={fromAccountIdInput}
              onChange={(event) => setFromAccountIdInput(event.target.value)}
              placeholder="例如 1"
            />
          </div>
          <div className="col-12 col-lg-4">
            <label className="form-label fw-semibold">To Account ID</label>
            <input
              className="form-control form-control-lg"
              type="number"
              value={toAccountIdInput}
              onChange={(event) => setToAccountIdInput(event.target.value)}
              placeholder="例如 2"
            />
          </div>
          <div className="col-12 d-flex align-items-end">
            <button className="btn btn-primary btn-lg px-4" type="button" onClick={handleSearch}>
              {isLoading ? '查詢中...' : '查詢轉帳列表'}
            </button>
          </div>
        </div>
      </SectionCard>

      {errorMessage ? (
        <section className="alert alert-danger shadow-sm mb-0" role="alert">
          <p className="mb-0">{errorMessage}</p>
        </section>
      ) : null}

      <SectionCard title="轉帳紀錄結果">
        {transferDetails.length > 0 ? (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Transfer ID</th>
                  <th>From Account ID</th>
                  <th>To Account ID</th>
                  <th>Amount</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {transferDetails.map((transferDetail) => (
                  <tr key={transferDetail.transferId}>
                    <td>{transferDetail.transferId}</td>
                    <td>{transferDetail.fromAccountId}</td>
                    <td>{transferDetail.toAccountId}</td>
                    <td>{transferDetail.amount.toLocaleString()}</td>
                    <td>{new Date(transferDetail.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-secondary mb-0">查詢後會在此顯示符合條件的轉帳列表。</p>
        )}
      </SectionCard>
    </main>
  )
}
