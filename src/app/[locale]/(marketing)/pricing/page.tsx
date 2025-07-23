import React from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PricingPageContent } from '@/components/pricing/PricingPageContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'Pricing' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function PricingPage(props: Props) {
  return <PricingPageContent />;
}