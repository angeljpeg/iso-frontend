import { type ProgresoMensual } from "../index";

export interface GetProgresoByAlumnoRequest {
  token: string;
  estadiaAlumnoId: string;
}

export interface GetProgresoByAlumnoResponse {
  data: ProgresoMensual[];
}