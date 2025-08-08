import type { RolUsuario, Usuario } from "..";

export interface CreateUsuarioRequest {
  token: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  password: string;
}

export interface CreateUsuarioResponse extends Usuario {}
