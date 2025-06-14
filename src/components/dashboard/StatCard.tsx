import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}) => {
  // Check if this is a compact layout (for admin dashboard with 5 columns)
  const isCompact = className?.includes('text-center');

  if (isCompact) {
    return (
      <div className={cn(
        'bg-primary overflow-hidden rounded-lg border border-primary-600 shadow-lg',
        className
      )}>
        <div className="p-4">
          <div className="text-center">
            {icon && (
              <div className="flex justify-center mb-3">
                <div className="p-2 rounded-md bg-black bg-opacity-20 text-black">
                  {icon}
                </div>
              </div>
            )}
            <p className="text-xs font-medium text-black opacity-80 mb-1 leading-tight">
              {title}
            </p>
            <p className="text-xl font-bold text-black">
              {value}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-primary overflow-hidden rounded-lg border border-primary-600 shadow-lg',
      className
    )}>
      <div className="p-6">
        <div className="flex items-center">
          {icon && (
            <div className="flex-shrink-0 p-3 rounded-md bg-black bg-opacity-20 text-black">
              {icon}
            </div>
          )}
          <div className={cn("ml-0", icon && "ml-5")}>
            <p className="text-sm font-medium text-black opacity-80 truncate">
              {title}
            </p>
            <p className="mt-1 text-3xl font-bold text-black">
              {value}
            </p>
          </div>
        </div>
      </div>
      
      {(description || trend) && (
        <div className="bg-gray-50 px-5 py-3 border-t">
          <div className="flex items-center justify-between">
            {description && (
              <div className="text-sm text-gray-500 truncate">
                {description}
              </div>
            )}
            
            {trend && (
              <div
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded text-sm font-medium",
                  trend.isPositive ? "text-green-800 bg-green-100" : "text-red-800 bg-red-100"
                )}
              >
                <svg
                  className={cn(
                    "-ml-0.5 mr-1 h-3 w-3",
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  )}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d={
                      trend.isPositive
                        ? "M12 7a1 1 0 0 1 .707.293l5 5a1 1 0 0 1-1.414 1.414L12 9.414l-4.293 4.293a1 1 0 0 1-1.414-1.414l5-5A1 1 0 0 1 12 7z"
                        : "M12 17a1 1 0 0 1-.707-.293l-5-5a1 1 0 0 1 1.414-1.414L12 14.586l4.293-4.293a1 1 0 0 1 1.414 1.414l-5 5A1 1 0 0 1 12 17z"
                    }
                    clipRule="evenodd"
                  />
                </svg>
                {trend.value}%
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};