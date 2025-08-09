import { type ProgresoMensual } from "../index";

export interface GetProgresoRequest {
  token: string;
  id: string;
}

export interface GetProgresoResponse {
  data: ProgresoMensual;
}