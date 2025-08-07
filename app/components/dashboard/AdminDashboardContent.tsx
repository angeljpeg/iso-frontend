export function AdminDashboardContent() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Panel de Administración
        </h3>
        <p className="text-gray-600">
          Gestiona usuarios, configuraciones y reportes del sistema
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Gestión de Usuarios</h4>
          <p className="text-sm text-gray-600 mb-4">
            Administra profesores, directores y coordinadores
          </p>
          <button className="text-utn-primary hover:text-utn-primary-dark font-medium text-sm">
            Ver usuarios →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Configuración</h4>
          <p className="text-sm text-gray-600 mb-4">
            Ajustes del sistema y parámetros generales
          </p>
          <button className="text-utn-primary hover:text-utn-primary-dark font-medium text-sm">
            Configurar →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Reportes Globales</h4>
          <p className="text-sm text-gray-600 mb-4">
            Estadísticas y reportes de toda la institución
          </p>
          <button className="text-utn-primary hover:text-utn-primary-dark font-medium text-sm">
            Ver reportes →
          </button>
        </div>
      </div>
    </div>
  );
}