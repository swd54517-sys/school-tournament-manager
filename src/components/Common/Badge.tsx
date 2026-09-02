import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-success-100 text-success-800',
  warning: 'bg-warning-100 text-warning-800',
  danger: 'bg-danger-100 text-danger-800',
  info: 'bg-primary-100 text-primary-800',
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variantClasses[variant]} ${className || ''}`}>
      {children}
    </span>
  );
};
