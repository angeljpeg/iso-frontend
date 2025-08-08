export enum RolUsuario {
  COORDINADOR = "coordinador",
  MODERADOR = "moderador",
  PROFESOR_TIEMPO_COMPLETO = "profesor_tiempo_completo",
  PROFESOR_ASIGNATURA = "profesor_asignatura",
}

export type Usuario = {
  id: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordExpires: Date | null;
  resetPasswordToken: string | null;
};
