import type { SeguimientoDetalle } from "../index";

export interface GetSeguimientoDetallesRequest {
  token: string;
  seguimientoCursoId: string;
}

export interface GetSeguimientoDetallesResponse {
  data: SeguimientoDetalle[];
  total: number;
}
