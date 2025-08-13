import { useState, useCallback } from "react";
import {
  getResumenGeneral,
  getReportePorTipoNecesidad,
  getReportePorCarrera,
  getReportePorProfesor,
  getTendenciasMensuales,
  exportarExcel,
} from "../../services/necesidades-especiales.service";
import {
  type ResumenGeneral,
  type ReportePorTipoNecesidad,
  type ReportePorCarrera,
  type ReportePorProfesor,
  type TendenciaMensual,
  type ExportarExcelResponse,
} from "../../types/necesidades-especiales";

interface UseReportesNecesidadesEspecialesReturn {
  // Estados para cada tipo de reporte
  resumenGeneral: ResumenGeneral | null;
  reportePorTipo: ReportePorTipoNecesidad[];
  reportePorCarrera: ReportePorCarrera[];
  reportePorProfesor: ReportePorProfesor[];
  tendenciasMensuales: TendenciaMensual[];

  // Estados de loading
  loadingResumen: boolean;
  loadingPorTipo: boolean;
  loadingPorCarrera: boolean;
  loadingPorProfesor: boolean;
  loadingTendencias: boolean;
  loadingExportacion: boolean;

  // Estados de error
  errorResumen: string | null;
  errorPorTipo: string | null;
  errorPorCarrera: string | null;
  errorPorProfesor: string | null;
  errorTendencias: string | null;
  errorExportacion: string | null;

  // Funciones para obtener reportes
  getResumenGeneral: (
    fechaDesde?: string,
    fechaHasta?: string,
    programaEducativo?: string
  ) => Promise<void>;
  getReportePorTipo: (
    fechaDesde?: string,
    fechaHasta?: string,
    programaEducativo?: string
  ) => Promise<void>;
  getReportePorCarrera: (
    fechaDesde?: string,
    fechaHasta?: string
  ) => Promise<void>;
  getReportePorProfesor: (
    fechaDesde?: string,
    fechaHasta?: string,
    profesorId?: number
  ) => Promise<void>;
  getTendenciasMensuales: (
    anio?: number,
    programaEducativo?: string
  ) => Promise<void>;
  exportarExcel: (
    fechaDesde?: string,
    fechaHasta?: string,
    programaEducativo?: string
  ) => Promise<ExportarExcelResponse | null>;

  // Función para limpiar errores
  clearErrors: () => void;
}

