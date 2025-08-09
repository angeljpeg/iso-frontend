export interface CreateAlumnoRequest {
  token: string;
  nombreAlumno: string;
  matricula?: string;
  carrera?: string;
  estadiaId: string;
  observacionesGenerales?: string;
}

export interface CreateAlumnoResponse {
  id: string;
  nombreAlumno: string;
  matricula: string | null;
  carrera: string | null;
  estadiaId: string;
  observacionesGenerales: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}