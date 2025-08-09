import type {
  // Servicios para Estadias
  CreateEstadiaRequest,
  CreateEstadiaResponse,
  GetAllEstadiasRequest,
  GetAllEstadiasResponse,
  GetEstadiasByProfesorRequest,
  GetEstadiasByProfesorResponse,
  GetEstadiaRequest,
  GetEstadiaResponse,
  UpdateEstadiaRequest,
  UpdateEstadiaResponse,
  DeleteEstadiaRequest,
  DeleteEstadiaResponse,
  // Servicios para Alumnos
  CreateAlumnoRequest,
  CreateAlumnoResponse,
  GetAllAlumnosRequest,
  GetAllAlumnosResponse,
  GetAlumnosByEstadiaRequest,
  GetAlumnosByEstadiaResponse,
  GetAlumnoRequest,
  GetAlumnoResponse,
  UpdateAlumnoRequest,
  UpdateAlumnoResponse,
  DeleteAlumnoRequest,
  DeleteAlumnoResponse,
  // Servicios para Progreso Mensual
  CreateProgresoRequest,
  CreateProgresoResponse,
  GetProgresoByAlumnoRequest,
  GetProgresoByAlumnoResponse,
  GetProgresoRequest,
  GetProgresoResponse,
  UpdateProgresoRequest,
  UpdateProgresoResponse,
  DeleteProgresoRequest,
  DeleteProgresoResponse,
  // Servicio para Reporte
  GetReporteEstadiaRequest,
  GetReporteEstadiaResponse,
} from "../types/estadias/services";
import { API_BASE_URL } from "./api-config";

const ESTADIAS_URL = `${API_BASE_URL}/estadias`;

// ==========================================
// SERVICIOS PARA ESTADÍAS
// ==========================================

