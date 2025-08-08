import { DataTable } from "~/components/ui/tables/data-table";
import { useUsuarios } from "~/hooks/useUsuarios";
import { UsuariosFilters } from "./usuarios-filters";
import { Pagination } from "~/components/ui/pagination";
import type { ColumnDef } from "@tanstack/react-table";
import {
  type RolUsuarioType,
  type Usuario,
  RolUsuarioEnum,
} from "~/types/usuarios";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { CrearUsuariosModal } from "./crear-usuarios-modal";

const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "nombre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 w-4 h-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 w-4 h-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "rol",
    header: "Rol",
    cell: ({ row }) => {
      const rol = row.getValue("rol") as RolUsuarioType;
      const rolLabels = {
        [RolUsuarioEnum.COORDINADOR]: "Coordinador",
        [RolUsuarioEnum.MODERADOR]: "Moderador",
        [RolUsuarioEnum.PROFESOR_TIEMPO_COMPLETO]: "Profesor Tiempo Completo",
        [RolUsuarioEnum.PROFESOR_ASIGNATURA]: "Profesor Asignatura",
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
  const {
    usuarios,
    isLoading,
    error,
    pagination,
    options,
    updateFilters,
    updatePage,
    clearFilters,
  } = useUsuarios({
    limit: 2,
    page: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { refetch } = useUsuarios();

  const handleSearch = (search: string) => {
    updateFilters({ search: search || undefined });
  };

  const handleFilterChange = (filters: {
    rol?: RolUsuarioType;
    estado?: boolean;
  }) => {
    updateFilters(filters);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const handlePageChange = (page: number) => {
    updatePage(page);
  };

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
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Usuarios</h1>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>Crear Usuario</Button>
      </header>

      <CrearUsuariosModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={refetch}
      />

      <UsuariosFilters
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        currentFilters={{
          search: options.search || "",
          rol: options.rol,
          estado: options.estado,
        }}
      />

      <div className="bg-white rounded-lg border">
        <DataTable columns={columns} data={usuarios} />

        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
        />
      </div>
    </div>
  );
}
