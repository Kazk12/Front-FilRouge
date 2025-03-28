import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          className={`w-full px-4 py-2 border ${
            error 
              ? "border-red-500 focus:ring-red-500" 
              : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
          } rounded-md focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${className}`}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;