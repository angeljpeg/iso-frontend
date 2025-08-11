export interface UpdateCargaAcademicaRequest {
  token: string;
  id: string;
  profesorId?: string;
  carrera?: string;
  asignatura?: string;
  grupoId?: string;
  esTutor?: boolean;
}

export interface UpdateCargaAcademicaResponse {
  id: string;
  profesorId: string;
  carrera: string;
  asignatura: string;
  grupoId: string;
  cuatrimestreId: string;
  activo: boolean;
  esTutor: boolean;
  createdAt: string;
  updatedAt: string;
}
