import type {
  // Servicios para SeguimientoCurso
  GetSeguimientosCursoResponse,
  GetSeguimientosCursoRequest,
  GetSeguimientoCursoByIdRequest,
  GetSeguimientoCursoByIdResponse,
  GetSeguimientosByCargaAcademicaRequest,
  GetSeguimientosByCargaAcademicaResponse,
  GetSeguimientosByProfesorRequest,
  GetSeguimientosByProfesorResponse,
  GetSeguimientosByCuatrimestreRequest,
  GetSeguimientosByCuatrimestreResponse,
  GetSeguimientoEstadoRequest,
  GetSeguimientoEstadoResponse,
  CreateSeguimientoCursoRequest,
  CreateSeguimientoCursoResponse,
  UpdateSeguimientoCursoRequest,
  UpdateSeguimientoCursoResponse,
  UpdateSeguimientoEstadoRequest,
  UpdateSeguimientoEstadoResponse,
  DeleteSeguimientoCursoRequest,
  DeleteSeguimientoCursoResponse,
  // Servicios para SeguimientoDetalle
  GetSeguimientoDetallesRequest,
  GetSeguimientoDetallesResponse,
  CreateSeguimientoDetalleRequest,
  CreateSeguimientoDetalleResponse,
  UpdateSeguimientoDetalleRequest,
  UpdateSeguimientoDetalleResponse,
  DeleteSeguimientoDetalleRequest,
  DeleteSeguimientoDetalleResponse,
  // Servicios para Notificaciones
  GetNotificacionesRequest,
  GetNotificacionesResponse,
  CreateNotificacionRequest,
  CreateNotificacionResponse,
  UpdateNotificacionRequest,
  UpdateNotificacionResponse,
  DeleteNotificacionRequest,
  DeleteNotificacionResponse,
  MarcarNotificacionLeidaRequest,
  MarcarNotificacionLeidaResponse,
} from "../types/programacion-curso/servicios";
import { API_BASE_URL } from "./api-config";

const PROGRAMACION_CURSO_URL = `${API_BASE_URL}/programacion-seguimiento-curso`;

// ==========================================
// SERVICIOS PARA SEGUIMIENTO CURSO
// ==========================================

