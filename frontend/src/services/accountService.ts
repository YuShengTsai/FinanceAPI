import { requestJson } from './apiClient'
import type {
  Account,
  AmountRequest,
  BalanceResponse,
  OperationResult,
  Transaction,
} from '../types/banking'

export function getAccount(accountId: number) {
  return requestJson<Account>(`/api/accounts/${accountId}`)
}

export function getBalance(accountId: number) {
  return requestJson<BalanceResponse>(`/api/accounts/${accountId}/balance`)
}

export function getAccountTransactions(accountId: number) {
  return requestJson<Transaction[]>(`/api/accounts/${accountId}/transactions`)
}

export function deposit(accountId: number, request: AmountRequest) {
  return requestJson<OperationResult>(`/api/accounts/${accountId}/deposit`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}

export function withdraw(accountId: number, request: AmountRequest) {
  return requestJson<OperationResult>(`/api/accounts/${accountId}/withdraw`, {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
