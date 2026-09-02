import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg font-semibold',
};

const variantClasses = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-400',
  secondary: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 disabled:border-gray-400 disabled:text-gray-400',
  success: 'bg-success-600 text-white hover:bg-success-700 disabled:bg-gray-400',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 disabled:bg-gray-400',
  ghost: 'text-primary-600 hover:bg-primary-50 disabled:text-gray-400',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded-md transition-colors duration-200
        flex items-center gap-2 justify-center
        disabled:cursor-not-allowed
        ${className || ''}
      `}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};
