'use client';

import { useState } from 'react';
import { useAuthActions } from '@/hooks/useAuthUser';

export function useGoogleAuth(redirectTo?: string) {
  const { signInWithGoogle } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocalizedPath = (path: string): string => {
    const currentPath = window.location.pathname;
    const localeMatch = currentPath.match(/^\/([^/]+)\//);
    let locale = null;
    if (localeMatch && localeMatch[1] && ['zh', 'en'].includes(localeMatch[1])) {
      locale = localeMatch[1];
    }
    if (!locale) {
      locale = document.documentElement.lang || 'en';
    }
    if (locale && locale !== 'en' && !path.startsWith(`/${locale}`)) {
      return `/${locale}${path}`;
    }
    return path;
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const redirectUrl = redirectTo ? getLocalizedPath(redirectTo) : getLocalizedPath('/dashboard');
      const fullRedirectUrl = `${window.location.origin}${redirectUrl}`;
      const result = await signInWithGoogle(fullRedirectUrl);
      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }
      return {};
    } catch (err) {
      const errorMsg = 'Google 登录失败，请重试';
      setError(errorMsg);
      return { error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleGoogleAuth,
    isLoading,
    error,
  };
}
