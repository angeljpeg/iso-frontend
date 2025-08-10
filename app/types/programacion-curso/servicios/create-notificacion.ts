import type { CreateNotificacionDto, NotificacionSeguimiento } from "../index";

export interface CreateNotificacionRequest {
  data: CreateNotificacionDto;
}

export interface CreateNotificacionResponse {
  data: NotificacionSeguimiento;
  message: string;
}
