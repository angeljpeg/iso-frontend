import type {
  Seguimiento,
  FiltroSeguimiento,
  EstadisticasSeguimiento,
  NotificacionSeguimiento,
} from "../types/seguimiento";
import type { AuthError } from "../types/auth";
import {
  getAuthHeaders,
  handleAuthError,
  handleAuthErrorWithStatus,
} from "../utils/auth";
import { EstadoSeguimiento } from "~/types/enums";

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
      handleAuthErrorWithStatus(response.status);

      const error: AuthError = await response.json();
      throw new Error(error.message || "Error en la solicitud");
    }

    return response.json();
  }

  // Obtener seguimientos del profesor actual
  async getMisSeguimientos(): Promise<Seguimiento[]> {
    return this.makeRequest<Seguimiento[]>("/programacion-seguimiento-curso", {
      method: "GET",
    });
  }

  // Obtener seguimiento específico
  async getSeguimiento(id: string): Promise<Seguimiento> {
    return this.makeRequest<Seguimiento>(
      `/programacion-seguimiento-curso/${id}`,
      {
        method: "GET",
      }
    );
  }

  // Crear nuevo seguimiento
  async crearSeguimiento(
    seguimiento: Omit<Seguimiento, "id">
  ): Promise<Seguimiento> {
    return this.makeRequest<Seguimiento>("/programacion-seguimiento-curso", {
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
    return this.makeRequest<Seguimiento>(
      `/programacion-seguimiento-curso/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(seguimiento),
      }
    );
  }

  // Enviar seguimiento para revisión - Esta funcionalidad no existe en el backend
  // Se puede implementar como una actualización de estado
  async enviarSeguimiento(id: string): Promise<Seguimiento> {
    return this.makeRequest<Seguimiento>(
      `/programacion-seguimiento-curso/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: "enviado" }),
      }
    );
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
      ? `/programacion-seguimiento-curso?${queryString}`
      : "/programacion-seguimiento-curso";

    return this.makeRequest<Seguimiento[]>(endpoint, {
      method: "GET",
    });
  }

  // Revisar seguimiento - Implementar como actualización de estado
  async revisarSeguimiento(
    id: string,
    estado: "aprobado" | "rechazado",
    comentarios?: string
  ): Promise<Seguimiento> {
    return this.makeRequest<Seguimiento>(
      `/programacion-seguimiento-curso/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado, comentarios }),
      }
    );
  }

  async getEstadisticas(
    filtros?: FiltroSeguimiento
  ): Promise<EstadisticasSeguimiento> {
    const seguimientos = await this.getAllSeguimientos(filtros);

    const totalSeguimientos = seguimientos.length;
    const seguimientosAprobados = seguimientos.filter(
      (s) => s.estado === "aprobado"
    ).length;
    const seguimientosPendientes = seguimientos.filter(
      (s) => s.estado === "borrador" || s.estado === "enviado"
    ).length;
    const seguimientosRechazados = seguimientos.filter(
      (s) => s.estado === "rechazado"
    ).length;

    // Calcular retrasos basándose en avancesSemanales
    let retrasosCriticos = 0;
    let retrasosLeves = 0;
    let sinRetrasos = 0;

    seguimientos.forEach(seguimiento => {
      if (seguimiento.avancesSemanales && seguimiento.avancesSemanales.length > 0) {
        const tieneRetrasosCriticos = seguimiento.avancesSemanales.some(
          avance => avance.nivelRetraso === "retraso_critico"
        );
        const tieneRetrasosLeves = seguimiento.avancesSemanales.some(
          avance => avance.nivelRetraso === "retraso_leve"
        );
        
        if (tieneRetrasosCriticos) {
          retrasosCriticos++;
        } else if (tieneRetrasosLeves) {
          retrasosLeves++;
        } else {
          sinRetrasos++;
        }
      } else {
        sinRetrasos++;
      }
    });

    return {
      totalSeguimientos,
      seguimientosPendientes,
      seguimientosAprobados,
      seguimientosRechazados,
      retrasosCriticos,
      retrasosLeves,
      sinRetrasos,
    };
  }

  async getNotificaciones(): Promise<NotificacionSeguimiento[]> {
    const seguimientos = await this.getAllSeguimientos();
    const notificaciones: NotificacionSeguimiento[] = [];

    seguimientos.forEach(seguimiento => {
      // Notificaciones por estado
      if (seguimiento.estado === "rechazado") {
        notificaciones.push({
          id: `${seguimiento.id}-rechazado`,
          tipo: "seguimiento_rechazado",
          mensaje: `Seguimiento rechazado: ${seguimiento.asignatura?.nombre || 'Asignatura'}`,
          fechaCreacion: new Date(),
          leida: false,
          seguimientoId: seguimiento.id,
        });
      }

      if (seguimiento.estado === "borrador") {
        notificaciones.push({
          id: `${seguimiento.id}-pendiente`,
          tipo: "seguimiento_pendiente",
          mensaje: `Seguimiento pendiente: ${seguimiento.asignatura?.nombre || 'Asignatura'}`,
          fechaCreacion: new Date(),
          leida: false,
          seguimientoId: seguimiento.id,
        });
      }

      // Notificaciones por retrasos críticos
      if (seguimiento.avancesSemanales) {
        const tieneRetrasosCriticos = seguimiento.avancesSemanales.some(
          avance => avance.nivelRetraso === "retraso_critico"
        );
        
        if (tieneRetrasosCriticos) {
          notificaciones.push({
            id: `${seguimiento.id}-retraso`,
            tipo: "retraso_critico",
            mensaje: `Retraso crítico detectado: ${seguimiento.asignatura?.nombre || 'Asignatura'}`,
            fechaCreacion: new Date(),
            leida: false,
            seguimientoId: seguimiento.id,
          });
        }
      }
    });

    return notificaciones;
  }

  async marcarNotificacionLeida(id: string): Promise<void> {
    // Esta funcionalidad necesitaría ser implementada en el backend
    // Por ahora, solo simular la operación
    return Promise.resolve();
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
      handleAuthErrorWithStatus(response.status);
      const error: AuthError = await response.json();
      throw new Error(error.message || "Error al exportar");
    }

    return response.blob();
  }
}

export const seguimientoService = new SeguimientoService();
