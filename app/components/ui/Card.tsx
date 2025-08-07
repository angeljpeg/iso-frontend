import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isClickable?: boolean;
  variant?: "default" | "elevated" | "outlined";
}

export function Card({
  children,
  className = "",
  onClick,
  isClickable = false,
  variant = "default",
}: CardProps) {
  const baseClasses = "bg-white rounded-xl p-6 transition-smooth duration-300";

  const variantClasses = {
    default: "shadow-md border border-gray-100",
    elevated: "shadow-lg border-0",
    outlined: "border-2 border-gray-200 shadow-sm",
  };

  const clickableClasses = isClickable
    ? "cursor-pointer hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] hover:border-[#3e9530]/30"
    : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
