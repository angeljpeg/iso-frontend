import { type CargaAcademica } from "../carga-academica";
export * from "./services";
export * from "./columns-table";
export * from "./reportes";

// Interfaces principales
export interface Asesoria {
  id: string;
  temaAsesoria: string;
  fecha: string;
  numeroAlumnos: number;
  nombreAlumno: string;
  duracionAsesoria: number;
  cargaAcademicaId: string;
  activo: boolean;
  cargaAcademica: CargaAcademica;
  createdAt: string;
  updatedAt: string;
}

// Tipos para formularios y creación
export interface CreateAsesoriaDto {
  cargaAcademicaId: string;
  temaAsesoria: string;
  fecha: string;
  numeroAlumnos: number;
  nombreAlumno: string;
  duracionAsesoria: number;
}

// Tipos para actualización
export interface UpdateAsesoriaDto {
  cargaAcademicaId?: string;
  temaAsesoria?: string;
  fecha?: string;
  numeroAlumnos?: number;
  nombreAlumno?: string;
  duracionAsesoria?: number;
}

// Tipos para consultas y filtros
export interface QueryAsesoriaDto {
  profesorNombre?: string;
  cuatrimestreNombre?: string;
  grupoNombre?: string;
  temaNombre?: string;
  asignaturaNombre?: string;
  carreraNombre?: string;
  cuatrimestreActual?: boolean;
  page?: number;
  limit?: number;
}

// Tipos para respuestas paginadas
export interface AsesoriaResponseDto {
  data: Asesoria[];
  total: number;
  page: number;
  limit: number;
}
