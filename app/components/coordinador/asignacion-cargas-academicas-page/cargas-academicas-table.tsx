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
import { useCargaAcademica } from "~/hooks/useCargaAcademica";
import { CargasAcademicasFilters } from "./cargas-academicas-filters";
import { CrearCargaAcademicaModal } from "./crear-carga-academica";
import { EditarCargaAcademicaModal } from "./editar-carga-academica";
import type { CargaAcademica } from "~/types/carga-academica";
import { deleteCargaAcademica } from "~/services/coordinadores/carga-academica.service";
import { useAuthStore } from "~/store/auth";

export const CargasAcademicasTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCarga, setSelectedCarga] = useState<CargaAcademica | null>(
    null
  );
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>(
    {}
  );
  const { accessToken } = useAuthStore();

  const {
    cargasAcademicas,
    isLoading,
    error,
    pagination,
    options,
    updateFilters,
    updatePage,
    clearFilters,
    refetch,
  } = useCargaAcademica({
    limit: 10,
    page: 1,
  });

  const handleEdit = (carga: CargaAcademica) => {
    setSelectedCarga(carga);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (cargaId: string) => {
    if (!accessToken) {
      toast.error("No hay token de autenticación");
      return;
    }

    setLoadingActions((prev) => ({ ...prev, [cargaId]: true }));

    try {
      await deleteCargaAcademica({ token: accessToken, id: cargaId });
      toast.success("Carga académica eliminada exitosamente");
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al eliminar carga académica";
      toast.error(errorMessage);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [cargaId]: false }));
    }
  };

  const columns: ColumnDef<CargaAcademica>[] = [
    {
      accessorKey: "profesor.nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Profesor
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const carga = row.original;
        return `${carga.profesor.nombre} ${carga.profesor.apellido}`;
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
      accessorKey: "asignatura",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Asignatura
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "grupo.nombreGenerado",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Grupo
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const carga = row.original;
        return carga.grupo.nombreGenerado;
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
        const carga = row.original;
        const isLoading = loadingActions[carga.id] || false;

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
                onClick={() => handleEdit(carga)}
                disabled={!carga.activo || isLoading}
              >
                <Edit className="mr-2 w-4 h-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(carga.id)}
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

  const handleSearch = (search: string) => {
    updateFilters({ asignatura: search || undefined });
  };

  const handleFilterChange = (filters: {
    profesorId?: string;
    carrera?: string;
    grupoId?: string;
    cuatrimestreId?: string;
    activo?: boolean;
    actual?: boolean;
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
          <p>Cargando cargas académicas...</p>
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
          <h1 className="text-2xl font-bold">Cargas Académicas</h1>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          Crear Carga Académica
        </Button>
      </header>

      <CrearCargaAcademicaModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={refetch}
      />

      <EditarCargaAcademicaModal
      /*         open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        carga={selectedCarga}
        onSuccess={refetch} */
      />

      <CargasAcademicasFilters
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        currentFilters={{
          profesorId: options.profesorId,
          carrera: options.carrera,
          grupoId: options.grupoId,
          cuatrimestreId: options.cuatrimestreId,
          activo: options.activo,
          actual: options.actual,
        }}
      />

      <div className="bg-white rounded-lg border">
        <DataTable columns={columns} data={cargasAcademicas} />

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
