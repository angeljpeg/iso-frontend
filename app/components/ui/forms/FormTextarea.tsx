import { forwardRef } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface FormTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  label?: string;
  error?: FieldError | string;
  helperText?: string;
  registration?: UseFormRegisterReturn;
  required?: boolean;
  rows?: number;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      helperText,
      registration,
      required,
      rows = 4,
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
        <textarea
          ref={ref}
          rows={rows}
          className={`
            w-full text-black px-4 py-3 border-2 rounded-lg shadow-sm transition-smooth text-body-sm
            focus:outline-none focus:ring-2 focus:ring-[#3e9530]/20 focus:border-[#3e9530]
            hover:border-gray-400
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            resize-vertical
            ${
              errorMessage
                ? "border-[#ef4444] focus:ring-[#ef4444]/20 focus:border-[#ef4444]"
                : "border-gray-300"
            }
            ${className}
          `}
          {...registration}
          {...props}
        />
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

FormTextarea.displayName = "FormTextarea";
