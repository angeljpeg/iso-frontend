import type { NivelRetraso } from "../../types/seguimiento";

interface IndicadorRetrasoProps {
  nivel: NivelRetraso;
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function IndicadorRetraso({
  nivel,
  className = "",
  showText = true,
  size = "md"
}: IndicadorRetrasoProps) {
  const getNivelConfig = (nivel: NivelRetraso) => {
    switch (nivel) {
      case "sin_retraso":
        return {
          label: "Sin retraso",
          className: "bg-gradient-to-r from-[#10b981] to-[#059669] shadow-green-200",
          icon: "🟢",
          pulseColor: "animate-pulse bg-green-400"
        };
      case "retraso_leve":
        return {
          label: "1 semana de retraso",
          className: "bg-gradient-to-r from-[#f59e0b] to-[#d97706] shadow-yellow-200",
          icon: "🟡",
          pulseColor: "animate-pulse bg-yellow-400"
        };
      case "retraso_critico":
        return {
          label: "≥2 semanas de retraso",
          className: "bg-gradient-to-r from-[#ef4444] to-[#dc2626] shadow-red-200",
          icon: "🔴",
          pulseColor: "animate-pulse bg-red-400"
        };
      default:
        return {
          label: "Desconocido",
          className: "bg-gradient-to-r from-[#6b7280] to-[#4b5563] shadow-gray-200",
          icon: "⚪",
          pulseColor: "animate-pulse bg-gray-400"
        };
    }
  };

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const config = getNivelConfig(nivel);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full ${config.className} shadow-md transition-smooth hover:scale-110`}
          title={config.label}
        />
        {nivel === "retraso_critico" && (
          <div className={`absolute inset-0 ${sizeClasses[size]} rounded-full ${config.pulseColor} opacity-75`} />
        )}
      </div>
      {showText && (
        <span className="text-body-sm text-gray-700 font-medium">{config.label}</span>
      )}
    </div>
  );
}
