import { type CargaAcademica } from "../index";

export interface GetMyCargaRequest {
  token: string;
  actual?: string;
}

export interface GetMyCargaResponse {
  data: CargaAcademica[];
}
