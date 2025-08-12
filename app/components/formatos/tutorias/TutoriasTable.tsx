import React from "react";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Eye, Edit, Trash2, RefreshCw } from "lucide-react";
import type { Tutoria } from "~/types/tutorias";

interface TutoriasTableProps {
  tutorias: Tutoria[];
  isLoading: boolean;
  isCoordinador: boolean;
  onViewTutoria: (tutoria: Tutoria) => void;
  onEditTutoria: (tutoria: Tutoria) => void;
  onDeleteTutoria: (tutoria: Tutoria) => void;
  onRefresh: () => void;
}

export function TutoriasTable({
  tutorias,
  isLoading,
  isCoordinador,
  onViewTutoria,
  onEditTutoria,
  onDeleteTutoria,
  onRefresh,
}: TutoriasTableProps) {
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "en progreso":
        return "bg-blue-100 text-blue-800";
      case "completado":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEstadoRevisionColor = (estado: string) => {
    switch (estado) {
      case "sin revisar":
        return "bg-yellow-100 text-yellow-800";
      case "revisando":
        return "bg-blue-100 text-blue-800";
      case "revisado":
        return "bg-purple-100 text-purple-800";
      case "aceptado":
        return "bg-green-100 text-green-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuatrimestre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tutor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grupo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Carrera
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Revisión
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-4 w-16" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-4 w-20" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="h-4 w-24" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cuatrimestre
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tutor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Grupo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Carrera
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Revisión
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tutorias.map((tutoria) => (
            <tr key={tutoria.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tutoria.cuatrimestre}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tutoria.nombreTutor}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tutoria.grupo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {tutoria.carrera}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(tutoria.fecha).toLocaleDateString("es-ES")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={getEstadoColor(tutoria.estado)}>
                  {tutoria.estado}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  className={getEstadoRevisionColor(tutoria.estadoRevision)}
                >
                  {tutoria.estadoRevision}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewTutoria(tutoria)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditTutoria(tutoria)}
                    className="text-green-600 hover:text-green-900"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  {isCoordinador && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteTutoria(tutoria)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tutorias.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay tutorías para mostrar</p>
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      )}
    </div>
  );
}
