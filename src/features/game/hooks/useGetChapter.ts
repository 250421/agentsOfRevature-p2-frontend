import { axiosInstance } from "@/lib/axios-config"
import { useQuery, type QueryFunctionContext } from "@tanstack/react-query"

const getChapter = async (id: string) => {
    const resp = await axiosInstance.get(`/auth/chapter/${id}`);

    return resp.data;
}

export const useGetChapter = (id: string) => {
    return useQuery({
        queryKey: ['chapter', id],
        queryFn: async (context: QueryFunctionContext) => {
            const [_, id] = context.queryKey;
            if (typeof id !== 'string') {
                throw new Error('Invalid id provided.')
            }

            return getChapter(id);
        },
    })
}