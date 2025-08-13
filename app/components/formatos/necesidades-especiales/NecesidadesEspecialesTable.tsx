import React from "react";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/badge";
import {
  NecesidadesEspeciales,
  TipoNecesidadEspecial,
  TIPOS_NECESIDAD_OPTIONS,
} from "../../../types/necesidades-especiales";

interface NecesidadesEspecialesTableProps {
  necesidades: NecesidadesEspeciales[];
  loading: boolean;
  onEdit: (necesidad: NecesidadesEspeciales) => void;
  onDelete: (id: number) => void;
  onView: (necesidad: NecesidadesEspeciales) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const NecesidadesEspecialesTable: React.FC<
  NecesidadesEspecialesTableProps
> = ({
  necesidades,
  loading,
  onEdit,
  onDelete,
  onView,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getTiposNecesidad = (necesidad: NecesidadesEspeciales): string[] => {
    const tipos: string[] = [];

    if (necesidad.excepcionesConductuales)
      tipos.push(TipoNecesidadEspecial.CONDUCTUALES);
    if (necesidad.excepcionesComunicacionales)
      tipos.push(TipoNecesidadEspecial.COMUNICACIONALES);
    if (necesidad.excepcionesIntelectuales)
      tipos.push(TipoNecesidadEspecial.INTELECTUALES);
    if (necesidad.excepcionesFisicas) tipos.push(TipoNecesidadEspecial.FISICAS);
    if (necesidad.excepcionesSuperdotacion)
      tipos.push(TipoNecesidadEspecial.SUPERDOTACION);
    if (necesidad.otrasNecesidades) tipos.push(TipoNecesidadEspecial.OTRAS);

    return tipos;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBadgeVariant = (
    tipo: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (tipo) {
      case TipoNecesidadEspecial.CONDUCTUALES:
        return "destructive";
      case TipoNecesidadEspecial.COMUNICACIONALES:
        return "secondary";
      case TipoNecesidadEspecial.INTELECTUALES:
        return "default";
      case TipoNecesidadEspecial.FISICAS:
        return "outline";
      case TipoNecesidadEspecial.SUPERDOTACION:
        return "default";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (necesidades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No se encontraron necesidades especiales
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alumno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Programa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipos de Necesidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revisión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profesor
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {necesidades.map((necesidad) => (
              <tr key={necesidad.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {necesidad.nombreAlumno}
                    </div>
                    <div className="text-sm text-gray-500">
                      {necesidad.numeroMatricula}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {necesidad.programaEducativo}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {getTiposNecesidad(necesidad).map((tipo, index) => (
                      <Badge
                        key={index}
                        variant={getBadgeVariant(tipo)}
                        className="text-xs"
                      >
                        {tipo}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(necesidad.fecha)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    #{necesidad.numeroRevision}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(necesidad.fechaRevision)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {necesidad.cargaAcademica?.usuario?.nombre || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(necesidad)}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(necesidad)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(necesidad.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
