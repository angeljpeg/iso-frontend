import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

export interface UserInfoProps {
  nombre: string;
  apellido: string;
  email: string;
}

export const UserInfo = (usuario: UserInfoProps) => {
  const userInitials = `${usuario?.nombre?.charAt(0) || ""}${
    usuario?.apellido?.charAt(0) || ""
  }`;
  return (
    <div className="border-t p-4">
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-green-500/30 text-black text-sm px-1 py-1 rounded">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {usuario?.nombre} {usuario?.apellido}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {usuario?.email || "usuario@utn.edu.ar"}
          </p>
        </div>
      </div>
    </div>
  );
};
