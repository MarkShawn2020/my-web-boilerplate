'use client';

import type { User } from '@supabase/supabase-js';
import React, { createContext, use, useEffect, useReducer, useRef } from 'react';
import { AuthClientService } from '@/libs/AuthClient';
import { supabase } from '@/libs/Supabase';
import { UserDataService } from '@/libs/UserDataService';

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
  signInWithGoogle: (redirectTo?: string) => Promise<{ error?: string }>;
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

// Helper function to get cached auth state
function getCachedAuthState(): Partial<AuthState> {
  if (typeof window === 'undefined') {
    return {};
  }
  
  try {
    const cached = sessionStorage.getItem('auth-state');
    if (cached) {
      const parsed = JSON.parse(cached);
      // Only return cached user data - always validate before trusting
      return {
        user: parsed.user || null,
        // Don't set loading state from cache - always validate first
      };
    }
  } catch (error) {
    console.warn('Failed to parse cached auth state:', error);
    // Clear corrupted cache
    try {
      sessionStorage.removeItem('auth-state');
    } catch (clearError) {
      console.warn('Failed to clear corrupted auth cache:', clearError);
    }
  }
  
  return {};
}

// Helper function to cache auth state
function cacheAuthState(state: AuthState) {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    sessionStorage.setItem('auth-state', JSON.stringify({
      user: state.user,
      // Don't cache loading/error states
    }));
  } catch (error) {
    console.warn('Failed to cache auth state:', error);
  }
}

// Remove module-level cache loading - will be done dynamically in useEffect
const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  let newState: AuthState;
  
  switch (action.type) {
    case 'SIGN_IN_START':
      newState = {
        ...state,
        loading: true,
        error: null,
      };
      break;
    case 'SIGN_IN_SUCCESS':
      newState = {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
      break;
    case 'SIGN_IN_ERROR':
      newState = {
        ...state,
        user: null,
        loading: false,
        error: action.payload,
      };
      break;
    case 'SIGN_OUT':
      newState = {
        ...state,
        user: null,
        loading: false,
        error: null,
      };
      // Clear cached auth state on sign out
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('auth-state');
      }
      break;
    case 'UPDATE_USER':
      newState = {
        ...state,
        user: action.payload,
      };
      break;
    case 'SET_LOADING':
      newState = {
        ...state,
        loading: action.payload,
      };
      break;
    case 'SET_ERROR':
      newState = {
        ...state,
        error: action.payload,
      };
      break;
    default:
      newState = state;
  }
  
  // Cache the state when user data changes
  if (newState !== state && (action.type === 'SIGN_IN_SUCCESS' || action.type === 'SIGN_OUT' || action.type === 'UPDATE_USER')) {
    cacheAuthState(newState);
  }
  
  return newState;
}

