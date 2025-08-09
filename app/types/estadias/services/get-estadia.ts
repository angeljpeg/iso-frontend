import { type Estadia } from "../index";

export interface GetEstadiaRequest {
  token: string;
  id: string;
}

export interface GetEstadiaResponse {
  data: Estadia;
}