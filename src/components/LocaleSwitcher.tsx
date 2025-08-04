'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/libs/I18nNavigation';

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleLocaleChange = (newLocale: string) => {
    // Use next-intl's router which handles locale switching correctly
    router.push(pathname, { locale: newLocale });
  };

  // Clean, professional locale display
  const localeNames = {
    zh: '中',
    en: 'EN',
  } as const;

  const otherLocale = locale === 'zh' ? 'en' : 'zh';

  return (
    <div className="flex items-center text-sm">
      <span className="text-text-main font-medium">
        {localeNames[locale as keyof typeof localeNames]}
      </span>
      <span className="mx-2 text-text-faded">/</span>
      <button
        type="button"
        onClick={() => handleLocaleChange(otherLocale)}
        className="text-text-faded hover:text-text-main transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-1"
        aria-label={
          locale === 'zh'
            ? `Switch to English`
            : `切换到中文`
        }
        title={
          locale === 'zh'
            ? 'Switch to English'
            : '切换到中文'
        }
      >
        {localeNames[otherLocale as keyof typeof localeNames]}
      </button>
    </div>
  );
};
