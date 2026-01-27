import React from "react";

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

/**
 * Input component with label and error states
 * Follows Udemy's clean form design
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        { label, error, helperText, className = "", id, ...props },
        ref
    ) => {
        const generatedId = React.useId();
        const inputId = id || generatedId;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-2 border rounded-lg
            text-gray-900 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-colors
            ${error ? "border-error focus:ring-error" : "border-gray-300"}
            ${className}
          `}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-error">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
