import { useQuery } from "@tanstack/react-query";
import {
  generarReporteGeneral,
  generarReportePorCarrera,
  generarReportePorProfesor,
  generarReportePorTema,
  generarReporteEstadisticas,
} from "~/services/reportes-asesorias.service";
import type {
  FiltrosReporteAsesorias,
  FiltrosReporteAsesoriasPorCarrera,
  FiltrosReporteAsesoriasPorProfesor,
  FiltrosReporteAsesoriasPorTema,
  FiltrosReporteEstadisticasAsesorias,
} from "~/types/asesorias/reportes";

// ==========================================
// HOOKS PARA REPORTES DE ASESORÍAS
// ==========================================

/**
 * Hook para generar reporte general de asesorías
 */
export const useReporteGeneralAsesorias = (
  filtros: FiltrosReporteAsesorias,
  token: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["reporte-asesorias", "general", filtros],
    queryFn: () => generarReporteGeneral({ token, filtros }),
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para generar reporte de asesorías por carrera
 */
export const useReporteAsesoriasPorCarrera = (
  filtros: FiltrosReporteAsesoriasPorCarrera,
  token: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["reporte-asesorias", "por-carrera", filtros],
    queryFn: () => generarReportePorCarrera({ token, filtros }),
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para generar reporte de asesorías por profesor
 */
export const useReporteAsesoriasPorProfesor = (
  filtros: FiltrosReporteAsesoriasPorProfesor,
  token: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["reporte-asesorias", "por-profesor", filtros],
    queryFn: () => generarReportePorProfesor({ token, filtros }),
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para generar reporte de asesorías por tema
 */
export const useReporteAsesoriasPorTema = (
  filtros: FiltrosReporteAsesoriasPorTema,
  token: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["reporte-asesorias", "por-tema", filtros],
    queryFn: () => generarReportePorTema({ token, filtros }),
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para generar reporte estadístico de asesorías
 */
export const useReporteEstadisticasAsesorias = (
  filtros: FiltrosReporteEstadisticasAsesorias,
  token: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["reporte-asesorias", "estadisticas", filtros],
    queryFn: () => generarReporteEstadisticas({ token, filtros }),
    enabled: enabled && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook genérico para cualquier tipo de reporte de asesorías
 */
export const useReporteAsesorias = (
  tipo:
    | "general"
    | "por-carrera"
    | "por-profesor"
    | "por-tema"
    | "estadisticas",
  filtros: any = {},
  token: string,
  enabled: boolean = true
) => {
  const queryKey = ["reporte-asesorias", tipo, filtros];

  const generalQuery = useQuery({
    queryKey: [...queryKey, "general"],
    queryFn: () => generarReporteGeneral({ token, filtros }),
    enabled: enabled && !!token && tipo === "general",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const porCarreraQuery = useQuery({
    queryKey: [...queryKey, "por-carrera"],
    queryFn: () => generarReportePorCarrera({ token, filtros }),
    enabled: enabled && !!token && tipo === "por-carrera",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const porProfesorQuery = useQuery({
    queryKey: [...queryKey, "por-profesor"],
    queryFn: () => generarReportePorProfesor({ token, filtros }),
    enabled: enabled && !!token && tipo === "por-profesor",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const porTemaQuery = useQuery({
    queryKey: [...queryKey, "por-tema"],
    queryFn: () => generarReportePorTema({ token, filtros }),
    enabled: enabled && !!token && tipo === "por-tema",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const estadisticasQuery = useQuery({
    queryKey: [...queryKey, "estadisticas"],
    queryFn: () => generarReporteEstadisticas({ token, filtros }),
    enabled: enabled && !!token && tipo === "estadisticas",
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Retornar el query correspondiente según el tipo
  switch (tipo) {
    case "general":
      return generalQuery;
    case "por-carrera":
      return porCarreraQuery;
    case "por-profesor":
      return porProfesorQuery;
    case "por-tema":
      return porTemaQuery;
    case "estadisticas":
      return estadisticasQuery;
    default:
      return generalQuery;
  }
};

/**
 * Hook para múltiples reportes simultáneos
 */
export const useMultiplesReportesAsesorias = (
  tipos: Array<
    "general" | "por-carrera" | "por-profesor" | "por-tema" | "estadisticas"
  >,
  filtros: any = {},
  token: string,
  enabled: boolean = true
) => {
  const reportes = tipos.map((tipo) => ({
    tipo,
    query: useReporteAsesorias(tipo, filtros, token, enabled),
  }));

  const isLoading = reportes.some((r) => r.query.isLoading);
  const error = reportes.find((r) => r.query.error)?.query.error;
  const isError = reportes.some((r) => r.query.isError);

  return {
    reportes,
    isLoading,
    error,
    isError,
    refetch: () => reportes.forEach((r) => r.query.refetch()),
  };
};
