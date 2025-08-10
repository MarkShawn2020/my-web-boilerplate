'use client';

import { useAuth } from '@/providers/AuthProvider';

/**
 * Hook to get the current authenticated user
 */
export function useAuthUser() {
  const { user, loading } = useAuth();

  return {
    user,
    loading,
    // If we have user data, consider authenticated (even if refreshing in background)
    // Only show as not authenticated if we explicitly have no user AND we're not loading
    isAuthenticated: !!user,
    profile: user?.profile,
    preferences: user?.preferences,
    subscription: user?.subscription,
  };
}

/**
 * Hook for authentication actions
 */
export function useAuthActions() {
  const { signIn, signInWithGoogle, signUp, signOut, resetPassword, updateProfile, updatePreferences, refreshUser } = useAuth();

  return {
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updatePreferences,
    refreshUser,
  };
}

/**
 * Hook to check if user has completed onboarding
 */
export function useOnboardingStatus() {
  const { user } = useAuth();

  const onboardingCompleted = user?.profile?.onboardingCompleted ?? false;
  const needsOnboarding = !!user && !onboardingCompleted;

  return {
    onboardingCompleted,
    needsOnboarding,
  };
}

/**
 * Hook to get user subscription info
 */
export function useSubscription() {
  const { user } = useAuth();

  const subscription = user?.subscription;
  const isActive = subscription?.status === 'active';
  const isPro = isActive && subscription?.planId !== 'free';
  const isExpired = subscription?.status === 'expired';

  return {
    subscription,
    isActive,
    isPro,
    isExpired,
    planId: subscription?.planId || 'free',
  };
}

/**
 * Hook to get user preferences
 */
export function useUserPreferences() {
  const { user } = useAuth();
  const { updatePreferences } = useAuthActions();

  const preferences = user?.preferences;

  return {
    preferences,
    theme: preferences?.theme || 'light',
    language: preferences?.language || 'zh',
    emailNotifications: preferences?.emailNotifications ?? true,
    marketingEmails: preferences?.marketingEmails ?? false,
    updatePreferences,
  };
}
