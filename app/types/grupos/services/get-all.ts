import { type Grupo } from "../index";

export interface GetAllGruposRequest {
  token: string;
  search?: string;
  carrera?: string;
  cuatrimestre?: string;
  activo?: string;
  page?: string;
  limit?: string;
}

export interface GetAllGruposResponse {
  data: Grupo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
