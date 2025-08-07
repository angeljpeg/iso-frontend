import { forwardRef, useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = "", ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="block text-body-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`
              w-full text-black px-4 py-3 border-2 rounded-lg shadow-sm transition-smooth text-body-sm
              focus:outline-none focus:ring-2 focus:ring-[#3e9530]/20 focus:border-[#3e9530]
              hover:border-gray-400
              ${icon ? "pl-10" : ""}
              ${
                error
                  ? "border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]"
                  : isFocused
                  ? "border-[#3e9530] ring-2 ring-[#3e9530]/20"
                  : "border-gray-300"
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-body-sm text-[#ef4444] flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-body-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
