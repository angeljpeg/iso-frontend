import type {
  // Servicios para Asignaturas
  GetAllAsignaturasRequest,
  GetAllAsignaturasResponse,
  GetOneAsignaturaRequest,
  GetOneAsignaturaResponse,
  GetTemasAsignaturaRequest,
  GetTemasAsignaturaResponse,
  GetAsignaturaCompletaRequest,
  GetAsignaturaCompletaResponse,
  GetAsignaturasByCarreraRequest,
  GetAsignaturasByCarreraResponse,
} from "../types/asignaturas/services";
import { API_BASE_URL } from "./api-config";

const ASIGNATURAS_URL = `${API_BASE_URL}/asignaturas`;

// ==========================================
// SERVICIOS PARA ASIGNATURAS
// ==========================================

// Obtener todas las asignaturas con filtros
export const getAllAsignaturas = async (
  request: GetAllAsignaturasRequest
): Promise<GetAllAsignaturasResponse> => {
  try {
    const { token, ...rest } = request;

    const params = new URLSearchParams(
      Object.entries(rest).filter(([, v]) => v !== undefined) as [
        string,
        string
      ][]
    );

    const FETCH_URL = `${ASIGNATURAS_URL}?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching asignaturas: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetAllAsignaturasResponse;
  } catch (error) {
    console.error("Error fetching asignaturas:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener una asignatura específica por nombre
export const getOneAsignatura = async (
  request: GetOneAsignaturaRequest
): Promise<GetOneAsignaturaResponse> => {
  try {
    const { token, nombre } = request;

    const response = await fetch(`${ASIGNATURAS_URL}/${nombre}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching asignatura: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const asignatura = await response.json();
    return { asignatura } as GetOneAsignaturaResponse;
  } catch (error) {
    console.error("Error fetching asignatura:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener temas de una asignatura específica
export const getTemasAsignatura = async (
  request: GetTemasAsignaturaRequest
): Promise<GetTemasAsignaturaResponse> => {
  try {
    const { token, nombre } = request;

    const response = await fetch(`${ASIGNATURAS_URL}/${nombre}/temas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching temas de asignatura: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const temas = await response.json();
    return { temas } as GetTemasAsignaturaResponse;
  } catch (error) {
    console.error("Error fetching temas de asignatura:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener asignatura completa con temas
export const getAsignaturaCompleta = async (
  request: GetAsignaturaCompletaRequest
): Promise<GetAsignaturaCompletaResponse> => {
  try {
    const { token, nombre } = request;

    const response = await fetch(`${ASIGNATURAS_URL}/${nombre}/completa`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching asignatura completa: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const asignatura = await response.json();
    return { asignatura } as GetAsignaturaCompletaResponse;
  } catch (error) {
    console.error("Error fetching asignatura completa:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener asignaturas por carrera específica
export const getAsignaturasByCarrera = async (
  request: GetAsignaturasByCarreraRequest
): Promise<GetAsignaturasByCarreraResponse> => {
  try {
    const { token, codigoCarrera } = request;

    // Nota: Este endpoint no existe en el backend actual, pero se puede implementar
    // como una extensión del endpoint principal con filtro de carrera
    const response = await fetch(
      `${ASIGNATURAS_URL}?carrera=${codigoCarrera}`,
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
        `Error fetching asignaturas por carrera: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { asignaturas: data.data } as GetAsignaturasByCarreraResponse;
  } catch (error) {
    console.error("Error fetching asignaturas por carrera:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// ==========================================
// FUNCIONES DE UTILIDAD
// ==========================================

// Función para buscar asignaturas por texto
export const searchAsignaturas = async (
  searchTerm: string,
  token: string,
  carrera?: string,
  page?: number,
  limit?: number
): Promise<GetAllAsignaturasResponse> => {
  try {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (carrera) params.append("carrera", carrera);
    if (page) params.append("page", page.toString());
    if (limit) params.append("limit", limit.toString());

    const FETCH_URL = `${ASIGNATURAS_URL}?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error searching asignaturas: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetAllAsignaturasResponse;
  } catch (error) {
    console.error("Error searching asignaturas:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Función para obtener asignaturas con paginación
export const getAsignaturasPaginated = async (
  page: number = 1,
  limit: number = 10,
  token: string,
  search?: string,
  carrera?: string
): Promise<GetAllAsignaturasResponse> => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (carrera) params.append("carrera", carrera);

    const FETCH_URL = `${ASIGNATURAS_URL}?${params}`;

    const response = await fetch(FETCH_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching asignaturas paginadas: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as GetAllAsignaturasResponse;
  } catch (error) {
    console.error("Error fetching asignaturas paginadas:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// ==========================================
// ENDPOINT DE PRUEBA
// ==========================================

// Función para probar la conectividad con el controlador
export const testAsignaturasController = async (): Promise<{
  message: string;
  timestamp: string;
}> => {
  try {
    const response = await fetch(`${ASIGNATURAS_URL}/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error testing asignaturas controller: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return await response.json();
  } catch (error) {
    console.error("Error testing asignaturas controller:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
