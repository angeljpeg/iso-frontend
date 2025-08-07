import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/Button";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const { date, time } = getCurrentDateTime();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Topbar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Título */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-utn-primary">
                  Formatos ISO de UTN
                </h1>
              </div>
            </div>

            {/* Fecha, Hora y Logout */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {date}
                </p>
                <p className="text-xs text-gray-600">{time}</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Saludo Central */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Hola, {usuario?.nombre} {usuario?.apellido}!
            </h2>
            <p className="text-lg text-gray-600">
              Bienvenido a tu sistema de gestión académica
            </p>
            {title && (
              <p className="text-sm text-utn-primary font-medium mt-2">
                {title}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Contenido Dinámico */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{children}</div>
      </main>
    </div>
  );
}
