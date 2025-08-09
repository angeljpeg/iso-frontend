import { type Estadia } from "../index";

export interface GetReporteEstadiaRequest {
  token: string;
  estadiaId: string;
}

export interface GetReporteEstadiaResponse {
  data: Estadia;
}