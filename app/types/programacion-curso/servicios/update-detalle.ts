import type { UpdateSeguimientoDetalleDto, SeguimientoDetalle } from "../index";

export interface UpdateSeguimientoDetalleRequest {
  token: string;
  seguimientoId: string;
  detalleId: string;
  data: UpdateSeguimientoDetalleDto;
}

export interface UpdateSeguimientoDetalleResponse {
  data: SeguimientoDetalle;
  message: string;
}
