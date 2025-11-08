'use client';

import type { ResetPasswordFormData } from '@/validations/AuthValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuthActions } from '@/hooks/useAuthUser';
import { ResetPasswordSchema } from '@/validations/AuthValidation';

type ResetPasswordFormProps = {
  onSuccess?: () => void;
  onBack?: () => void;
};

export function ResetPasswordForm({ onSuccess, onBack }: ResetPasswordFormProps) {
  const t = useTranslations('ResetPassword');
  const { resetPassword } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);

    try {
      const result = await resetPassword(data.email);

      if (result.error) {
        setError('root', { message: result.error });
        return;
      }

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
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('email_sent_title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('email_sent_message')}
          </p>
          <Button onClick={onBack} variant="outline" className="w-full">
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

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? t('sending') : t('send_reset_email')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400"
          >
            ←
            {' '}
            {t('back_to_sign_in')}
          </button>
        </div>
      </div>
    </Card>
  );
}
