import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/Card";
import {
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  User,
  GraduationCap,
  Clock,
} from "lucide-react";
import { type Estadia } from "~/types/estadias";
import { EstadiaDetailsModal } from "./EstadiaDetailsModal";
import { EstadiaEditModal } from "./EstadiaEditModal";
import { EstadiaDeleteModal } from "./EstadiaDeleteModal";

interface EstadiasTableProps {
  estadias: Estadia[];
  isLoading: boolean;
  isCoordinador: boolean;
  onViewEstadia: (estadia: Estadia) => void;
  onEditEstadia: (estadia: Estadia) => void;
  onDeleteEstadia: (estadia: Estadia) => void;
  onRefresh: () => void;
}

export function EstadiasTable({
  estadias,
  isLoading,
  isCoordinador,
  onViewEstadia,
  onEditEstadia,
  onDeleteEstadia,
  onRefresh,
}: EstadiasTableProps) {
  const handleViewDetails = (estadia: Estadia) => {
    onViewEstadia(estadia);
  };

  const handleEdit = (estadia: Estadia) => {
    onEditEstadia(estadia);
  };

  const handleDelete = (estadia: Estadia) => {
    onDeleteEstadia(estadia);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadías...</p>
        </div>
      </div>
    );
  }

  if (estadias.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay estadías para mostrar
        </h3>
        <p className="text-gray-500">
          No se encontraron estadías con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Período
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profesor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alumnos
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Creación
            </th>
            {isCoordinador && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {estadias.map((estadia) => (
            <tr key={estadia.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-900">
                    {estadia.periodo}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {estadia.profesor?.nombre} {estadia.profesor?.apellido}
                    </div>
                    <div className="text-sm text-gray-500">
                      {estadia.profesor?.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {estadia.alumnos?.length || 0} alumno(s)
                    </div>
                    <div className="text-sm text-gray-500">
                      {estadia.alumnos
                        ?.slice(0, 2)
                        .map((a) => a.nombreAlumno)
                        .join(", ")}
                      {estadia.alumnos && estadia.alumnos.length > 2 && "..."}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge
                  variant={estadia.activo ? "default" : "secondary"}
                  className={
                    estadia.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {estadia.activo ? "Activo" : "Inactivo"}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  {new Date(estadia.createdAt).toLocaleDateString("es-ES")}
                </div>
              </td>
              {isCoordinador && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(estadia)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(estadia)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(estadia)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
