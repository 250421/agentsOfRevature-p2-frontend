import { axiosInstance } from "@/lib/axios-config"
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PostOptionSelectedParams {
    scenarioId: string,
    selectedOptionId: string,
}

interface PostOptionSelectedPayload {
    selectedOptionId: string,
}

const postOptionSelected = async (params: PostOptionSelectedParams) => {
    const { scenarioId, selectedOptionId } = params;

    const payload: PostOptionSelectedPayload = { selectedOptionId };
    const resp = await axiosInstance.patch(`/api/scenario/${scenarioId}`, payload);

    return resp.data;
}

export const useOptionSelected = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postOptionSelected,
        onSuccess: (data) => {
            queryClient.setQueryData(['currentScenario'], data);
        }
    })
}