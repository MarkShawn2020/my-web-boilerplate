'use client';

import { useTranslations } from 'next-intl';
import React from 'react';
import { Container } from '../layout/Container';

type LegalPageProps = {
  title: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  effectiveDate?: string;
  lastUpdated?: string;
};

export const LegalPage: React.FC<LegalPageProps> = ({
  title,
  sections,
  effectiveDate,
  lastUpdated,
}) => {
  const t = useTranslations('Legal');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <div className="mx-auto max-w-4xl py-12 lg:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-text-main mb-6">{title}</h1>

          {/* Date Information */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 text-sm text-gray-600">
            {effectiveDate && (
              <div>
                <span className="font-medium">
                  {t('effective_date')}
                  :
                </span>
                {' '}
                {effectiveDate}
              </div>
            )}
            {lastUpdated && (
              <div>
                <span className="font-medium">
                  {t('last_updated')}
                  :
                </span>
                {' '}
                {lastUpdated}
              </div>
            )}
          </div>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 p-6 bg-gray-50 rounded-lg border">
          <h2 className="text-lg font-semibold text-text-main mb-4">
            {t('table_of_contents')}
          </h2>
          <nav className="space-y-2">
            {sections.map((section, index) => (
              <a
                key={index}
                href={`#section-${index}`}
                className="block text-primary hover:text-primary/80 transition-colors text-sm"
              >
                {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="prose prose-lg max-w-none">
          {sections.map((section, index) => (
            <div key={index} id={`section-${index}`} className="mb-12">
              <h2 className="text-2xl font-semibold text-text-main mb-4 scroll-mt-6">
                {section.title}
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Back to Top Button */}
        <div className="mt-12 text-center">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
            {t('back_to_top')}
          </button>
        </div>

        {/* Contact Section */}
        <div className="mt-16 p-6 bg-gray-50 rounded-lg border text-center">
          <h3 className="text-lg font-semibold text-text-main mb-2">
            {t('contact_us')}
          </h3>
          <p className="text-gray-600 text-sm">
            If you have any questions about this policy, please contact us at
            {' '}
            <a
              href="mailto:mark@cs-magic.com"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              mark@cs-magic.com
            </a>
          </p>
        </div>
      </div>
    </Container>
  );
};

LegalPage.displayName = 'LegalPage';
