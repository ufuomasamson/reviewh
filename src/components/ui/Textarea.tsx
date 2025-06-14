import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helpText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-on-dark mb-1">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={cn(
            "block w-full rounded-md border border-accent-300 bg-card text-on-light focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 shadow-sm",
            "placeholder-muted sm:text-sm min-h-[80px]",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
            className
          )}
          {...props}
        />

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

Textarea.displayName = 'Textarea';