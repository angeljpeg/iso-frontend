import type { EstadoSeguimiento } from "../index";

export interface GetSeguimientoEstadoRequest {
  id: string;
}

export interface GetSeguimientoEstadoResponse {
  estado: EstadoSeguimiento;
  fechaRevision?: string;
  fechaSeguimientoFinal?: string;
  numeroRevision: number;
}
