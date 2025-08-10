import type { EstadoSeguimiento } from "../index";

export interface UpdateSeguimientoEstadoRequest {
  id: string;
  estado: EstadoSeguimiento;
  fechaRevision?: string;
  fechaSeguimientoFinal?: string;
  numeroRevision?: number;
}

export interface UpdateSeguimientoEstadoResponse {
  message: string;
  success: boolean;
  nuevoEstado: EstadoSeguimiento;
}
