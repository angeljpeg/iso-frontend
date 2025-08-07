import { Button } from "../ui";

export interface TopBarDashboardProps {
  date: string;
  time: string;
  handleLogout: () => void;
}

export const TopBarDashboard = ({
  date,
  time,
  handleLogout,
}: TopBarDashboardProps) => {
  return (
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
  );
};
