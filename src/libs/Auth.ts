import type { AuthUser, UserPreferences, UserProfile } from '@/types/Auth';
import { eq } from 'drizzle-orm';
import { userPreferences, userProfiles, userSubscriptions } from '@/models/Schema';
import { db, runMigrations } from './DB';
import { supabaseServer } from './SupabaseServer';

export class AuthService {
  /**
   * Ensure migrations are run before database operations
   */
  private static async ensureMigrations() {
    try {
      await runMigrations();
    } catch (error) {
      console.error('Migration error (may be safe to ignore if already applied):', error);
    }
  }

  /**
   * Get user profile by ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const result = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.id, userId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Create user profile after signup
   */
  static async createUserProfile(userId: string, email: string, fullName?: string): Promise<UserProfile | null> {
    try {
      await this.ensureMigrations();
      const result = await db
        .insert(userProfiles)
        .values({
          id: userId,
          email,
          fullName,
          locale: 'zh',
          timezone: 'Asia/Shanghai',
          onboardingCompleted: false,
        })
        .returning();

      // Also create default preferences
      await this.createUserPreferences(userId);

      return result[0] || null;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const result = await db
        .update(userProfiles)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userProfiles.id, userId))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  /**
   * Get user preferences
   */
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const result = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return null;
    }
  }

  /**
   * Create default user preferences
   */
  static async createUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const result = await db
        .insert(userPreferences)
        .values({
          userId,
          theme: 'light',
          emailNotifications: true,
          marketingEmails: false,
          language: 'zh',
        })
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error('Error creating user preferences:', error);
      return null;
    }
  }

  /**
   * Update user preferences
   */
  static async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
    try {
      const { createdAt, id, ...updateData } = updates;
      const result = await db
        .update(userPreferences)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(userPreferences.userId, userId))
        .returning();

      return result[0] || null;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      return null;
    }
  }

  /**
   * Get user subscription
   */
  static async getUserSubscription(userId: string) {
    try {
      const result = await db
        .select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions.userId, userId))
        .limit(1);

      return result[0] || null;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  /**
   * Get complete user data with profile, preferences, and subscription
   */
  static async getCompleteUser(userId: string): Promise<AuthUser | null> {
    try {
      // Get Supabase user
      const { data: user, error } = await supabaseServer.auth.getUser();

      if (error || !user.user || user.user.id !== userId) {
        return null;
      }

      // Get additional data
      const [profile, preferences, subscription] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserPreferences(userId),
        this.getUserSubscription(userId),
      ]);

      return {
        ...user.user,
        profile: profile || undefined,
        preferences: preferences || undefined,
        subscription: subscription || undefined,
      };
    } catch (error) {
      console.error('Error fetching complete user:', error);
      return null;
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabaseServer.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return { user: data.user };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUp(email: string, password: string, options?: { redirectTo?: string }) {
    try {
      const { data, error } = await supabaseServer.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: options?.redirectTo,
        },
      });

      if (error) {
        return { error: error.message };
      }

      // Create user profile if signup successful
      if (data.user) {
        await this.createUserProfile(data.user.id, email);
      }

      return { user: data.user };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  /**
   * Sign out
   */
  static async signOut() {
    try {
      const { error } = await supabaseServer.auth.signOut();
      return { error: error?.message };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string) {
    try {
      const { error } = await supabaseServer.auth.resetPasswordForEmail(email);
      return { error: error?.message };
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get current session
   */
  static async getSession() {
    try {
      const { data: { session }, error } = await supabaseServer.auth.getSession();
      return { session, error: error?.message };
    } catch (error) {
      return { session: null, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Refresh session
   */
  static async refreshSession() {
    try {
      const { data: { session }, error } = await supabaseServer.auth.refreshSession();
      return { session, error: error?.message };
    } catch (error) {
      return { session: null, error: 'An unexpected error occurred' };
    }
  }
}
