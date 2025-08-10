import type { NotificacionSeguimiento } from "../index";

export interface GetNotificacionesRequest {
  usuarioId?: string;
  seguimientoCursoId?: string;
  tipo?: string;
  estado?: string;
  page?: number;
  limit?: number;
}

export interface GetNotificacionesResponse {
  data: NotificacionSeguimiento[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
