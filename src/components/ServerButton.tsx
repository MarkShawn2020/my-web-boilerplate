import React from 'react';
import { cn } from '@/utils/Helpers';

type ServerButtonProps = {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
};

/**
 * 服务器端渲染的静态按钮组件
 * 用于不需要交互的场景，如静态链接按钮
 * 性能优化：完全在服务器渲染，减少客户端包大小
 */
export const ServerButton = ({
  className,
  variant = 'primary',
  size = 'md',
  href,
  disabled = false,
  children,
  ...props
}: ServerButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';

  const variants = {
    primary: 'text-white bg-primary hover:opacity-90 shadow-sm',
    secondary: 'text-text-main bg-transparent border border-border-default hover:bg-gray-50 shadow-sm',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-md gap-2',
    md: 'px-6 py-3 text-base rounded-md gap-2',
    lg: 'px-8 py-4 text-lg rounded-lg gap-3',
  };

  const disabledStyles = disabled
    ? 'opacity-50 pointer-events-none cursor-not-allowed'
    : '';

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    disabledStyles,
    className,
  );

  // 服务器端渲染的链接
  if (href && !disabled) {
    return (
      <a
        href={href}
        className={combinedClassName}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </a>
    );
  }

  // 禁用状态的链接渲染为span
  if (href && disabled) {
    return (
      <span
        className={combinedClassName}
        aria-disabled="true"
        role="button"
        tabIndex={-1}
        {...props}
      >
        {children}
      </span>
    );
  }

  // 静态按钮（无交互）
  return (
    <span
      className={combinedClassName}
      role="button"
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      {...props}
    >
      {children}
    </span>
  );
};

ServerButton.displayName = 'ServerButton';
