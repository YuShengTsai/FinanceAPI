import { useEffect, useState } from 'react'
import { getAccessibleAccounts } from '../services/accountService'
import type { Account } from '../types/banking'

export function useAccessibleAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadAccounts() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await getAccessibleAccounts()

        if (!cancelled) {
          setAccounts(response)
        }
      } catch (error) {
        if (!cancelled) {
          setAccounts([])
          setErrorMessage(error instanceof Error ? error.message : '載入帳戶清單失敗。')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadAccounts()

    return () => {
      cancelled = true
    }
  }, [])

  return {
    accounts,
    isLoading,
    errorMessage,
  }
}
