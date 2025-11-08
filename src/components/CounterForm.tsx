'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/Button';
import { useFormButtonState } from '@/hooks/useButtonState';
import { CounterValidation } from '@/validations/CounterValidation';

export const CounterForm = () => {
  const t = useTranslations('CounterForm');
  const form = useForm({
    resolver: zodResolver(CounterValidation),
    defaultValues: {
      increment: 0,
    },
  });
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  // 使用统一的按钮状态管理
  const buttonState = useFormButtonState(formRef as React.RefObject<HTMLFormElement>, ['increment']);

  const handleIncrement = form.handleSubmit(async (data) => {
    // 使用统一的异步执行方法
    const result = await buttonState.executeAsync(async () => {
      const response = await fetch(`/api/counter`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update counter');
      }

      return response.json();
    });

    if (result.success) {
      form.reset();
      router.refresh();
    }
  });

  // 计算禁用状态
  const isFormInvalid = Object.keys(form.formState.errors).length > 0;
  const isDisabled = buttonState.isDisabled || isFormInvalid || form.formState.isSubmitting;

  return (
    <form ref={formRef} onSubmit={handleIncrement}>
      <p>{t('presentation')}</p>
      <div>
        <label className="text-sm font-bold text-gray-700" htmlFor="increment">
          {t('label_increment')}
          <input
            id="increment"
            type="number"
            className="ml-2 w-32 appearance-none rounded-sm border border-gray-200 px-2 py-1 text-sm leading-tight text-gray-700 focus:outline-hidden focus:ring-3 focus:ring-blue-300/50"
            {...form.register('increment')}
          />
        </label>

        {form.formState.errors.increment && (
          <div className="my-2 text-xs italic text-red-500">
            {t('error_increment_range')}
          </div>
        )}
      </div>

      <div className="mt-2">
        <Button
          type="submit"
          variant="default"
          size="default"
          disabled={isDisabled}
        >
          {buttonState.isLoading ? t('loading_submit') : t('button_increment')}
        </Button>
      </div>
    </form>
  );
};
