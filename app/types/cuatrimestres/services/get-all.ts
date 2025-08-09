import type { Cuatrimestre, CuatrimestreEstadoType } from "../index";

export interface GetAllCuatrimestresRequest {
  año?: number;
  fechaInicio?: string; // formato YYYY-MM-DD
  fechaFin?: string; // formato YYYY-MM-DD
  actual?: boolean;
  page?: number;
  limit?: number;
  token: string;
}

export interface GetAllCuatrimestresResponse {
  data: (Cuatrimestre & { estado: CuatrimestreEstadoType })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
