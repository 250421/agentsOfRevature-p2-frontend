import { useQueries } from '@tanstack/react-query'
import { axiosInstance }    from '@/lib/axios-config'
import type { Results } from '@/features/results/models/results'

export interface ScenarioSelectionDto {
  userId:    number
  username:  string
  calamityId: number
  hero1:     string
  hero2:     string
  hero3:     string
}

export function useUserSelections(results: Results[] | undefined) {
  const queries = useQueries({
    queries:
      results?.map(r => ({
        queryKey: ['calamitySelections', r.calamityId],
        queryFn:  () =>
          axiosInstance
            .get<ScenarioSelectionDto>(`/api/results/calamitySelections/${r.calamityId}`)
            .then(res => res.data),
        enabled: !!r.calamityId,
      })) ?? [],
  })

  const data = queries.every(q => q.isSuccess)
    ? queries.map(q => q.data!)
    : undefined

  return {
    isLoading: queries.some(q => q.isLoading),
    error:     queries.find(q => q.isError)?.error,
    data,
  }
}
