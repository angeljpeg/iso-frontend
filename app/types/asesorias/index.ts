import { type CargaAcademica } from "../carga-academica";

// Tipos principales de asesorías
export interface Asesoria {
  id: string;
  temaAsesoria: string;
  fecha: string;
  numeroAlumnos: number;
  nombreAlumno: string;
  duracionAsesoria: number;
  cargaAcademicaId: string;
  activo: boolean;
  cargaAcademica: {
    id: string;
    carrera: string;
    asignatura: string;
    profesor: {
      id: string;
      nombre: string;
      apellido: string;
    };
    grupo: {
      id: string;
      nombreGenerado: string;
    };
    cuatrimestre: {
      id: string;
      nombreGenerado: string;
    };
  };
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
  profesorId?: string;
  cuatrimestreId?: string;
  grupoId?: string;
  temaAsesoria?: string;
  asignaturaId?: string;
  carrera?: string;
  fechaInicio?: string;
  fechaFin?: string;
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

// Tipos para reportes
export * from "./reportes";