// Crear nueva estadía
export const createEstadia = async (
  request: CreateEstadiaRequest
): Promise<CreateEstadiaResponse> => {
  try {
    const { token, ...estadiaData } = request;

    const response = await fetch(ESTADIAS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(estadiaData),
    });

    if (!response.ok) {
      throw new Error(
        `Error creating estadia: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as CreateEstadiaResponse;
  } catch (error) {
    console.error("Error creating estadia:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener todas las estadías (para coordinadores y moderadores)
export const getAllEstadias = async (
  request: GetAllEstadiasRequest
): Promise<GetAllEstadiasResponse> => {
  try {
    const { token } = request;

    const response = await fetch(ESTADIAS_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching estadias: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetAllEstadiasResponse;
  } catch (error) {
    console.error("Error fetching estadias:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener estadías del profesor autenticado
export const getEstadiasByProfesor = async (
  request: GetEstadiasByProfesorRequest
): Promise<GetEstadiasByProfesorResponse> => {
  try {
    const { token } = request;

    const response = await fetch(`${ESTADIAS_URL}/profesor`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching estadias by profesor: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetEstadiasByProfesorResponse;
  } catch (error) {
    console.error("Error fetching estadias by profesor:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener una estadía específica por ID
export const getEstadia = async (
  request: GetEstadiaRequest
): Promise<GetEstadiaResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${ESTADIAS_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching estadia: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetEstadiaResponse;
  } catch (error) {
    console.error("Error fetching estadia:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Actualizar estadía
export const updateEstadia = async (
  request: UpdateEstadiaRequest
): Promise<UpdateEstadiaResponse> => {
  try {
    const { token, id, ...estadiaData } = request;

    const response = await fetch(`${ESTADIAS_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(estadiaData),
    });

    if (!response.ok) {
      throw new Error(
        `Error updating estadia: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as UpdateEstadiaResponse;
  } catch (error) {
    console.error("Error updating estadia:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Eliminar estadía (soft delete)
export const deleteEstadia = async (
  request: DeleteEstadiaRequest
): Promise<DeleteEstadiaResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${ESTADIAS_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error deleting estadia: ${response.status} ${response.statusText}`
      );
    }

    return {
      message: "Estadía eliminada exitosamente",
    } as DeleteEstadiaResponse;
  } catch (error) {
    console.error("Error deleting estadia:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// ==========================================
// SERVICIOS PARA ALUMNOS DE ESTADÍA
// ==========================================

// Crear nuevo alumno en estadía
export const createAlumno = async (
  request: CreateAlumnoRequest
): Promise<CreateAlumnoResponse> => {
  try {
    const { token, ...alumnoData } = request;

    const response = await fetch(`${ESTADIAS_URL}/alumnos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(alumnoData),
    });

    if (!response.ok) {
      throw new Error(
        `Error creating alumno: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as CreateAlumnoResponse;
  } catch (error) {
    console.error("Error creating alumno:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener todos los alumnos
export const getAllAlumnos = async (
  request: GetAllAlumnosRequest
): Promise<GetAllAlumnosResponse> => {
  try {
    const { token } = request;

    const response = await fetch(`${ESTADIAS_URL}/alumnos/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching alumnos: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetAllAlumnosResponse;
  } catch (error) {
    console.error("Error fetching alumnos:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener alumnos por estadía
export const getAlumnosByEstadia = async (
  request: GetAlumnosByEstadiaRequest
): Promise<GetAlumnosByEstadiaResponse> => {
  try {
    const { token, estadiaId } = request;

    const response = await fetch(
      `${ESTADIAS_URL}/alumnos/estadia/${estadiaId}`,
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
        `Error fetching alumnos by estadia: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetAlumnosByEstadiaResponse;
  } catch (error) {
    console.error("Error fetching alumnos by estadia:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener un alumno específico por ID
export const getAlumno = async (
  request: GetAlumnoRequest
): Promise<GetAlumnoResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${ESTADIAS_URL}/alumnos/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching alumno: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetAlumnoResponse;
  } catch (error) {
    console.error("Error fetching alumno:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Actualizar alumno
export const updateAlumno = async (
  request: UpdateAlumnoRequest
): Promise<UpdateAlumnoResponse> => {
  try {
    const { token, id, ...alumnoData } = request;

    const response = await fetch(`${ESTADIAS_URL}/alumnos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(alumnoData),
    });

    if (!response.ok) {
      throw new Error(
        `Error updating alumno: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as UpdateAlumnoResponse;
  } catch (error) {
    console.error("Error updating alumno:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Eliminar alumno (soft delete)
export const deleteAlumno = async (
  request: DeleteAlumnoRequest
): Promise<DeleteAlumnoResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${ESTADIAS_URL}/alumnos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error deleting alumno: ${response.status} ${response.statusText}`
      );
    }

    return { message: "Alumno eliminado exitosamente" } as DeleteAlumnoResponse;
  } catch (error) {
    console.error("Error deleting alumno:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// ==========================================
// SERVICIOS PARA PROGRESO MENSUAL
// ==========================================

// Crear nuevo progreso mensual
export const createProgreso = async (
  request: CreateProgresoRequest
): Promise<CreateProgresoResponse> => {
  try {
    const { token, ...progresoData } = request;

    const response = await fetch(`${ESTADIAS_URL}/progreso`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(progresoData),
    });

    if (!response.ok) {
      throw new Error(
        `Error creating progreso: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as CreateProgresoResponse;
  } catch (error) {
    console.error("Error creating progreso:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener progreso por alumno
export const getProgresoByAlumno = async (
  request: GetProgresoByAlumnoRequest
): Promise<GetProgresoByAlumnoResponse> => {
  try {
    const { token, estadiaAlumnoId } = request;

    const response = await fetch(
      `${ESTADIAS_URL}/progreso/alumno/${estadiaAlumnoId}`,
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
        `Error fetching progreso by alumno: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetProgresoByAlumnoResponse;
  } catch (error) {
    console.error("Error fetching progreso by alumno:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Obtener un progreso específico por ID
export const getProgreso = async (
  request: GetProgresoRequest
): Promise<GetProgresoResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${ESTADIAS_URL}/progreso/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching progreso: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetProgresoResponse;
  } catch (error) {
    console.error("Error fetching progreso:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Actualizar progreso mensual
export const updateProgreso = async (
  request: UpdateProgresoRequest
): Promise<UpdateProgresoResponse> => {
  try {
    const { token, id, ...progresoData } = request;

    const response = await fetch(`${ESTADIAS_URL}/progreso/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(progresoData),
    });

    if (!response.ok) {
      throw new Error(
        `Error updating progreso: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return (await response.json()) as UpdateProgresoResponse;
  } catch (error) {
    console.error("Error updating progreso:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// Eliminar progreso mensual
export const deleteProgreso = async (
  request: DeleteProgresoRequest
): Promise<DeleteProgresoResponse> => {
  try {
    const { token, id } = request;

    const response = await fetch(`${ESTADIAS_URL}/progreso/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error deleting progreso: ${response.status} ${response.statusText}`
      );
    }

    return {
      message: "Progreso eliminado exitosamente",
    } as DeleteProgresoResponse;
  } catch (error) {
    console.error("Error deleting progreso:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// ==========================================
// SERVICIO PARA REPORTE
// ==========================================

// Obtener reporte completo de estadía
export const getReporteEstadia = async (
  request: GetReporteEstadiaRequest
): Promise<GetReporteEstadiaResponse> => {
  try {
    const { token, estadiaId } = request;

    const response = await fetch(`${ESTADIAS_URL}/reporte/${estadiaId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error fetching reporte estadia: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    const data = await response.json();
    return { data } as GetReporteEstadiaResponse;
  } catch (error) {
    console.error("Error fetching reporte estadia:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};

// ==========================================
// ENDPOINT DE PRUEBA
// ==========================================

// Función para probar la conectividad con el controlador
export const testEstadiasController = async (): Promise<{
  message: string;
  timestamp: string;
}> => {
  try {
    const response = await fetch(`${ESTADIAS_URL}/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Error testing estadias controller: ${response.status} ${response.statusText}`
      );
    }

    if (!response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Respuesta no es JSON válida");
    }

    return await response.json();
  } catch (error) {
    console.error("Error testing estadias controller:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
};
