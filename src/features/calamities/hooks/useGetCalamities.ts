import { axiosInstance } from "@/lib/axios-config"
import { useQuery } from "@tanstack/react-query"

const getCalamities = async () => {
    const resp = await axiosInstance.get('/api/calamity');

    return resp.data;
}

export const useGetCalamities = () => {
    return useQuery({
        queryKey: ['calamities'],
        queryFn: getCalamities,
        retry: 2,
    })
}