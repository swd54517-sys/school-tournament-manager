import React from 'react';
import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle } from 'lucide-react';
import { ToastMessage } from '../../hooks/useToast';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const typeConfig = {
  success: {
    bg: 'bg-success-50',
    border: 'border-success-200',
    text: 'text-success-800',
    icon: <CheckCircle className="text-success-600" size={20} />,
  },
  error: {
    bg: 'bg-danger-50',
    border: 'border-danger-200',
    text: 'text-danger-800',
    icon: <AlertCircle className="text-danger-600" size={20} />,
  },
  warning: {
    bg: 'bg-warning-50',
    border: 'border-warning-200',
    text: 'text-warning-800',
    icon: <AlertTriangle className="text-warning-600" size={20} />,
  },
  info: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-800',
    icon: <InfoIcon className="text-primary-600" size={20} />,
  },
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => {
        const config = typeConfig[toast.type];
        return (
          <div
            key={toast.id}
            className={`${config.bg} ${config.border} ${config.text} border rounded-lg p-4 flex items-center gap-3 animate-slide-in`}
          >
            {config.icon}
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};
