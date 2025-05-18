import { axiosInstance } from "@/lib/axios-config"
import { useQuery } from "@tanstack/react-query"
import type { Results } from '@/features/results/models/results'

export function useUserResults(userId: number) {
  return useQuery<Results[], Error>({
    queryKey: ['userResults', userId],
    queryFn:    async () => {
      const { data } = await axiosInstance.get<Results[]>(
        `/api/results/userResults/${userId}`
      )
      return data
    },
  })
}
