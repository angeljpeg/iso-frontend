import type {
  Grupo,
  GetAllGruposRequest,
  GetAllGruposResponse,
  CreateGrupoRequest,
  CreateGrupoResponse,
  UpdateGrupoRequest,
  UpdateGrupoResponse,
  GetOneGrupoRequest,
  GetOneGrupoResponse,
  DeactivateGrupoRequest,
  DeactivateGrupoResponse,
  ReactivateGrupoRequest,
  ReactivateGrupoResponse,
  DeleteGrupoRequest,
  GetCarrerasDisponiblesRequest,
  GetCarrerasDisponiblesResponse,
} from "../types/grupos";
import type { CargaAcademica } from "../types/carga-academica";
import { API_BASE_URL } from "./api-config";

const GRUPOS_URL = `${API_BASE_URL}/grupos`;

// Tipo para la respuesta paginada del backend
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Obtener todos los grupos
export const getAllGrupos = async (
  request: GetAllGruposRequest
): Promise<GetAllGruposResponse> => {
  try {
    const { token, ...rest } = request;

    const params = new URLSearchParams(
      Object.entries(rest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${GRUPOS_URL}?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching grupos: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetAllGruposResponse;
  } catch (error) {
    console.error("Error fetching grupos:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Crear nuevo grupo
export const createGrupo = async (
  request: CreateGrupoRequest
): Promise<CreateGrupoResponse> => {
  try {
    const { token, ...grupoData } = request;

    const response = await fetch(GRUPOS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(grupoData),
    });

    if (!response.ok) {
      throw new Error(
        `Error creating grupo: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as CreateGrupoResponse;
  } catch (error) {
    console.error("Error creating grupo:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener un grupo específico por ID
export const getOneGrupo = async (
  request: GetOneGrupoRequest
): Promise<GetOneGrupoResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${GRUPOS_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching grupo: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetOneGrupoResponse;
  } catch (error) {
    console.error("Error fetching grupo:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Actualizar grupo
export const updateGrupo = async (
  request: UpdateGrupoRequest
): Promise<UpdateGrupoResponse> => {
  try {
    const { token, id, ...grupoData } = request;

    const response = await fetch(`${GRUPOS_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(grupoData),
    });

    if (!response.ok) {
      throw new Error(
        `Error updating grupo: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as UpdateGrupoResponse;
  } catch (error) {
    console.error("Error updating grupo:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Desactivar grupo
export const deactivateGrupo = async (
  request: DeactivateGrupoRequest
): Promise<DeactivateGrupoResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${GRUPOS_URL}/${id}/deactivate`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error deactivating grupo: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as DeactivateGrupoResponse;
  } catch (error) {
    console.error("Error deactivating grupo:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Reactivar grupo
export const reactivateGrupo = async (
  request: ReactivateGrupoRequest
): Promise<ReactivateGrupoResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${GRUPOS_URL}/${id}/reactivate`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error reactivating grupo: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as ReactivateGrupoResponse;
  } catch (error) {
    console.error("Error reactivating grupo:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Eliminar grupo
export const deleteGrupo = async (
  request: DeleteGrupoRequest
): Promise<void> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${GRUPOS_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error deleting grupo: ${response.status} ${response.statusText}`
      );
    }

    // No verificar content-type ya que el backend puede no enviar JSON
    // Solo verificar que la respuesta sea exitosa (200-299)
  } catch (error) {
    console.error("Error deleting grupo:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener carreras disponibles
export const getCarrerasDisponibles = async (
  request: GetCarrerasDisponiblesRequest
): Promise<GetCarrerasDisponiblesResponse> => {
  try {
    const { token } = request;

    const response = await fetch(`${GRUPOS_URL}/carreras`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching carreras: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetCarrerasDisponiblesResponse;
  } catch (error) {
    console.error("Error fetching carreras:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener carga académica por grupo (mantener compatibilidad con el hook existente)
export const getCargaAcademicaByGrupo = async (
  grupoId: string,
  token: string
): Promise<CargaAcademica[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/carga-academica?grupoId=${grupoId}`,
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
        `Error fetching carga académica: ${response.status} ${response.statusText}`
      );
    }

    const data: PaginatedResponse<CargaAcademica> = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching carga académica:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Clase de servicio legacy (mantener para compatibilidad)
class GruposService {
  async getGrupoById(grupoId: string): Promise<Grupo> {
    // Esta función necesitará el token, pero para mantener compatibilidad
    // se puede obtener del store de auth
    throw new Error("Use getOneGrupo function instead");
  }

  async getCargaAcademicaByGrupo(grupoId: string): Promise<CargaAcademica[]> {
    // Esta función necesitará el token, pero para mantener compatibilidad
    // se puede obtener del store de auth
    throw new Error("Use getCargaAcademicaByGrupo function instead");
  }
}

export const gruposService = new GruposService();
