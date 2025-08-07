import type { EstadoSeguimiento } from "../../types/seguimiento";

interface EstadoBadgeProps {
  estado: EstadoSeguimiento;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function EstadoBadge({ estado, className = "", size = "md" }: EstadoBadgeProps) {
  const getEstadoConfig = (estado: EstadoSeguimiento) => {
    switch (estado) {
      case "borrador":
        return {
          label: "Borrador",
          className: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 shadow-sm",
          icon: "📝",
        };
      case "enviado":
        return {
          label: "Enviado",
          className: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300 shadow-sm",
          icon: "📤",
        };
      case "revisado":
        return {
          label: "Revisado",
          className: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300 shadow-sm",
          icon: "👀",
        };
      case "aprobado":
        return {
          label: "Aprobado",
          className: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300 shadow-sm",
          icon: "✅",
        };
      case "rechazado":
        return {
          label: "Rechazado",
          className: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300 shadow-sm",
          icon: "❌",
        };
      default:
        return {
          label: "Desconocido",
          className: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 shadow-sm",
          icon: "❓",
        };
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const config = getEstadoConfig(estado);

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border transition-smooth hover:scale-105 ${config.className} ${sizeClasses[size]} ${className}`}
    >
      <span className="mr-1.5">{config.icon}</span>
      {config.label}
    </span>
  );
}
