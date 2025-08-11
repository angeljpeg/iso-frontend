import { useQuery } from "@tanstack/react-query";
import { getAsesoriasByCargaAcademica } from "~/services/asesorias.service";

export const useAsesoriasByCargaAcademica = (
  cargaAcademicaId: string,
  token: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["asesorias", "carga-academica", cargaAcademicaId],
    queryFn: () => getAsesoriasByCargaAcademica({ cargaAcademicaId, token }),
    enabled: enabled && !!token && !!cargaAcademicaId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
