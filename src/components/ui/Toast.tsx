'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastData = {
  id: string;
  type: ToastType;
  titleKey?: string;
  messageKey?: string;
  title?: string;
  message?: string;
  duration?: number;
};

type ToastItemProps = {
  toast: ToastData;
  onClose: (id: string) => void;
};

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const t = useTranslations('notifications');

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        onClose(toast.id);
      }, toast.duration || 5000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [toast.id, toast.duration, onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const title = toast.titleKey ? t(toast.titleKey as any) : toast.title;
  const message = toast.messageKey ? t(toast.messageKey as any) : toast.message;

  return (
    <div className={`
      relative flex items-start p-4 mb-3 rounded-lg border shadow-lg
      transform transition-all duration-300 ease-in-out
      animate-in slide-in-from-right-full
      ${getToastStyles()}
    `}
    >
      <div className="flex-shrink-0 mr-3">
        <div className="flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold">
          {getIcon()}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <p className="text-sm font-medium">
            {title}
          </p>
        )}
        {message && (
          <p className={`text-sm ${title ? 'mt-1' : ''}`}>
            {message}
          </p>
        )}
      </div>

      <button
        onClick={() => onClose(toast.id)}
        className="flex-shrink-0 ml-4 text-lg leading-none hover:opacity-70 transition-opacity"
        aria-label={t('close')}
      >
        ×
      </button>
    </div>
  );
};

type ToastContainerProps = {
  toasts: ToastData[];
  onClose: (id: string) => void;
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[100] w-full max-w-sm space-y-2">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
