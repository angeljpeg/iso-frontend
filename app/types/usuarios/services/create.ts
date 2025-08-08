import type { RolUsuarioType, Usuario } from "..";

export interface CreateUsuarioRequest {
  token: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: RolUsuarioType;
  password: string;
}

export interface UpdateUsuarioRequest extends Partial<CreateUsuarioRequest> {}

export interface CreateUsuarioResponse extends Usuario {}
