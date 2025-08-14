import React, { useState, useEffect } from "react";
import { Button } from "../../ui/Button";
import { Badge } from "../../ui/badge";
import { NecesidadesEspecialesModal } from "./NecesidadesEspecialesModal";
import { getNecesidadesEspecialesByCargaAcademica } from "../../../services/necesidades-especiales.service";
import { useAuthStore } from "../../../store/auth";
import type { NecesidadesEspeciales } from "../../../types/necesidades-especiales";
import type { CargaAcademica } from "../../../types/carga-academica";

interface NecesidadesEspecialesListProps {
  cargaAcademica: CargaAcademica;
}

export const NecesidadesEspecialesList: React.FC<
  NecesidadesEspecialesListProps
> = ({ cargaAcademica }) => {
  const { accessToken } = useAuthStore();
  const [necesidadesEspeciales, setNecesidadesEspeciales] = useState<NecesidadesEspeciales[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNecesidad, setSelectedNecesidad] = useState<NecesidadesEspeciales | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (accessToken && cargaAcademica.id) {
      fetchNecesidadesEspeciales();
    }
  }, [accessToken, cargaAcademica.id]);

  const fetchNecesidadesEspeciales = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getNecesidadesEspecialesByCargaAcademica({
        cargaAcademicaId: cargaAcademica.id.toString(),
        token: accessToken!,
      });

      setNecesidadesEspeciales(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error al cargar necesidades especiales";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNecesidadClick = (necesidad: NecesidadesEspeciales) => {
    setSelectedNecesidad(necesidad);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedNecesidad(null);
  };

  const handleRefresh = () => {
    fetchNecesidadesEspeciales();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getNecesidadesCount = () => {
    let count = 0;
    necesidadesEspeciales.forEach(necesidad => {
      if (necesidad.excepcionesConductuales) count++;
      if (necesidad.excepcionesComunicacionales) count++;
      if (necesidad.excepcionesIntelectuales) count++;
      if (necesidad.excepcionesFisicas) count++;
      if (necesidad.excepcionesSuperdotacion) count++;
      if (necesidad.otrasNecesidades) count++;
    });
    return count;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-center items-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando necesidades especiales...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                Error al cargar necesidades especiales
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Necesidades Especiales del Grupo
          </h3>
          <p className="text-sm text-gray-600">
            {necesidadesEspeciales.length} alumno(s) con necesidades especiales registradas
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          🔄 Actualizar
        </Button>
      </div>

      {necesidadesEspeciales.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay necesidades especiales registradas
          </h3>
          <p className="text-gray-600">
            Este grupo no tiene alumnos con necesidades especiales registradas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {necesidadesEspeciales.map((necesidad) => (
            <div
              key={necesidad.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleNecesidadClick(necesidad)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {necesidad.nombreAlumno}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {necesidad.numeroMatricula}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Rev. {necesidad.numeroRevision}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {necesidad.excepcionesConductuales && (
                      <Badge variant="destructive" className="text-xs">
                        Conductual
                      </Badge>
                    )}
                    {necesidad.excepcionesComunicacionales && (
                      <Badge variant="destructive" className="text-xs">
                        Comunicacional
                      </Badge>
                    )}
                    {necesidad.excepcionesIntelectuales && (
                      <Badge variant="destructive" className="text-xs">
                        Intelectual
                      </Badge>
                    )}
                    {necesidad.excepcionesFisicas && (
                      <Badge variant="destructive" className="text-xs">
                        Físico
                      </Badge>
                    )}
                    {necesidad.excepcionesSuperdotacion && (
                      <Badge variant="destructive" className="text-xs">
                        Superdotación
                      </Badge>
                    )}
                    {necesidad.otrasNecesidades && (
                      <Badge variant="secondary" className="text-xs">
                        Otros
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Programa:</span> {necesidad.programaEducativo}
                  </p>
                </div>
                
                <div className="text-right text-sm text-gray-500">
                  <p>Registrado: {formatDate(necesidad.fecha)}</p>
                  <p>Revisado: {formatDate(necesidad.fechaRevision)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para ver detalles */}
      {selectedNecesidad && (
        <NecesidadesEspecialesModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          necesidadesEspeciales={selectedNecesidad}
        />
      )}
    </div>
  );
};
