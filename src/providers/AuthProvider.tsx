'use client';

import type { User } from '@supabase/supabase-js';
import React, { createContext, use, useEffect, useReducer } from 'react';
import { AuthClientService } from '@/libs/AuthClient';
import { supabase } from '@/libs/Supabase';

// Types - moved here to avoid importing from types file that might reference server code
export type UserProfile = {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  locale: string;
  timezone: string | null;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPreferences = {
  id: number;
  userId: string;
  theme: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  language: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserSubscription = {
  id: number;
  userId: string;
  planId: string;
  status: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthUser = {
  profile?: UserProfile;
  preferences?: UserPreferences;
  subscription?: UserSubscription;
} & User;

export type AuthState = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
};

export type AuthContextType = {
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName?: string, options?: { redirectTo?: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ error?: string }>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<{ error?: string }>;
  refreshUser: () => Promise<void>;
} & AuthState;

type AuthAction
  = | { type: 'SIGN_IN_START' }
    | { type: 'SIGN_IN_SUCCESS'; payload: AuthUser }
    | { type: 'SIGN_IN_ERROR'; payload: string }
    | { type: 'SIGN_OUT' }
    | { type: 'UPDATE_USER'; payload: AuthUser }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SIGN_IN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'SIGN_IN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case 'SIGN_IN_ERROR':
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'SIGN_OUT':
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

// Helper function to fetch user data from API
async function fetchUserData(userId: string): Promise<AuthUser | null> {
  try {
    const { user, error } = await AuthClientService.getCurrentUser();

    if (error || !user || user.id !== userId) {
      return null;
    }

    // Fetch additional data from API
    const response = await fetch(`/api/auth/user?userId=${encodeURIComponent(userId)}`);

    if (!response.ok) {
      console.error('Failed to fetch user data from API');
      return user;
    }

    const { profile, preferences, subscription } = await response.json();

    return {
      ...user,
      profile: profile || undefined,
      preferences: preferences || undefined,
      subscription: subscription || undefined,
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on mount and listen for auth changes
  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const loadUser = async () => {
      try {
        const { session, error } = await AuthClientService.getSession();

        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            dispatch({ type: 'SIGN_IN_ERROR', payload: error });
          }
          return;
        }

        if (session?.user) {
          const completeUser = await fetchUserData(session.user.id);
          if (isMounted) {
            dispatch({ type: 'SIGN_IN_SUCCESS', payload: completeUser || session.user });
          }
        } else {
          if (isMounted) {
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        if (isMounted) {
          dispatch({ type: 'SIGN_IN_ERROR', payload: 'Failed to load user' });
        }
      }
    };

    loadUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) {
          return;
        }

        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              dispatch({ type: 'SIGN_IN_START' });
              const completeUser = await fetchUserData(session.user.id);
              dispatch({ type: 'SIGN_IN_SUCCESS', payload: completeUser || session.user });
            }
            break;
          case 'SIGNED_OUT':
            dispatch({ type: 'SIGN_OUT' });
            break;
          case 'TOKEN_REFRESHED':
            if (session?.user) {
              const completeUser = await fetchUserData(session.user.id);
              dispatch({ type: 'UPDATE_USER', payload: completeUser || session.user });
            }
            break;
        }
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    dispatch({ type: 'SIGN_IN_START' });
    const result = await AuthClientService.signIn(email, password);

    if (result.error) {
      dispatch({ type: 'SIGN_IN_ERROR', payload: result.error });
      return { error: result.error };
    }

    return {};
  };

  const signUp = async (email: string, password: string, fullName?: string, options?: { redirectTo?: string }) => {
    dispatch({ type: 'SIGN_IN_START' });
    const result = await AuthClientService.signUp(email, password, fullName, options);

    if (result.error) {
      dispatch({ type: 'SIGN_IN_ERROR', payload: result.error });
      return { error: result.error };
    }

    return {};
  };

  const signOut = async () => {
    const result = await AuthClientService.signOut();
    if (result.error) {
      dispatch({ type: 'SET_ERROR', payload: result.error });
    }
  };

  const resetPassword = async (email: string) => {
    const result = await AuthClientService.resetPassword(email);
    if (result.error) {
      return { error: result.error };
    }
    return {};
  };

  const updateProfile = async (profileUpdates: Partial<UserProfile>) => {
    if (!state.user) {
      return { error: 'No user logged in' };
    }

    try {
      const result = await AuthClientService.updateUserProfile(state.user.id, profileUpdates);
      if (result && result.profile) {
        const updatedUser: AuthUser = {
          ...state.user,
          profile: result.profile,
        };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        return {};
      }

      return { error: 'Failed to update profile' };
    } catch (error) {
      return { error: 'Failed to update profile' };
    }
  };

  const updatePreferences = async (preferenceUpdates: Partial<UserPreferences>) => {
    if (!state.user) {
      return { error: 'No user logged in' };
    }

    try {
      const result = await AuthClientService.updateUserPreferences(state.user.id, preferenceUpdates);
      if (result && result.preferences) {
        const updatedUser: AuthUser = {
          ...state.user,
          preferences: result.preferences,
        };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        return {};
      }

      return { error: 'Failed to update preferences' };
    } catch (error) {
      return { error: 'Failed to update preferences' };
    }
  };

  const refreshUser = async () => {
    if (!state.user) {
      return;
    }

    const completeUser = await fetchUserData(state.user.id);
    if (completeUser) {
      dispatch({ type: 'UPDATE_USER', payload: completeUser });
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    updatePreferences,
    refreshUser,
  };

  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const context = use(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
