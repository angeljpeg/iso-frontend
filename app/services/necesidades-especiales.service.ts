import type {
  CreateNecesidadesEspecialesDto,
  UpdateNecesidadesEspecialesDto,
  QueryNecesidadesEspecialesDto,
  NecesidadesEspeciales,
  NecesidadesEspecialesPaginatedResponse,
  ResumenGeneral,
  ReportePorTipoNecesidad,
  ReportePorCarrera,
  ReportePorProfesor,
  TendenciaMensual,
  ExportarExcelResponse,
} from "../types/necesidades-especiales";
import { API_BASE_URL } from "./api-config";

const NECESIDADES_ESPECIALES_URL = `${API_BASE_URL}/necesidades-especiales`;

// Tipos para las peticiones de servicios
export interface CreateNecesidadesEspecialesRequest
  extends CreateNecesidadesEspecialesDto {
  token: string;
}

export interface UpdateNecesidadesEspecialesRequest
  extends UpdateNecesidadesEspecialesDto {
  id: string;
  token: string;
}

export interface DeleteNecesidadesEspecialesRequest {
  id: string;
  token: string;
}

export interface GetAllNecesidadesEspecialesRequest
  extends QueryNecesidadesEspecialesDto {
  token: string;
}

export interface GetNecesidadesEspecialesByIdRequest {
  id: string;
  token: string;
}

export interface GetNecesidadesEspecialesByCargaAcademicaRequest {
  cargaAcademicaId: string;
  token: string;
}

export interface GetReportesRequest {
  token: string;
  fechaDesde?: string;
  fechaHasta?: string;
  programaEducativo?: string;
  anio?: number;
}

