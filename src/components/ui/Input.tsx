import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, iconPosition = 'left', helpText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-on-dark mb-1">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={cn(
              "block w-full rounded-md border border-accent-300 bg-card text-on-light focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 shadow-sm",
              "placeholder-muted sm:text-sm",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
              icon && iconPosition === 'left' ? "pl-10" : "",
              icon && iconPosition === 'right' ? "pr-10" : "",
              className
            )}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {helpText && !error && (
          <p className="mt-1 text-sm text-muted">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';