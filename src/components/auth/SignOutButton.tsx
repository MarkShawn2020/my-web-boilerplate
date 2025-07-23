'use client';

import React from 'react';
import { useAuthActions } from '@/hooks/useAuthUser';
import { useRouter } from '@/libs/I18nNavigation';

type SignOutButtonProps = {
  children: React.ReactNode;
  redirectTo?: string;
  className?: string;
};

export function SignOutButton({ children, redirectTo = '/', className }: SignOutButtonProps) {
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push(redirectTo);
  };

  return (
    <button
      onClick={handleSignOut}
      className={className}
      type="button"
    >
      {children}
    </button>
  );
}
