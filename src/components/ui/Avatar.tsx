'use client';

import React from 'react';
import { cn } from '@/utils/Helpers';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

const Avatar = ({ src, alt, fallback, size = 'md', className, onClick }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 select-none overflow-hidden border border-gray-200',
        sizeClasses[size],
        onClick && 'cursor-pointer hover:bg-gray-200 transition-colors',
        className,
      )}
      onClick={onClick}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className="w-full h-full object-cover rounded-full"
          onError={handleImageError}
        />
      ) : (
        <span className="font-semibold">
          {getInitials(fallback || alt)}
        </span>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export { Avatar, type AvatarProps };