import React from 'react';
import { cn } from '../../lib/utils';
import { getInitials } from '../../lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  countryCode?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className,
  countryCode,
}) => {
  const sizeStyles = {
    'xs': 'h-6 w-6 text-xs',
    'sm': 'h-8 w-8 text-xs',
    'md': 'h-10 w-10 text-sm',
    'lg': 'h-12 w-12 text-base',
    'xl': 'h-16 w-16 text-lg',
  };

  const initials = name ? getInitials(name) : '';

  // Helper to get emoji flag from country code
  function getFlagEmoji(countryCode?: string) {
    if (!countryCode) return '';
    // Convert country code to regional indicator symbols
    return countryCode
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  }

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center flex-shrink-0 rounded-full bg-gray-200 text-gray-600 font-medium',
        sizeStyles[size],
        className
      )}
    >
      {countryCode ? (
        <span style={{ fontSize: '1.5em' }}>{getFlagEmoji(countryCode)}</span>
      ) : src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
};