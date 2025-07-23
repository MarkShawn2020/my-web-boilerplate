import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { LegalPage } from '@/components/legal/LegalPage';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'CookiePolicy' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function CookiesPage(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'CookiePolicy' });

  const sections = [
    {
      title: t('sections.what_are_cookies.title'),
      content: t('sections.what_are_cookies.content'),
    },
    {
      title: t('sections.types_of_cookies.title'),
      content: t('sections.types_of_cookies.content'),
    },
    {
      title: t('sections.third_party_cookies.title'),
      content: t('sections.third_party_cookies.content'),
    },
    {
      title: t('sections.cookie_consent.title'),
      content: t('sections.cookie_consent.content'),
    },
    {
      title: t('sections.control_cookies.title'),
      content: t('sections.control_cookies.content'),
    },
    {
      title: t('sections.updates.title'),
      content: t('sections.updates.content'),
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
