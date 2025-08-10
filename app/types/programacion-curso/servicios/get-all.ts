import type { SeguimientoCurso } from "../index";

export interface GetSeguimientosCursoResponse {
  data: SeguimientoCurso[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetSeguimientosCursoRequest {
  token: string;
  page?: number;
  limit?: number;
  estado?: string;
  cuatrimestreId?: string;
  profesorId?: string;
  carrera?: string;
  search?: string;
}