export const useReportesNecesidadesEspeciales =
  (): UseReportesNecesidadesEspecialesReturn => {
    // Estados para los datos de los reportes
    const [resumenGeneral, setResumenGeneral] = useState<ResumenGeneral | null>(
      null
    );
    const [reportePorTipo, setReportePorTipo] = useState<
      ReportePorTipoNecesidad[]
    >([]);
    const [reportePorCarrera, setReportePorCarrera] = useState<
      ReportePorCarrera[]
    >([]);
    const [reportePorProfesor, setReportePorProfesor] = useState<
      ReportePorProfesor[]
    >([]);
    const [tendenciasMensuales, setTendenciasMensuales] = useState<
      TendenciaMensual[]
    >([]);

    // Estados de loading
    const [loadingResumen, setLoadingResumen] = useState(false);
    const [loadingPorTipo, setLoadingPorTipo] = useState(false);
    const [loadingPorCarrera, setLoadingPorCarrera] = useState(false);
    const [loadingPorProfesor, setLoadingPorProfesor] = useState(false);
    const [loadingTendencias, setLoadingTendencias] = useState(false);
    const [loadingExportacion, setLoadingExportacion] = useState(false);

    // Estados de error
    const [errorResumen, setErrorResumen] = useState<string | null>(null);
    const [errorPorTipo, setErrorPorTipo] = useState<string | null>(null);
    const [errorPorCarrera, setErrorPorCarrera] = useState<string | null>(null);
    const [errorPorProfesor, setErrorPorProfesor] = useState<string | null>(
      null
    );
    const [errorTendencias, setErrorTendencias] = useState<string | null>(null);
    const [errorExportacion, setErrorExportacion] = useState<string | null>(
      null
    );

    // Función para obtener resumen general
    const fetchResumenGeneral = useCallback(
      async (
        fechaDesde?: string,
        fechaHasta?: string,
        programaEducativo?: string
      ) => {
        try {
          setLoadingResumen(true);
          setErrorResumen(null);

          const response = await getResumenGeneral({
            token: "your-token-here", // TODO: Get from auth context
            fechaDesde,
            fechaHasta,
            programaEducativo,
          });

          setResumenGeneral(response);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error al obtener el resumen general";
          setErrorResumen(errorMessage);
          console.error("Error getting resumen general:", err);
        } finally {
          setLoadingResumen(false);
        }
      },
      []
    );

    // Función para obtener reporte por tipo de necesidad
    const fetchReportePorTipo = useCallback(
      async (
        fechaDesde?: string,
        fechaHasta?: string,
        programaEducativo?: string
      ) => {
        try {
          setLoadingPorTipo(true);
          setErrorPorTipo(null);

          const response = await getReportePorTipoNecesidad({
            token: "your-token-here", // TODO: Get from auth context
            fechaDesde,
            fechaHasta,
            programaEducativo,
          });

          setReportePorTipo(response);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error al obtener el reporte por tipo";
          setErrorPorTipo(errorMessage);
          console.error("Error getting reporte por tipo:", err);
        } finally {
          setLoadingPorTipo(false);
        }
      },
      []
    );

    // Función para obtener reporte por carrera
    const fetchReportePorCarrera = useCallback(
      async (fechaDesde?: string, fechaHasta?: string) => {
        try {
          setLoadingPorCarrera(true);
          setErrorPorCarrera(null);

          const response = await getReportePorCarrera({
            token: "your-token-here", // TODO: Get from auth context
            fechaDesde,
            fechaHasta,
          });

          setReportePorCarrera(response);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error al obtener el reporte por carrera";
          setErrorPorCarrera(errorMessage);
          console.error("Error getting reporte por carrera:", err);
        } finally {
          setLoadingPorCarrera(false);
        }
      },
      []
    );

    // Función para obtener reporte por profesor
    const fetchReportePorProfesor = useCallback(
      async (fechaDesde?: string, fechaHasta?: string, profesorId?: number) => {
        try {
          setLoadingPorProfesor(true);
          setErrorPorProfesor(null);

          const response = await getReportePorProfesor({
            token: "your-token-here", // TODO: Get from auth context
            fechaDesde,
            fechaHasta,
            profesorId,
          });

          setReportePorProfesor(response);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error al obtener el reporte por profesor";
          setErrorPorProfesor(errorMessage);
          console.error("Error getting reporte por profesor:", err);
        } finally {
          setLoadingPorProfesor(false);
        }
      },
      []
    );

    // Función para obtener tendencias mensuales
    const fetchTendenciasMensuales = useCallback(
      async (anio?: number, programaEducativo?: string) => {
        try {
          setLoadingTendencias(true);
          setErrorTendencias(null);

          const response = await getTendenciasMensuales({
            token: "your-token-here", // TODO: Get from auth context
            anio,
            programaEducativo,
          });

          setTendenciasMensuales(response);
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : "Error al obtener las tendencias mensuales";
          setErrorTendencias(errorMessage);
          console.error("Error getting tendencias mensuales:", err);
        } finally {
          setLoadingTendencias(false);
        }
      },
      []
    );

    // Función para exportar a Excel
    const fetchExportarExcel = useCallback(
      async (
        fechaDesde?: string,
        fechaHasta?: string,
        programaEducativo?: string
      ): Promise<ExportarExcelResponse | null> => {
        try {
          setLoadingExportacion(true);
          setErrorExportacion(null);

          const response = await exportarExcel({
            token: "your-token-here", // TODO: Get from auth context
            fechaDesde,
            fechaHasta,
            programaEducativo,
          });

          return response;
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "Error al exportar el reporte";
          setErrorExportacion(errorMessage);
          console.error("Error exporting excel:", err);
          return null;
        } finally {
          setLoadingExportacion(false);
        }
      },
      []
    );

    // Función para limpiar todos los errores
    const clearErrors = useCallback(() => {
      setErrorResumen(null);
      setErrorPorTipo(null);
      setErrorPorCarrera(null);
      setErrorPorProfesor(null);
      setErrorTendencias(null);
      setErrorExportacion(null);
    }, []);

    return {
      // Estados de datos
      resumenGeneral,
      reportePorTipo,
      reportePorCarrera,
      reportePorProfesor,
      tendenciasMensuales,

      // Estados de loading
      loadingResumen,
      loadingPorTipo,
      loadingPorCarrera,
      loadingPorProfesor,
      loadingTendencias,
      loadingExportacion,

      // Estados de error
      errorResumen,
      errorPorTipo,
      errorPorCarrera,
      errorPorProfesor,
      errorTendencias,
      errorExportacion,

      // Funciones
      getResumenGeneral: fetchResumenGeneral,
      getReportePorTipo: fetchReportePorTipo,
      getReportePorCarrera: fetchReportePorCarrera,
      getReportePorProfesor: fetchReportePorProfesor,
      getTendenciasMensuales: fetchTendenciasMensuales,
      exportarExcel: fetchExportarExcel,
      clearErrors,
    };
  };

// Hook para obtener todos los reportes de una vez
export const useTodosLosReportes = (
  fechaDesde?: string,
  fechaHasta?: string,
  programaEducativo?: string,
  anio?: number
) => {
  const {
    getResumenGeneral,
    getReportePorTipo,
    getReportePorCarrera,
    getReportePorProfesor,
    getTendenciasMensuales,
    ...rest
  } = useReportesNecesidadesEspeciales();

  const cargarTodosLosReportes = useCallback(async () => {
    await Promise.all([
      getResumenGeneral(fechaDesde, fechaHasta, programaEducativo),
      getReportePorTipo(fechaDesde, fechaHasta, programaEducativo),
      getReportePorCarrera(fechaDesde, fechaHasta),
      getReportePorProfesor(fechaDesde, fechaHasta),
      getTendenciasMensuales(anio, programaEducativo),
    ]);
  }, [
    getResumenGeneral,
    getReportePorTipo,
    getReportePorCarrera,
    getReportePorProfesor,
    getTendenciasMensuales,
    fechaDesde,
    fechaHasta,
    programaEducativo,
    anio,
  ]);

  return {
    ...rest,
    cargarTodosLosReportes,
  };
};