// Obtener todos los seguimientos de curso con filtros
export const getAllSeguimientosCurso = async (
  request: GetSeguimientosCursoRequest
): Promise<GetSeguimientosCursoResponse> => {
  try {
    const { token, ...rest } = request;

    const params = new URLSearchParams(
      Object.entries(rest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${PROGRAMACION_CURSO_URL}/seguimientos?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching seguimientos: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as GetSeguimientosCursoResponse;
  } catch (error) {
    console.error("Error fetching seguimientos:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener un seguimiento específico por ID
export const getSeguimientoCursoById = async (
  request: GetSeguimientoCursoByIdRequest
): Promise<GetSeguimientoCursoByIdResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/seguimientos/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching seguimiento: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as GetSeguimientoCursoByIdResponse;
  } catch (error) {
    console.error("Error fetching seguimiento:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener seguimientos por carga académica
export const getSeguimientosByCargaAcademica = async (
  request: GetSeguimientosByCargaAcademicaRequest
): Promise<GetSeguimientosByCargaAcademicaResponse> => {
  try {
    const { token, cargaAcademicaId } = request;
    const FETCH_URL = `${PROGRAMACION_CURSO_URL}/cargaAcademica/${cargaAcademicaId}`;
    console.log("FETCH_URL: ", FETCH_URL);

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching seguimientos por carga académica: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as GetSeguimientosByCargaAcademicaResponse;
  } catch (error) {
    console.error("Error fetching seguimientos por carga académica:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener seguimientos por profesor
export const getSeguimientosByProfesor = async (
  request: GetSeguimientosByProfesorRequest
): Promise<GetSeguimientosByProfesorResponse> => {
  try {
    const { token, ...rest } = request;

    const params = new URLSearchParams(
      Object.entries(rest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${PROGRAMACION_CURSO_URL}/seguimientos/profesor?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching seguimientos por profesor: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as GetSeguimientosByProfesorResponse;
  } catch (error) {
    console.error("Error fetching seguimientos por profesor:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener seguimientos por cuatrimestre
export const getSeguimientosByCuatrimestre = async (
  request: GetSeguimientosByCuatrimestreRequest
): Promise<GetSeguimientosByCuatrimestreResponse> => {
  try {
    const { token, ...rest } = request;

    const params = new URLSearchParams(
      Object.entries(rest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${PROGRAMACION_CURSO_URL}/seguimientos/cuatrimestre?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching seguimientos por cuatrimestre: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as GetSeguimientosByCuatrimestreResponse;
  } catch (error) {
    console.error("Error fetching seguimientos por cuatrimestre:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener estado de un seguimiento
export const getSeguimientoEstado = async (
  request: GetSeguimientoEstadoRequest
): Promise<GetSeguimientoEstadoResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/seguimientos/${id}/estado`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching estado del seguimiento: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as GetSeguimientoEstadoResponse;
  } catch (error) {
    console.error("Error fetching estado del seguimiento:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Crear un nuevo seguimiento de curso
export const createSeguimientoCurso = async (
  request: CreateSeguimientoCursoRequest
): Promise<CreateSeguimientoCursoResponse> => {
  try {
    const { token, data } = request;

    const response = await fetch(`${PROGRAMACION_CURSO_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Intentar obtener más detalles del error
      let errorDetails = "";
      try {
        const errorResponse = await response.text();
        errorDetails = errorResponse;
      } catch (e) {
        errorDetails = "No se pudieron obtener detalles del error";
      }

      throw new Error(
        `Error creating seguimiento: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    const responseData = await response.json();
    return responseData as CreateSeguimientoCursoResponse;
  } catch (error) {
    console.error("Error creating seguimiento:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Actualizar un seguimiento de curso
export const updateSeguimientoCurso = async (
  request: UpdateSeguimientoCursoRequest
): Promise<UpdateSeguimientoCursoResponse> => {
  try {
    const { token, id, data } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/seguimientos/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error updating seguimiento: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as UpdateSeguimientoCursoResponse;
  } catch (error) {
    console.error("Error updating seguimiento:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Actualizar estado de un seguimiento
export const updateSeguimientoEstado = async (
  request: UpdateSeguimientoEstadoRequest
): Promise<UpdateSeguimientoEstadoResponse> => {
  try {
    const { token, id, ...data } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/seguimientos/${id}/estado`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error updating estado del seguimiento: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as UpdateSeguimientoEstadoResponse;
  } catch (error) {
    console.error("Error updating estado del seguimiento:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Eliminar un seguimiento de curso
export const deleteSeguimientoCurso = async (
  request: DeleteSeguimientoCursoRequest
): Promise<DeleteSeguimientoCursoResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/seguimientos/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error deleting seguimiento: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as DeleteSeguimientoCursoResponse;
  } catch (error) {
    console.error("Error deleting seguimiento:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// ==========================================
// SERVICIOS PARA SEGUIMIENTO DETALLE
// ==========================================

// Obtener detalles de un seguimiento
export const getSeguimientoDetalles = async (
  request: GetSeguimientoDetallesRequest
): Promise<GetSeguimientoDetallesResponse> => {
  try {
    const { token, seguimientoCursoId } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/seguimientos/${seguimientoCursoId}/detalles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error fetching detalles: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as GetSeguimientoDetallesResponse;
  } catch (error) {
    console.error("Error fetching detalles:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Crear un nuevo detalle de seguimiento
export const createSeguimientoDetalle = async (
  request: CreateSeguimientoDetalleRequest
): Promise<CreateSeguimientoDetalleResponse> => {
  try {
    const { token, data } = request;

    console.log(
      "🔍 createSeguimientoDetalle - URL:",
      `${PROGRAMACION_CURSO_URL}/${data.seguimientoCursoId}/detalles`
    );
    console.log("🔍 createSeguimientoDetalle - Body data:", data);

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/${data.seguimientoCursoId}/detalles`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error response:", response.status, response.statusText);
      console.error("❌ Error body:", errorText);
      throw new Error(
        `Error creating detalle: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("✅ createSeguimientoDetalle - Respuesta exitosa:", result);
    return result as CreateSeguimientoDetalleResponse;
  } catch (error) {
    console.error("Error creating detalle:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Actualizar un detalle de seguimiento
export const updateSeguimientoDetalle = async (
  request: UpdateSeguimientoDetalleRequest
): Promise<UpdateSeguimientoDetalleResponse> => {
  try {
    const { token, seguimientoId, detalleId, data } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/${seguimientoId}/detalles/${detalleId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error updating detalle: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as UpdateSeguimientoDetalleResponse;
  } catch (error) {
    console.error("Error updating detalle:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Eliminar un detalle de seguimiento
export const deleteSeguimientoDetalle = async (
  request: DeleteSeguimientoDetalleRequest
): Promise<DeleteSeguimientoDetalleResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/seguimientos/detalles/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error deleting detalle: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as DeleteSeguimientoDetalleResponse;
  } catch (error) {
    console.error("Error deleting detalle:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// ==========================================
// SERVICIOS PARA NOTIFICACIONES
// ==========================================

// Obtener notificaciones
export const getNotificaciones = async (
  request: GetNotificacionesRequest
): Promise<GetNotificacionesResponse> => {
  try {
    const { token, ...rest } = request;

    const params = new URLSearchParams(
      Object.entries(rest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${PROGRAMACION_CURSO_URL}/notificaciones?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching notificaciones: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as GetNotificacionesResponse;
  } catch (error) {
    console.error("Error fetching notificaciones:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Crear una nueva notificación
export const createNotificacion = async (
  request: CreateNotificacionRequest
): Promise<CreateNotificacionResponse> => {
  try {
    const { token, data } = request;

    const response = await fetch(`${PROGRAMACION_CURSO_URL}/notificaciones`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Error creating notificacion: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as CreateNotificacionResponse;
  } catch (error) {
    console.error("Error creating notificacion:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Actualizar una notificación
export const updateNotificacion = async (
  request: UpdateNotificacionRequest
): Promise<UpdateNotificacionResponse> => {
  try {
    const { token, id, data } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/notificaciones/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error updating notificacion: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as UpdateNotificacionResponse;
  } catch (error) {
    console.error("Error updating notificacion:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Eliminar una notificación
export const deleteNotificacion = async (
  request: DeleteNotificacionRequest
): Promise<DeleteNotificacionResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/notificaciones/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error deleting notificacion: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as DeleteNotificacionResponse;
  } catch (error) {
    console.error("Error deleting notificacion:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Marcar notificación como leída
export const marcarNotificacionLeida = async (
  request: MarcarNotificacionLeidaRequest
): Promise<MarcarNotificacionLeidaResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(
      `${PROGRAMACION_CURSO_URL}/notificaciones/${id}/marcar-leida`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Error marcando notificacion como leida: ${response.status} ${response.statusText}`
      );
    }

    return (await response.json()) as MarcarNotificacionLeidaResponse;
  } catch (error) {
    console.error("Error marcando notificacion como leida:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// ==========================================
// FUNCIONES UTILITARIAS
// ==========================================

// Función para obtener seguimientos paginados
export const getSeguimientosPaginated = async (
  page: number = 1,
  limit: number = 10,
  token: string,
  estado?: string,
  cuatrimestreId?: string,
  profesorId?: string,
  carrera?: string,
  search?: string
): Promise<GetSeguimientosCursoResponse> => {
  const params: any = { page, limit, token };

  if (estado) params.estado = estado;
  if (cuatrimestreId) params.cuatrimestreId = cuatrimestreId;
  if (profesorId) params.profesorId = profesorId;
  if (carrera) params.carrera = carrera;
  if (search) params.search = search;

  return getAllSeguimientosCurso(params);
};

// Función para buscar seguimientos
export const searchSeguimientos = async (
  searchTerm: string,
  token: string,
  estado?: string,
  cuatrimestreId?: string,
  page?: number,
  limit?: number
): Promise<GetSeguimientosCursoResponse> => {
  const params: any = { search: searchTerm, token };

  if (estado) params.estado = estado;
  if (cuatrimestreId) params.cuatrimestreId = cuatrimestreId;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  return getAllSeguimientosCurso(params);
};

// Función para obtener notificaciones del usuario
export const getNotificacionesUsuario = async (
  usuarioId: string,
  token: string,
  page: number = 1,
  limit: number = 10,
  estado?: string
): Promise<GetNotificacionesResponse> => {
  const params: any = { usuarioId, token, page, limit };

  if (estado) params.estado = estado;

  return getNotificaciones(params);
};

// Función para obtener notificaciones de un seguimiento específico
export const getNotificacionesSeguimiento = async (
  seguimientoCursoId: string,
  token: string,
  page: number = 1,
  limit: number = 10
): Promise<GetNotificacionesResponse> => {
  const params: any = { seguimientoCursoId, token, page, limit };

  return getNotificaciones(params);
};
