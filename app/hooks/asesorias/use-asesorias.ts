import { useQuery } from "@tanstack/react-query";
import { getAllAsesorias } from "~/services/asesorias.service";
import type { QueryAsesoriaDto } from "~/types/asesorias";

export const useAsesorias = (
  filters: QueryAsesoriaDto,
  token: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["asesorias", filters],
    queryFn: () => getAllAsesorias({ ...filters, token }),
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useAsesoriasPaginated = (
  page: number = 1,
  limit: number = 10,
  token: string,
  filters?: Omit<QueryAsesoriaDto, "page" | "limit">,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["asesorias", "paginated", page, limit, filters],
    queryFn: () => getAllAsesorias({ page, limit, ...filters, token }),
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
