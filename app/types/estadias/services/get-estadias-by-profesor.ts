import { type Estadia } from "../index";

export interface GetEstadiasByProfesorRequest {
  token: string;
}

export interface GetEstadiasByProfesorResponse {
  data: Estadia[];
}