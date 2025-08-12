import { Modal } from "~/components/ui/modal";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/Card";
import { Button } from "~/components/ui/Button";
import {
  Users,
  Calendar,
  User,
  GraduationCap,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";
import { type Estadia } from "~/types/estadias";
import { EstadiaPDFDownloader } from "~/components/formatos/pdf/EstadiaPDFDownloader";

interface EstadiaDetailsModalProps {
  estadia: Estadia;
  isOpen: boolean;
  onClose: () => void;
}

export function EstadiaDetailsModal({
  estadia,
  isOpen,
  onClose,
}: EstadiaDetailsModalProps) {
  // Verificaciones de seguridad
  const alumnos = estadia.alumnos || [];
  const observacionesGenerales = estadia.observacionesGenerales || "";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Estadía"
      size="full"
    >
      <div className="space-y-6">
        {/* Información general */}
        <Card className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Período</p>
                <p className="text-sm text-gray-900">{estadia.periodo}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Profesor</p>
                <p className="text-sm text-gray-900">
                  {estadia.profesor?.nombre || ""}{" "}
                  {estadia.profesor?.apellido || ""}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Fecha Creación
                </p>
                <p className="text-sm text-gray-900">
                  {estadia.createdAt
                    ? new Date(estadia.createdAt).toLocaleDateString("es-ES")
                    : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-500">Estado</p>
                <Badge
                  variant={estadia.activo ? "default" : "secondary"}
                  className={
                    estadia.activo
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  {estadia.activo ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </div>
          </div>

          {observacionesGenerales && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Observaciones Generales
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {observacionesGenerales}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Lista de alumnos */}
        <Card className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Alumnos ({alumnos.length})
          </h3>
          <div className="max-h-96 overflow-y-auto pr-2">
            <div className="space-y-4">
              {alumnos.length > 0 ? (
                alumnos.map((alumno) => {
                  const progresoMensual = alumno.progresoMensual || [];
                  const observacionesAlumno =
                    alumno.observacionesGenerales || "";

                  return (
                    <div
                      key={alumno.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Users className="h-5 w-5 text-blue-500" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {alumno.nombreAlumno}
                            </h4>
                            {alumno.matricula && (
                              <p className="text-sm text-gray-500">
                                Matrícula: {alumno.matricula}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={alumno.activo ? "default" : "secondary"}
                          className={
                            alumno.activo
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {alumno.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {alumno.carrera && (
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {alumno.carrera}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {progresoMensual.length} evaluaciones mensuales
                          </span>
                        </div>

                        {observacionesAlumno && (
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Con observaciones
                            </span>
                          </div>
                        )}
                      </div>

                      {observacionesAlumno && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Observaciones:</span>{" "}
                            {observacionesAlumno}
                          </p>
                        </div>
                      )}

                      {/* Progreso mensual */}
                      {progresoMensual.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Progreso Mensual:
                          </h5>
                          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-2">
                            {progresoMensual.map((progreso) => (
                              <div
                                key={progreso.id}
                                className="text-xs p-2 border rounded"
                              >
                                <div className="font-medium">
                                  Mes {progreso.mes}
                                </div>
                                <div className="flex items-center space-x-1 mt-1">
                                  {progreso.avance === "si" ? (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  ) : (
                                    <XCircle className="h-3 w-3 text-red-500" />
                                  )}
                                  <span className="text-gray-600">
                                    {progreso.avance === "si" ? "Sí" : "No"}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                  <p>No hay alumnos registrados en esta estadía</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-between items-center space-x-3 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <EstadiaPDFDownloader estadia={estadia}>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                Exportar Reporte PDF
              </Button>
            </EstadiaPDFDownloader>
          </div>

          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
