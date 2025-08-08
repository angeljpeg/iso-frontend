import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/auth";
import { DashboardLayout } from "../layouts/DashboardLayout";

// Importar componentes específicos por rol
import { ProfesorDashboardContent } from "~/components/dashboard/profesor-dashboard-content";
import { CoordinadorDashboardContent } from "~/components/dashboard/coordinador-dashboard-content";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Simular carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  // Función para obtener el título según el rol
  const getDashboardTitle = () => {
    switch (usuario?.rol) {
      case "profesor_tiempo_completo":
      case "profesor_asignatura":
        return "Dashboard de Profesor";
      case "coordinador":
        return "Dashboard de Coordinador";
      default:
        return "Dashboard";
    }
  };

  // Función para renderizar el contenido según el rol
  const renderDashboardContent = () => {
    if (isLoading) {
      return (
        <div className="py-12 text-center">
          <div className="animate-pulse">
            <div className="flex justify-center items-center mx-auto mb-4 w-16 h-16 rounded-full bg-utn-primary">
              <svg
                className="w-8 h-8 text-white animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Cargando tu dashboard...
            </h3>
            <p className="text-gray-600">
              Preparando tu espacio de trabajo personalizado
            </p>
          </div>
        </div>
      );
    }

    switch (usuario?.rol) {
      case "profesor_tiempo_completo":
      case "profesor_asignatura":
        return <ProfesorDashboardContent />;

      case "coordinador":
        return <CoordinadorDashboardContent />;

      default:
        return (
          <div className="py-12 text-center">
            <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="mb-2 text-lg font-semibold text-yellow-800">
                Rol no reconocido
              </h3>
              <p className="text-yellow-700">
                Tu rol ({usuario?.rol}) no tiene un dashboard asignado. Contacta
                al administrador del sistema.
              </p>
            </div>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout title={getDashboardTitle()}>
      {renderDashboardContent()}
    </DashboardLayout>
  );
}
