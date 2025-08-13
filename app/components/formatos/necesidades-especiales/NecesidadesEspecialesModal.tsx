import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/badge";
import { type NecesidadesEspeciales } from "../../../types/necesidades-especiales";

interface NecesidadesEspecialesModalProps {
  isOpen: boolean;
  onClose: () => void;
  necesidadesEspeciales: NecesidadesEspeciales | null;
}

export const NecesidadesEspecialesModal: React.FC<
  NecesidadesEspecialesModalProps
> = ({ isOpen, onClose, necesidadesEspeciales }) => {
  if (!necesidadesEspeciales) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderExcepcion = (
    tieneExcepcion: boolean,
    especificacion: string | undefined,
    label: string
  ) => {
    if (!tieneExcepcion) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="text-xs">
            {label}
          </Badge>
        </div>
        {especificacion && (
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            {especificacion}
          </p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Detalles de Necesidades Especiales
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica del alumno */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              Información del Alumno
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-blue-800">
                  Nombre:
                </label>
                <p className="text-blue-900 font-semibold">
                  {necesidadesEspeciales.nombreAlumno}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-blue-800">
                  Matrícula:
                </label>
                <p className="text-blue-900 font-semibold">
                  {necesidadesEspeciales.numeroMatricula}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-blue-800">
                  Programa Educativo:
                </label>
                <p className="text-blue-900 font-semibold">
                  {necesidadesEspeciales.programaEducativo}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-blue-800">
                  Fecha de Registro:
                </label>
                <p className="text-blue-900 font-semibold">
                  {formatDate(necesidadesEspeciales.fecha)}
                </p>
              </div>
            </div>
          </div>

          {/* Información de revisión */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900 mb-3">
              Información de Revisión
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-green-800">
                  Fecha de Revisión:
                </label>
                <p className="text-green-900 font-semibold">
                  {formatDate(necesidadesEspeciales.fechaRevision)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-green-800">
                  Número de Revisión:
                </label>
                <p className="text-green-900 font-semibold">
                  {necesidadesEspeciales.numeroRevision}
                </p>
              </div>
            </div>
          </div>

          {/* Excepciones y necesidades especiales */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-orange-900 mb-3">
              Necesidades Especiales Identificadas
            </h3>
            <div className="space-y-4">
              {renderExcepcion(
                necesidadesEspeciales.excepcionesConductuales,
                necesidadesEspeciales.especificacionConductual,
                "Excepciones Conductuales"
              )}

              {renderExcepcion(
                necesidadesEspeciales.excepcionesComunicacionales,
                necesidadesEspeciales.especificacionComunicacional,
                "Excepciones Comunicacionales"
              )}

              {renderExcepcion(
                necesidadesEspeciales.excepcionesIntelectuales,
                necesidadesEspeciales.especificacionIntelectual,
                "Excepciones Intelectuales"
              )}

              {renderExcepcion(
                necesidadesEspeciales.excepcionesFisicas,
                necesidadesEspeciales.especificacionFisica,
                "Excepciones Físicas"
              )}

              {renderExcepcion(
                necesidadesEspeciales.excepcionesSuperdotacion,
                necesidadesEspeciales.especificacionSuperdotacion,
                "Excepciones de Superdotación"
              )}

              {necesidadesEspeciales.otrasNecesidades && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Otras Necesidades
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {necesidadesEspeciales.otrasNecesidades}
                  </p>
                </div>
              )}

              {!necesidadesEspeciales.excepcionesConductuales &&
                !necesidadesEspeciales.excepcionesComunicacionales &&
                !necesidadesEspeciales.excepcionesIntelectuales &&
                !necesidadesEspeciales.excepcionesFisicas &&
                !necesidadesEspeciales.excepcionesSuperdotacion &&
                !necesidadesEspeciales.otrasNecesidades && (
                  <p className="text-sm text-orange-700 italic">
                    No se han identificado necesidades especiales específicas.
                  </p>
                )}
            </div>
          </div>

          {/* Información del profesor */}
          {necesidadesEspeciales.cargaAcademica?.usuario && (
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-900 mb-3">
                Profesor Asignado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-purple-800">
                    Nombre:
                  </label>
                  <p className="text-purple-900 font-semibold">
                    {necesidadesEspeciales.cargaAcademica.usuario.nombre}
                  </p>
                </div>
                {necesidadesEspeciales.cargaAcademica.usuario.email && (
                  <div>
                    <label className="text-sm font-medium text-purple-800">
                      Email:
                    </label>
                    <p className="text-purple-900 font-semibold">
                      {necesidadesEspeciales.cargaAcademica.usuario.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadatos */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Información del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  ID de Carga Académica:
                </label>
                <p className="text-gray-900">
                  {necesidadesEspeciales.cargaAcademicaId}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Creado:
                </label>
                <p className="text-gray-900">
                  {formatDate(necesidadesEspeciales.createdAt)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Actualizado:
                </label>
                <p className="text-gray-900">
                  {formatDate(necesidadesEspeciales.updatedAt)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Estado:
                </label>
                <p className="text-gray-900">
                  {necesidadesEspeciales.isDeleted ? (
                    <Badge variant="destructive">Eliminado</Badge>
                  ) : (
                    <Badge variant="default">Activo</Badge>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
