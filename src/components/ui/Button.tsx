'use client';

import React from 'react';
import { cn } from '@/utils/Helpers';

// Loading Spinner Component
const Spinner = ({ size }: { size: 'sm' | 'md' | 'lg' }) => {
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <svg
      className={cn('animate-spin', spinnerSizes[size])}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  state?: ButtonState;
  loading?: boolean;
  asChild?: boolean;
  href?: string;
  loadingText?: string;
  disabledReason?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
  disabled?: boolean;
};

const Button = ({ ref, className, variant = 'primary', size = 'md', state = 'idle', loading = false, asChild = false, href, loadingText, disabledReason, disabled = false, children, onClick, ...props }: ButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
  // Determine if button should be disabled
  const isDisabled = disabled || loading || state === 'loading';
  const isLoading = loading || state === 'loading';

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative overflow-hidden';

  const variants = {
    primary: 'text-white bg-primary hover:opacity-90 shadow-sm',
    secondary: 'text-text-main bg-transparent border border-border-default hover:bg-gray-50 shadow-sm',
    outline: 'text-gray-700 bg-transparent border border-gray-300 hover:bg-gray-50 shadow-sm dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md gap-2',
    md: 'px-6 py-3 text-base rounded-md gap-2',
    lg: 'px-8 py-4 text-lg rounded-lg gap-3',
  };

  // State-based styles
  const stateStyles = {
    idle: '',
    loading: 'cursor-wait',
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
  };

  // Disabled styles
  const disabledStyles = isDisabled
    ? 'opacity-50 pointer-events-none cursor-not-allowed'
    : 'hover:scale-[0.98] active:scale-95';

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    stateStyles[state],
    disabledStyles,
    className,
  );

  // Handle click with loading state management
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  // Render content with loading state
  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <Spinner size={size} />
          {loadingText || children}
        </>
      );
    }
    return children;
  };

  // Handle href mode with disabled state
  if (href && !asChild && !isDisabled) {
    return (
      <a
        href={href}
        className={combinedClassName}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        aria-disabled={isDisabled}
        title={disabledReason}
      >
        {renderContent()}
      </a>
    );
  }

  // Render disabled link as span to prevent navigation
  if (href && !asChild && isDisabled) {
    return (
      <span
        className={combinedClassName}
        aria-disabled="true"
        role="button"
        title={disabledReason}
        tabIndex={-1}
      >
        {renderContent()}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={combinedClassName}
      ref={ref}
      disabled={isDisabled}
      onClick={handleClick}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      aria-describedby={disabledReason ? 'button-disabled-reason' : undefined}
      title={disabledReason}
      {...props}
    >
      {renderContent()}
      {disabledReason && (
        <span id="button-disabled-reason" className="sr-only">
          {disabledReason}
        </span>
      )}
    </button>
  );
};

Button.displayName = 'Button';

export { Button, type ButtonProps };