// Crear nueva necesidad especial
export const createNecesidadesEspeciales = async (
  request: CreateNecesidadesEspecialesRequest
): Promise<NecesidadesEspeciales> => {
  try {
    const { token, ...data } = request;

    const response = await fetch(NECESIDADES_ESPECIALES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al crear necesidad especial: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as NecesidadesEspeciales;
  } catch (error) {
    console.error("Error en createNecesidadesEspeciales:", error);
    throw error;
  }
};

// Obtener todas las necesidades especiales con filtros y paginación
export const getAllNecesidadesEspeciales = async (
  request: GetAllNecesidadesEspecialesRequest
): Promise<NecesidadesEspecialesPaginatedResponse> => {
  try {
    const { token, ...query } = request;

    const params = new URLSearchParams(
      Object.entries(query).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${NECESIDADES_ESPECIALES_URL}?${params}`;

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
        `Error al obtener necesidades especiales: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as NecesidadesEspecialesPaginatedResponse;
  } catch (error) {
    console.error("Error en getAllNecesidadesEspeciales:", error);
    throw error;
  }
};

// Obtener necesidades especiales por ID
export const getNecesidadesEspecialesById = async (
  request: GetNecesidadesEspecialesByIdRequest
): Promise<NecesidadesEspeciales> => {
  try {
    const { id, token } = request;

    const response = await fetch(`${NECESIDADES_ESPECIALES_URL}/${id}`, {
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
      if (response.status === 404) {
        throw new Error("Necesidad especial no encontrada");
      }
      throw new Error(
        `Error al obtener necesidad especial: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as NecesidadesEspeciales;
  } catch (error) {
    console.error("Error en getNecesidadesEspecialesById:", error);
    throw error;
  }
};

// Obtener necesidades especiales por carga académica
export const getNecesidadesEspecialesByCargaAcademica = async (
  request: GetNecesidadesEspecialesByCargaAcademicaRequest
): Promise<NecesidadesEspeciales[]> => {
  try {
    const { cargaAcademicaId, token } = request;

    const response = await fetch(
      `${NECESIDADES_ESPECIALES_URL}/carga-academica/${cargaAcademicaId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al obtener necesidades especiales por carga académica: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as NecesidadesEspeciales[];
  } catch (error) {
    console.error("Error en getNecesidadesEspecialesByCargaAcademica:", error);
    throw error;
  }
};

// Actualizar necesidades especiales
export const updateNecesidadesEspeciales = async (
  request: UpdateNecesidadesEspecialesRequest
): Promise<NecesidadesEspeciales> => {
  try {
    const { id, token, ...data } = request;

    const response = await fetch(`${NECESIDADES_ESPECIALES_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      if (response.status === 404) {
        throw new Error("Necesidad especial no encontrada");
      }
      throw new Error(
        `Error al actualizar necesidad especial: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as NecesidadesEspeciales;
  } catch (error) {
    console.error("Error en updateNecesidadesEspeciales:", error);
    throw error;
  }
};

// Eliminar necesidades especiales (soft delete)
export const deleteNecesidadesEspeciales = async (
  request: DeleteNecesidadesEspecialesRequest
): Promise<void> => {
  try {
    const { id, token } = request;

    const response = await fetch(`${NECESIDADES_ESPECIALES_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      if (response.status === 404) {
        throw new Error("Necesidad especial no encontrada");
      }
      throw new Error(
        `Error al eliminar necesidad especial: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error en deleteNecesidadesEspeciales:", error);
    throw error;
  }
};

// Reportes
export const getResumenGeneral = async (
  request: GetReportesRequest
): Promise<ResumenGeneral> => {
  try {
    const { token, fechaDesde, fechaHasta, programaEducativo } = request;

    const params = new URLSearchParams();
    if (fechaDesde) params.append("fechaDesde", fechaDesde);
    if (fechaHasta) params.append("fechaHasta", fechaHasta);
    if (programaEducativo)
      params.append("programaEducativo", programaEducativo);

    const response = await fetch(
      `${API_BASE_URL}/reportes/necesidades-especiales/resumen-general?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al obtener resumen general: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as ResumenGeneral;
  } catch (error) {
    console.error("Error en getResumenGeneral:", error);
    throw error;
  }
};

export const getReportePorTipoNecesidad = async (
  request: GetReportesRequest
): Promise<ReportePorTipoNecesidad[]> => {
  try {
    const { token, fechaDesde, fechaHasta, programaEducativo } = request;

    const params = new URLSearchParams();
    if (fechaDesde) params.append("fechaDesde", fechaDesde);
    if (fechaHasta) params.append("fechaHasta", fechaHasta);
    if (programaEducativo)
      params.append("programaEducativo", programaEducativo);

    const response = await fetch(
      `${API_BASE_URL}/reportes/necesidades-especiales/por-tipo-necesidad?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al obtener reporte por tipo de necesidad: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as ReportePorTipoNecesidad[];
  } catch (error) {
    console.error("Error en getReportePorTipoNecesidad:", error);
    throw error;
  }
};

export const getReportePorCarrera = async (
  request: GetReportesRequest
): Promise<ReportePorCarrera[]> => {
  try {
    const { token, fechaDesde, fechaHasta } = request;

    const params = new URLSearchParams();
    if (fechaDesde) params.append("fechaDesde", fechaDesde);
    if (fechaHasta) params.append("fechaHasta", fechaHasta);

    const response = await fetch(
      `${API_BASE_URL}/reportes/necesidades-especiales/por-carrera?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al obtener reporte por carrera: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as ReportePorCarrera[];
  } catch (error) {
    console.error("Error en getReportePorCarrera:", error);
    throw error;
  }
};

export const getReportePorProfesor = async (
  request: GetReportesRequest & { profesorId?: number }
): Promise<ReportePorProfesor[]> => {
  try {
    const { token, fechaDesde, fechaHasta, profesorId } = request;

    const params = new URLSearchParams();
    if (fechaDesde) params.append("fechaDesde", fechaDesde);
    if (fechaHasta) params.append("fechaHasta", fechaHasta);
    if (profesorId) params.append("profesorId", profesorId.toString());

    const response = await fetch(
      `${API_BASE_URL}/reportes/necesidades-especiales/por-profesor?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al obtener reporte por profesor: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as ReportePorProfesor[];
  } catch (error) {
    console.error("Error en getReportePorProfesor:", error);
    throw error;
  }
};

export const getTendenciasMensuales = async (
  request: GetReportesRequest
): Promise<TendenciaMensual[]> => {
  try {
    const { token, anio, programaEducativo } = request;

    const params = new URLSearchParams();
    if (anio) params.append("anio", anio.toString());
    if (programaEducativo)
      params.append("programaEducativo", programaEducativo);

    const response = await fetch(
      `${API_BASE_URL}/reportes/necesidades-especiales/tendencias-mensuales?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al obtener tendencias mensuales: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as TendenciaMensual[];
  } catch (error) {
    console.error("Error en getTendenciasMensuales:", error);
    throw error;
  }
};

export const exportarExcel = async (
  request: GetReportesRequest
): Promise<ExportarExcelResponse> => {
  try {
    const { token, fechaDesde, fechaHasta, programaEducativo } = request;

    const params = new URLSearchParams();
    if (fechaDesde) params.append("fechaDesde", fechaDesde);
    if (fechaHasta) params.append("fechaHasta", fechaHasta);
    if (programaEducativo)
      params.append("programaEducativo", programaEducativo);

    const response = await fetch(
      `${API_BASE_URL}/reportes/necesidades-especiales/exportar-excel?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al exportar Excel: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as ExportarExcelResponse;
  } catch (error) {
    console.error("Error en exportarExcel:", error);
    throw error;
  }
};
