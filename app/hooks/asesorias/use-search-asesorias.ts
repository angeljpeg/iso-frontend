import { useQuery } from "@tanstack/react-query";
import {
  searchAsesorias,
  getAsesoriasCuatrimestreActual,
  getAsesoriasByProfesor,
  getAsesoriasByAsignatura,
  getAsesoriasByCarrera,
} from "~/services/asesorias.service";
import type { QueryAsesoriaDto } from "~/types/asesorias";

// Hook para búsqueda por término
export const useSearchAsesorias = (
  searchTerm: string,
  token: string,
  filters?: Omit<QueryAsesoriaDto, "page" | "limit">,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["asesorias", "search", searchTerm, page, limit, filters],
    queryFn: () => searchAsesorias(searchTerm, token, filters, page, limit),
    enabled: enabled && !!token && !!searchTerm.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para asesorías del cuatrimestre actual
export const useAsesoriasCuatrimestreActual = (
  token: string,
  page: number = 1,
  limit: number = 10,
  additionalFilters?: Omit<
    QueryAsesoriaDto,
    "page" | "limit" | "cuatrimestreActual"
  >,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [
      "asesorias",
      "cuatrimestre-actual",
      page,
      limit,
      additionalFilters,
    ],
    queryFn: () =>
      getAsesoriasCuatrimestreActual(token, page, limit, additionalFilters),
    enabled: enabled && !!token,
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 8 * 60 * 1000, // 8 minutos
  });
};

// Hook para asesorías por profesor
export const useAsesoriasByProfesor = (
  profesorNombre: string,
  token: string,
  page: number = 1,
  limit: number = 10,
  additionalFilters?: Omit<
    QueryAsesoriaDto,
    "page" | "limit" | "profesorNombre"
  >,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [
      "asesorias",
      "profesor",
      profesorNombre,
      page,
      limit,
      additionalFilters,
    ],
    queryFn: () =>
      getAsesoriasByProfesor(
        profesorNombre,
        token,
        page,
        limit,
        additionalFilters
      ),
    enabled: enabled && !!token && !!profesorNombre.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para asesorías por asignatura
export const useAsesoriasByAsignatura = (
  asignaturaNombre: string,
  token: string,
  page: number = 1,
  limit: number = 10,
  additionalFilters?: Omit<
    QueryAsesoriaDto,
    "page" | "limit" | "asignaturaNombre"
  >,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [
      "asesorias",
      "asignatura",
      asignaturaNombre,
      page,
      limit,
      additionalFilters,
    ],
    queryFn: () =>
      getAsesoriasByAsignatura(
        asignaturaNombre,
        token,
        page,
        limit,
        additionalFilters
      ),
    enabled: enabled && !!token && !!asignaturaNombre.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para asesorías por carrera
export const useAsesoriasByCarrera = (
  carreraNombre: string,
  token: string,
  page: number = 1,
  limit: number = 10,
  additionalFilters?: Omit<
    QueryAsesoriaDto,
    "page" | "limit" | "carreraNombre"
  >,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [
      "asesorias",
      "carrera",
      carreraNombre,
      page,
      limit,
      additionalFilters,
    ],
    queryFn: () =>
      getAsesoriasByCarrera(
        carreraNombre,
        token,
        page,
        limit,
        additionalFilters
      ),
    enabled: enabled && !!token && !!carreraNombre.trim(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
