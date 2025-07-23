'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/Helpers';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'end';
  className?: string;
}

interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

interface DropdownMenuSeparatorProps {
  className?: string;
}

interface DropdownMenuLabelProps {
  children: React.ReactNode;
  className?: string;
}

const DropdownMenu = ({ trigger, children, align = 'end', className }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const alignmentClasses = {
    start: 'left-0',
    end: 'right-0',
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-56 rounded-md border border-gray-200 bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-700 dark:bg-gray-800',
            alignmentClasses[align],
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick, className, disabled = false }: DropdownMenuItemProps) => {
  return (
    <div
      className={cn(
        'relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors cursor-pointer',
        disabled
          ? 'pointer-events-none opacity-50'
          : 'hover:bg-gray-100 dark:hover:bg-gray-700',
        className,
      )}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  );
};

const DropdownMenuSeparator = ({ className }: DropdownMenuSeparatorProps) => {
  return (
    <div
      className={cn('my-1 h-px bg-gray-200 dark:bg-gray-700', className)}
    />
  );
};

const DropdownMenuLabel = ({ children, className }: DropdownMenuLabelProps) => {
  return (
    <div
      className={cn(
        'px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100',
        className,
      )}
    >
      {children}
    </div>
  );
};

export {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  type DropdownMenuProps,
  type DropdownMenuItemProps,
  type DropdownMenuSeparatorProps,
  type DropdownMenuLabelProps,
};