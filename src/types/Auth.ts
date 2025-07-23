import type { User } from '@supabase/supabase-js';

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
  signUp: (email: string, password: string, options?: { redirectTo?: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ error?: string }>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<{ error?: string }>;
  refreshUser: () => Promise<void>;
} & AuthState;

export type AuthAction
  = | { type: 'SIGN_IN_START' }
    | { type: 'SIGN_IN_SUCCESS'; payload: AuthUser }
    | { type: 'SIGN_IN_ERROR'; payload: string }
    | { type: 'SIGN_OUT' }
    | { type: 'UPDATE_USER'; payload: AuthUser }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };
