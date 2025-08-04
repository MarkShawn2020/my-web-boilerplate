'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { BillingToggle } from './BillingToggle';
import { FAQ } from './FAQ';
import { FeatureComparison } from './FeatureComparison';
import { PlatformGrid } from './PlatformGrid';
import { PricingCard } from './PricingCard';
import { Testimonial } from './Testimonial';

type BillingCycle = 'monthly' | 'yearly';

export const PricingPageContent: React.FC = () => {
  const t = useTranslations('Pricing');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');

  return (
    <Container>
      <div className="py-12 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-text-main mb-6">
            {t('hero_title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('hero_description')}
          </p>
        </div>

        {/* Billing Toggle */}
        <BillingToggle
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
        />

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <PricingCard
            planKey="free"
            billingCycle={billingCycle}
          />
          <PricingCard
            planKey="essentials"
            billingCycle={billingCycle}
            isRecommended={true}
          />
          <PricingCard
            planKey="team"
            billingCycle={billingCycle}
          />
        </div>

        {/* Enterprise Note */}
        <div className="text-center mb-16">
          <p className="text-gray-600">
            {t('enterprise_note')}
          </p>
        </div>

        {/* Supported Platforms */}
        <PlatformGrid />

        {/* Testimonial */}
        <div className="-mx-4 md:-mx-8 lg:-mx-12">
          <Testimonial />
        </div>

        {/* Feature Comparison */}
        <FeatureComparison />

        {/* FAQ */}
        <FAQ />
      </div>
    </Container>
  );
};

PricingPageContent.displayName = 'PricingPageContent';
