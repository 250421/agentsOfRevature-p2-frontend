import { axiosInstance } from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query"
import { type Auth } from "../models/auth";
import { setState } from "@/store";

export const useAuth = () => {
    return useQuery({
        queryKey: ["auth"],
        queryFn: async (): Promise <Auth | null> => {
            try{
                const resp = await axiosInstance.get("/auth/me");
                setState({ loggedIn: true, username: resp.data.username });
                return resp.data;
            } catch (error) {
                setState({ loggedIn: false, username: '' });
                console.error(error);
                return null;
            }
        }
    })
}