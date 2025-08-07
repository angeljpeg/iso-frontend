import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router";
import type { ReactNode } from "react";
import { TopBarDashboard } from "~/components/dashboard/TopBarDashboard";
import { SaludoCentral } from "~/components/dashboard/SaludoCentral";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  needsSaludo?: boolean;
}

export function DashboardLayout({
  children,
  title,
  needsSaludo = true,
}: DashboardLayoutProps) {
  const { usuario, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!usuario) {
    navigate("/login");
    return null;
  }

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
      <TopBarDashboard date={date} time={time} handleLogout={handleLogout} />

      {/* Saludo Central */}
      {needsSaludo && (
        <SaludoCentral
          apellido={usuario?.apellido}
          nombre={usuario?.nombre}
          title={title}
        />
      )}

      {/* Contenido Dinámico */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">{children}</div>
      </main>
    </div>
  );
}
