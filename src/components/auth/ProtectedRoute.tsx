'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { useAuthUser } from '@/hooks/useAuthUser';
import { useRouter } from '@/libs/I18nNavigation';

type ProtectedRouteProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireOnboarding?: boolean;
};

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/sign-in',
  requireOnboarding = false,
}: ProtectedRouteProps) {
  const { loading, isAuthenticated, profile } = useAuthUser();
  const router = useRouter();
  const t = useTranslations('Auth');

  // Show loading state
  if (loading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push(redirectTo);
    return null;
  }

  // Check onboarding requirement
  if (requireOnboarding && profile && !profile.onboardingCompleted) {
    router.push('/onboarding');
    return null;
  }

  return <>{children}</>;
}

// Higher-order component version
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>,
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
