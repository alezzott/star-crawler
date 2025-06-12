import { useCallback } from 'react'

export function useExportCsv() {
  return useCallback((username: string) => {
    if (!username) return
    window.open(
      `${process.env.NEXT_PUBLIC_API_URL}/repositories/export/csv?owner=${username}`,
      '_blank'
    )
  }, [])
}
