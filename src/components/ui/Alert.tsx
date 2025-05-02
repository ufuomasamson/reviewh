import React from 'react';
import { cn } from '../../lib/utils';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  className,
  icon,
  onClose,
}) => {
  const variantStyles = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  const titleColorStyles = {
    info: 'text-blue-800',
    success: 'text-green-800',
    warning: 'text-amber-800',
    error: 'text-red-800',
  };

  return (
    <div
      className={cn(
        'rounded-md border p-4',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex">
        {icon && <div className="flex-shrink-0 mr-3">{icon}</div>}
        <div className="flex-1">
          {title && (
            <h3 className={cn('text-sm font-medium mb-1', titleColorStyles[variant])}>
              {title}
            </h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            type="button"
            className={cn(
              'ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              {
                'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-500 focus:ring-offset-blue-50': variant === 'info',
                'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-500 focus:ring-offset-green-50': variant === 'success',
                'bg-amber-50 text-amber-500 hover:bg-amber-100 focus:ring-amber-500 focus:ring-offset-amber-50': variant === 'warning',
                'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-500 focus:ring-offset-red-50': variant === 'error',
              }
            )}
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};