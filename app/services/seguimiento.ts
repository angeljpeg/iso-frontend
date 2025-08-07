import type {
  Seguimiento,
  FiltroSeguimiento,
  EstadisticasSeguimiento,
  NotificacionSeguimiento,
} from "../types/seguimiento";
import type { AuthError } from "../types/auth";
import { getAuthHeaders, handleAuthError } from "../utils/auth";

const API_BASE_URL = "http://localhost:3000";

class SeguimientoService {
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

  // Obtener seguimientos del profesor actual
  async getMisSeguimientos(): Promise<Seguimiento[]> {
    return this.makeRequest<Seguimiento[]>("/seguimiento/mis-seguimientos", {
      method: "GET",
    });
  }

  // Obtener seguimiento específico
  async getSeguimiento(id: string): Promise<Seguimiento> {
    return this.makeRequest<Seguimiento>(`/seguimiento/${id}`, {
      method: "GET",
    });
  }

  // Crear nuevo seguimiento
  async crearSeguimiento(
    seguimiento: Omit<Seguimiento, "id">
  ): Promise<Seguimiento> {
    return this.makeRequest<Seguimiento>("/seguimiento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seguimiento),
    });
  }

  // Actualizar seguimiento
  async actualizarSeguimiento(
    id: string,
    seguimiento: Partial<Seguimiento>
  ): Promise<Seguimiento> {
    return this.makeRequest<Seguimiento>(`/seguimiento/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seguimiento),
    });
  }

  // Enviar seguimiento para revisión
  async enviarSeguimiento(id: string): Promise<Seguimiento> {
    return this.makeRequest<Seguimiento>(`/seguimiento/${id}/enviar`, {
      method: "POST",
    });
  }

  // Obtener todos los seguimientos (para directores/coordinadores)
  async getAllSeguimientos(
    filtros?: FiltroSeguimiento
  ): Promise<Seguimiento[]> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `/seguimiento?${queryString}`
      : "/seguimiento";

    return this.makeRequest<Seguimiento[]>(endpoint, {
      method: "GET",
    });
  }

  // Revisar seguimiento (aprobar/rechazar)
  async revisarSeguimiento(
    id: string,
    estado: "aprobado" | "rechazado",
    comentarios?: string
  ): Promise<Seguimiento> {
    return this.makeRequest<Seguimiento>(`/seguimiento/${id}/revisar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ estado, comentarios }),
    });
  }

  // Obtener estadísticas
  async getEstadisticas(
    filtros?: FiltroSeguimiento
  ): Promise<EstadisticasSeguimiento> {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `/seguimiento/estadisticas?${queryString}`
      : "/seguimiento/estadisticas";

    return this.makeRequest<EstadisticasSeguimiento>(endpoint, {
      method: "GET",
    });
  }

  // Obtener notificaciones
  async getNotificaciones(): Promise<NotificacionSeguimiento[]> {
    return this.makeRequest<NotificacionSeguimiento[]>(
      "/seguimiento/notificaciones",
      {
        method: "GET",
      }
    );
  }

  // Marcar notificación como leída
  async marcarNotificacionLeida(id: string): Promise<void> {
    return this.makeRequest<void>(`/seguimiento/notificaciones/${id}/leer`, {
      method: "POST",
    });
  }

  // Exportar reporte
  async exportarReporte(
    filtros?: FiltroSeguimiento,
    formato: "pdf" | "excel" = "pdf"
  ): Promise<Blob> {
    const params = new URLSearchParams();
    params.append("formato", formato);

    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            params.append(key, value.toISOString());
          } else {
            params.append(key, String(value));
          }
        }
      });
    }

    const url = `${API_BASE_URL}/seguimiento/exportar?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      handleAuthError(response.status);
      const error: AuthError = await response.json();
      throw new Error(error.message || "Error al exportar");
    }

    return response.blob();
  }
}

export const seguimientoService = new SeguimientoService();
