import type { ReactNode } from "react";
import { Button } from "../ui";
import { BarChart3, Calendar, FileText, Settings } from "lucide-react";

export interface NavigationProps {
  sidebarItems?: {
    title: string;
    icon: ReactNode;
    href: string;
  }[];
}

export const Navigation = ({}: NavigationProps) => {
  const sidebarItems = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
    },
    {
      title: "Formatos ISO",
      icon: FileText,
      href: "/formatos",
    },
    {
      title: "Calendario",
      icon: Calendar,
      href: "/calendario",
    },
    {
      title: "Configuración",
      icon: Settings,
      href: "/configuracion",
    },
  ];

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {sidebarItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.href}
            variant="ghost"
            className="w-full justify-start h-10 px-3 text-gray-700 hover:bg-gray-100 hover:text-utn-primary"
            onClick={() => {
              window.location.href = item.href;
            }}
          >
            <Icon className="mr-3 h-4 w-4" />
            {item.title}
          </Button>
        );
      })}
    </nav>
  );
};
