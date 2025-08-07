import { Menu } from "lucide-react";
import { Button } from "~/components/ui/Button";
import { Sheet, SheetTrigger } from "~/components/ui/sheet";
import { DateTimeDisplay } from "./DateTimeDisplay";
import { NotificationButton } from "./NotificationButton";
import { UserMenu } from "./UserMenu";

interface DashboardHeaderProps {
  title?: string;
  date: string;
  time: string;
  onMobileMenuClick: () => void;
  usuario: {
    nombre: string;
    apellido: string;
    email: string;
  };
  onLogout: () => void;
}

export function DashboardHeader({
  title,
  date,
  time,
  onMobileMenuClick,
  usuario,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={onMobileMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Page Title */}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {title || "Dashboard"}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Date and Time */}
          <DateTimeDisplay date={date} time={time} />

          {/* Notifications */}
          <NotificationButton count={3} />

          {/* User Menu */}
          <UserMenu
            nombre={usuario.nombre}
            apellido={usuario.apellido}
            email={usuario.email}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
}