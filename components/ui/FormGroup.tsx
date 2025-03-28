import React from "react";

interface FormGroupProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ 
  label, 
  htmlFor, 
  children, 
  required = false,
  className = ""
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label 
        htmlFor={htmlFor} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
};

export default FormGroup;