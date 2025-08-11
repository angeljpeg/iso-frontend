import { type Usuario } from "../usuarios";
import { type Grupo } from "../grupos";
export * from "./services";

export interface CargaAcademica {
  id: string;
  profesorId: string;
  carrera: string;
  asignatura: string;
  grupoId: string;
  cuatrimestreId: string;
  activo: boolean;
  esTutor: boolean;
  profesor: Usuario;
  grupo: Grupo;
  createdAt: string;
  updatedAt: string;
}
