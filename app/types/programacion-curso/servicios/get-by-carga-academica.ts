import type { SeguimientoCurso } from "../index";

export interface GetSeguimientosByCargaAcademicaRequest {
  token: string;
  cargaAcademicaId: string;
  page?: number;
  limit?: number;
}

export interface GetSeguimientosByCargaAcademicaResponse {
  data: SeguimientoCurso[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
