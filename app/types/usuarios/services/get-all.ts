import type { RolUsuario, Usuario } from "..";

export interface GetAllUsuariosRequest {
  token: string;
  rol?: RolUsuario;
  estado?: boolean;
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
