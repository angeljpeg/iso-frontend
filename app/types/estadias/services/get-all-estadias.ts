import { type Estadia } from "../index";

export interface GetAllEstadiasRequest {
  token: string;
}

export interface GetAllEstadiasResponse {
  data: Estadia[];
}