import React from "react";
import { Modal } from "~/components/ui/modal";
import { Button } from "~/components/ui/Button";
import { Badge } from "~/components/ui/badge";
import { X, Calendar, User, Users, GraduationCap } from "lucide-react";
import { TutoriaPDFDownloader } from "~/components/formatos/pdf/TutoriaPDFDownloader";
import type { Tutoria } from "~/types/tutorias";

interface TutoriaDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutoria: Tutoria;
}

export function TutoriaDetailsModal({
  isOpen,
  onClose,
  tutoria,
}: TutoriaDetailsModalProps) {
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

  const getVulnerabilidadColor = (vulnerabilidad: string) => {
    switch (vulnerabilidad) {
      case "academica":
        return "bg-red-100 text-red-800";
      case "personal":
        return "bg-blue-100 text-blue-800";
      case "socioeconomica":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAreaCanalizacionColor = (area: string) => {
    switch (area) {
      case "Asesoria":
        return "bg-green-100 text-green-800";
      case "Medico":
        return "bg-blue-100 text-blue-800";
      case "Psicologo":
        return "bg-purple-100 text-purple-800";
      case "Estudiantiles":
        return "bg-yellow-100 text-yellow-800";
      case "Admon":
        return "bg-gray-100 text-gray-800";
      case "Vinculacion":
        return "bg-indigo-100 text-indigo-800";
      case "Direccion de Carrera":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Detalles de la Tutoría
            </h2>
            <p className="text-gray-600 mt-1">
              Información completa de la tutoría y sus detalles
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <TutoriaPDFDownloader tutoria={tutoria}>
              Exportar PDF
            </TutoriaPDFDownloader>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Información principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Información General
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Cuatrimestre:
                </span>
                <p className="text-sm text-gray-900">{tutoria.cuatrimestre}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Fecha:
                </span>
                <p className="text-sm text-gray-900">
                  {new Date(tutoria.fecha).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Estado:
                </span>
                <Badge className={`mt-1 ${getEstadoColor(tutoria.estado)}`}>
                  {tutoria.estado}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Estado de Revisión:
                </span>
                <Badge
                  className={`mt-1 ${getEstadoRevisionColor(
                    tutoria.estadoRevision
                  )}`}
                >
                  {tutoria.estadoRevision}
                </Badge>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Información del Tutor
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Tutor:
                </span>
                <p className="text-sm text-gray-900">{tutoria.nombreTutor}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Grupo:
                </span>
                <p className="text-sm text-gray-900">{tutoria.grupo}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">
                  Carrera:
                </span>
                <p className="text-sm text-gray-900">{tutoria.carrera}</p>
              </div>
              {tutoria.fechaRevision && (
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    Fecha de Revisión:
                  </span>
                  <p className="text-sm text-gray-900">
                    {new Date(tutoria.fechaRevision).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Observaciones */}
        {tutoria.observaciones && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Observaciones
            </h3>
            <p className="text-gray-700">{tutoria.observaciones}</p>
          </div>
        )}

        {/* Actividades de tutoría grupal */}
        {tutoria.actividadesTutoriaGrupal &&
          tutoria.actividadesTutoriaGrupal.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Actividades de Tutoría Grupal
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {tutoria.actividadesTutoriaGrupal.map((actividad, index) => (
                  <li key={index} className="text-gray-700">
                    {actividad}
                  </li>
                ))}
              </ul>
            </div>
          )}

        {/* Detalles de alumnos */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Detalles de Alumnos ({tutoria.detalles.length})
          </h3>

          {tutoria.detalles.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay detalles de alumnos registrados para esta tutoría.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alumno
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vulnerabilidad
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Área de Canalización
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fue Atendido
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Presentó Mejora
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Causó Baja
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tutoria.detalles.map((detalle) => (
                    <tr key={detalle.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {detalle.nombreAlumno}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          className={getVulnerabilidadColor(
                            detalle.vulnerabilidad
                          )}
                        >
                          {detalle.vulnerabilidad}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          className={getAreaCanalizacionColor(
                            detalle.areaCanalizacion
                          )}
                        >
                          {detalle.areaCanalizacion}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          className={
                            detalle.fueAtendido
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {detalle.fueAtendido ? "Sí" : "No"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          className={
                            detalle.presentoMejoria
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {detalle.presentoMejoria ? "Sí" : "No"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge
                          className={
                            detalle.causoBaja
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }
                        >
                          {detalle.causoBaja ? "Sí" : "No"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
