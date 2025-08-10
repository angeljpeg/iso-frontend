import type { NotificacionSeguimiento } from "../index";

export interface UpdateNotificacionRequest {
  id: string;
  data: Partial<NotificacionSeguimiento>;
}

export interface UpdateNotificacionResponse {
  data: NotificacionSeguimiento;
  message: string;
}
