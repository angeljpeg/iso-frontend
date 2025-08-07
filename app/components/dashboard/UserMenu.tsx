import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface UserMenuProps {
  nombre: string;
  apellido: string;
  email: string;
  onLogout: () => void;
}

export function UserMenu({ nombre, apellido, email, onLogout }: UserMenuProps) {
  const userInitials = `${nombre?.charAt(0) || ""}${apellido?.charAt(0) || ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 h-8">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-sm text-black bg-green-500/60">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:block">{nombre}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">
              {nombre} {apellido}
            </p>
            <p className="text-xs text-gray-500">
              {email || "usuario@utn.edu.ar"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 w-4 h-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 w-4 h-4" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} className="text-red-600">
          <LogOut className="mr-2 w-4 h-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
