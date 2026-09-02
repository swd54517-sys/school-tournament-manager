import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow border border-gray-200
        transition-shadow duration-300 hover:shadow-md
        ${onClick ? 'cursor-pointer' : ''}
        ${className || ''}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className || ''}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return <div className={`px-6 py-4 ${className || ''}`}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 flex gap-3 justify-end ${className || ''}`}>
      {children}
    </div>
  );
};
