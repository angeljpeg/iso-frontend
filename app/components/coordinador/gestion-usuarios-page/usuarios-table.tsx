import { DataTable } from "~/components/ui/tables/data-table";
import { useUsuarios } from "~/hooks/useUsuarios";
import type { ColumnDef } from "@tanstack/react-table";
import { type Usuario, RolUsuario } from "~/types/usuarios";
import { Badge } from "~/components/ui/badge";

// Definir las columnas para la tabla
const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => {
      const usuario = row.original;
      return `${usuario.nombre} ${usuario.apellido}`;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ row }) => {
      const rol = row.getValue("rol") as RolUsuario;
      const rolLabels = {
        [RolUsuario.COORDINADOR]: "Coordinador",
        [RolUsuario.MODERADOR]: "Moderador",
        [RolUsuario.PROFESOR_TIEMPO_COMPLETO]: "Profesor Tiempo Completo",
        [RolUsuario.PROFESOR_ASIGNATURA]: "Profesor Asignatura",
      };
      return <Badge variant="outline">{rolLabels[rol] || rol}</Badge>;
    },
  },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) => {
      const activo = row.getValue("activo") as boolean;
      return (
        <Badge variant={activo ? "default" : "destructive"}>
          {activo ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Creación",
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("createdAt") as Date);
      return fecha.toLocaleDateString("es-ES");
    },
  },
];

export function UsuariosTable() {
  const { usuarios, isLoading, error } = useUsuarios({
    limit: 10,
    page: 1,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-2 w-8 h-8 rounded-full border-b-2 border-gray-900 animate-spin"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log(error);
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Usuarios</h1>
      <DataTable columns={columns} data={usuarios} />
    </div>
  );
}
