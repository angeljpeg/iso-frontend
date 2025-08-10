import type { Asignatura } from "../index";

export interface GetAsignaturaCompletaRequest {
  nombre: string;
  token: string;
}

export interface GetAsignaturaCompletaResponse {
  asignatura: Asignatura;
}
