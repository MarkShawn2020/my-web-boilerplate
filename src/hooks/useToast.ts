'use client';

import type { ToastData } from '@/components/Toast';
import { create } from 'zustand';

type ToastStore = {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
};

const useToastStore = create<ToastStore>(set => ({
  toasts: [],
  addToast: toast =>
    set(state => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    })),
  removeToast: id =>
    set(state => ({
      toasts: state.toasts.filter(toast => toast.id !== id),
    })),
  clearAllToasts: () => set({ toasts: [] }),
}));

export const useToast = () => {
  const { toasts, addToast, removeToast, clearAllToasts } = useToastStore();

  const toast = {
    success: (titleKey?: string, messageKey?: string, title?: string, message?: string) => {
      addToast({
        type: 'success',
        titleKey,
        messageKey,
        title,
        message,
        duration: 4000,
      });
    },
    error: (titleKey?: string, messageKey?: string, title?: string, message?: string) => {
      addToast({
        type: 'error',
        titleKey,
        messageKey,
        title,
        message,
        duration: 6000,
      });
    },
    warning: (titleKey?: string, messageKey?: string, title?: string, message?: string) => {
      addToast({
        type: 'warning',
        titleKey,
        messageKey,
        title,
        message,
        duration: 5000,
      });
    },
    info: (titleKey?: string, messageKey?: string, title?: string, message?: string) => {
      addToast({
        type: 'info',
        titleKey,
        messageKey,
        title,
        message,
        duration: 4000,
      });
    },
    custom: (toast: Omit<ToastData, 'id'>) => {
      addToast(toast);
    },
  };

  return {
    toasts,
    toast,
    removeToast,
    clearAllToasts,
  };
};
