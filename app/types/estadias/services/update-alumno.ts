export interface UpdateAlumnoRequest {
  token: string;
  id: string;
  nombreAlumno?: string;
  matricula?: string;
  carrera?: string;
  observacionesGenerales?: string;
}

export interface UpdateAlumnoResponse {
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