import type { LocalizationResource } from '@clerk/types';
import type { LocalePrefixMode } from 'next-intl/routing';
import { enUS, zhCN } from '@clerk/localizations';

const localePrefix: LocalePrefixMode = 'as-needed';

// Helper function to detect user's preferred language
export const detectUserLocale = (acceptLanguage?: string | null): string => {
  if (!acceptLanguage) {
    return 'en';
  }

  // Parse Accept-Language header and check for Chinese variants
  const languages = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase());

  // Check for any Chinese variant (zh, zh-CN, zh-Hans, zh-TW, zh-Hant, etc.)
  const hasChineseVariant = languages.some(lang =>
    lang.startsWith('zh') || lang.includes('chinese'),
  );

  return hasChineseVariant ? 'zh' : 'en';
};

export const AppConfig = {
  name: 'Neurora',
  locales: ['zh', 'en'],
  defaultLocale: 'zh', // Default to Chinese for Neurora's primary audience
  localePrefix,
};

const supportedLocales: Record<string, LocalizationResource> = {
  zh: zhCN,
  en: enUS,
};

export const ClerkLocalizations = {
  defaultLocale: zhCN,
  supportedLocales,
};
