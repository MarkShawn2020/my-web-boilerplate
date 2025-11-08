'use client';

import type { UpdateProfileFormData } from '@/validations/AuthValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuthActions, useAuthUser } from '@/hooks/useAuthUser';
import { UpdateProfileSchema } from '@/validations/AuthValidation';

export function UserProfileForm() {
  const t = useTranslations('UserProfile');
  const { user, profile } = useAuthUser();
  const { updateProfile } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      fullName: profile?.fullName || '',
      avatarUrl: profile?.avatarUrl || '',
      locale: (profile?.locale as 'zh' | 'en') || 'zh',
      timezone: profile?.timezone || 'Asia/Shanghai',
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true);
    setSuccessMessage('');

    try {
      const result = await updateProfile(data);

      if (result.error) {
        setError('root', { message: result.error });
        return;
      }

      setSuccessMessage(t('profile_updated_success'));
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="p-6">
        <p className="text-gray-600 dark:text-gray-400">
          {t('loading')}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('title')}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.root.message}
            </div>
          )}

          {successMessage && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
              {successMessage}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('email_label')}
            </label>
            <input
              type="email"
              id="email"
              value={user.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {t('email_help')}
            </p>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('full_name_label')}
            </label>
            <input
              {...register('fullName')}
              type="text"
              id="fullName"
              placeholder={t('full_name_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('avatar_url_label')}
            </label>
            <input
              {...register('avatarUrl')}
              type="url"
              id="avatarUrl"
              placeholder={t('avatar_url_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            />
            {errors.avatarUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.avatarUrl.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="locale" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('locale_label')}
            </label>
            <select
              {...register('locale')}
              id="locale"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            >
              <option value="zh">{t('locale_zh')}</option>
              <option value="en">{t('locale_en')}</option>
            </select>
            {errors.locale && (
              <p className="mt-1 text-sm text-red-600">{errors.locale.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('timezone_label')}
            </label>
            <select
              {...register('timezone')}
              id="timezone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            >
              <option value="Asia/Shanghai">{t('timezone_shanghai')}</option>
              <option value="America/New_York">{t('timezone_new_york')}</option>
              <option value="Europe/London">{t('timezone_london')}</option>
              <option value="Asia/Tokyo">{t('timezone_tokyo')}</option>
              <option value="Australia/Sydney">{t('timezone_sydney')}</option>
            </select>
            {errors.timezone && (
              <p className="mt-1 text-sm text-red-600">{errors.timezone.message}</p>
            )}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? t('updating') : t('update_profile')}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('account_info_title')}
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              {t('user_id')}
              :
            </span>
            <span className="ml-2 font-mono text-gray-900 dark:text-white">{user.id}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              {t('created_at')}
              :
            </span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">
              {t('email_verified')}
              :
            </span>
            <span className="ml-2 text-gray-900 dark:text-white">
              {user.email_confirmed_at ? t('verified') : t('not_verified')}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
