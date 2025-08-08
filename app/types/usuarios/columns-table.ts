import type { ColumnDef } from "@tanstack/react-table";
import type { Usuario } from ".";

export const UsuariosColumns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "apellido",
    header: "Apellido",
  },
  {
    accessorKey: "rol",
    header: "Rol",
  },
  {
    accessorKey: "activo",
    header: "Activo",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
  },
  {
    accessorKey: "updatedAt",
    header: "Actualizado",
  },
];
