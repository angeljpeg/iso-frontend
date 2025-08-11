import type {
  CreateAsesoriaDto,
  UpdateAsesoriaDto,
  QueryAsesoriaDto,
  AsesoriaResponseDto,
  Asesoria,
} from "~/types/asesorias";
import { API_BASE_URL } from "./api-config";

const ASESORIAS_URL = `${API_BASE_URL}/asesorias`;

// Tipos para las peticiones de servicios
export interface CreateAsesoriaRequest extends CreateAsesoriaDto {
  token: string;
}

export interface CreateAsesoriaResponse extends Asesoria {}

export interface UpdateAsesoriaRequest extends UpdateAsesoriaDto {
  id: string;
  token: string;
}

export interface UpdateAsesoriaResponse extends Asesoria {}

export interface DeleteAsesoriaRequest {
  id: string;
  token: string;
}

export interface GetAllAsesoriasRequest extends QueryAsesoriaDto {
  token: string;
}

export interface GetAllAsesoriasResponse extends AsesoriaResponseDto {}

export interface GetAsesoriaByIdRequest {
  id: string;
  token: string;
}

export interface GetAsesoriaByIdResponse extends Asesoria {}

export interface GetAsesoriasByCargaAcademicaRequest {
  cargaAcademicaId: string;
  token: string;
}

export interface GetAsesoriasByCargaAcademicaResponse {
  data: Asesoria[];
}

export interface TestRelationsRequest {
  token: string;
}

