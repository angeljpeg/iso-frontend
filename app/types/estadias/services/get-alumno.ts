import { type EstadiaAlumno } from "../index";

export interface GetAlumnoRequest {
  token: string;
  id: string;
}

export interface GetAlumnoResponse {
  data: EstadiaAlumno;
}