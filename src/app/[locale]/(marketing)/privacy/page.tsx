import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';
import { LegalPage } from '@/components/legal/LegalPage';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicy' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function PrivacyPage(props: Props) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'PrivacyPolicy' });

  const sections = [
    {
      title: t('sections.introduction.title'),
      content: t('sections.introduction.content'),
    },
    {
      title: t('sections.information_collected.title'),
      content: t('sections.information_collected.content'),
    },
    {
      title: t('sections.how_we_use.title'),
      content: t('sections.how_we_use.content'),
    },
    {
      title: t('sections.information_sharing.title'),
      content: t('sections.information_sharing.content'),
    },
    {
      title: t('sections.data_retention.title'),
      content: t('sections.data_retention.content'),
    },
    {
      title: t('sections.security.title'),
      content: t('sections.security.content'),
    },
    {
      title: t('sections.ai_processing.title'),
      content: t('sections.ai_processing.content'),
    },
    {
      title: t('sections.third_party.title'),
      content: t('sections.third_party.content'),
    },
    {
      title: t('sections.your_rights.title'),
      content: t('sections.your_rights.content'),
    },
    {
      title: t('sections.international_transfers.title'),
      content: t('sections.international_transfers.content'),
    },
    {
      title: t('sections.changes.title'),
      content: t('sections.changes.content'),
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
