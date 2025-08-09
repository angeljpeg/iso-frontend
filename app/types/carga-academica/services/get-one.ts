import { type CargaAcademica } from "../index";

export interface GetOneCargaAcademicaRequest {
  token: string;
  id: string;
}

export interface GetOneCargaAcademicaResponse extends CargaAcademica {}
