import type { Tema } from "../../temas";

export interface GetTemasAsignaturaRequest {
  nombre: string;
  token: string;
}

export interface GetTemasAsignaturaResponse {
  temas: Tema[];
}
