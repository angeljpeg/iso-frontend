import type { Grupo, CargaAcademica } from "../types/carga-academica";
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

class GruposService {
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

  async getGrupoById(grupoId: string): Promise<Grupo> {
    return this.makeRequest<Grupo>(`/grupos/${grupoId}`, {
      method: "GET",
    });
  }

  async getCargaAcademicaByGrupo(grupoId: string): Promise<CargaAcademica[]> {
    const response = await this.makeRequest<PaginatedResponse<CargaAcademica>>(
      `/carga-academica?grupoId=${grupoId}`,
      {
        method: "GET",
      }
    );
    // Extraer solo el array de datos de la respuesta paginada
    return response.data;
  }
}

export const gruposService = new GruposService();