// Helper function to fetch user data directly from Supabase using RLS
async function fetchUserData(userId: string): Promise<AuthUser | null> {
  try {
    const { user, error } = await AuthClientService.getCurrentUser();

    if (error || !user || user.id !== userId) {
      return null;
    }

    // 🚀 直接并行调用 Supabase，使用 RLS 策略保证安全性
    const { profile, preferences, subscription } = await UserDataService.getUserDataParallel(userId);

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

// 备注：如需渐进式加载，可以使用 UserDataService.getUserDataProgressive 方法

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const stateRef = useRef(state);
  
  // Keep stateRef current for visibility handler access
  stateRef.current = state;

  // Load user on mount and listen for auth changes
  useEffect(() => {
    let isMounted = true;
    let authSubscription: any = null;
    let isBackgroundValidating = false; // Flag to prevent circular triggering

    // Load initial auth state with dynamic cache loading
    const loadUser = async () => {
      try {
        // Always show loading state initially
        dispatch({ type: 'SET_LOADING', payload: true });

        // Dynamically get cached state (fresh on each mount)
        const cachedState = getCachedAuthState();
        
        // If we have cached user, update state but still validate
        if (cachedState.user && isMounted) {
          dispatch({ type: 'UPDATE_USER', payload: cachedState.user });
        }

        const { session, error } = await AuthClientService.getSession();

        if (error) {
          console.error('Error getting session:', error);
          if (isMounted) {
            dispatch({ type: 'SIGN_IN_ERROR', payload: error });
          }
          return;
        }

        if (session?.user) {
          // Always fetch complete user data for validation
          const completeUser = await fetchUserData(session.user.id);
          if (isMounted) {
            if (completeUser) {
              dispatch({ type: 'SIGN_IN_SUCCESS', payload: completeUser });
            } else {
              // If fetchUserData fails, treat as authentication failure
              console.warn('Failed to fetch complete user data, signing out');
              dispatch({ type: 'SIGN_OUT' });
            }
          }
        } else {
          // No session, clear any cached data
          if (isMounted) {
            dispatch({ type: 'SIGN_OUT' });
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        if (isMounted) {
          dispatch({ type: 'SIGN_IN_ERROR', payload: 'Failed to load user' });
        }
      }
    };

    // Silent background validation without loading state
    const validateUserSilently = async () => {
      if (isBackgroundValidating) {
        console.log('Background validation already in progress, skipping');
        return;
      }
      
      try {
        isBackgroundValidating = true;
        console.log('Starting silent background validation');
        
        const { session, error } = await AuthClientService.getSession();
        
        if (error || !session?.user) {
          console.log('Silent validation: No valid session, signing out');
          if (isMounted) {
            dispatch({ type: 'SIGN_OUT' });
          }
          return;
        }
        
        const currentUser = stateRef.current.user;
        if (currentUser && session.user.id === currentUser.id) {
          // Same user, optionally refresh profile data without showing loading
          console.log('Silent validation: Same user, refreshing profile silently');
          const completeUser = await fetchUserData(session.user.id);
          if (completeUser && isMounted) {
            dispatch({ type: 'UPDATE_USER', payload: completeUser });
          }
        } else {
          // Different user or no current user, this is a significant change
          console.log('Silent validation: User changed, updating with loading');
          if (isMounted) {
            dispatch({ type: 'SIGN_IN_START' });
            const completeUser = await fetchUserData(session.user.id);
            dispatch({ type: 'SIGN_IN_SUCCESS', payload: completeUser || session.user });
          }
        }
      } catch (error) {
        console.error('Silent validation failed:', error);
        // Don't update state for background validation failures
      } finally {
        isBackgroundValidating = false;
        console.log('Silent background validation completed');
      }
    };

    // Smart visibility change handler
    const handleVisibilityChange = () => {
      if (!document.hidden && isMounted) {
        const currentState = stateRef.current;
        
        if (!currentState.user || currentState.error) {
          // No user or error state - need full loading
          console.log('Page visible: No user data, loading with spinner');
          loadUser();
        } else {
          // Have user data - validate silently in background
          console.log('Page visible: Have user data, validating silently');
          validateUserSilently();
        }
      }
    };

    // Initial load
    loadUser();

    // Add page visibility listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for auth changes with coordination logic to prevent circular triggering
    authSubscription = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) {
          return;
        }

        console.log('Auth state change:', event, session?.user?.id, `(backgroundValidating: ${isBackgroundValidating})`);

        // Ignore events triggered by our own background validation
        if (isBackgroundValidating) {
          console.log('Ignoring auth event during background validation to prevent circular triggering');
          return;
        }

        const currentUser = stateRef.current.user;

        switch (event) {
          case 'SIGNED_IN':
            if (session?.user) {
              // Only show loading if this represents a real state change
              if (!currentUser || currentUser.id !== session.user.id) {
                console.log('SIGNED_IN: New user detected, showing loading');
                dispatch({ type: 'SIGN_IN_START' });
                const completeUser = await fetchUserData(session.user.id);
                if (completeUser) {
                  dispatch({ type: 'SIGN_IN_SUCCESS', payload: completeUser });
                } else {
                  console.warn('Auth event SIGNED_IN but failed to fetch user data');
                  dispatch({ type: 'SIGN_IN_ERROR', payload: 'Failed to load user profile' });
                }
              } else {
                console.log('SIGNED_IN: Same user, updating without loading');
                const completeUser = await fetchUserData(session.user.id);
                if (completeUser) {
                  dispatch({ type: 'UPDATE_USER', payload: completeUser });
                }
              }
            }
            break;
          case 'SIGNED_OUT':
            dispatch({ type: 'SIGN_OUT' });
            break;
          case 'TOKEN_REFRESHED':
            if (session?.user) {
              const completeUser = await fetchUserData(session.user.id);
              if (completeUser) {
                dispatch({ type: 'UPDATE_USER', payload: completeUser });
              } else {
                console.warn('Token refreshed but failed to fetch user data, signing out');
                dispatch({ type: 'SIGN_OUT' });
              }
            }
            break;
        }
      },
    );

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (authSubscription) {
        authSubscription.data.subscription.unsubscribe();
      }
    };
  }, []); // Keep empty dependency array but remove state references

  const signIn = async (email: string, password: string) => {
    console.log('🔑 AuthProvider signIn called with:', { email });
    dispatch({ type: 'SIGN_IN_START' });
    
    console.log('🌐 Calling AuthClientService.signIn...');
    const result = await AuthClientService.signIn(email, password);
    console.log('📋 AuthClientService result:', result);

    if (result.error) {
      console.error('❌ AuthProvider signIn error:', result.error);
      dispatch({ type: 'SIGN_IN_ERROR', payload: result.error });
      return { error: result.error };
    }

    console.log('✅ AuthProvider signIn successful, waiting for auth state change...');
    return {};
  };

  const signInWithGoogle = async (redirectTo?: string) => {
    console.log('🔑 AuthProvider signInWithGoogle called');
    dispatch({ type: 'SIGN_IN_START' });
    
    console.log('🌐 Calling AuthClientService.signInWithGoogle...');
    const result = await AuthClientService.signInWithGoogle(redirectTo);
    console.log('📋 AuthClientService Google OAuth result:', result);

    if (result.error) {
      console.error('❌ AuthProvider Google OAuth error:', result.error);
      dispatch({ type: 'SIGN_IN_ERROR', payload: result.error });
      return { error: result.error };
    }

    console.log('✅ AuthProvider Google OAuth initiated successfully');
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
      // 🚀 直接调用 Supabase，使用 RLS 策略
      const updatedProfile = await UserDataService.updateUserProfile(state.user.id, profileUpdates);
      
      if (updatedProfile) {
        const updatedUser: AuthUser = {
          ...state.user,
          profile: updatedProfile,
        };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        return {};
      }

      return { error: 'Failed to update profile' };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: 'Failed to update profile' };
    }
  };

  const updatePreferences = async (preferenceUpdates: Partial<UserPreferences>) => {
    if (!state.user) {
      return { error: 'No user logged in' };
    }

    try {
      // 🚀 直接调用 Supabase，使用 RLS 策略
      const updatedPreferences = await UserDataService.updateUserPreferences(state.user.id, preferenceUpdates);
      
      if (updatedPreferences) {
        const updatedUser: AuthUser = {
          ...state.user,
          preferences: updatedPreferences,
        };
        dispatch({ type: 'UPDATE_USER', payload: updatedUser });
        return {};
      }

      return { error: 'Failed to update preferences' };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { error: 'Failed to update preferences' };
    }
  };

  const refreshUser = async () => {
    if (!state.user) {
      return;
    }

    // 🚀 使用优化后的数据获取函数
    const completeUser = await fetchUserData(state.user.id);
    if (completeUser) {
      dispatch({ type: 'UPDATE_USER', payload: completeUser });
    }
  };

  const value: AuthContextType = {
    ...state,
    signIn,
    signInWithGoogle,
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
