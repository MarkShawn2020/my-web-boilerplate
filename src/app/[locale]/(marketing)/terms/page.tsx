import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { LegalPage } from '@/components/legal/LegalPage';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'TermsOfService' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function TermsPage(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'TermsOfService' });

  const sections = [
    {
      title: t('sections.acceptance.title'),
      content: t('sections.acceptance.content'),
    },
    {
      title: t('sections.description.title'),
      content: t('sections.description.content'),
    },
    {
      title: t('sections.user_accounts.title'),
      content: t('sections.user_accounts.content'),
    },
    {
      title: t('sections.user_content.title'),
      content: t('sections.user_content.content'),
    },
    {
      title: t('sections.intellectual_property.title'),
      content: t('sections.intellectual_property.content'),
    },
    {
      title: t('sections.ai_usage.title'),
      content: t('sections.ai_usage.content'),
    },
    {
      title: t('sections.termination.title'),
      content: t('sections.termination.content'),
    },
    {
      title: t('sections.disclaimers.title'),
      content: t('sections.disclaimers.content'),
    },
    {
      title: t('sections.governing_law.title'),
      content: t('sections.governing_law.content'),
    },
    {
      title: t('sections.contact.title'),
      content: t('sections.contact.content'),
    },
  ];

  return (
    <LegalPage
      title={t('title')}
      sections={sections}
      effectiveDate="January 1, 2025"
      lastUpdated="January 1, 2025"
    />
  );
}
