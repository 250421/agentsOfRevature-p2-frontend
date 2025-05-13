import { axiosInstance } from "@/lib/axios-config"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAxiosError } from "axios";
import { toast } from "sonner"


const deleteCalamity = async (id: number) => {
    const resp = await axiosInstance.delete(`/calamities/${id}`);

    return resp.data;
}

export const useDeleteCalamity = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCalamity,
        onSuccess: () => {
            toast.success('Calamity deleted.');
            queryClient.invalidateQueries({ queryKey: ['calamities'] });
        },
        onError: (error) => {
            if (isAxiosError(error)) toast.error(error.response?.data.message);
        }
    })
}