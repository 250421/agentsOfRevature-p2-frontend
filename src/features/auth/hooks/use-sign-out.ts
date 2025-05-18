import { axiosInstance } from "@/lib/axios-config";
import { setState } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const useSignOut = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async () => {
            const resp = await axiosInstance.post("/auth/logout");
            return resp.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["auth"],
            });
            setState({ loggedIn: false, username: '' });
            toast.success("Logged out successfully");
            navigate({ to: "/sign-in" });
        },
        onError: (error) => {
            console.error(error);
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message || "An error ocurred");
            }
        }
    });
}