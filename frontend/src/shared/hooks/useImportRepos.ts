import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Filters = {
  name?: string
  owner?: string
  stars?: number
}

export function useImportedRepos(
  page = 1,
  limit?: number,
  filters: Filters = {}
) {
  return useQuery({
    queryKey: ['imported-repos', page, limit, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        ...(filters.name ? { name: filters.name } : {}),
        ...(filters.owner ? { owner: filters.owner } : {}),
        ...(filters.stars !== undefined
          ? { stars: String(filters.stars) }
          : {}),
      })
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/repositories?${params.toString()}`
      )
      return data
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  })
}
