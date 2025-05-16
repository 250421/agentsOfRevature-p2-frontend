import { axiosInstance } from "@/lib/axios-config"
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PostOptionSelectedParams {
    scenarioId: string,
    optionId: string,
}

interface PostOptionSelectedPayload {
    optionId: string,
}

const postOptionSelected = async (params: PostOptionSelectedParams) => {
    const { scenarioId, optionId } = params;

    const payload: PostOptionSelectedPayload = { optionId };
    const resp = await axiosInstance.patch(`/api/scenario/${scenarioId}`, payload);

    return resp.data;
}

export const useOptionSelected = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postOptionSelected,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['scenario'] });
        }
    })
}