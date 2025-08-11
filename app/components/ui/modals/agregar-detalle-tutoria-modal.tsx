import { useState, useEffect } from "react";
import { Button } from "../Button";
import { FormInput } from "../forms/FormInput";
import { FormCheckbox } from "../forms/FormCheckbox";
import { RadioGroup } from "../forms/RadioGroup";
import {
  type CreateTutoriaDetalleDto,
  CausaNoAtencion,
  CausaBaja,
  Vulnerabilidad,
  AreaCanalizacion,
} from "../../../types/tutorias";

interface AgregarDetalleTutoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (detalle: CreateTutoriaDetalleDto) => void;
  isLoading?: boolean;
  tutoriaId: number; // Agregar tutoriaId como prop obligatoria
}

export function AgregarDetalleTutoriaModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  tutoriaId,
}: AgregarDetalleTutoriaModalProps) {
  const [formData, setFormData] = useState<CreateTutoriaDetalleDto>({
    nombreAlumno: "",
    vulnerabilidad: Vulnerabilidad.ACADEMICA,
    areaCanalizacion: AreaCanalizacion.ASESORIA,
    fueAtendido: false,
    presentoMejoria: false,
    causoBaja: false,
    tutoriaId: tutoriaId, // Usar el tutoriaId de las props
  });

  // Actualizar tutoriaId cuando cambie la prop
  useEffect(() => {
    console.log("Modal recibió tutoriaId:", tutoriaId);
    setFormData((prev) => ({
      ...prev,
      tutoriaId: tutoriaId,
    }));
  }, [tutoriaId]);

  const handleInputChange = (
    field: keyof CreateTutoriaDetalleDto,
    value: any
  ) => {
    console.log(`Campo: ${field}, Valor:`, value, `Tipo:`, typeof value);

    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Si se desmarca "fueAtendido", limpiar causaNoAtencion
      if (field === "fueAtendido" && !value) {
        newData.causaNoAtencion = undefined;
      }

      // Si se desmarca "causoBaja", limpiar causaBaja
      if (field === "causoBaja" && !value) {
        newData.causaBaja = undefined;
      }

      // Si se marca "fueAtendido", limpiar causaNoAtencion
      if (field === "fueAtendido" && value) {
        newData.causaNoAtencion = undefined;
      }

      // Si se marca "causoBaja", limpiar causaBaja para que se seleccione una nueva
      if (field === "causoBaja" && value) {
        newData.causaBaja = undefined;
      }

      return newData;
    });
  };

  // Función para limpiar los datos del formulario
  const limpiarDatosFormulario = () => {
    // Crear un objeto completamente nuevo sin referencias
    const datosLimpios: CreateTutoriaDetalleDto = {
      nombreAlumno: String(formData.nombreAlumno || "").trim(),
      vulnerabilidad: formData.vulnerabilidad,
      areaCanalizacion: formData.areaCanalizacion,
      fueAtendido: Boolean(formData.fueAtendido),
      presentoMejoria: Boolean(formData.presentoMejoria),
      causoBaja: Boolean(formData.causoBaja),
      tutoriaId: formData.tutoriaId,
    };
    
    // Solo agregar campos opcionales si tienen valor y no son undefined
    if (formData.causaNoAtencion && formData.causaNoAtencion !== undefined) {
      datosLimpios.causaNoAtencion = formData.causaNoAtencion;
    }
    
    if (formData.causaBaja && formData.causaBaja !== undefined) {
      datosLimpios.causaBaja = formData.causaBaja;
    }
    
    return datosLimpios;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!formData.nombreAlumno?.trim()) {
      alert("El nombre del alumno es obligatorio");
      return;
    }

    if (!formData.vulnerabilidad) {
      alert("El tipo de vulnerabilidad es obligatorio");
      return;
    }

    if (!formData.areaCanalizacion) {
      alert("El área de canalización es obligatorio");
      return;
    }

    // Validar que el tutoriaId sea válido
    if (!formData.tutoriaId || formData.tutoriaId === 0) {
      alert("Error: ID de tutoria no válido");
      return;
    }

    // Validar que si no fue atendido, debe tener causa de no atención
    if (!formData.fueAtendido && !formData.causaNoAtencion) {
      alert("Si el alumno no fue atendido, debe especificar la causa");
      return;
    }

    // Validar que si causó baja, debe tener causa de baja
    if (formData.causoBaja && !formData.causaBaja) {
      alert("Si el alumno causó baja, debe especificar la causa");
      return;
    }

    // Limpiar los datos antes de enviar para evitar referencias circulares
    const datosLimpios = limpiarDatosFormulario();
    
    console.log("Estado del formulario antes del envío:", datosLimpios);
    console.log(
      "nombreAlumno:",
      datosLimpios.nombreAlumno,
      "Tipo:",
      typeof datosLimpios.nombreAlumno
    );
    console.log("Datos limpios a enviar:", {
      nombreAlumno: datosLimpios.nombreAlumno,
      vulnerabilidad: datosLimpios.vulnerabilidad,
      areaCanalizacion: datosLimpios.areaCanalizacion,
      fueAtendido: datosLimpios.fueAtendido,
      presentoMejoria: datosLimpios.presentoMejoria,
      causoBaja: datosLimpios.causoBaja,
      tutoriaId: datosLimpios.tutoriaId,
      causaNoAtencion: datosLimpios.causaNoAtencion,
      causaBaja: datosLimpios.causaBaja,
    });
    onSubmit(datosLimpios);
  };

  const handleClose = () => {
    setFormData({
      nombreAlumno: "",
      vulnerabilidad: Vulnerabilidad.ACADEMICA,
      areaCanalizacion: AreaCanalizacion.ASESORIA,
      fueAtendido: false,
      presentoMejoria: false,
      causoBaja: false,
      tutoriaId: tutoriaId,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Agregar Detalle de Tutoría
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Completa la información del alumno para esta tutoría
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nota sobre campos obligatorios */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Los campos marcados con{" "}
              <span className="text-red-500">*</span> son obligatorios.
            </p>
          </div>

          {/* Nombre del Alumno */}
          <FormInput
            label="Nombre del Alumno"
            value={formData.nombreAlumno || ""}
            onChange={(value) => {
              console.log(
                "FormInput onChange llamado con valor:",
                value,
                "Tipo:",
                typeof value
              );
              handleInputChange("nombreAlumno", value);
            }}
            required
            placeholder="Ingresa el nombre completo del alumno"
          />

          {/* Tipo de Vulnerabilidad */}
          <RadioGroup
            label="Tipo de Vulnerabilidad *"
            value={formData.vulnerabilidad}
            onChange={(value) =>
              handleInputChange("vulnerabilidad", value as Vulnerabilidad)
            }
            options={[
              { value: Vulnerabilidad.ACADEMICA, label: "Académica" },
              { value: Vulnerabilidad.PERSONAL, label: "Personal" },
              { value: Vulnerabilidad.SOCIOECONOMICA, label: "Socioeconómica" },
            ]}
            required
            name="vulnerabilidad"
          />

          {/* Área de Canalización */}
          <RadioGroup
            label="Área de Canalización *"
            value={formData.areaCanalizacion}
            onChange={(value) =>
              handleInputChange("areaCanalizacion", value as AreaCanalizacion)
            }
            options={[
              { value: AreaCanalizacion.ASESORIA, label: "Asesoría" },
              { value: AreaCanalizacion.MEDICO, label: "Médico" },
              { value: AreaCanalizacion.PSICOLOGO, label: "Psicólogo" },
              { value: AreaCanalizacion.ESTUDIANTILES, label: "Estudiantiles" },
              { value: AreaCanalizacion.ADMON, label: "Administración" },
              { value: AreaCanalizacion.VINCULACION, label: "Vinculación" },
              {
                value: AreaCanalizacion.DIRECCION_CARRERA,
                label: "Dirección de Carrera",
              },
              { value: AreaCanalizacion.OTRA, label: "Otra" },
            ]}
            required
            name="areaCanalizacion"
          />

          {/* Fue Atendido */}
          <div className="space-y-2">
            <FormCheckbox
              label="¿El alumno fue atendido? *"
              checked={formData.fueAtendido}
              onChange={(checked) => handleInputChange("fueAtendido", checked)}
              required
            />
            {formData.fueAtendido && (
              <button
                type="button"
                onClick={() => handleInputChange("fueAtendido", false)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Desmarcar "Fue Atendido"
              </button>
            )}
          </div>

          {/* Causa de No Atención (solo si no fue atendido) */}
          {!formData.fueAtendido && (
            <div className="space-y-2">
              <RadioGroup
                label="Causa de No Atención *"
                value={formData.causaNoAtencion || ""}
                onChange={(value) =>
                  handleInputChange("causaNoAtencion", value as CausaNoAtencion)
                }
                options={[
                  {
                    value: CausaNoAtencion.NO_PERSONAL,
                    label: "No había personal que atendiera en el área",
                  },
                  {
                    value: CausaNoAtencion.NO_ASISTIO,
                    label: "El alumno no asistió al área canalizada",
                  },
                ]}
                required
                name="causaNoAtencion"
              />
              <button
                type="button"
                onClick={() => handleInputChange("causaNoAtencion", undefined)}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Limpiar selección de causa
              </button>
            </div>
          )}

          {/* Presentó Mejora */}
          <div className="space-y-2">
            <FormCheckbox
              label="¿El alumno presentó mejora? *"
              checked={formData.presentoMejoria}
              onChange={(checked) =>
                handleInputChange("presentoMejoria", checked)
              }
              required
            />
            {formData.presentoMejoria && (
              <button
                type="button"
                onClick={() => handleInputChange("presentoMejoria", false)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Desmarcar "Presentó Mejora"
              </button>
            )}
          </div>

          {/* Causó Baja */}
          <div className="space-y-2">
            <FormCheckbox
              label="¿El alumno causó baja? *"
              checked={formData.causoBaja}
              onChange={(checked) => handleInputChange("causoBaja", checked)}
              required
            />
            {formData.causoBaja && (
              <button
                type="button"
                onClick={() => handleInputChange("causoBaja", false)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Desmarcar "Causó Baja"
              </button>
            )}
          </div>

          {/* Causa de Baja (solo si causó baja) */}
          {formData.causoBaja && (
            <div className="space-y-2">
              <RadioGroup
                label="Causa de la Baja *"
                value={formData.causaBaja || ""}
                onChange={(value) =>
                  handleInputChange("causaBaja", value as CausaBaja)
                }
                options={[
                  { value: CausaBaja.SIN_CAUSA, label: "Sin causa conocida" },
                  {
                    value: CausaBaja.INCUMPLIMIENTO,
                    label: "Incumplimiento de expectativas",
                  },
                  { value: CausaBaja.REPROBACION, label: "Reprobación" },
                  {
                    value: CausaBaja.PROBLEMAS_ECONOMICOS,
                    label: "Problemas económicos",
                  },
                  {
                    value: CausaBaja.MOTIVOS_PERSONALES,
                    label: "Motivos personales",
                  },
                  {
                    value: CausaBaja.DISTANCIA_UT,
                    label: "Distancia de la UT",
                  },
                  {
                    value: CausaBaja.PROBLEMAS_TRABAJO,
                    label: "Problemas de trabajo",
                  },
                  { value: CausaBaja.CAMBIO_UT, label: "Cambio de UT" },
                  {
                    value: CausaBaja.CAMBIO_CARRERA,
                    label: "Cambio de carrera",
                  },
                  {
                    value: CausaBaja.FALTAS_REGLAMENTO,
                    label: "Faltas al reglamento escolar",
                  },
                  { value: CausaBaja.OTRAS_CAUSAS, label: "Otras causas" },
                ]}
                required
                name="causaBaja"
              />
              <button
                type="button"
                onClick={() => handleInputChange("causaBaja", undefined)}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Limpiar selección de causa
              </button>
            </div>
          )}

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
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.nombreAlumno ||
                formData.nombreAlumno.trim().length === 0
              }
            >
              {isLoading ? "Guardando..." : "Guardar Detalle"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
