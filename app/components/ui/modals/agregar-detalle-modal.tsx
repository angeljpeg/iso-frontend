import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FormModal } from "./form-modal";
import { Input } from "../Input";
import { EstadoAvance } from "~/types/enums";
import type { Tema } from "~/types/temas";
import { useSeguimientoDetalleActions } from "~/hooks/programacion-curso/useSeguimientoDetalleActions";

interface AgregarDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Tema | null;
  seguimientoId: string;
  detalleExistenteProp?: any;
  onDetalleCreated?: () => void;
}

export function AgregarDetalleModal({
  isOpen,
  onClose,
  tema,
  seguimientoId,
  detalleExistenteProp,
  onDetalleCreated,
}: AgregarDetalleModalProps) {
  console.log(
    "🔍 AgregarDetalleModal renderizado con seguimientoId:",
    seguimientoId
  );
  console.log("🔍 AgregarDetalleModal renderizado con tema:", tema);
  console.log(
    "🔍 AgregarDetalleModal renderizado con tema.semanaProgramada:",
    tema?.semanaProgramada
  );
  const { createDetalle, updateDetalle, isLoading, error, clearError } =
    useSeguimientoDetalleActions();

  // Usar la prop detalleExistenteProp en lugar de buscar en los detalles
  const detalleExistente = detalleExistenteProp;

  const [formData, setFormData] = useState({
    tema: "",
    semanaTerminada: 1,
    estadoAvance: EstadoAvance.EN_PROGRESO,
    justificacion: "",
    acciones: "",
    evidencias: "",
  });

  // Determinar si se puede editar completamente (estados EN_PROGRESO, etc.)
  const sePuedeEditarCompletamente = useMemo(
    () =>
      detalleExistente &&
      detalleExistente.estadoAvance !== EstadoAvance.RETRASADO &&
      detalleExistente.estadoAvance !== EstadoAvance.COMPLETADO,
    [detalleExistente]
  );

  // Determinar si se puede editar solo acciones y evidencias (en caso de retraso)
  const sePuedeEditarAcciones = useMemo(
    () =>
      detalleExistente &&
      detalleExistente.estadoAvance === EstadoAvance.RETRASADO,
    [detalleExistente]
  );

  // Determinar si el detalle está completamente bloqueado
  const isDetalleBloqueado = useMemo(
    () =>
      detalleExistente &&
      detalleExistente.estadoAvance === EstadoAvance.COMPLETADO,
    [detalleExistente]
  );

  // Determinar si se puede editar algo (completamente o solo acciones)
  const sePuedeEditar = useMemo(
    () => sePuedeEditarCompletamente || sePuedeEditarAcciones,
    [sePuedeEditarCompletamente, sePuedeEditarAcciones]
  );

  // Función para determinar si el estado está bloqueado
  const isEstadoBloqueado = useCallback(() => {
    if (!tema?.semanaProgramada) return false;
    const diferencia = formData.semanaTerminada - tema.semanaProgramada;
    return (
      (formData.estadoAvance === EstadoAvance.RETRASADO && diferencia >= 2) ||
      (formData.estadoAvance === EstadoAvance.COMPLETADO && diferencia >= 0)
    );
  }, [tema?.semanaProgramada, formData.semanaTerminada, formData.estadoAvance]);

  // Función para actualizar el estado automáticamente basado en la semana
  const updateEstadoAvance = useCallback(
    (semana: number) => {
      if (!tema?.semanaProgramada) {
        console.log("⚠️ No hay semana programada para el tema");
        return;
      }

      const diferencia = semana - tema.semanaProgramada;
      console.log("🔍 Calculando estado automático:", {
        semana,
        semanaProgramada: tema.semanaProgramada,
        diferencia,
      });

      if (diferencia >= 2) {
        // Si la diferencia es >= 2, estado = RETRASADO
        console.log("🚨 Estado automático: RETRASADO (diferencia >= 2)");
        setFormData((prev) => ({
          ...prev,
          estadoAvance: EstadoAvance.RETRASADO,
          // Limpiar campos de retraso si ya no aplican
          justificacion: "",
          acciones: "",
          evidencias: "",
        }));
      } else if (diferencia >= 0) {
        // Si la diferencia es >= 0 (se cumple o se adelanta), estado = COMPLETADO
        console.log("✅ Estado automático: COMPLETADO (diferencia >= 0)");
        setFormData((prev) => ({
          ...prev,
          estadoAvance: EstadoAvance.COMPLETADO,
        }));
      } else {
        // Si la diferencia es < 0 (está adelantado), permitir selección manual
        console.log("🔄 Estado automático: EN_PROGRESO (diferencia < 0)");
        setFormData((prev) => ({
          ...prev,
          estadoAvance: EstadoAvance.EN_PROGRESO,
        }));
      }
    },
    [tema?.semanaProgramada]
  );

  useEffect(() => {
    console.log("🔍 useEffect del modal ejecutándose:", {
      tema: !!tema,
      isOpen,
      seguimientoId: !!seguimientoId,
      temaSemanaProgramada: tema?.semanaProgramada,
    });

    if (tema && isOpen) {
      console.log("🔍 Modal abierto - seguimientoId:", seguimientoId);
      console.log("🔍 Modal abierto - tema:", tema);
      console.log(
        "🔍 Modal abierto - tema.semanaProgramada:",
        tema.semanaProgramada
      );
      console.log("🔍 Modal abierto - detalleExistente:", detalleExistente);

      if (detalleExistente) {
        // Si estamos editando, precargar los datos existentes
        setFormData({
          tema: detalleExistente.tema,
          semanaTerminada: detalleExistente.semanaTerminada,
          estadoAvance: detalleExistente.estadoAvance,
          justificacion: detalleExistente.justificacion || "",
          acciones: detalleExistente.acciones || "",
          evidencias: detalleExistente.evidencias || "",
        });
      } else {
        // Si estamos creando, inicializar con valores por defecto
        setFormData({
          tema: tema.nombre,
          semanaTerminada: tema.semanaProgramada,
          estadoAvance: EstadoAvance.EN_PROGRESO,
          justificacion: "",
          acciones: "",
          evidencias: "",
        });

        // Aplicar lógica de estado automático al inicializar
        if (tema.semanaProgramada) {
          updateEstadoAvance(tema.semanaProgramada);
        }
      }
    }
  }, [tema, isOpen, detalleExistente, seguimientoId, updateEstadoAvance]);

  // Efecto adicional para forzar la actualización del estado cuando cambie la semana
  useEffect(() => {
    if (tema?.semanaProgramada && formData.semanaTerminada) {
      console.log("🔄 Forzando actualización de estado por cambio de semana");
      console.log("🔍 Tema disponible:", tema);
      console.log("🔍 Semana programada:", tema.semanaProgramada);
      console.log("🔍 Semana terminada:", formData.semanaTerminada);
      updateEstadoAvance(formData.semanaTerminada);
    } else {
      console.log("⚠️ No se puede actualizar estado automáticamente:", {
        temaDisponible: !!tema,
        semanaProgramada: tema?.semanaProgramada,
        semanaTerminada: formData.semanaTerminada,
      });
    }
  }, [formData.semanaTerminada, tema?.semanaProgramada, updateEstadoAvance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Debug: verificar el seguimientoId
    console.log("🔍 Debug - seguimientoId:", seguimientoId);
    console.log("🔍 Debug - detalleExistente:", detalleExistente);
    console.log("🔍 Debug - formData:", formData);

    // Validar campos obligatorios cuando el estado es RETRASADO
    if (formData.estadoAvance === EstadoAvance.RETRASADO) {
      if (!formData.justificacion.trim()) {
        alert("La justificación del retraso es obligatoria");
        return;
      }
      if (!formData.acciones.trim()) {
        alert("Las acciones a tomar son obligatorias");
        return;
      }
    }

    // Si estamos editando un detalle en retraso, validar que acciones no esté vacío
    if (sePuedeEditarAcciones && !formData.acciones.trim()) {
      alert("Las acciones a tomar son obligatorias");
      return;
    }

    try {
      let result;

      // Validar que el seguimientoId esté presente
      if (!seguimientoId) {
        alert("Error: No se pudo identificar el seguimiento del curso");
        return;
      }

      if (
        detalleExistente &&
        (sePuedeEditarCompletamente || sePuedeEditarAcciones)
      ) {
        // Actualizar detalle existente
        console.log("📝 Actualizando detalle existente:", detalleExistente.id);

        if (sePuedeEditarAcciones) {
          // Solo actualizar acciones y evidencias en caso de retraso
          result = await updateDetalle(seguimientoId, detalleExistente.id, {
            acciones: formData.acciones,
            evidencias: formData.evidencias,
          });
        } else {
          // Actualizar todos los campos si se puede editar completamente
          result = await updateDetalle(seguimientoId, detalleExistente.id, {
            semanaTerminada: formData.semanaTerminada,
            estadoAvance: formData.estadoAvance,
            justificacion: formData.justificacion,
            acciones: formData.acciones,
            evidencias: formData.evidencias,
          });
        }
      } else if (!detalleExistente) {
        // Crear nuevo detalle
        const detalleData = {
          ...formData,
          seguimientoCursoId: seguimientoId,
        };
        console.log("📤 Creando nuevo detalle:", detalleData);
        result = await createDetalle(detalleData);
      } else if (isDetalleBloqueado) {
        // No se puede editar (estado bloqueado)
        alert(
          "No se puede editar este detalle porque su estado está bloqueado (COMPLETADO)"
        );
        return;
      } else {
        // Caso inesperado
        alert("Error: No se puede determinar si el detalle se puede editar");
        return;
      }

      if (result !== null) {
        console.log("✅ Operación exitosa, cerrando modal");
        onClose();
        // Llamar al callback con el mensaje correcto
        if (detalleExistente) {
          // Si es edición, mostrar mensaje de guardado
          onDetalleCreated?.();
        } else {
          // Si es creación, mostrar mensaje de agregado
          onDetalleCreated?.();
        }
      } else {
        console.log("❌ Operación falló");
      }
    } catch (err) {
      console.error("❌ Error en la operación:", err);
    }
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        detalleExistente
          ? "Editar Detalle del Seguimiento"
          : "Agregar Detalle al Seguimiento"
      }
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitText={detalleExistente ? "Actualizar" : "Crear"}
    >
      <div className="space-y-4">
        {detalleExistente && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              {sePuedeEditarCompletamente
                ? "📝 Editando detalle existente. Puedes modificar todos los campos."
                : sePuedeEditarAcciones
                ? "📝 Editando detalle en retraso. Solo puedes modificar las acciones a tomar y evidencias."
                : isDetalleBloqueado
                ? "🔒 Este detalle no se puede editar porque su estado está bloqueado (COMPLETADO)."
                : "⚠️ Este detalle tiene restricciones de edición."}
            </p>
          </div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Tema
          </label>
          <Input
            value={formData.tema}
            disabled
            className="bg-gray-50 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Semana Terminada
          </label>
          <Input
            type="number"
            min="1"
            value={formData.semanaTerminada}
            onChange={(e) => {
              const semana = parseInt(e.target.value);
              console.log("🔍 onChange semana:", {
                valorOriginal: e.target.value,
                semanaParseada: semana,
                temaDisponible: !!tema,
                semanaProgramada: tema?.semanaProgramada,
              });

              setFormData((prev) => ({
                ...prev,
                semanaTerminada: semana,
              }));

              // Actualizar estado automáticamente
              console.log(
                "🔍 Llamando a updateEstadoAvance con semana:",
                semana
              );
              updateEstadoAvance(semana);
            }}
            disabled={
              isDetalleBloqueado ||
              (!sePuedeEditarCompletamente && !!detalleExistente)
            }
            className={
              isDetalleBloqueado ||
              (!sePuedeEditarCompletamente && !!detalleExistente)
                ? "bg-gray-50 cursor-not-allowed"
                : ""
            }
            required
          />
          {tema?.semanaProgramada && (
            <p className="text-sm text-amber-600 mt-1">
              ⚠️ Semana programada: {tema.semanaProgramada} |
              {formData.semanaTerminada - tema.semanaProgramada >= 2
                ? " Estado se bloqueará en 'Retrasado'"
                : formData.semanaTerminada - tema.semanaProgramada >= 0
                ? " Estado se bloqueará en 'Completado'"
                : " Estado se puede cambiar manualmente"}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Estado del Avance
          </label>
          <select
            value={formData.estadoAvance}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                estadoAvance: e.target.value as EstadoAvance,
              }))
            }
            disabled={
              isEstadoBloqueado() ||
              isDetalleBloqueado ||
              (!sePuedeEditarCompletamente && !!detalleExistente)
            }
            className={`px-3 py-2 w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isEstadoBloqueado() ||
              isDetalleBloqueado ||
              (!sePuedeEditarCompletamente && !!detalleExistente)
                ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                : "border-gray-300"
            }`}
            required
          >
            <option value={EstadoAvance.NO_INICIADO}>No Iniciado</option>
            <option value={EstadoAvance.EN_PROGRESO}>En Progreso</option>
            <option value={EstadoAvance.COMPLETADO}>Completado</option>
            <option value={EstadoAvance.RETRASADO}>Retrasado</option>
          </select>
          {(formData.estadoAvance === EstadoAvance.RETRASADO &&
            formData.semanaTerminada - (tema?.semanaProgramada || 0) >= 2) ||
            (formData.estadoAvance === EstadoAvance.COMPLETADO &&
              formData.semanaTerminada - (tema?.semanaProgramada || 0) >= 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  🔒 El estado está bloqueado en "{formData.estadoAvance}" hasta
                  que cambies la semana apropiadamente
                </p>
              ))}
        </div>

        {formData.estadoAvance === EstadoAvance.RETRASADO && (
          <>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Justificación del Retraso{" "}
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.justificacion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    justificacion: e.target.value,
                  }))
                }
                disabled={!sePuedeEditarCompletamente && !!detalleExistente}
                className={`px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !sePuedeEditarCompletamente && !!detalleExistente
                    ? "bg-gray-50 cursor-not-allowed"
                    : ""
                }`}
                rows={2}
                maxLength={500}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Acciones a Tomar <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.acciones}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, acciones: e.target.value }))
                }
                disabled={!sePuedeEditarAcciones && !!detalleExistente}
                className={`px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !sePuedeEditarAcciones && !!detalleExistente
                    ? "bg-gray-50 cursor-not-allowed"
                    : ""
                }`}
                rows={2}
                maxLength={500}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Evidencias
              </label>
              <textarea
                value={formData.evidencias}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    evidencias: e.target.value,
                  }))
                }
                disabled={!sePuedeEditarAcciones && !!detalleExistente}
                className={`px-3 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !sePuedeEditarAcciones && !!detalleExistente
                    ? "bg-gray-50 cursor-not-allowed"
                    : ""
                }`}
                rows={2}
                maxLength={500}
              />
            </div>
          </>
        )}
      </div>
    </FormModal>
  );
}
