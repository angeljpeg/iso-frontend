export interface CreateCargaAcademicaRequest {
  token: string;
  profesorId: string;
  carrera: string;
  asignatura: string;
  grupoId: string;
  esTutor?: boolean;
}

export interface CreateCargaAcademicaResponse {
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
