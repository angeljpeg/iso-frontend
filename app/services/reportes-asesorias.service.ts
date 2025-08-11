import type {
  FiltrosReporteAsesorias,
  FiltrosReporteAsesoriasPorCarrera,
  FiltrosReporteAsesoriasPorProfesor,
  FiltrosReporteAsesoriasPorTema,
  FiltrosReporteEstadisticasAsesorias,
  ReporteAsesoriasGeneral,
  ReporteAsesoriasPorCarrera,
  ReporteAsesoriasPorProfesor,
  ReporteAsesoriasPorTema,
  ReporteEstadisticasAsesorias,
  ReporteDashboardAsesorias,
} from "~/types/asesorias/reportes";
import { API_BASE_URL } from "./api-config";

const REPORTES_ASESORIAS_URL = `${API_BASE_URL}/asesorias/reportes`;

// Tipos para las peticiones de servicios
export interface GenerarReporteGeneralRequest {
  token: string;
  filtros: FiltrosReporteAsesorias;
}

export interface GenerarReportePorCarreraRequest {
  token: string;
  filtros: FiltrosReporteAsesoriasPorCarrera;
}

export interface GenerarReportePorProfesorRequest {
  token: string;
  filtros: FiltrosReporteAsesoriasPorProfesor;
}

export interface GenerarReportePorTemaRequest {
  token: string;
  filtros: FiltrosReporteAsesoriasPorTema;
}

export interface GenerarReporteEstadisticasRequest {
  token: string;
  filtros: FiltrosReporteEstadisticasAsesorias;
}

export interface GenerarReporteDashboardRequest {
  token: string;
}

// ==========================================
// SERVICIOS PARA REPORTES DE ASESORÍAS
// ==========================================

/**
 * Genera reporte general de asesorías con filtros avanzados
 */
export const generarReporteGeneral = async (
  request: GenerarReporteGeneralRequest
): Promise<ReporteAsesoriasGeneral> => {
  try {
    const { token, filtros } = request;

    const params = new URLSearchParams(
      Object.entries(filtros).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${REPORTES_ASESORIAS_URL}/general?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al generar reporte general: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as ReporteAsesoriasGeneral;
  } catch (error) {
    console.error("Error al generar reporte general:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Genera reporte de asesorías agrupadas por carrera
 */
export const generarReportePorCarrera = async (
  request: GenerarReportePorCarreraRequest
): Promise<ReporteAsesoriasPorCarrera> => {
  try {
    const { token, filtros } = request;

    const params = new URLSearchParams(
      Object.entries(filtros).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${REPORTES_ASESORIAS_URL}/por-carrera?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al generar reporte por carrera: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as ReporteAsesoriasPorCarrera;
  } catch (error) {
    console.error("Error al generar reporte por carrera:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Genera reporte de asesorías por profesor
 */
export const generarReportePorProfesor = async (
  request: GenerarReportePorProfesorRequest
): Promise<ReporteAsesoriasPorProfesor> => {
  try {
    const { token, filtros } = request;

    const params = new URLSearchParams(
      Object.entries(filtros).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${REPORTES_ASESORIAS_URL}/por-profesor?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al generar reporte por profesor: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as ReporteAsesoriasPorProfesor;
  } catch (error) {
    console.error("Error al generar reporte por profesor:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Genera reporte de asesorías por tema
 */
export const generarReportePorTema = async (
  request: GenerarReportePorTemaRequest
): Promise<ReporteAsesoriasPorTema> => {
  try {
    const { token, filtros } = request;

    const params = new URLSearchParams(
      Object.entries(filtros).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${REPORTES_ASESORIAS_URL}/por-tema?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al generar reporte por tema: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as ReporteAsesoriasPorTema;
  } catch (error) {
    console.error("Error al generar reporte por tema:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Genera reporte estadístico con métricas agregadas
 */
export const generarReporteEstadisticas = async (
  request: GenerarReporteEstadisticasRequest
): Promise<ReporteEstadisticasAsesorias> => {
  try {
    const { token, filtros } = request;

    const params = new URLSearchParams(
      Object.entries(filtros).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${REPORTES_ASESORIAS_URL}/estadisticas?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al generar reporte estadístico: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as ReporteEstadisticasAsesorias;
  } catch (error) {
    console.error("Error al generar reporte estadístico:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Genera reporte consolidado para el dashboard
 */
export const generarReporteDashboard = async (
  request: GenerarReporteDashboardRequest
): Promise<ReporteDashboardAsesorias> => {
  try {
    const { token } = request;

    const FETCH_URL = `${REPORTES_ASESORIAS_URL}/dashboard`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al generar reporte del dashboard: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as ReporteDashboardAsesorias;
  } catch (error) {
    console.error("Error al generar reporte del dashboard:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Función helper para convertir filtros a parámetros de URL
 */
export const convertirFiltrosAParams = (filtros: Record<string, any>): string => {
  const params = new URLSearchParams();
  
  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (typeof value === "boolean") {
        params.append(key, value.toString());
      } else if (typeof value === "number") {
        params.append(key, value.toString());
      } else if (typeof value === "string") {
        params.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach(item => params.append(key, item.toString()));
      }
    }
  });

  return params.toString();
};
