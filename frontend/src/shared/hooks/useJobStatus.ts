import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type JobStatus = {
  status: 'pending' | 'processing' | 'done' | 'error'
  repos?: any[]
  errorMessage?: string
}

export function useJobStatus(jobId?: string) {
  return useQuery<JobStatus | null>({
    queryKey: ['import-job-status', jobId],
    queryFn: async () => {
      if (!jobId) return null
      try {
        const { data } = await axios.get<JobStatus>(
          `${process.env.NEXT_PUBLIC_API_URL}/repositories/import/status/${jobId}`
        )
        return data
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // Job ainda não existe, considere como "pending"
          return { status: 'pending' }
        }
        throw error
      }
    },
    enabled: !!jobId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (data && (data.status === 'done' || data.status === 'error')) {
        return false
      }
      return 1500
    },
  })
}
