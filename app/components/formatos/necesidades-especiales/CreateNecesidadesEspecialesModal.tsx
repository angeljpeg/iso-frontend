import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/forms/input";
import { Label } from "../../ui/forms/label";
import { Textarea } from "../../ui/forms/textarea";
import { Checkbox } from "../../ui/forms/checkbox";
import {
  useNecesidadesEspecialesActions,
  useNecesidadesEspecialesValidation,
} from "../../../hooks/necesidades-especiales/useNecesidadesEspecialesActions";
import { useAuthStore } from "../../../store/auth";
import type { CreateNecesidadesEspecialesDto } from "../../../types/necesidades-especiales";
import type { CargaAcademica } from "../../../types/carga-academica";

interface CreateNecesidadesEspecialesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cargaAcademica: CargaAcademica;
}

export const CreateNecesidadesEspecialesModal: React.FC<
  CreateNecesidadesEspecialesModalProps
> = ({ isOpen, onClose, onSuccess, cargaAcademica }) => {
  const { accessToken } = useAuthStore();
  const { createNecesidad, loading, error, success, clearMessages } =
    useNecesidadesEspecialesActions();
  const { validateCreateForm } = useNecesidadesEspecialesValidation();

  const [formData, setFormData] = useState<CreateNecesidadesEspecialesDto>({
    fecha: new Date().toISOString().split("T")[0],
    nombreAlumno: "",
    numeroMatricula: "",
    programaEducativo: cargaAcademica.asignatura || "",
    fechaRevision: new Date().toISOString().split("T")[0],
    numeroRevision: 1,
    excepcionesConductuales: false,
    especificacionConductual: "",
    excepcionesComunicacionales: false,
    especificacionComunicacional: "",
    excepcionesIntelectuales: false,
    especificacionIntelectual: "",
    excepcionesFisicas: false,
    especificacionFisica: "",
    excepcionesSuperdotacion: false,
    especificacionSuperdotacion: "",
    otrasNecesidades: "",
    cargaAcademicaId: cargaAcademica.id,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        onSuccess();
        onClose();
        clearMessages();
      }, 1500);
    }
  }, [success, onSuccess, onClose, clearMessages]);

  const handleInputChange = (
    field: keyof CreateNecesidadesEspecialesDto,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar errores de validación cuando el usuario empiece a escribir
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleCheckboxChange = (
    field: keyof CreateNecesidadesEspecialesDto
  ) => {
    const newValue = !formData[field] as boolean;
    setFormData((prev) => ({
      ...prev,
      [field]: newValue,
    }));

    // Limpiar especificación si se desmarca la excepción
    if (!newValue) {
      const especificacionField = `especificacion${field
        .toString()
        .replace("excepciones", "")}` as keyof CreateNecesidadesEspecialesDto;
      if (especificacionField in formData) {
        setFormData((prev) => ({
          ...prev,
          [especificacionField]: "",
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formulario
    const errors = validateCreateForm(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Crear necesidad especial
    if (accessToken) {
      await createNecesidad({
        ...formData,
        token: accessToken,
      });
    }
  };

  const handleClose = () => {
    setFormData({
      fecha: new Date().toISOString().split("T")[0],
      nombreAlumno: "",
      numeroMatricula: "",
      programaEducativo: cargaAcademica.asignatura || "",
      fechaRevision: new Date().toISOString().split("T")[0],
      numeroRevision: 1,
      excepcionesConductuales: false,
      especificacionConductual: "",
      excepcionesComunicacionales: false,
      especificacionComunicacional: "",
      excepcionesIntelectuales: false,
      especificacionIntelectual: "",
      excepcionesFisicas: false,
      especificacionFisica: "",
      excepcionesSuperdotacion: false,
      especificacionSuperdotacion: "",
      otrasNecesidades: "",
      cargaAcademicaId: cargaAcademica.id,
    });
    setValidationErrors([]);
    clearMessages();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Crear Necesidades Especiales
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-3">
              Información del Alumno
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombreAlumno">Nombre del Alumno *</Label>
                <Input
                  id="nombreAlumno"
                  value={formData.nombreAlumno}
                  onChange={(e) =>
                    handleInputChange("nombreAlumno", e.target.value)
                  }
                  placeholder="Nombre completo del alumno"
                  required
                />
              </div>
              <div>
                <Label htmlFor="numeroMatricula">Número de Matrícula *</Label>
                <Input
                  id="numeroMatricula"
                  value={formData.numeroMatricula}
                  onChange={(e) =>
                    handleInputChange("numeroMatricula", e.target.value)
                  }
                  placeholder="Matrícula del alumno"
                  required
                />
              </div>
              <div>
                <Label htmlFor="programaEducativo">Programa Educativo *</Label>
                <Input
                  id="programaEducativo"
                  value={formData.programaEducativo}
                  onChange={(e) =>
                    handleInputChange("programaEducativo", e.target.value)
                  }
                  placeholder="Carrera o programa"
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha de Registro *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange("fecha", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fechaRevision">Fecha de Revisión *</Label>
                <Input
                  id="fechaRevision"
                  type="date"
                  value={formData.fechaRevision}
                  onChange={(e) =>
                    handleInputChange("fechaRevision", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="numeroRevision">Número de Revisión *</Label>
                <Input
                  id="numeroRevision"
                  type="number"
                  min="1"
                  value={formData.numeroRevision}
                  onChange={(e) =>
                    handleInputChange(
                      "numeroRevision",
                      parseInt(e.target.value)
                    )
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Necesidades especiales */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-orange-900 mb-3">
              Tipos de Necesidades Especiales
            </h3>
            <div className="space-y-4">
              {/* Excepciones Conductuales */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excepcionesConductuales"
                    checked={formData.excepcionesConductuales}
                    onCheckedChange={() =>
                      handleCheckboxChange("excepcionesConductuales")
                    }
                  />
                  <Label htmlFor="excepcionesConductuales">
                    Excepciones Conductuales
                  </Label>
                </div>
                {formData.excepcionesConductuales && (
                  <Textarea
                    placeholder="Especifique las necesidades conductuales del alumno..."
                    value={formData.especificacionConductual}
                    onChange={(e) =>
                      handleInputChange(
                        "especificacionConductual",
                        e.target.value
                      )
                    }
                    className="ml-6"
                  />
                )}
              </div>

              {/* Excepciones Comunicacionales */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excepcionesComunicacionales"
                    checked={formData.excepcionesComunicacionales}
                    onCheckedChange={() =>
                      handleCheckboxChange("excepcionesComunicacionales")
                    }
                  />
                  <Label htmlFor="excepcionesComunicacionales">
                    Excepciones Comunicacionales
                  </Label>
                </div>
                {formData.excepcionesComunicacionales && (
                  <Textarea
                    placeholder="Especifique las necesidades comunicacionales del alumno..."
                    value={formData.especificacionComunicacional}
                    onChange={(e) =>
                      handleInputChange(
                        "especificacionComunicacional",
                        e.target.value
                      )
                    }
                    className="ml-6"
                  />
                )}
              </div>

              {/* Excepciones Intelectuales */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excepcionesIntelectuales"
                    checked={formData.excepcionesIntelectuales}
                    onCheckedChange={() =>
                      handleCheckboxChange("excepcionesIntelectuales")
                    }
                  />
                  <Label htmlFor="excepcionesIntelectuales">
                    Excepciones Intelectuales
                  </Label>
                </div>
                {formData.excepcionesIntelectuales && (
                  <Textarea
                    placeholder="Especifique las necesidades intelectuales del alumno..."
                    value={formData.especificacionIntelectual}
                    onChange={(e) =>
                      handleInputChange(
                        "especificacionIntelectual",
                        e.target.value
                      )
                    }
                    className="ml-6"
                  />
                )}
              </div>

              {/* Excepciones Físicas */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excepcionesFisicas"
                    checked={formData.excepcionesFisicas}
                    onCheckedChange={() =>
                      handleCheckboxChange("excepcionesFisicas")
                    }
                  />
                  <Label htmlFor="excepcionesFisicas">
                    Excepciones Físicas
                  </Label>
                </div>
                {formData.excepcionesFisicas && (
                  <Textarea
                    placeholder="Especifique las necesidades físicas del alumno..."
                    value={formData.especificacionFisica}
                    onChange={(e) =>
                      handleInputChange("especificacionFisica", e.target.value)
                    }
                    className="ml-6"
                  />
                )}
              </div>

              {/* Excepciones de Superdotación */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="excepcionesSuperdotacion"
                    checked={formData.excepcionesSuperdotacion}
                    onCheckedChange={() =>
                      handleCheckboxChange("excepcionesSuperdotacion")
                    }
                  />
                  <Label htmlFor="excepcionesSuperdotacion">
                    Excepciones de Superdotación
                  </Label>
                </div>
                {formData.excepcionesSuperdotacion && (
                  <Textarea
                    placeholder="Especifique las necesidades de superdotación del alumno..."
                    value={formData.especificacionSuperdotacion}
                    onChange={(e) =>
                      handleInputChange(
                        "especificacionSuperdotacion",
                        e.target.value
                      )
                    }
                    className="ml-6"
                  />
                )}
              </div>

              {/* Otras necesidades */}
              <div className="space-y-2">
                <Label htmlFor="otrasNecesidades">Otras Necesidades</Label>
                <Textarea
                  id="otrasNecesidades"
                  placeholder="Otras necesidades especiales no categorizadas..."
                  value={formData.otrasNecesidades}
                  onChange={(e) =>
                    handleInputChange("otrasNecesidades", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Información del grupo */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900 mb-3">
              Información del Grupo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Grupo</Label>
                <p className="text-green-900 font-semibold">
                  {cargaAcademica.grupo?.nombreGenerado || "N/A"}
                </p>
              </div>
              <div>
                <Label>Asignatura</Label>
                <p className="text-green-900 font-semibold">
                  {cargaAcademica.asignatura || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Errores de validación */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Errores de validación
                  </h3>
                  <ul className="text-sm text-red-700 mt-1 list-disc list-inside">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Mensajes del sistema */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Éxito</h3>
                  <p className="text-sm text-green-700 mt-1">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Creando..." : "Crear Necesidades Especiales"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
