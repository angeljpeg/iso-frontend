import type {
  CreateCargaAcademicaRequest,
  CreateCargaAcademicaResponse,
  UpdateCargaAcademicaRequest,
  UpdateCargaAcademicaResponse,
  DeleteCargaAcademicaRequest,
  GetAllCargaAcademicaRequest,
  GetAllCargaAcademicaResponse,
  GetOneCargaAcademicaRequest,
  GetOneCargaAcademicaResponse,
  GetCargaByProfesorRequest,
  GetCargaByProfesorResponse,
  GetMyCargaRequest,
  GetMyCargaResponse,
} from "~/types/carga-academica/services";
import { API_BASE_URL } from "./api-config";

const CARGA_ACADEMICA_URL = `${API_BASE_URL}/carga-academica`;

// Obtener todas las asignaciones de carga académica
export const getAllCargaAcademica = async (
  request: GetAllCargaAcademicaRequest
): Promise<GetAllCargaAcademicaResponse> => {
  try {
    const { token, ...rest } = request;

    const params = new URLSearchParams(
      Object.entries(rest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${CARGA_ACADEMICA_URL}?${params}`;

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
        `Error al obtener carga académica: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetAllCargaAcademicaResponse;
  } catch (error) {
    console.error("Error fetching carga académica:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Crear nueva asignación de carga académica
export const createCargaAcademica = async (
  request: CreateCargaAcademicaRequest
): Promise<CreateCargaAcademicaResponse> => {
  try {
    const { token, ...cargaData } = request;

    const requestBody = JSON.stringify(cargaData);

    const response = await fetch(CARGA_ACADEMICA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: requestBody,
    });

    // Debug logging removed for production

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }

      // Intentar obtener más detalles del error
      let errorDetails = "";
      try {
        const errorResponse = await response.text();
        errorDetails = errorResponse;
        // Debug logging removed for production
      } catch (e) {
        errorDetails = "No se pudieron obtener detalles del error";
      }

      throw new Error(
        `Error al crear carga académica: ${response.status} ${response.statusText} - ${errorDetails}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as CreateCargaAcademicaResponse;
  } catch (error) {
    console.error("Error creating carga académica:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener una asignación específica por ID
export const getOneCargaAcademica = async (
  request: GetOneCargaAcademicaRequest
): Promise<GetOneCargaAcademicaResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${CARGA_ACADEMICA_URL}/${id}`, {
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
        `Error al obtener carga académica: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetOneCargaAcademicaResponse;
  } catch (error) {
    console.error("Error fetching carga académica:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Actualizar asignación de carga académica
export const updateCargaAcademica = async (
  request: UpdateCargaAcademicaRequest
): Promise<UpdateCargaAcademicaResponse> => {
  try {
    const { token, id, ...cargaData } = request;

    const response = await fetch(`${CARGA_ACADEMICA_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cargaData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Sesión expirada");
      }
      throw new Error(
        `Error al actualizar carga académica: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as UpdateCargaAcademicaResponse;
  } catch (error) {
    console.error("Error updating carga académica:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Eliminar asignación de carga académica (soft delete)
export const deleteCargaAcademica = async (
  request: DeleteCargaAcademicaRequest
): Promise<void> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${CARGA_ACADEMICA_URL}/${id}`, {
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
      throw new Error(
        `Error al eliminar carga académica: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error deleting carga académica:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener carga académica de un profesor específico
export const getCargaByProfesor = async (
  request: GetCargaByProfesorRequest
): Promise<GetCargaByProfesorResponse> => {
  try {
    const { token, profesorId, actual } = request;

    const params = new URLSearchParams();
    if (actual !== undefined) {
      params.append("actual", actual.toString());
    }

    const FETCH_URL = `${CARGA_ACADEMICA_URL}/profesor/${profesorId}?${params}`;

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
        `Error al obtener carga por profesor: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetCargaByProfesorResponse;
  } catch (error) {
    console.error("Error fetching carga by profesor:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener mi propia carga académica (para profesores)
export const getMyCarga = async (
  request: GetMyCargaRequest
): Promise<GetMyCargaResponse> => {
  try {
    const { token, actual } = request;

    const params = new URLSearchParams();
    if (actual !== undefined) {
      params.append("actual", actual.toString());
    }

    const FETCH_URL = `${CARGA_ACADEMICA_URL}/mi-carga?${params}`;

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
        `Error al obtener mi carga: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetMyCargaResponse;
  } catch (error) {
    console.error("Error fetching mi carga:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
