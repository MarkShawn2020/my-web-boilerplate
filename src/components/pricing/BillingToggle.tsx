'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

type BillingCycle = 'monthly' | 'yearly';

type BillingToggleProps = {
  billingCycle: BillingCycle;
  onBillingCycleChange: (cycle: BillingCycle) => void;
};

export const BillingToggle: React.FC<BillingToggleProps> = ({
  billingCycle,
  onBillingCycleChange,
}) => {
  const t = useTranslations('Pricing');

  return (
    <div className="flex items-center justify-center mb-12">
      <div className="flex items-center space-x-4">
        <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-text-main' : 'text-gray-500'}`}>
          {t('billing_monthly')}
        </span>

        <button
          onClick={() => onBillingCycleChange(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          style={{
            backgroundColor: billingCycle === 'yearly' ? 'var(--color-primary)' : '',
          }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>

        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-text-main' : 'text-gray-500'}`}>
            {t('billing_yearly')}
          </span>
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            {t('billing_save')}
          </span>
        </div>
      </div>
    </div>
  );
};

BillingToggle.displayName = 'BillingToggle';
