import { type EstadiaAlumno } from "../index";

export interface GetAlumnosByEstadiaRequest {
  token: string;
  estadiaId: string;
}

export interface GetAlumnosByEstadiaResponse {
  data: EstadiaAlumno[];
}