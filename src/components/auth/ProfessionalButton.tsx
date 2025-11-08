'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ProfessionalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const ProfessionalButton = ({ ref, className, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, children, disabled, ...props }: ProfessionalButtonProps & { ref?: React.RefObject<HTMLButtonElement | null> }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";
    
    const variants = {
      primary: "text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
      secondary: "text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2",
      outline: "border-2 text-white hover:text-white shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2",
      ghost: "hover:shadow-md focus:ring-2 focus:ring-offset-2"
    };

    const sizes = {
      sm: "h-10 px-4 text-sm",
      md: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-lg"
    };

    const isDisabled = disabled || isLoading;

    // Lovpen 设计系统样式
    const getLovpenStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: '#D97757',
            borderColor: '#D97757',
            fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
          };
        case 'secondary':
          return {
            backgroundColor: '#CC785C',
            borderColor: '#CC785C',
            fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            borderColor: '#D97757',
            color: '#D97757',
            fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: '#87867F',
            fontFamily: 'Fira Code, ui-sans-serif, system-ui, sans-serif'
          };
        default:
          return {};
      }
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isDisabled && "transform-none hover:scale-100",
          className
        )}
        style={getLovpenStyles()}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* 加载状态的光效 */}
        {isLoading && variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        )}

        {/* 左侧图标 */}
        {leftIcon && !isLoading && (
          <span className="mr-2 flex-shrink-0">
            {leftIcon}
          </span>
        )}

        {/* 加载指示器 */}
        {isLoading && (
          <div className="mr-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        )}

        {/* 按钮文本 */}
        <span className={cn("flex-1", isLoading && "opacity-80")}>
          {children}
        </span>

        {/* 右侧图标 */}
        {rightIcon && !isLoading && (
          <span className="ml-2 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  };

ProfessionalButton.displayName = "ProfessionalButton";