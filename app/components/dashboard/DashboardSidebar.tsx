import { Logo } from "~/components/dashboard/Logo";
import { Navigation } from "~/components/dashboard/Navigation";
import { UserInfo } from "~/components/dashboard/UserInfo";

interface DashboardSidebarProps {
  className?: string;
  nombre: string;
  apellido: string;
  email: string;
}

export function DashboardSidebar({
  className = "",
  nombre,
  apellido,
  email,
}: DashboardSidebarProps) {
  return (
    <div className={`flex h-full w-64 flex-col bg-white border-r ${className}`}>
      {/* Logo */}
      <Logo />

      {/* Navigation */}
      <Navigation />

      {/* User Info */}
      <UserInfo nombre={nombre} apellido={apellido} email={email} />
    </div>
  );
}