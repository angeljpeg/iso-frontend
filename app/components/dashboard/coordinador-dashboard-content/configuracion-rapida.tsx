import { Settings } from "lucide-react";
import { Button } from "~/components/ui";

export const ConfiguracionRapida = () => {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
        <Settings className="mr-2 w-5 h-5 text-gray-600" />
        Configuración Rápida
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="p-4 rounded-lg border border-gray-200">
          <h4 className="mb-2 font-medium text-gray-900">
            Gestión de Usuarios
          </h4>
          <p className="mb-3 text-sm text-gray-600">
            Administra profesores, directores y coordinadores
          </p>
          <Button size="sm" variant="outline">
            Gestionar usuarios →
          </Button>
        </div>

        <div className="p-4 rounded-lg border border-gray-200">
          <h4 className="mb-2 font-medium text-gray-900">
            Asignación de Cargas
          </h4>
          <p className="mb-3 text-sm text-gray-600">
            Asigna profesores a grupos y asignaturas
          </p>
          <Button size="sm" variant="outline">
            Asignar cargas →
          </Button>
        </div>

        <div className="p-4 rounded-lg border border-gray-200">
          <h4 className="mb-2 font-medium text-gray-900">
            Asignación de Estadias
          </h4>
          <p className="mb-3 text-sm text-gray-600">
            Asigna alumnos a profesores y estadias
          </p>
          <Button size="sm" variant="outline">
            Asignar estadias →
          </Button>
        </div>

        <div className="p-4 rounded-lg border border-gray-200">
          <h4 className="mb-2 font-medium text-gray-900">
            Asignación de Tutorias
          </h4>
          <p className="mb-3 text-sm text-gray-600">
            Asigna alumnos a profesores y tutorias
          </p>
          <Button size="sm" variant="outline">
            Asignar tutorias →
          </Button>
        </div>
      </div>
    </div>
  );
};
