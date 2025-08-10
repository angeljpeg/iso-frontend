import React from "react";
import { useEstadias } from "../hooks/useEstadias";
import { Card, Button } from "../components/ui";
import { Badge } from "../components/ui/badge";

export default function EstadiasPage() {
  const { estadias, loading, error } = useEstadias();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando estadías...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Control de Estadías
        </h1>
        <Button variant="default">Nueva Estadía</Button>
      </div>

      {estadias.length === 0 ? (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay estadías registradas
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza creando una nueva estadía para llevar el control de tus
            alumnos.
          </p>
          <Button variant="default">Crear Primera Estadía</Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {estadias.map((estadia) => (
            <Card key={estadia.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {estadia.profesor.nombre}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Período: {estadia.periodo}
                  </p>
                </div>
                <Badge variant={estadia.activo ? "default" : "secondary"}>
                  {estadia.activo ? "Activa" : "Inactiva"}
                </Badge>
              </div>

              {estadia.observacionesGenerales && (
                <p className="text-sm text-gray-600 mb-4">
                  {estadia.observacionesGenerales}
                </p>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {estadia.alumnos?.length || 0} alumnos
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
