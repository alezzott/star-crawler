import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Filters = {
  name?: string
  owner?: string
  stars?: number
}

function buildQueryParams(page: number, filters: Filters): URLSearchParams {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (filters.name) params.set('name', filters.name)
  if (filters.owner) params.set('owner', filters.owner)
  if (filters.stars !== undefined) params.set('stars', String(filters.stars))
  return params
}

async function fetchImportedRepos(page: number, filters: Filters) {
  console.log('Refetching repos', page, filters)

  const params = buildQueryParams(page, filters)
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/repositories?${params.toString()}`
  )
  return data
}

export function useImportedRepos(page = 1, filters: Filters = {}) {
  return useQuery({
    queryKey: [
      'imported-repos',
      page,
      filters.name || '',
      filters.owner || '',
      filters.stars ?? '',
    ],
    queryFn: () => fetchImportedRepos(page, filters),
    placeholderData: keepPreviousData,
    staleTime: 0,
  })
}
