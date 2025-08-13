import React, { useState } from "react";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/Card";
import { type NecesidadesEspeciales } from "../../../types/necesidades-especiales";
import { NecesidadesEspecialesModal } from "./NecesidadesEspecialesModal";
import { Eye, Edit, Trash2, Calendar, User, GraduationCap } from "lucide-react";

interface NecesidadesEspecialesCardProps {
  necesidadesEspeciales: NecesidadesEspeciales;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

export const NecesidadesEspecialesCard: React.FC<
  NecesidadesEspecialesCardProps
> = ({ necesidadesEspeciales, onEdit, onDelete, showActions = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getNecesidadesCount = () => {
    let count = 0;
    if (necesidadesEspeciales.excepcionesConductuales) count++;
    if (necesidadesEspeciales.excepcionesComunicacionales) count++;
    if (necesidadesEspeciales.excepcionesIntelectuales) count++;
    if (necesidadesEspeciales.excepcionesFisicas) count++;
    if (necesidadesEspeciales.excepcionesSuperdotacion) count++;
    if (necesidadesEspeciales.otrasNecesidades) count++;
    return count;
  };

  const getPriorityColor = () => {
    const count = getNecesidadesCount();
    if (count === 0) return "bg-gray-100 text-gray-600";
    if (count <= 2) return "bg-yellow-100 text-yellow-800";
    if (count <= 4) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const getPriorityText = () => {
    const count = getNecesidadesCount();
    if (count === 0) return "Sin necesidades";
    if (count <= 2) return "Baja";
    if (count <= 4) return "Media";
    return "Alta";
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                {necesidadesEspeciales.nombreAlumno}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>{necesidadesEspeciales.programaEducativo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Matrícula: {necesidadesEspeciales.numeroMatricula}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={getPriorityColor()}>{getPriorityText()}</Badge>
              <div className="text-xs text-gray-500">
                Rev. #{necesidadesEspeciales.numeroRevision}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Información de fechas */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Registro: {formatDate(necesidadesEspeciales.fecha)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                Revisión: {formatDate(necesidadesEspeciales.fechaRevision)}
              </span>
            </div>
          </div>

          {/* Resumen de necesidades */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Necesidades Identificadas:
            </h4>
            <div className="flex flex-wrap gap-2">
              {necesidadesEspeciales.excepcionesConductuales && (
                <Badge variant="outline" className="text-xs">
                  Conductuales
                </Badge>
              )}
              {necesidadesEspeciales.excepcionesComunicacionales && (
                <Badge variant="outline" className="text-xs">
                  Comunicacionales
                </Badge>
              )}
              {necesidadesEspeciales.excepcionesIntelectuales && (
                <Badge variant="outline" className="text-xs">
                  Intelectuales
                </Badge>
              )}
              {necesidadesEspeciales.excepcionesFisicas && (
                <Badge variant="outline" className="text-xs">
                  Físicas
                </Badge>
              )}
              {necesidadesEspeciales.excepcionesSuperdotacion && (
                <Badge variant="outline" className="text-xs">
                  Superdotación
                </Badge>
              )}
              {necesidadesEspeciales.otrasNecesidades && (
                <Badge variant="outline" className="text-xs">
                  Otras
                </Badge>
              )}
              {getNecesidadesCount() === 0 && (
                <span className="text-sm text-gray-500 italic">
                  No se han identificado necesidades específicas
                </span>
              )}
            </div>
          </div>

          {/* Profesor asignado */}
          {necesidadesEspeciales.cargaAcademica?.usuario && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-1">
                Profesor Asignado:
              </h4>
              <p className="text-sm text-gray-900">
                {necesidadesEspeciales.cargaAcademica.usuario.nombre}
              </p>
            </div>
          )}

          {/* Botones de acción */}
          {showActions && (
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-1" />
                Ver Detalles
              </Button>

              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(necesidadesEspeciales.id)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(necesidadesEspeciales.id)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <NecesidadesEspecialesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        necesidadesEspeciales={necesidadesEspeciales}
      />
    </>
  );
};
