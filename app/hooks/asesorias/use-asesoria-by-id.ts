import { useQuery } from "@tanstack/react-query";
import { getAsesoriaById } from "~/services/asesorias.service";

export const useAsesoriaById = (
  id: string,
  token: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["asesoria", id],
    queryFn: () => getAsesoriaById({ id, token }),
    enabled: enabled && !!token && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
