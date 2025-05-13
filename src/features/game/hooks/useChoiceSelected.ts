import { axiosInstance } from "@/lib/axios-config"
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PostChoiceSelectedParams {
    chapterId: string,
    choiceId: string,
}

interface PostChoiceSelectedPayload {
    choiceId: string,
}

const postChoiceSelected = async (params: PostChoiceSelectedParams) => {
    const { chapterId, choiceId } = params;

    const payload: PostChoiceSelectedPayload = { choiceId };
    const resp = await axiosInstance.post(`/api/chapter/${chapterId}/action`, payload);

    return resp.data;
}

export const useChoiceSelected = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: postChoiceSelected,
        onSuccess: (_, params) => {
            queryClient.invalidateQueries({ queryKey: ['chapter', params.chapterId] });
        }
    })
}