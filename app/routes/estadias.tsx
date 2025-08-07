import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/auth";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";

export default function EstadiasPage() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (
      usuario?.rol !== "profesor_tiempo_completo" &&
      usuario?.rol !== "profesor_asignatura"
    ) {
      navigate("/dashboard");
      return;
    }
  }, [isAuthenticated, usuario?.rol, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout title="Reporte Mensual de Avances de Estadías">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                📊 Reporte Mensual de Avances de Estadías
              </h3>
              <p className="text-gray-600">
                Seguimiento mensual del progreso de estudiantes en estadías
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/dashboard")}
            >
              ← Volver al Dashboard
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h4 className="text-lg font-semibold text-yellow-800 mb-2">
            Módulo en Desarrollo
          </h4>
          <p className="text-yellow-700">
            El módulo de Reporte Mensual de Avances de Estadías estará disponible próximamente.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}