export interface TestRelationsResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Obtener todas las asesorías con filtros y paginación
export const getAllAsesorias = async (
  request: GetAllAsesoriasRequest
): Promise<GetAllAsesoriasResponse> => {
  try {
    const { token, ...rest } = request;

    const params = new URLSearchParams(
      Object.entries(rest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${ASESORIAS_URL}?${params}`;

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
        `Error al obtener asesorías: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetAllAsesoriasResponse;
  } catch (error) {
    console.error("Error fetching asesorías:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Crear nueva asesoría
export const createAsesoria = async (
  request: CreateAsesoriaRequest
): Promise<CreateAsesoriaResponse> => {
  try {
    const { token, ...asesoriaData } = request;

    const requestBody = JSON.stringify(asesoriaData);

    const response = await fetch(ASESORIAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: requestBody,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }

      // Intentar obtener más detalles del error
      let errorDetails = "";
      try {
        const errorResponse = await response.text();
        errorDetails = errorResponse;
      } catch (e) {
        errorDetails = "No se pudieron obtener detalles del error";
      }

      throw new Error(
        `Error al crear asesoría: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as CreateAsesoriaResponse;
  } catch (error) {
    console.error("Error creating asesoría:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener una asesoría específica por ID
export const getAsesoriaById = async (
  request: GetAsesoriaByIdRequest
): Promise<GetAsesoriaByIdResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${ASESORIAS_URL}/${id}`, {
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
        throw new Error("Asesoría no encontrada");
      }
      throw new Error(
        `Error al obtener asesoría: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetAsesoriaByIdResponse;
  } catch (error) {
    console.error("Error fetching asesoría:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener asesorías por ID de carga académica
export const getAsesoriasByCargaAcademica = async (
  request: GetAsesoriasByCargaAcademicaRequest
): Promise<GetAsesoriasByCargaAcademicaResponse> => {
  try {
    const { token, cargaAcademicaId } = request;

    const response = await fetch(
      `${ASESORIAS_URL}/carga-academica/${cargaAcademicaId}`,
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
        `Error al obtener asesorías por carga académica: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetAsesoriasByCargaAcademicaResponse;
  } catch (error) {
    console.error("Error fetching asesorías por carga académica:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Actualizar asesoría
export const updateAsesoria = async (
  request: UpdateAsesoriaRequest
): Promise<UpdateAsesoriaResponse> => {
  try {
    const { token, id, ...asesoriaData } = request;

    const response = await fetch(`${ASESORIAS_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(asesoriaData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      if (response.status === 404) {
        throw new Error("Asesoría no encontrada");
      }
      throw new Error(
        `Error al actualizar asesoría: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as UpdateAsesoriaResponse;
  } catch (error) {
    console.error("Error updating asesoría:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Eliminar asesoría
export const deleteAsesoria = async (
  request: DeleteAsesoriaRequest
): Promise<void> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${ASESORIAS_URL}/${id}`, {
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
        throw new Error("Asesoría no encontrada");
      }
      throw new Error(
        `Error al eliminar asesoría: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error deleting asesoría:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Probar relaciones (endpoint temporal del backend)
export const testAsesoriasRelations = async (
  request: TestRelationsRequest
): Promise<TestRelationsResponse> => {
  try {
    const { token } = request;

    const response = await fetch(`${ASESORIAS_URL}/test-relations`, {
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
        `Error al probar relaciones: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as TestRelationsResponse;
  } catch (error) {
    console.error("Error testing asesorías relations:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Funciones de utilidad para paginación y búsqueda

// Obtener asesorías paginadas
export const getAsesoriasPaginated = async (
  page: number = 1,
  limit: number = 10,
  token: string,
  filters?: Omit<QueryAsesoriaDto, "page" | "limit">
): Promise<GetAllAsesoriasResponse> => {
  const request: GetAllAsesoriasRequest = {
    token,
    page,
    limit,
    ...filters,
  };

  return getAllAsesorias(request);
};

// Buscar asesorías por término de búsqueda
export const searchAsesorias = async (
  searchTerm: string,
  token: string,
  filters?: Omit<QueryAsesoriaDto, "page" | "limit">,
  page: number = 1,
  limit: number = 10
): Promise<GetAllAsesoriasResponse> => {
  const request: GetAllAsesoriasRequest = {
    token,
    page,
    limit,
    temaNombre: searchTerm,
    ...filters,
  };

  return getAllAsesorias(request);
};

// Obtener asesorías del cuatrimestre actual
export const getAsesoriasCuatrimestreActual = async (
  token: string,
  page: number = 1,
  limit: number = 10,
  additionalFilters?: Omit<
    QueryAsesoriaDto,
    "page" | "limit" | "cuatrimestreActual"
  >
): Promise<GetAllAsesoriasResponse> => {
  const request: GetAllAsesoriasRequest = {
    token,
    page,
    limit,
    cuatrimestreActual: true,
    ...additionalFilters,
  };

  return getAllAsesorias(request);
};

// Obtener asesorías por profesor
export const getAsesoriasByProfesor = async (
  profesorNombre: string,
  token: string,
  page: number = 1,
  limit: number = 10,
  additionalFilters?: Omit<
    QueryAsesoriaDto,
    "page" | "limit" | "profesorNombre"
  >
): Promise<GetAllAsesoriasResponse> => {
  const request: GetAllAsesoriasRequest = {
    token,
    page,
    limit,
    profesorNombre,
    ...additionalFilters,
  };

  return getAllAsesorias(request);
};

// Obtener asesorías por asignatura
export const getAsesoriasByAsignatura = async (
  asignaturaNombre: string,
  token: string,
  page: number = 1,
  limit: number = 10,
  additionalFilters?: Omit<
    QueryAsesoriaDto,
    "page" | "limit" | "asignaturaNombre"
  >
): Promise<GetAllAsesoriasResponse> => {
  const request: GetAllAsesoriasRequest = {
    token,
    page,
    limit,
    asignaturaNombre,
    ...additionalFilters,
  };

  return getAllAsesorias(request);
};

// Obtener asesorías por carrera
export const getAsesoriasByCarrera = async (
  carreraNombre: string,
  token: string,
  page: number = 1,
  limit: number = 10,
  additionalFilters?: Omit<QueryAsesoriaDto, "page" | "limit" | "carreraNombre">
): Promise<GetAllAsesoriasResponse> => {
  const request: GetAllAsesoriasRequest = {
    token,
    page,
    limit,
    carreraNombre,
    ...additionalFilters,
  };

  return getAllAsesorias(request);
};
