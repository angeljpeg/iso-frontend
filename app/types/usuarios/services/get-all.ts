import type { RolUsuarioType, Usuario } from "..";

export interface GetAllUsuariosRequest {
  token: string;
  rol?: RolUsuarioType;
  activo?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetAllUsuariosResponse {
  data: Usuario[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
