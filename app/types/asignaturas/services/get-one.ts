import type { Asignatura } from "../index";

export interface GetOneAsignaturaRequest {
  nombre: string;
  token: string;
}

export interface GetOneAsignaturaResponse {
  asignatura: Asignatura;
}
