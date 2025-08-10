import type { Asignatura } from "../index";

export interface GetAsignaturasByCarreraRequest {
  codigoCarrera: string;
  token: string;
}

export interface GetAsignaturasByCarreraResponse {
  asignaturas: Asignatura[];
}
