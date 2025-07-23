'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export const DemoBanner = () => {
  const t = useTranslations('DemoBanner');

  return (
    <div className="sticky top-0 z-50 bg-background-dark p-4 text-center text-base font-medium text-white border-b border-border-default/20">
      <div className="flex items-center justify-center gap-2 text-sm">
        <span>🚀</span>
        <span>{t('demo_text')}</span>
        <span>-</span>
        <Link
          href="/sign-up"
          className="text-primary hover:opacity-80 transition-opacity underline underline-offset-2 font-semibold"
        >
          {t('try_auth')}
        </Link>
      </div>
    </div>
  );
};
