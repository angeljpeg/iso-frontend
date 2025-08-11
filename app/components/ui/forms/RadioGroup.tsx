import { forwardRef } from "react";

interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: RadioOption[];
  name: string;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    {
      label,
      value,
      onChange,
      error,
      helperText,
      required,
      options,
      name,
      className = "",
      ...props
    },
    ref
  ) => {
    const handleChange = (optionValue: string | number) => {
      if (onChange) {
        onChange(optionValue);
      }
    };

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                ref={ref}
                type="radio"
                id={`${name}-${option.value}`}
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => handleChange(option.value)}
                disabled={option.disabled}
                className={`
                  w-4 h-4 text-blue-600 border-2 border-gray-300 transition-colors
                  focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                  disabled:bg-gray-50 disabled:border-gray-200 disabled:cursor-not-allowed
                  ${
                    error
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-gray-300"
                  }
                `}
                {...props}
              />
              <label 
                htmlFor={`${name}-${option.value}`}
                className="ml-3 text-sm text-gray-700 cursor-pointer"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
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
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = "RadioGroup";
