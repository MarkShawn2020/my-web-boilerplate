import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Fira_Code, Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { routing } from '@/libs/I18nRouting';
import { AuthProvider } from '@/providers/AuthProvider';
import '@/styles/global.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Base metadata configuration - specific metadata will be generated per locale
export const generateMetadata = async (props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await props.params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lovweb.ai';

  // Locale-specific metadata
  const metadataByLocale = {
    zh: {
      title: {
        default: 'Lovweb - 为创作者而生的 AI 智能创作平台',
        template: '%s | Lovweb',
      },
      description: 'Lovweb，为创作者而生。专为知识博主和内容创作者打造的 AI 智能创作平台，让一部分人先机械飞升，最大化思想者的价值。',
      keywords: ['AI创作', '内容创作', '知识博主', '创作平台', '机械飞升', 'Lovweb'],
      ogLocale: 'zh_CN',
      ogTitle: 'Lovweb - 为创作者而生的 AI 智能创作平台',
      ogDescription: 'Lovweb，为创作者而生。专为知识博主和内容创作者打造的 AI 智能创作平台，让一部分人先机械飞升，最大化思想者的价值。',
      twitterTitle: 'Lovweb - 为创作者而生的 AI 智能创作平台',
      twitterDescription: 'Lovweb，为创作者而生。专为知识博主和内容创作者打造的 AI 智能创作平台。',
      ogImageAlt: 'Lovweb - 为创作者而生',
    },
    en: {
      title: {
        default: 'Lovweb - AI Creation Platform for Content Creators',
        template: '%s | Lovweb',
      },
      description: 'Lovweb is built for creators. An AI-powered intelligent creation platform designed specifically for knowledge bloggers and content creators.',
      keywords: ['AI creation', 'content creation', 'knowledge blogger', 'creation platform', 'AI platform', 'Lovweb'],
      ogLocale: 'en_US',
      ogTitle: 'Lovweb - AI Creation Platform for Content Creators',
      ogDescription: 'Lovweb is built for creators. An AI-powered intelligent creation platform designed specifically for knowledge bloggers and content creators.',
      twitterTitle: 'Lovweb - AI Creation Platform for Content Creators',
      twitterDescription: 'Lovweb is built for creators. AI-powered creation platform for content creators.',
      ogImageAlt: 'Lovweb - Built for creators',
    },
  };

  const currentMetadata = metadataByLocale[locale as keyof typeof metadataByLocale] || metadataByLocale.en;

  return {
    title: currentMetadata.title,
    description: currentMetadata.description,
    keywords: currentMetadata.keywords,
    authors: [{ name: 'Lovweb Technology' }],
    creator: 'Lovweb Technology',
    publisher: 'Lovweb Technology',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'zh-CN': `${baseUrl}/zh`,
        'en-US': `${baseUrl}/en`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: currentMetadata.ogLocale,
      alternateLocale: locale === 'zh' ? 'en_US' : 'zh_CN',
      url: `/${locale}`,
      title: currentMetadata.ogTitle,
      description: currentMetadata.ogDescription,
      siteName: 'Lovweb',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: currentMetadata.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@lovweb_ai',
      creator: '@lovweb_ai',
      title: currentMetadata.twitterTitle,
      description: currentMetadata.twitterDescription,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        'index': true,
        'follow': true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_SITE_VERIFICATION,
    },
    icons: [
      {
        rel: 'apple-touch-icon',
        url: '/apple-touch-icon.png',
        sizes: '180x180',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        url: '/favicon.ico',
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        url: '/favicon.svg',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/icon-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/icon-512x512.png',
      },
    ],
    manifest: '/manifest.json',
  };
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${inter.variable} ${firaCode.variable}`}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider>
          <PostHogProvider>
            <ToastProvider>
              <AuthProvider>
                {props.children}
              </AuthProvider>
            </ToastProvider>
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
