import type { Asignatura, CargaAcademica } from "../types/carga-academica";
import type { Tema } from "../types/carga-academica";
import type { AuthError } from "../types/auth";
import { getAuthHeaders, handleAuthError } from "../utils/auth";

const API_BASE_URL = "http://localhost:3000";

// Tipo para la respuesta paginada del backend
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CargaAcademicaService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      handleAuthError(response.status);

      const error: AuthError = await response.json();
      throw new Error(error.message || "Error en la solicitud");
    }

    return response.json();
  }

  async getMiCargaActual(): Promise<CargaAcademica[]> {
    return this.makeRequest<CargaAcademica[]>(
      "/carga-academica/mi-carga?actual=true",
      {
        method: "GET",
      }
    );
  }

  async getTemasByAsignatura(asignaturaId: string): Promise<Asignatura> {
    return this.makeRequest<Asignatura>(`/asignaturas/${asignaturaId}`, {
      method: "GET",
    });
  }

  async getAsignaturaById(asignaturaId: string): Promise<Asignatura> {
    return this.makeRequest<Asignatura>(`/asignaturas/${asignaturaId}`, {
      method: "GET",
    });
  }
}

export const cargaAcademicaService = new CargaAcademicaService();
