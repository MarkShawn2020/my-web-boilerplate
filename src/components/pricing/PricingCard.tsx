'use client';

import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

type BillingCycle = 'monthly' | 'yearly';

type PricingCardProps = {
  planKey: 'free' | 'essentials' | 'team';
  billingCycle: BillingCycle;
  isRecommended?: boolean;
};

export const PricingCard: React.FC<PricingCardProps> = ({
  planKey,
  billingCycle,
  isRecommended = false,
}) => {
  const t = useTranslations('Pricing');
  const locale = useLocale();

  const getPriceDisplay = () => {
    if (planKey === 'free') {
      return t('plans.free.price_label');
    }

    if (billingCycle === 'yearly') {
      return t(`plans.${planKey}.price_label_yearly`);
    } else {
      return t(`plans.${planKey}.price_label_monthly`);
    }
  };

  const getAnnualPriceNote = () => {
    if (planKey === 'free' || billingCycle === 'monthly') {
      return null;
    }

    const yearlyPrice = t(`plans.${planKey}.price_yearly`);
    const currency = locale === 'zh' ? '¥' : '$';
    const annualTotal = Number.parseInt(yearlyPrice) * 12;

    return (
      <p className="text-sm text-gray-500 mt-1">
        {currency}
        {annualTotal}
        {' '}
        billed annually
      </p>
    );
  };

  const features = t.raw(`plans.${planKey}.features`) as string[];

  return (
    <div className={`relative rounded-2xl border bg-white p-8 shadow-sm ${
      isRecommended
        ? 'border-primary ring-1 ring-primary'
        : 'border-gray-200'
    }`}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
            {t('recommended')}
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-text-main mb-2">
          {t(`plans.${planKey}.name`)}
        </h3>

        <div className="mb-4">
          <div className="text-4xl font-bold text-text-main">
            {getPriceDisplay()}
          </div>
          {getAnnualPriceNote()}
        </div>

        <p className="text-gray-600 text-sm">
          {t(`plans.${planKey}.description`)}
        </p>
      </div>

      {/* CTA Button */}
      <div className="mb-8">
        <button
          className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
            planKey === 'free'
              ? 'bg-gray-900 text-white hover:bg-gray-800'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {t(`plans.${planKey}.cta`)}
        </button>
      </div>

      {/* Features List */}
      <div>
        <h4 className="text-sm font-semibold text-text-main mb-4">
          What's included:
        </h4>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <svg
                className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

PricingCard.displayName = 'PricingCard';
