import { useState } from "react";
import { Button } from "../Button";
import { FormInput } from "../forms/FormInput";
import { FormTextarea } from "../forms/FormTextarea";
import type { CreateTutoriaDto } from "~/types/tutorias";

interface CrearTutoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tutoria: CreateTutoriaDto) => void;
  isLoading?: boolean;
  grupo: {
    nombreGenerado: string;
    carrera: string;
    cuatrimestreRelacion: {
      nombreGenerado: string;
    };
  };
  nombreTutor: string;
  cargaAcademicaId: number;
}

export function CrearTutoriaModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  grupo,
  nombreTutor,
  cargaAcademicaId,
}: CrearTutoriaModalProps) {
  const [formData, setFormData] = useState<CreateTutoriaDto>({
    cuatrimestre: grupo.cuatrimestreRelacion.nombreGenerado,
    nombreTutor,
    grupo: grupo.nombreGenerado,
    carrera: grupo.carrera,
    fecha: new Date().toISOString().split("T")[0], // Fecha actual
    observaciones: "",
    actividadesTutoriaGrupal: [],
    cargaAcademicaId,
  });

  const [actividadTemporal, setActividadTemporal] = useState("");

  const handleInputChange = (field: keyof CreateTutoriaDto, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddActividad = () => {
    if (
      actividadTemporal.trim() &&
      formData.actividadesTutoriaGrupal!.length < 5
    ) {
      setFormData((prev) => ({
        ...prev,
        actividadesTutoriaGrupal: [
          ...(prev.actividadesTutoriaGrupal || []),
          actividadTemporal.trim(),
        ],
      }));
      setActividadTemporal("");
    }
  };

  const handleRemoveActividad = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      actividadesTutoriaGrupal: prev.actividadesTutoriaGrupal!.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      cuatrimestre: grupo.cuatrimestreRelacion.nombreGenerado,
      nombreTutor,
      grupo: grupo.nombreGenerado,
      carrera: grupo.carrera,
      fecha: new Date().toISOString().split("T")[0],
      observaciones: "",
      actividadesTutoriaGrupal: [],
      cargaAcademicaId,
    });
    setActividadTemporal("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Crear Nueva Tutoría
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Completa la información para crear una nueva tutoría del grupo{" "}
            {grupo.nombreGenerado}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del Grupo (solo lectura) */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grupo
              </label>
              <p className="text-sm text-gray-900">{grupo.nombreGenerado}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carrera
              </label>
              <p className="text-sm text-gray-900">{grupo.carrera}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuatrimestre
              </label>
              <p className="text-sm text-gray-900">
                {grupo.cuatrimestreRelacion.nombreGenerado}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tutor
              </label>
              <p className="text-sm text-gray-900">{nombreTutor}</p>
            </div>
          </div>

          {/* Fecha */}
          <FormInput
            label="Fecha de la Tutoría"
            type="date"
            value={formData.fecha}
            onChange={(value) => handleInputChange("fecha", value)}
            required
          />

          {/* Observaciones */}
          <FormTextarea
            label="Observaciones Generales"
            value={formData.observaciones || ""}
            onChange={(value) => handleInputChange("observaciones", value)}
            placeholder="Describe las observaciones generales de la tutoría..."
            rows={3}
          />

          {/* Actividades de Tutoría Grupal */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Actividades de Tutoría Grupal
              <span className="text-xs text-gray-500 ml-2">
                (Máximo 5 actividades)
              </span>
            </label>

            {/* Lista de actividades */}
            {formData.actividadesTutoriaGrupal &&
              formData.actividadesTutoriaGrupal.length > 0 && (
                <div className="space-y-2">
                  {formData.actividadesTutoriaGrupal.map((actividad, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                    >
                      <span className="text-sm text-blue-900">{actividad}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveActividad(index)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </div>
              )}

            {/* Agregar nueva actividad */}
            {formData.actividadesTutoriaGrupal!.length < 5 && (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={actividadTemporal}
                  onChange={(e) => setActividadTemporal(e.target.value)}
                  placeholder="Nueva actividad..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={100}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddActividad}
                  disabled={!actividadTemporal.trim()}
                >
                  Agregar
                </Button>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.fecha}>
              {isLoading ? "Creando..." : "Crear Tutoría"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
