import type { SeguimientoCurso } from "../index";

export interface GetSeguimientosByProfesorRequest {
  profesorId: string;
  page?: number;
  limit?: number;
  estado?: string;
  cuatrimestreId?: string;
}

export interface GetSeguimientosByProfesorResponse {
  data: SeguimientoCurso[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
