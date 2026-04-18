import { requestJson } from './apiClient'
import type { Transaction } from '../types/banking'

export function getTransaction(transactionId: number) {
  return requestJson<Transaction>(`/api/transactions/${transactionId}`)
}

export function getTransactions(accountId: number, type?: string) {
  const searchParams = new URLSearchParams({
    accountId: accountId.toString(),
  })

  if (type && type !== 'All') {
    searchParams.set('type', type)
  }

  return requestJson<Transaction[]>(`/api/transactions?${searchParams.toString()}`)
}
