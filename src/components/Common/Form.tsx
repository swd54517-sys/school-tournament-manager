import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          className={`
            w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-danger-500' : 'border-gray-300'}
            ${className || ''}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-danger-600 mt-1">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        className={`
          w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500
          ${error ? 'border-danger-500' : 'border-gray-300'}
          ${className || ''}
        `}
        {...props}
      >
        <option value="">-- 請選擇 --</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-danger-600 mt-1">{error}</p>}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <textarea
        className={`
          w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500
          ${error ? 'border-danger-500' : 'border-gray-300'}
          ${className || ''}
        `}
        {...props}
      />
      {error && <p className="text-sm text-danger-600 mt-1">{error}</p>}
    </div>
  );
};
