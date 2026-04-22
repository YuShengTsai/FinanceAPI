export function formatTransactionType(type: string) {
  switch (type) {
    case 'Deposit':
      return '存款'
    case 'Withdraw':
      return '提款'
    case 'Transfer':
      return '轉帳'
    default:
      return type
  }
}
