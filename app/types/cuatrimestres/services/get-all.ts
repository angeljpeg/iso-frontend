import type { Cuatrimestre, CuatrimestreEstadoType } from "../index";

export interface GetAllCuatrimestresRequest {
  año?: string;
  fechaInicio?: string; // formato YYYY-MM-DD
  fechaFin?: string; // formato YYYY-MM-DD
  actual?: string;
  page?: string;
  limit?: string;
  token: string;
}

export interface GetAllCuatrimestresResponse {
  data: (Cuatrimestre & { estado: CuatrimestreEstadoType })[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
