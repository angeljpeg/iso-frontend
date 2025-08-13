import { forwardRef } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  label?: string;
  error?: FieldError | string;
  helperText?: string;
  registration?: UseFormRegisterReturn;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      helperText,
      registration,
      required,
      options,
      placeholder,
      onChange,
      className = "",
      ...props
    },
    ref
  ) => {
    const errorMessage = typeof error === "string" ? error : error?.message;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-body-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-[#ef4444] ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`
              w-full text-black px-4 py-3 border-2 rounded-lg shadow-sm transition-smooth text-body-sm
              focus:outline-none focus:ring-2 focus:ring-[#3e9530]/20 focus:border-[#3e9530]
              hover:border-gray-400
              disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
              appearance-none bg-white
              ${
                errorMessage
                  ? "border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]"
                  : "border-gray-300"
              }
              ${className}
            `}
            onChange={onChange}
            {...registration}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* Icono de flecha personalizado */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {errorMessage && (
          <p className="mt-2 text-body-sm text-[#ef4444] flex items-center">
            <svg
              className="w-4 h-4 mr-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {errorMessage}
          </p>
        )}
        {helperText && !errorMessage && (
          <p className="mt-2 text-body-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";
