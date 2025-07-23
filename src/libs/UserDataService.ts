'use client';

import type { UserPreferences, UserProfile, UserSubscription } from '@/providers/AuthProvider';
import { supabase } from './Supabase';

/**
 * 直接调用 Supabase 的用户数据服务
 * 使用 RLS 策略保证安全性，避免 API 层的额外延迟
 */
export class UserDataService {
  /**
   * 获取用户档案信息 - 优先级最高，首先加载
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // 如果没有找到记录，创建默认用户档案
        if (error.code === 'PGRST116') {
          return await this.createDefaultUserProfile(userId);
        }
        console.error('Error fetching user profile:', error.message);
        return null;
      }

      return this.mapDbProfileToUserProfile(data);
    } catch (error) {
      console.error('Unexpected error fetching user profile:', error);
      return null;
    }
  }

  /**
   * 获取用户偏好设置
   */
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // 如果没有找到记录，创建默认偏好设置
        if (error.code === 'PGRST116') {
          return await this.createDefaultUserPreferences(userId);
        }
        console.error('Error fetching user preferences:', error.message);
        return null;
      }

      return this.mapDbPreferencesToUserPreferences(data);
    } catch (error) {
      console.error('Unexpected error fetching user preferences:', error);
      return null;
    }
  }

  /**
   * 获取用户订阅信息
   */
  static async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // 如果没有找到记录，创建免费订阅
        if (error.code === 'PGRST116') {
          return await this.createDefaultUserSubscription(userId);
        }
        console.error('Error fetching user subscription:', error.message);
        return null;
      }

      return this.mapDbSubscriptionToUserSubscription(data);
    } catch (error) {
      console.error('Unexpected error fetching user subscription:', error);
      return null;
    }
  }

  /**
   * 并行获取用户的完整数据（最快的方式）
   */
  static async getUserDataParallel(userId: string): Promise<{
    profile: UserProfile | null;
    preferences: UserPreferences | null;
    subscription: UserSubscription | null;
  }> {
    try {
      const [profile, preferences, subscription] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserPreferences(userId),
        this.getUserSubscription(userId),
      ]);

      return {
        profile,
        preferences,
        subscription,
      };
    } catch (error) {
      console.error('Error fetching user data in parallel:', error);
      return {
        profile: null,
        preferences: null,
        subscription: null,
      };
    }
  }

  /**
   * 渐进式获取用户数据：先获取档案，后台加载其他数据
   */
  static async getUserDataProgressive(
    userId: string,
    onAdditionalDataLoaded?: (data: { preferences: UserPreferences | null; subscription: UserSubscription | null }) => void
  ): Promise<UserProfile | null> {
    try {
      // 第一步：立即获取用户档案（最重要的数据）
      const profile = await this.getUserProfile(userId);

      // 第二步：后台异步获取其他数据
      if (onAdditionalDataLoaded) {
        Promise.all([
          this.getUserPreferences(userId),
          this.getUserSubscription(userId),
        ]).then(([preferences, subscription]) => {
          onAdditionalDataLoaded({ preferences, subscription });
        }).catch(error => {
          console.error('Error loading additional user data:', error);
          onAdditionalDataLoaded({ preferences: null, subscription: null });
        });
      }

      return profile;
    } catch (error) {
      console.error('Error in progressive user data loading:', error);
      return null;
    }
  }

  /**
   * 更新用户档案
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      // 映射字段名：TypeScript camelCase -> database snake_case
      const dbUpdates: any = {};
      
      if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
      if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
      if (updates.onboardingCompleted !== undefined) dbUpdates.onboarding_completed = updates.onboardingCompleted;
      if (updates.locale !== undefined) dbUpdates.locale = updates.locale;
      if (updates.timezone !== undefined) dbUpdates.timezone = updates.timezone;
      
      dbUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('user_profiles')
        .update(dbUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user profile:', error.message);
        return null;
      }

      // 映射字段名：database snake_case -> TypeScript camelCase
      return this.mapDbProfileToUserProfile(data);
    } catch (error) {
      console.error('Unexpected error updating user profile:', error);
      return null;
    }
  }

  /**
   * 更新用户偏好设置
   */
  static async updateUserPreferences(userId: string, updates: Partial<UserPreferences>): Promise<UserPreferences | null> {
    try {
      // 映射字段名：TypeScript camelCase -> database snake_case
      const dbUpdates: any = {};
      
      if (updates.theme !== undefined) dbUpdates.theme = updates.theme;
      if (updates.emailNotifications !== undefined) dbUpdates.email_notifications = updates.emailNotifications;
      if (updates.marketingEmails !== undefined) dbUpdates.marketing_emails = updates.marketingEmails;
      if (updates.language !== undefined) dbUpdates.language = updates.language;
      
      dbUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('user_preferences')
        .update(dbUpdates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user preferences:', error.message);
        return null;
      }

      return this.mapDbPreferencesToUserPreferences(data);
    } catch (error) {
      console.error('Unexpected error updating user preferences:', error);
      return null;
    }
  }

  /**
   * 创建默认用户档案
   */
  private static async createDefaultUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // Get the user's email from Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user || user.id !== userId) {
        console.error('Error getting auth user for profile creation:', authError);
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          locale: 'zh',
          timezone: 'Asia/Shanghai',
          onboarding_completed: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating default user profile:', error.message);
        return null;
      }

      return this.mapDbProfileToUserProfile(data);
    } catch (error) {
      console.error('Unexpected error creating default user profile:', error);
      return null;
    }
  }

  /**
   * 创建默认用户偏好设置
   */
  private static async createDefaultUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .insert({
          user_id: userId,
          theme: 'light',
          email_notifications: true,
          marketing_emails: false,
          language: 'zh',
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating default user preferences:', error.message);
        return null;
      }

      return this.mapDbPreferencesToUserPreferences(data);
    } catch (error) {
      console.error('Unexpected error creating default user preferences:', error);
      return null;
    }
  }

  /**
   * 创建默认用户订阅
   */
  private static async createDefaultUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: 'free',
          status: 'active',
          cancel_at_period_end: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating default user subscription:', error.message);
        return null;
      }

      return this.mapDbSubscriptionToUserSubscription(data);
    } catch (error) {
      console.error('Unexpected error creating default user subscription:', error);
      return null;
    }
  }

  /**
   * 实时订阅用户数据变化（可选功能）
   */
  static subscribeToUserProfile(userId: string, callback: (profile: UserProfile) => void) {
    return supabase
      .channel(`user_profile_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            callback(payload.new as UserProfile);
          }
        }
      )
      .subscribe();
  }

  /**
   * 取消实时订阅
   */
  static unsubscribeFromUserProfile(subscription: any) {
    return supabase.removeChannel(subscription);
  }

  // ==========================================
  // 字段映射辅助函数
  // ==========================================

  /**
   * 将数据库的 snake_case 字段映射为 TypeScript 的 camelCase
   */
  private static mapDbProfileToUserProfile(dbData: any): UserProfile {
    return {
      id: dbData.id,
      email: dbData.email,
      fullName: dbData.full_name,
      avatarUrl: dbData.avatar_url,
      locale: dbData.locale,
      timezone: dbData.timezone,
      onboardingCompleted: dbData.onboarding_completed,
      createdAt: new Date(dbData.created_at),
      updatedAt: new Date(dbData.updated_at),
    };
  }

  /**
   * 将数据库的 snake_case 字段映射为 TypeScript 的 camelCase
   */
  private static mapDbPreferencesToUserPreferences(dbData: any): UserPreferences {
    return {
      id: dbData.id,
      userId: dbData.user_id,
      theme: dbData.theme,
      emailNotifications: dbData.email_notifications,
      marketingEmails: dbData.marketing_emails,
      language: dbData.language,
      createdAt: new Date(dbData.created_at),
      updatedAt: new Date(dbData.updated_at),
    };
  }

  /**
   * 将数据库的 snake_case 字段映射为 TypeScript 的 camelCase
   */
  private static mapDbSubscriptionToUserSubscription(dbData: any): UserSubscription {
    return {
      id: dbData.id,
      userId: dbData.user_id,
      planId: dbData.plan_id,
      status: dbData.status,
      stripeCustomerId: dbData.stripe_customer_id,
      stripeSubscriptionId: dbData.stripe_subscription_id,
      currentPeriodStart: dbData.current_period_start ? new Date(dbData.current_period_start) : null,
      currentPeriodEnd: dbData.current_period_end ? new Date(dbData.current_period_end) : null,
      cancelAtPeriodEnd: dbData.cancel_at_period_end,
      createdAt: new Date(dbData.created_at),
      updatedAt: new Date(dbData.updated_at),
    };
  }
}