import type { UpdateSeguimientoDetalleDto, SeguimientoDetalle } from "../index";

export interface UpdateSeguimientoDetalleRequest {
  id: string;
  data: UpdateSeguimientoDetalleDto;
}

export interface UpdateSeguimientoDetalleResponse {
  data: SeguimientoDetalle;
  message: string;
}
