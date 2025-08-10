import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router";
import type { ReactNode } from "react";
import { useState } from "react";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import { DashboardSidebar } from "~/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "~/components/dashboard/DashboardHeader";
import { WelcomeSection } from "~/components/dashboard/WelcomeSection";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex">
        <DashboardSidebar
          nombre={usuario?.nombre || ""}
          apellido={usuario?.apellido || ""}
          email={usuario?.email || ""}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <DashboardSidebar
            nombre={usuario?.nombre || ""}
            apellido={usuario?.apellido || ""}
            email={usuario?.email || ""}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          title={title}
          date={date}
          time={time}
          onMobileMenuClick={() => setSidebarOpen(true)}
          usuario={{
            nombre: usuario?.nombre || "",
            apellido: usuario?.apellido || "",
            email: usuario?.email || "",
          }}
          onLogout={handleLogout}
        />

        {/* Welcome Section */}
        {needsSaludo && (
          <WelcomeSection nombre={usuario?.nombre || ""} title={title} />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
