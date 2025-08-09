import { type EstadiaAlumno } from "../index";

export interface GetAllAlumnosRequest {
  token: string;
}

export interface GetAllAlumnosResponse {
  data: EstadiaAlumno[];
}