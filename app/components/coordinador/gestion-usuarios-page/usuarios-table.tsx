import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Edit,
  UserX,
  UserCheck,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "~/components/ui/Button";
import { DataTable } from "~/components/ui/tables/data-table";
import { Pagination } from "~/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
import { useUsuarios } from "~/hooks/useUsuarios";
import { UsuariosFilters } from "./usuarios-filters";
import { CrearUsuariosModal } from "./crear-usuarios-modal";
import { EditarUsuarioModal } from "./editar-usuario-modal";
import {
  type Usuario,
  type RolUsuarioType,
  RolUsuarioEnum,
} from "~/types/usuarios";
import {
  deactivateUsuario,
  reactivateUsuario,
} from "~/services/coordinadores/usuarios.service";
import { useAuthStore } from "~/store/auth";

export const UsuariosTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>(
    {}
  );
  const { accessToken } = useAuthStore();

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

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsEditModalOpen(true);
  };

  const handleDeactivate = async (usuarioId: string) => {
    if (!accessToken) {
      toast.error("No hay token de autenticación");
      return;
    }

    setLoadingActions((prev) => ({ ...prev, [usuarioId]: true }));

    try {
      await deactivateUsuario({ token: accessToken, id: usuarioId });
      toast.success("Usuario desactivado exitosamente");
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al desactivar usuario";
      toast.error(errorMessage);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [usuarioId]: false }));
    }
  };

  const handleReactivate = async (usuarioId: string) => {
    if (!accessToken) {
      toast.error("No hay token de autenticación");
      return;
    }

    setLoadingActions((prev) => ({ ...prev, [usuarioId]: true }));

    try {
      await reactivateUsuario({ token: accessToken, id: usuarioId });
      toast.success("Usuario reactivado exitosamente");
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al reactivar usuario";
      toast.error(errorMessage);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [usuarioId]: false }));
    }
  };

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
        const isLoading = loadingActions[usuario.id] || false;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 w-8 h-8">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleEdit(usuario)}
                disabled={!usuario.activo || isLoading}
              >
                <Edit className="mr-2 w-4 h-4" />
                Editar
              </DropdownMenuItem>
              {usuario.activo ? (
                <DropdownMenuItem
                  onClick={() => handleDeactivate(usuario.id)}
                  disabled={isLoading}
                  className="text-red-600"
                >
                  <UserX className="mr-2 w-4 h-4" />
                  Desactivar
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleReactivate(usuario.id)}
                  disabled={isLoading}
                  className="text-green-600"
                >
                  <UserCheck className="mr-2 w-4 h-4" />
                  Reactivar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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

      <EditarUsuarioModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        usuario={selectedUsuario}
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
        <DataTable
          loading={isLoading}
          emptyMessage="No se encontraron usuarios"
          columns={columns}
          data={usuarios}
        />

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
};
