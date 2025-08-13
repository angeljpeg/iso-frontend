import React, { useState, useEffect } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/textarea";
import { FormSelect } from "../../ui/forms/FormSelect";
import { Checkbox } from "../../ui/checkbox";

import {
  type CreateNecesidadesEspecialesDto,
  type UpdateNecesidadesEspecialesDto,
  type NecesidadesEspeciales,
  TIPOS_NECESIDAD_OPTIONS,
} from "../../../types/necesidades-especiales";
import { useNecesidadesEspecialesValidation } from "../../../hooks/necesidades-especiales/useNecesidadesEspecialesActions";

interface NecesidadesEspecialesFormProps {
  initialData?: NecesidadesEspeciales;
  onSubmit: (
    data: CreateNecesidadesEspecialesDto | UpdateNecesidadesEspecialesDto
  ) => void;
  onCancel: () => void;
  loading?: boolean;
  isEdit?: boolean;
}

export const NecesidadesEspecialesForm: React.FC<
  NecesidadesEspecialesFormProps
> = ({ initialData, onSubmit, onCancel, loading = false, isEdit = false }) => {
  const { validateCreateForm, validateUpdateForm } =
    useNecesidadesEspecialesValidation();

  const [formData, setFormData] = useState<CreateNecesidadesEspecialesDto>({
    fecha: "",
    nombreAlumno: "",
    numeroMatricula: "",
    programaEducativo: "",
    fechaRevision: "",
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
    cargaAcademicaId: 0,
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [cargasAcademicas, setCargasAcademicas] = useState<
    Array<{ id: number; nombre: string }>
  >([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        fecha: initialData.fecha,
        nombreAlumno: initialData.nombreAlumno,
        numeroMatricula: initialData.numeroMatricula,
        programaEducativo: initialData.programaEducativo,
        fechaRevision: initialData.fechaRevision,
        numeroRevision: initialData.numeroRevision,
        excepcionesConductuales: initialData.excepcionesConductuales,
        especificacionConductual: initialData.especificacionConductual || "",
        excepcionesComunicacionales: initialData.excepcionesComunicacionales,
        especificacionComunicacional:
          initialData.especificacionComunicacional || "",
        excepcionesIntelectuales: initialData.excepcionesIntelectuales,
        especificacionIntelectual: initialData.especificacionIntelectual || "",
        excepcionesFisicas: initialData.excepcionesFisicas,
        especificacionFisica: initialData.especificacionFisica || "",
        excepcionesSuperdotacion: initialData.excepcionesSuperdotacion,
        especificacionSuperdotacion:
          initialData.especificacionSuperdotacion || "",
        otrasNecesidades: initialData.otrasNecesidades || "",
        cargaAcademicaId: initialData.cargaAcademicaId,
      });
    }
  }, [initialData]);

  // TODO: Implementar carga de cargas académicas
  useEffect(() => {
    // Simular datos de cargas académicas
    setCargasAcademicas([
      { id: 1, nombre: "Carga Académica 1" },
      { id: 2, nombre: "Carga Académica 2" },
    ]);
  }, []);

  const handleInputChange = (
    field: keyof CreateNecesidadesEspecialesDto,
    value: any
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleCheckboxChange = (
    field: keyof CreateNecesidadesEspecialesDto,
    checked: boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));

    // Si se desmarca una excepción, limpiar su especificación
    if (!checked) {
      const especificacionField = `especificacion${field
        .toString()
        .replace("excepciones", "")}` as keyof CreateNecesidadesEspecialesDto;
      setFormData((prev) => ({ ...prev, [especificacionField]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = isEdit
      ? validateUpdateForm(formData as UpdateNecesidadesEspecialesDto)
      : validateCreateForm(formData);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  const programasEducativos = [
    "Ingeniería en Sistemas Computacionales",
    "Ingeniería Industrial",
    "Ingeniería Mecánica",
    "Ingeniería Eléctrica",
    "Ingeniería Química",
    "Ingeniería Civil",
    "Licenciatura en Administración",
    "Licenciatura en Contaduría",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-800">
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Información Básica
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha del Registro <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Alumno <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.nombreAlumno}
              onChange={(e) =>
                handleInputChange("nombreAlumno", e.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Matrícula <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.numeroMatricula}
              onChange={(e) =>
                handleInputChange("numeroMatricula", e.target.value)
              }
              required
            />
          </div>

          <FormSelect
            label="Programa Educativo"
            value={formData.programaEducativo}
            onChange={(e) =>
              handleInputChange("programaEducativo", e.target.value)
            }
            options={programasEducativos.map((programa) => ({
              value: programa,
              label: programa,
            }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Revisión <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.fechaRevision}
              onChange={(e) =>
                handleInputChange("fechaRevision", e.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Revisión <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.numeroRevision}
              onChange={(e) =>
                handleInputChange("numeroRevision", parseInt(e.target.value))
              }
              min={1}
              required
            />
          </div>

          <FormSelect
            label="Carga Académica"
            value={formData.cargaAcademicaId.toString()}
            onChange={(e) =>
              handleInputChange("cargaAcademicaId", parseInt(e.target.value))
            }
            options={cargasAcademicas.map((carga) => ({
              value: carga.id,
              label: carga.nombre,
            }))}
            required
          />
        </div>

        {/* Tipos de necesidades especiales */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Tipos de Necesidades Especiales
          </h3>

          {TIPOS_NECESIDAD_OPTIONS.map((tipo) => {
            const excepcionField =
              tipo.value as keyof CreateNecesidadesEspecialesDto;
            const especificacionField = `especificacion${tipo.value.replace(
              "excepciones",
              ""
            )}` as keyof CreateNecesidadesEspecialesDto;
            const isChecked = formData[excepcionField] as boolean;

            return (
              <div key={tipo.value} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(excepcionField, checked as boolean)
                    }
                  />
                  <label className="text-sm font-medium text-gray-700">
                    {tipo.label}
                  </label>
                </div>

                {isChecked && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especificación de {tipo.label}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={formData[especificacionField] as string}
                      onChange={(e) =>
                        handleInputChange(especificacionField, e.target.value)
                      }
                      placeholder={`Describa las necesidades específicas de ${tipo.label.toLowerCase()}`}
                      rows={3}
                      required
                    />
                  </div>
                )}
              </div>
            );
          })}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Otras Necesidades
            </label>
            <Textarea
              value={formData.otrasNecesidades}
              onChange={(e) =>
                handleInputChange("otrasNecesidades", e.target.value)
              }
              placeholder="Describa cualquier otra necesidad especial no cubierta anteriormente"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  );
};
