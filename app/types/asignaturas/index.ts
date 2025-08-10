import type { Tema } from "../temas";

// Interfaces principales
export interface Asignatura {
  nombre: string;
  horasProgramadas: number;
  temas: Tema[];
}

export interface AsignaturaWithCarrera {
  asignatura: Asignatura;
  carrera: {
    codigo: string;
    nombre: string;
    activo: boolean;
  };
}

export interface AsignaturaResponse {
  data: Asignatura[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AsignaturaFilters {
  search?: string;
  carrera?: string;
  page?: number;
  limit?: number;
}

export * from "./services";
