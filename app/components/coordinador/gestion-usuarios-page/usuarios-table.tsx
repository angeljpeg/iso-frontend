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
import { ArrowUpDown, Edit, Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { CrearUsuariosModal } from "./crear-usuarios-modal";
import { useAuthStore } from "~/store/auth";
import {
  deactivateUsuario,
  reactivateUsuario,
} from "~/services/coordinadores/usuarios.service";
import { toast } from "sonner";

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
    accessorKey: "apellido",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Apellido
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
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const usuario = row.original;
      const { accessToken } = useAuthStore();
      const [isLoading, setIsLoading] = useState(false);

      const handleDeactivate = async (refetchFn: () => void) => {
        if (!accessToken) return;

        try {
          setIsLoading(true);
          await deactivateUsuario({ token: accessToken, id: usuario.id });
          toast.success("Usuario desactivado exitosamente");
          refetchFn(); // Usar refetch en lugar de reload
        } catch (error) {
          console.error("Error desactivando usuario:", error);
          toast.error("Error al desactivar usuario");
        } finally {
          setIsLoading(false);
        }
      };

      const handleReactivate = async (refetchFn: () => void) => {
        if (!accessToken) return;

        try {
          setIsLoading(true);
          await reactivateUsuario({ token: accessToken, id: usuario.id });
          toast.success("Usuario reactivado exitosamente");
          refetchFn(); // Usar refetch en lugar de reload
        } catch (error) {
          console.error("Error reactivando usuario:", error);
          toast.error("Error al reactivar usuario");
        } finally {
          setIsLoading(false);
        }
      };

      const handleEdit = () => {
        toast.info("Función de edición en desarrollo");
      };

      return (
        <ActionsCell
          usuario={usuario}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
          onReactivate={handleReactivate}
        />
      );
    },
  },
];

// Componente separado para las acciones que recibe refetch como prop
function ActionsCell({
  usuario,
  isLoading,
  onEdit,
  onDeactivate,
  onReactivate,
}: {
  usuario: Usuario;
  isLoading: boolean;
  onEdit: () => void;
  onDeactivate: (refetch: () => void) => void;
  onReactivate: (refetch: () => void) => void;
}) {
  // Necesitamos acceso al refetch desde el componente padre
  const { refetch } = useUsuarios();

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        disabled={!usuario.activo || isLoading}
        className="p-0 w-8 h-8"
      >
        <Edit className="w-4 h-4" />
      </Button>

      {usuario.activo ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDeactivate(refetch)}
          disabled={isLoading}
          className="p-0 w-8 h-8"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          variant="default"
          size="sm"
          onClick={() => onReactivate(refetch)}
          disabled={isLoading}
          className="p-0 w-8 h-8"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}

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
    refetch,
  } = useUsuarios({
    limit: 2,
    page: 1,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Crear las columnas dentro del componente para tener acceso a refetch
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
      accessorKey: "apellido",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Apellido
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
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const usuario = row.original;
        const { accessToken } = useAuthStore();
        const [isLoading, setIsLoading] = useState(false);

        const handleDeactivate = async () => {
          if (!accessToken) return;

          try {
            setIsLoading(true);
            await deactivateUsuario({ token: accessToken, id: usuario.id });
            toast.success("Usuario desactivado exitosamente");
            refetch(); // Ahora tenemos acceso a refetch
          } catch (error) {
            console.error("Error desactivando usuario:", error);
            toast.error("Error al desactivar usuario");
          } finally {
            setIsLoading(false);
          }
        };

        const handleReactivate = async () => {
          if (!accessToken) return;

          try {
            setIsLoading(true);
            await reactivateUsuario({ token: accessToken, id: usuario.id });
            toast.success("Usuario reactivado exitosamente");
            refetch(); // Ahora tenemos acceso a refetch
          } catch (error) {
            console.error("Error reactivando usuario:", error);
            toast.error("Error al reactivar usuario");
          } finally {
            setIsLoading(false);
          }
        };

        const handleEdit = () => {
          toast.info("Función de edición en desarrollo");
        };

        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              disabled={!usuario.activo || isLoading}
              className="p-0 w-8 h-8"
            >
              <Edit className="w-4 h-4" />
            </Button>

            {usuario.activo ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeactivate}
                disabled={isLoading}
                className="p-0 w-8 h-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleReactivate}
                disabled={isLoading}
                className="p-0 w-8 h-8"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

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
          activo: options.activo,
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
