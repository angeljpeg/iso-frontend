import { useQuery } from "@tanstack/react-query";
import { generarReporteDashboard } from "~/services/reportes-asesorias.service";
import type { ReporteDashboardAsesorias } from "~/types/asesorias/reportes";

/**
 * Hook especializado para el reporte del dashboard de asesorías
 * Incluye lógica adicional para manejo de errores y refresco automático
 */
export const useReporteDashboardAsesorias = (
  token: string,
  options: {
    enabled?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
    onSuccess?: (data: ReporteDashboardAsesorias) => void;
    onError?: (error: Error) => void;
  } = {}
) => {
  const {
    enabled = true,
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 minutos por defecto
    onSuccess,
    onError,
  } = options;

  return useQuery({
    queryKey: ["reporte-asesorias", "dashboard"],
    queryFn: () => generarReporteDashboard({ token }),
    enabled: enabled && !!token,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchInterval: autoRefresh ? refreshInterval : false,
    refetchIntervalInBackground: autoRefresh,
    onSuccess: (data) => {
      console.log("✅ Reporte dashboard asesorías generado:", data);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error("❌ Error generando reporte dashboard asesorías:", error);
      onError?.(error as Error);
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook para el reporte del dashboard con datos transformados para la UI
 */
export const useReporteDashboardAsesoriasUI = (
  token: string,
  options: {
    enabled?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
  } = {}
) => {
  const query = useReporteDashboardAsesorias(token, options);

  // Transformar datos para la UI
  const datosTransformados = query.data ? {
    ...query.data,
    // Calcular porcentajes para gráficos
    porcentajeAsesoriasPorCarrera: Object.entries(query.data.distribucionPorCarrera).map(([carrera, total]) => ({
      carrera,
      total,
      porcentaje: query.data.totalAsesorias > 0 ? (total / query.data.totalAsesorias) * 100 : 0
    })),
    porcentajeAsesoriasPorCuatrimestre: Object.entries(query.data.distribucionPorCuatrimestre).map(([cuatrimestre, total]) => ({
      cuatrimestre,
      total,
      porcentaje: query.data.totalAsesorias > 0 ? (total / query.data.totalAsesorias) * 100 : 0
    })),
    // Calcular métricas adicionales
    promedioAsesoriasPorMes: query.data.asesoriasPorMes.length > 0 
      ? query.data.asesoriasPorMes.reduce((sum, item) => sum + item.cantidad, 0) / query.data.asesoriasPorMes.length 
      : 0,
    totalHorasFormateado: `${Math.floor(query.data.totalHorasAsesorias / 60)}h ${query.data.totalHorasAsesorias % 60}min`,
    // Ordenar top por cantidad
    topAsignaturasOrdenadas: [...query.data.topAsignaturas].sort((a, b) => b.cantidad - a.cantidad),
    topProfesoresOrdenados: [...query.data.topProfesores].sort((a, b) => b.cantidad - a.cantidad),
  } : null;

  return {
    ...query,
    data: datosTransformados,
    // Métodos adicionales para la UI
    refrescarDatos: query.refetch,
    estaActualizando: query.isFetching,
    ultimaActualizacion: query.dataUpdatedAt,
    // Estados derivados
    tieneDatos: !!query.data,
    esPrimeraCarga: query.isLoading && !query.data,
    puedeRefrescar: !query.isLoading && !query.isError,
  };
};

/**
 * Hook para el reporte del dashboard con filtros por fecha
 */
export const useReporteDashboardAsesoriasConFiltros = (
  token: string,
  filtros: {
    fechaInicio?: string;
    fechaFin?: string;
    cuatrimestreId?: string;
    carrera?: string;
  } = {},
  options: {
    enabled?: boolean;
    autoRefresh?: boolean;
    refreshInterval?: number;
  } = {}
) => {
  const query = useReporteDashboardAsesorias(token, options);

  // Aplicar filtros a los datos si existen
  const datosFiltrados = query.data ? {
    ...query.data,
    // Filtrar asesorías por mes según fechas
    asesoriasPorMes: query.data.asesoriasPorMes.filter(item => {
      if (filtros.fechaInicio && filtros.fechaFin) {
        const fechaItem = new Date(item.mes + " 1, " + new Date().getFullYear());
        const fechaInicio = new Date(filtros.fechaInicio);
        const fechaFin = new Date(filtros.fechaFin);
        return fechaItem >= fechaInicio && fechaItem <= fechaFin;
      }
      return true;
    }),
    // Filtrar top asignaturas por carrera si se especifica
    topAsignaturas: filtros.carrera 
      ? query.data.topAsignaturas.filter(asignatura => 
          asignatura.nombre.toLowerCase().includes(filtros.carrera!.toLowerCase())
        )
      : query.data.topAsignaturas,
    // Filtrar distribución por cuatrimestre si se especifica
    distribucionPorCuatrimestre: filtros.cuatrimestreId
      ? Object.fromEntries(
          Object.entries(query.data.distribucionPorCuatrimestre).filter(([cuatrimestre]) =>
            cuatrimestre.includes(filtros.cuatrimestreId!)
          )
        )
      : query.data.distribucionPorCuatrimestre,
  } : null;

  return {
    ...query,
    data: datosFiltrados,
    filtrosAplicados: filtros,
    // Métodos para gestionar filtros
    aplicarFiltros: (nuevosFiltros: typeof filtros) => {
      // En una implementación real, esto podría disparar una nueva consulta
      console.log("Aplicando nuevos filtros:", nuevosFiltros);
    },
    limpiarFiltros: () => {
      // En una implementación real, esto podría resetear los filtros
      console.log("Limpiando filtros");
    },
  };
};
