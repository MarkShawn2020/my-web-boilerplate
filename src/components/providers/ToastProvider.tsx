'use client';

import { ToastContainer } from '@/components/Toast';
import { useToast } from '@/hooks/useToast';

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
};
