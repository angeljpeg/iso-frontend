import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/badge";
import {
  X,
  User,
  BookOpen,
  Calendar,
  Clock,
  Users,
  FileText,
} from "lucide-react";
import type { Asesoria } from "~/types/asesorias";

interface AsesoriaDetailsModalProps {
  asesoria: Asesoria;
  onClose: () => void;
}

export function AsesoriaDetailsModal({
  asesoria,
  onClose,
}: AsesoriaDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Detalles de la Asesoría
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
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Tema de Asesoría</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {asesoria.temaAsesoria}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Alumno</p>
                  <p className="text-sm text-gray-900">
                    {asesoria.nombreAlumno}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Número de Alumnos</p>
                  <Badge variant="secondary">
                    {asesoria.numeroAlumnos} alumno{asesoria.numeroAlumnos !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha</p>
                  <p className="text-sm text-gray-900">
                    {new Date(asesoria.fecha).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Duración</p>
                  <p className="text-sm text-gray-900">
                    {asesoria.duracionAsesoria} minutos
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Profesor</p>
                  <p className="text-sm text-gray-900">
                    {asesoria.cargaAcademica?.profesor?.nombre}{" "}
                    {asesoria.cargaAcademica?.profesor?.apellido}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de Carga Académica */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información Académica
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Asignatura</p>
                  <p className="text-sm text-gray-900">
                    {asesoria.cargaAcademica?.asignatura}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Grupo</p>
                  <p className="text-sm text-gray-900">
                    {asesoria.cargaAcademica?.grupo?.nombreGenerado}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas del Sistema */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Fechas del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500">Fecha de Creación</p>
                <p className="text-sm text-gray-900">
                  {new Date(asesoria.createdAt).toLocaleDateString("es-ES")}
                </p>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-500">Última Actualización</p>
                <p className="text-sm text-gray-900">
                  {new Date(asesoria.updatedAt).toLocaleDateString("es-ES")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}
