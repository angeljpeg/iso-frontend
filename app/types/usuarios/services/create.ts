import type { RolUsuarioType, Usuario } from "..";

export interface CreateUsuarioRequest {
  token: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: RolUsuarioType;
  password: string;
}

export interface UpdateUsuarioRequest
  extends Partial<Omit<CreateUsuarioRequest, "password">> {
  id: string;
}

export interface CreateUsuarioResponse extends Usuario {}

export interface UpdateUsuarioResponse extends Usuario {}
