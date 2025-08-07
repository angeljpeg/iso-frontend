import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-smooth text-button relative overflow-hidden duration-300";

    const variantClasses = {
      primary:
        "bg-[#3e9530] text-white hover:bg-[#45a436] focus:ring-[#3e9530] shadow-md hover:shadow-lg active:bg-[#2d6e23] active:scale-95",
      secondary:
        "bg-[#6b7280] text-white hover:bg-[#4b5563] focus:ring-[#6b7280] shadow-md hover:shadow-lg active:bg-gray-700 active:scale-95",
      outline:
        "border-2 border-[#3e9530] text-[#3e9530] hover:bg-[#3e9530] hover:text-white focus:ring-[#3e9530] hover:shadow-md active:scale-95",
      ghost:
        "text-[#3e9530] hover:bg-green-50 focus:ring-[#3e9530] hover:shadow-sm active:scale-95",
      danger:
        "bg-[#ef4444] text-white hover:bg-[#dc2626] focus:ring-[#ef4444] shadow-md hover:shadow-lg active:bg-red-700 active:scale-95",
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 min-h-[32px]",
      md: "px-4 py-2 min-h-[40px]",
      lg: "px-6 py-3 min-h-[48px]",
    };

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${
            isDisabled
              ? "opacity-50 cursor-not-allowed hover:transform-none"
              : ""
          }
          ${className}
        `}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        <span className={loading ? "opacity-0" : ""}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
