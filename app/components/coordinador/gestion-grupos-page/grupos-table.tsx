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
import { useGrupos } from "~/hooks/useGrupos";
import { useGrupoActions } from "~/hooks/useGrupoActions";
import { GruposFilters } from "./grupos-filters";
import { CrearGrupoModal } from "./crear-grupo-modal";
import { EditarGrupoModal } from "./editar-grupo-modal";
import type { Grupo } from "~/types/grupos";

export const GruposTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});

  const {
    grupos,
    isLoading,
    error,
    pagination,
    options,
    updateFilters,
    updatePage,
    clearFilters,
    refetch,
  } = useGrupos({
    limit: 10,
    page: 1,
  });

  const { deactivate, reactivate, remove } = useGrupoActions();

  const handleEdit = (grupo: Grupo) => {
    setSelectedGrupo(grupo);
    setIsEditModalOpen(true);
  };

  const handleDeactivate = async (grupoId: string) => {
    setLoadingActions((prev) => ({ ...prev, [grupoId]: true }));

    try {
      await deactivate(grupoId);
      toast.success("Grupo desactivado exitosamente");
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al desactivar grupo";
      toast.error(errorMessage);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [grupoId]: false }));
    }
  };

  const handleReactivate = async (grupoId: string) => {
    setLoadingActions((prev) => ({ ...prev, [grupoId]: true }));

    try {
      await reactivate(grupoId);
      toast.success("Grupo reactivado exitosamente");
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al reactivar grupo";
      toast.error(errorMessage);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [grupoId]: false }));
    }
  };

  const handleDelete = async (grupoId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este grupo?")) {
      return;
    }

    setLoadingActions((prev) => ({ ...prev, [grupoId]: true }));

    try {
      await remove(grupoId);
      toast.success("Grupo eliminado exitosamente");
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar grupo";
      toast.error(errorMessage);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [grupoId]: false }));
    }
  };

  const columns: ColumnDef<Grupo>[] = [
    {
      accessorKey: "nombreGenerado",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre del Grupo
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "carrera",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Carrera
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "cuatrimestre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Cuatrimestre
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "numeroGrupo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Número de Grupo
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
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
        const fecha = new Date(row.getValue("createdAt") as string);
        return fecha.toLocaleDateString("es-ES");
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const grupo = row.original;
        const isLoading = loadingActions[grupo.id] || false;

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
                onClick={() => handleEdit(grupo)}
                disabled={isLoading}
              >
                <Edit className="mr-2 w-4 h-4" />
                Editar
              </DropdownMenuItem>
              {grupo.activo ? (
                <DropdownMenuItem
                  onClick={() => handleDeactivate(grupo.id)}
                  disabled={isLoading}
                  className="text-orange-600"
                >
                  <UserX className="mr-2 w-4 h-4" />
                  Desactivar
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleReactivate(grupo.id)}
                  disabled={isLoading}
                  className="text-green-600"
                >
                  <UserCheck className="mr-2 w-4 h-4" />
                  Reactivar
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleDelete(grupo.id)}
                disabled={isLoading}
                className="text-red-600"
              >
                <UserX className="mr-2 w-4 h-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleFilterChange = (filters: {
    search?: string;
    carrera?: string;
    cuatrimestre?: number;
    activo?: boolean;
  }) => {
    updateFilters(filters);
  };

  const handlePageChange = (page: number) => {
    updatePage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-2 w-8 h-8 rounded-full border-b-2 border-gray-900 animate-spin"></div>
          <p>Cargando grupos...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
          <h1 className="text-2xl font-bold">Gestión de Grupos</h1>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>Crear Grupo</Button>
      </header>

      <CrearGrupoModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={refetch}
      />

      <EditarGrupoModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        grupo={selectedGrupo}
        onSuccess={refetch}
      />

      <GruposFilters
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        currentFilters={{
          search: options.search,
          carrera: options.carrera,
          cuatrimestre: options.cuatrimestre,
          activo: options.activo,
        }}
      />

      <div className="bg-white rounded-lg border">
        <DataTable
          loading={isLoading}
          emptyMessage="No se encontraron grupos"
          columns={columns}
          data={grupos}
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