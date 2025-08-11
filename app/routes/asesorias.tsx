import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/auth";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";

export default function AsesoriasPage() {
  const navigate = useNavigate();
  const { usuario, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  // Determinar si el usuario puede acceder a asesorías
  const canAccessAsesorias =
    usuario?.rol === "profesor_tiempo_completo" ||
    usuario?.rol === "profesor_asignatura" ||
    usuario?.rol === "coordinador" ||
    usuario?.rol === "moderador";

  if (!canAccessAsesorias) {
    return (
      <DashboardLayout title="Acceso Denegado">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🚫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Acceso Denegado
              </h3>
              <p className="text-gray-600 mb-4">
                Tu rol actual ({usuario?.rol}) no tiene permisos para acceder al
                módulo de Asesorías.
              </p>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                ← Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Registro de Asesorías">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                👥 Registro de Asesorías
              </h3>
              <p className="text-gray-600">
                Documenta las asesorías académicas brindadas a estudiantes
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              ← Volver al Dashboard
            </Button>
          </div>
        </div>

        {/* Contenido principal de asesorías */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Módulo de Asesorías
            </h4>
            <p className="text-gray-600 mb-4">
              Bienvenido al módulo de gestión de asesorías académicas.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>
                <strong>Usuario:</strong> {usuario?.nombre} {usuario?.apellido}
              </p>
              <p>
                <strong>Rol:</strong> {usuario?.rol}
              </p>
              <p>
                <strong>Email:</strong> {usuario?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl mb-4">ℹ️</div>
            <h4 className="text-lg font-semibold text-blue-800 mb-2">
              Información del Módulo
            </h4>
            <p className="text-blue-700">
              Este módulo te permite gestionar y registrar las asesorías
              académicas que brindas a los estudiantes.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
