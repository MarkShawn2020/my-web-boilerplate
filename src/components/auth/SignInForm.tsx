'use client';

import type { SignInFormData } from '@/validations/AuthValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuthActions } from '@/hooks/useAuthUser';
import { useRouter } from '@/libs/I18nNavigation';
import { SignInSchema } from '@/validations/AuthValidation';

type SignInFormProps = {
  redirectTo?: string;
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
};

export function SignInForm({ redirectTo, onSuccess, onForgotPassword, onSignUp }: SignInFormProps) {
  const t = useTranslations('SignIn');
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInFormData>({
    resolver: zodResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      const result = await signIn(data.email, data.password);

      if (result.error) {
        setError('root', { message: result.error });
        return;
      }

      if (onSuccess) {
        onSuccess();
      } else if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('remember_me')}
              </label>
            </div>

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              {t('forgot_password')}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? t('signing_in') : t('sign_in_button')}
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
              {t('no_account')}
              {' '}
              <button
                type="button"
                onClick={onSignUp}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                {t('sign_up_link')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
