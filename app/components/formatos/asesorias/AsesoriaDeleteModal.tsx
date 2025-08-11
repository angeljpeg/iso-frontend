import { useState } from "react";
import { Button } from "~/components/ui/Button";
import {
  X,
  Trash2,
  AlertTriangle,
  User,
  BookOpen,
  Calendar,
  Clock,
} from "lucide-react";
import type { Asesoria } from "~/types/asesorias";
import { useDeleteAsesoria } from "~/hooks/asesorias/use-delete-asesoria";
import { useAuthStore } from "~/store/auth";

interface AsesoriaDeleteModalProps {
  asesoria: Asesoria;
  onClose: () => void;
  onSuccess: () => void;
}

export function AsesoriaDeleteModal({
  asesoria,
  onClose,
  onSuccess,
}: AsesoriaDeleteModalProps) {
  const deleteAsesoriaMutation = useDeleteAsesoria();
  const { accessToken } = useAuthStore();

  const handleDelete = async () => {
    try {
      if (!accessToken) {
        throw new Error("No hay token de autenticación");
      }

      await deleteAsesoriaMutation.mutateAsync({
        id: asesoria.id,
        token: accessToken,
      });

      onSuccess();
    } catch (error) {
      console.error("Error al eliminar la asesoría:", error);
      alert("Error al eliminar la asesoría");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Eliminar Asesoría
            </h2>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que quieres eliminar esta asesoría? Esta acción
              no se puede deshacer.
            </p>

            {/* Información de la asesoría a eliminar */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      Tema de Asesoría
                    </p>
                    <p className="text-sm text-red-700 font-medium">
                      {asesoria.temaAsesoria}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Alumno</p>
                    <p className="text-sm text-red-700">
                      {asesoria.nombreAlumno}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Fecha</p>
                    <p className="text-sm text-red-700">
                      {new Date(asesoria.fecha).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Duración</p>
                    <p className="text-sm text-red-700">
                      {asesoria.duracionAsesoria} minutos
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Profesor</p>
                    <p className="text-sm text-red-700">
                      {asesoria.cargaAcademica?.profesor?.nombre}{" "}
                      {asesoria.cargaAcademica?.profesor?.apellido}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">
                      Asignatura
                    </p>
                    <p className="text-sm text-red-700">
                      {asesoria.cargaAcademica?.asignatura}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteAsesoriaMutation.isPending}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            {deleteAsesoriaMutation.isPending
              ? "Eliminando..."
              : "Eliminar Asesoría"}
          </Button>
        </div>
      </div>
    </div>
  );
}
