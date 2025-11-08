'use client';

import type { SignUpFormData } from '@/validations/AuthValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuthActions } from '@/hooks/useAuthUser';
import { SignUpSchema } from '@/validations/AuthValidation';

type SignUpFormProps = {
  redirectTo?: string;
  onSuccess?: () => void;
  onSignIn?: () => void;
};

export function SignUpForm({ redirectTo, onSuccess, onSignIn }: SignUpFormProps) {
  const t = useTranslations('SignUp');
  const { signUp } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);

    try {
      const result = await signUp(data.email, data.password, data.fullName, {
        redirectTo: redirectTo || `${window.location.origin}/dashboard`,
      });

      if (result.error) {
        setError('root', { message: result.error });
        return;
      }

      // Show success message for email confirmation
      setShowSuccess(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('check_email_title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('check_email_message')}
          </p>
          <Button onClick={onSignIn} variant="outline" className="w-full">
            {t('back_to_sign_in')}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errors.root.message}
            </div>
          )}

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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('email_label')}
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              placeholder={t('email_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('password_label')}
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              placeholder={t('password_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('confirm_password_label')}
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              id="confirmPassword"
              placeholder={t('confirm_password_placeholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                {...register('acceptTerms')}
                id="acceptTerms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptTerms" className="text-gray-700 dark:text-gray-300">
                {t('accept_terms_part1')}
                {' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-500" target="_blank">
                  {t('terms_of_service')}
                </a>
                {' '}
                {t('and')}
                {' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-500" target="_blank">
                  {t('privacy_policy')}
                </a>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? t('creating_account') : t('sign_up_button')}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {t('or')}
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('have_account')}
              {' '}
              <button
                type="button"
                onClick={onSignIn}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                {t('sign_in_link')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
