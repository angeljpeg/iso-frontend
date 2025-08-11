import type {
  FiltrosReporteSeguimiento,
  FiltrosReporteAvance,
  FiltrosReporteNotificaciones,
  FiltrosReporteEstadisticas,
  FiltrosReporteRetrasos,
  FiltrosReporteCompletitud,
  ReporteSeguimientos,
  ReporteAvance,
  ReporteNotificaciones,
  ReporteEstadisticas,
  ReporteRetrasos,
  ReporteCompletitud,
  ReporteDashboard,
} from "../types/programacion-curso";
import { API_BASE_URL } from "./api-config";

const REPORTES_SEGUIMIENTO_URL = `${API_BASE_URL}/reportes-seguimiento`;

// ==========================================
// SERVICIOS PARA REPORTES DE SEGUIMIENTO
// ==========================================

/**
 * Generar reporte general de seguimientos
 */
export const generarReporteSeguimientos = async (
  token: string,
  filtros: FiltrosReporteSeguimiento
): Promise<ReporteSeguimientos> => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.cuatrimestreId) params.append("cuatrimestreId", filtros.cuatrimestreId);
    if (filtros.profesorId) params.append("profesorId", filtros.profesorId);
    if (filtros.asignaturaId) params.append("asignaturaId", filtros.asignaturaId);
    if (filtros.grupoId) params.append("grupoId", filtros.grupoId);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.semana) params.append("semana", filtros.semana.toString());
    if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
    if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);
    if (filtros.conRetrasos) params.append("conRetrasos", filtros.conRetrasos.toString());
    if (filtros.pendientesRevision) params.append("pendientesRevision", filtros.pendientesRevision.toString());
    if (filtros.incluirDetalles) params.append("incluirDetalles", filtros.incluirDetalles.toString());

    const response = await fetch(`${REPORTES_SEGUIMIENTO_URL}/seguimientos?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error generando reporte de seguimientos: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error generando reporte de seguimientos:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Generar reporte de avance por tema y semana
 */
export const generarReporteAvance = async (
  token: string,
  filtros: FiltrosReporteAvance
): Promise<ReporteAvance> => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.cuatrimestreId) params.append("cuatrimestreId", filtros.cuatrimestreId);
    if (filtros.profesorId) params.append("profesorId", filtros.profesorId);
    if (filtros.asignaturaId) params.append("asignaturaId", filtros.asignaturaId);
    if (filtros.grupoId) params.append("grupoId", filtros.grupoId);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.estadoAvance) params.append("estadoAvance", filtros.estadoAvance);
    if (filtros.tema) params.append("tema", filtros.tema);
    if (filtros.semana) params.append("semana", filtros.semana.toString());
    if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
    if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);

    const response = await fetch(`${REPORTES_SEGUIMIENTO_URL}/avance?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error generando reporte de avance: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error generando reporte de avance:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Generar reporte de notificaciones del sistema
 */
export const generarReporteNotificaciones = async (
  token: string,
  filtros: FiltrosReporteNotificaciones
): Promise<ReporteNotificaciones> => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.usuarioId) params.append("usuarioId", filtros.usuarioId);
    if (filtros.tipo) params.append("tipo", filtros.tipo);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.noLeidas) params.append("noLeidas", filtros.noLeidas.toString());
    if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
    if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);

    const response = await fetch(`${REPORTES_SEGUIMIENTO_URL}/notificaciones?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error generando reporte de notificaciones: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error generando reporte de notificaciones:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Generar reporte estadístico con métricas agregadas
 */
export const generarReporteEstadisticas = async (
  token: string,
  filtros: FiltrosReporteEstadisticas
): Promise<ReporteEstadisticas> => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.cuatrimestreId) params.append("cuatrimestreId", filtros.cuatrimestreId);
    if (filtros.profesorId) params.append("profesorId", filtros.profesorId);
    if (filtros.asignaturaId) params.append("asignaturaId", filtros.asignaturaId);
    if (filtros.grupoId) params.append("grupoId", filtros.grupoId);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
    if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);
    if (filtros.agruparPorSemana) params.append("agruparPorSemana", filtros.agruparPorSemana.toString());
    if (filtros.agruparPorAsignatura) params.append("agruparPorAsignatura", filtros.agruparPorAsignatura.toString());
    if (filtros.agruparPorGrupo) params.append("agruparPorGrupo", filtros.agruparPorGrupo.toString());

    const response = await fetch(`${REPORTES_SEGUIMIENTO_URL}/estadisticas?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error generando reporte estadístico: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error generando reporte estadístico:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Generar reporte específico de retrasos con análisis detallado
 */
export const generarReporteRetrasos = async (
  token: string,
  filtros: FiltrosReporteRetrasos
): Promise<ReporteRetrasos> => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.cuatrimestreId) params.append("cuatrimestreId", filtros.cuatrimestreId);
    if (filtros.profesorId) params.append("profesorId", filtros.profesorId);
    if (filtros.asignaturaId) params.append("asignaturaId", filtros.asignaturaId);
    if (filtros.grupoId) params.append("grupoId", filtros.grupoId);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.tema) params.append("tema", filtros.tema);
    if (filtros.semana) params.append("semana", filtros.semana.toString());
    if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
    if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);
    if (filtros.incluirJustificaciones) params.append("incluirJustificaciones", filtros.incluirJustificaciones.toString());
    if (filtros.incluirAccionesCorrectivas) params.append("incluirAccionesCorrectivas", filtros.incluirAccionesCorrectivas.toString());

    const response = await fetch(`${REPORTES_SEGUIMIENTO_URL}/retrasos?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error generando reporte de retrasos: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error generando reporte de retrasos:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Generar reporte de completitud con métricas de calidad
 */
export const generarReporteCompletitud = async (
  token: string,
  filtros: FiltrosReporteCompletitud
): Promise<ReporteCompletitud> => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.cuatrimestreId) params.append("cuatrimestreId", filtros.cuatrimestreId);
    if (filtros.profesorId) params.append("profesorId", filtros.profesorId);
    if (filtros.asignaturaId) params.append("asignaturaId", filtros.asignaturaId);
    if (filtros.grupoId) params.append("grupoId", filtros.grupoId);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
    if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);
    if (filtros.porcentajeMinimo) params.append("porcentajeMinimo", filtros.porcentajeMinimo.toString());
    if (filtros.porcentajeMaximo) params.append("porcentajeMaximo", filtros.porcentajeMaximo.toString());
    if (filtros.incluirMetricasCalidad) params.append("incluirMetricasCalidad", filtros.incluirMetricasCalidad.toString());

    const response = await fetch(`${REPORTES_SEGUIMIENTO_URL}/completitud?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error generando reporte de completitud: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error generando reporte de completitud:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Generar reporte consolidado para dashboard
 */
export const generarReporteDashboard = async (token: string): Promise<ReporteDashboard> => {
  try {
    const response = await fetch(`${REPORTES_SEGUIMIENTO_URL}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error generando reporte de dashboard: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error generando reporte de dashboard:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Exportar reporte en diferentes formatos
 */
export const exportarReporte = async (
  token: string,
  tipo: string,
  filtros: FiltrosReporteSeguimiento
): Promise<any> => {
  try {
    const params = new URLSearchParams();
    
    if (filtros.cuatrimestreId) params.append("cuatrimestreId", filtros.cuatrimestreId);
    if (filtros.profesorId) params.append("profesorId", filtros.profesorId);
    if (filtros.asignaturaId) params.append("asignaturaId", filtros.asignaturaId);
    if (filtros.grupoId) params.append("grupoId", filtros.grupoId);
    if (filtros.estado) params.append("estado", filtros.estado);
    if (filtros.semana) params.append("semana", filtros.semana.toString());
    if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
    if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);
    if (filtros.conRetrasos) params.append("conRetrasos", filtros.conRetrasos.toString());
    if (filtros.pendientesRevision) params.append("pendientesRevision", filtros.pendientesRevision.toString());
    if (filtros.incluirDetalles) params.append("incluirDetalles", filtros.incluirDetalles.toString());

    const response = await fetch(`${REPORTES_SEGUIMIENTO_URL}/exportar/${tipo}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error exportando reporte: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error exportando reporte:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
