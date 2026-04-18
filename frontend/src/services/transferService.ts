import { requestJson } from './apiClient'
import type { TransferDetail, TransferRequest, TransferResult } from '../types/banking'

export async function transferMoney(request: TransferRequest): Promise<TransferResult> {
  return requestJson<TransferResult>('/api/transfers', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function getTransferDetail(transferId: number) {
  return requestJson<TransferDetail>(`/api/transfers/${transferId}`)
}

export function getTransferDetails(filters: {
  accountId?: number
  fromAccountId?: number
  toAccountId?: number
}) {
  const searchParams = new URLSearchParams()

  if (filters.accountId && filters.accountId > 0) {
    searchParams.set('accountId', filters.accountId.toString())
  }

  if (filters.fromAccountId && filters.fromAccountId > 0) {
    searchParams.set('fromAccountId', filters.fromAccountId.toString())
  }

  if (filters.toAccountId && filters.toAccountId > 0) {
    searchParams.set('toAccountId', filters.toAccountId.toString())
  }

  const queryString = searchParams.toString()
  return requestJson<TransferDetail[]>(`/api/transfers${queryString ? `?${queryString}` : ''}`)
}
