export interface UpdateCargaAcademicaRequest {
  token: string;
  id: string;
  profesorId?: string;
  carrera?: string;
  asignatura?: string;
  grupoId?: string;
}

export interface UpdateCargaAcademicaResponse {
  id: string;
  profesorId: string;
  carrera: string;
  asignatura: string;
  grupoId: string;
  cuatrimestreId: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}