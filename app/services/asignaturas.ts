import type { Asignatura } from "../types/asignaturas";
import type { AuthError } from "../types/auth";
import { getAuthHeaders, handleAuthError } from "../utils/auth";

const API_BASE_URL = "http://localhost:3000";

class AsignaturasService {
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
      handleAuthError();

      const error: AuthError = await response.json();
      throw new Error(error.message || "Error en la solicitud");
    }

    return response.json();
  }

  async getAsignaturaByNombre(nombre: string): Promise<Asignatura> {
    // Codificar el nombre para manejar espacios y caracteres especiales
    const encodedNombre = encodeURIComponent(nombre);
    return this.makeRequest<Asignatura>(
      `/asignaturas/${encodedNombre}/completa`,
      {
        method: "GET",
      }
    );
  }

  async getAllAsignaturas(): Promise<Asignatura[]> {
    const response = await this.makeRequest<{
      data: Asignatura[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/asignaturas`, {
      method: "GET",
    });
    return response.data;
  }
}

export const asignaturasService = new AsignaturasService();
