export const RolUsuario = [
  "coordinador",
  "moderador",
  "profesor_tiempo_completo",
  "profesor_asignatura",
] as const;

export enum RolUsuarioEnum {
  COORDINADOR = "coordinador",
  MODERADOR = "moderador",
  PROFESOR_TIEMPO_COMPLETO = "profesor_tiempo_completo",
  PROFESOR_ASIGNATURA = "profesor_asignatura",
}

export type RolUsuarioType = (typeof RolUsuario)[number];

export type Usuario = {
  id: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: RolUsuarioType;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordExpires: Date | null;
  resetPasswordToken: string | null;
};
