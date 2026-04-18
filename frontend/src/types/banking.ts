export type Account = {
  accountId: number
  customerId: number
  accountNumber: string
  balance: number
  currency: string
  createdAt: string
}

export type BalanceResponse = {
  accountId: number
  accountNumber: string
  balance: number
  currency: string
}

export type Transaction = {
  transactionId: number
  accountId: number
  type: string
  amount: number
  status: string
  createdAt: string
}

export type OperationResult = {
  success: boolean
  message: string
  transactionId: number | null
  balance: number | null
}

export type AmountRequest = {
  amount: number
}

export type TransferRequest = {
  fromAccountId: number
  toAccountId: number
  amount: number
}

export type TransferResult = {
  resultCode: number
  resultMessage: string
}

export type TransferDetail = {
  transferId: number
  fromAccountId: number
  toAccountId: number
  amount: number
  createdAt: string
}
