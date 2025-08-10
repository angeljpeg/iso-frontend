import type { Asignatura, AsignaturaFilters } from "../index";

export interface GetAllAsignaturasRequest extends AsignaturaFilters {
  token: string;
}

export interface GetAllAsignaturasResponse {
  data: Asignatura[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
