
import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  isTextarea?: boolean;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  required = false, 
  placeholder = '', 
  type = 'text',
  isTextarea = false,
  rows = 3
}) => {
  const baseClasses = "w-full bg-black/40 border border-white/10 rounded-lg p-3 placeholder:text-gray-500 focus:ring-1 focus:ring-white/30 focus:outline-none";
  
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
      {isTextarea ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
};

export default FormField;
