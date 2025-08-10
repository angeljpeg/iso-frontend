import type { SeguimientoCurso } from "../index";

export interface GetSeguimientosByCuatrimestreRequest {
  token: string;
  cuatrimestreId: string;
  page?: number;
  limit?: number;
  estado?: string;
  carrera?: string;
}

export interface GetSeguimientosByCuatrimestreResponse {
  data: SeguimientoCurso[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
