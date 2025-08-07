import { forwardRef } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {
  label?: string;
  error?: FieldError | string;
  helperText?: string;
  registration?: UseFormRegisterReturn;
  required?: boolean;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      registration,
      required,
      className = "",
      ...props
    },
    ref
  ) => {
    const errorMessage = typeof error === "string" ? error : error?.message;

    return (
      <div className="w-full">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              ref={ref}
              type="checkbox"
              className={`
                w-4 h-4 text-[#3e9530] border-2 border-gray-300 rounded transition-smooth
                focus:ring-2 focus:ring-[#3e9530]/20 focus:border-[#3e9530]
                disabled:bg-gray-50 disabled:border-gray-200 disabled:cursor-not-allowed
                ${
                  errorMessage
                    ? "border-[#ef4444] focus:ring-[#ef4444]/20"
                    : "border-gray-300"
                }
                ${className}
              `}
              {...registration}
              {...props}
            />
          </div>
          {label && (
            <div className="ml-3">
              <label className="text-body-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-[#ef4444] ml-1">*</span>}
              </label>
            </div>
          )}
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

FormCheckbox.displayName = "FormCheckbox";
