import { type CargaAcademica } from "../index";

export interface GetCargaByProfesorRequest {
  token: string;
  profesorId: string;
  actual?: string;
}

export interface GetCargaByProfesorResponse {
  data: CargaAcademica[];
}
