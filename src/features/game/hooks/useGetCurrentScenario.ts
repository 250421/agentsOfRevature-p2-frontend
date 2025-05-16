import { axiosInstance } from "@/lib/axios-config";
import { useQuery } from "@tanstack/react-query";

const getCurrentScenario = async () => {
  const resp = await axiosInstance.get(`/api/scenario/in-progress`);

  return resp.data;
};

export const useGetCurrentScenario = () => {
  return useQuery({
    queryKey: ["scenario"],
    queryFn: getCurrentScenario,
  });
};
