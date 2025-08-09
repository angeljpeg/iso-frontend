import { useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash2, ArrowUpDown, Plus } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { DataTable } from "~/components/ui/tables/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { toast } from "sonner";
import { useEstadias } from "~/hooks/estadias-hooks";
import { useEstadiaActions } from "~/hooks/estadias-hooks";
import { EstadiasFilters } from "./estadias-filters";
import { CrearEstadiaModal } from "./crear-estadia-modal";
import { EditarEstadiaModal } from "./editar-estadia-modal";
import type { Estadia } from "~/types/estadias";

export const EstadiasTable = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEstadia, setSelectedEstadia] = useState<Estadia | null>(null);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>(
    {}
  );
  const [filters, setFilters] = useState({
    profesorId: "",
    periodo: "",
  });

  const { estadias, isLoading, error, refetch } = useEstadias({
    profesorId: filters.profesorId || undefined,
    periodo: filters.periodo || undefined,
  });
  const { remove } = useEstadiaActions();

  const handleEdit = (estadia: Estadia) => {
    setSelectedEstadia(estadia);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (estadiaId: string) => {
    setLoadingActions((prev) => ({ ...prev, [estadiaId]: true }));

    try {
      await remove(estadiaId);
      toast.success("Estadía eliminada exitosamente");
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al eliminar estadía";
      toast.error(errorMessage);
    } finally {
      setLoadingActions((prev) => ({ ...prev, [estadiaId]: false }));
    }
  };

  const handleFilterChange = useCallback((newFilters: {
    profesorId?: string;
    periodo?: string;
  }) => {
    setFilters({
      profesorId: newFilters.profesorId || "",
      periodo: newFilters.periodo || "",
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      profesorId: "",
      periodo: "",
    });
  }, []);

  const columns: ColumnDef<Estadia>[] = [
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
        const estadia = row.original;
        return `${estadia.profesor.nombre} ${estadia.profesor.apellido}`;
      },
    },
    {
      accessorKey: "periodo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Período
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <Badge variant="outline">{row.getValue("periodo")}</Badge>;
      },
    },
    {
      accessorKey: "alumnos",
      header: "Alumnos Asignados",
      cell: ({ row }) => {
        const alumnos = row.original.alumnos || [];
        return (
          <div className="flex gap-2 items-center">
            <span className="text-sm font-medium">{alumnos.length}</span>
            <span className="text-xs text-muted-foreground">alumnos</span>
          </div>
        );
      },
    },
    {
      accessorKey: "observacionesGenerales",
      header: "Observaciones",
      cell: ({ row }) => {
        const observaciones = row.getValue("observacionesGenerales") as string;
        return (
          <div
            className="max-w-[200px] truncate"
            title={observaciones || "Sin observaciones"}
          >
            {observaciones || "Sin observaciones"}
          </div>
        );
      },
    },
    {
      accessorKey: "activo",
      header: "Estado",
      cell: ({ row }) => {
        const activo = row.getValue("activo") as boolean;
        return (
          <Badge variant={activo ? "default" : "secondary"}>
            {activo ? "Activa" : "Inactiva"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha Creación
            <ArrowUpDown className="ml-2 w-4 h-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString("es-ES");
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const estadia = row.original;
        const isLoading = loadingActions[estadia.id];

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="p-0 w-8 h-8"
                disabled={isLoading}
              >
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(estadia)}>
                <Edit className="mr-2 w-4 h-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(estadia.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <Button onClick={refetch}>Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Gestión de Estadías
          </h2>
          <p className="text-muted-foreground">
            Administra las estadías y su asignación a profesores
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 w-4 h-4" />
          Nueva Estadía
        </Button>
      </div>

      <EstadiasFilters
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        currentFilters={filters}
      />

      <DataTable
        columns={columns}
        data={estadias}
        loading={isLoading}
        emptyMessage="No se encontraron estadías"
      />

      <CrearEstadiaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsCreateModalOpen(false);
        }}
      />

      <EditarEstadiaModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEstadia(null);
        }}
        estadia={selectedEstadia}
        onSuccess={() => {
          refetch();
          setIsEditModalOpen(false);
          setSelectedEstadia(null);
        }}
      />
    </div>
  );
};
