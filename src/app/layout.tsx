import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Fira_Code, Inter } from 'next/font/google';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
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

export const metadata: Metadata = {
  title: {
    default: 'PodFast - 快速转录管理平台',
    template: '%s | PodFast',
  },
  description: '将音频、视频和文档快速转换为结构化的文字记录，支持智能编辑和导出',
  keywords: ['转录', '语音转文字', '文档处理', 'AI转录', 'PodFast'],
  authors: [{ name: 'PodFast' }],
  creator: 'PodFast',
  publisher: 'PodFast',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    title: 'PodFast - 快速转录管理平台',
    description: '将音频、视频和文档快速转换为结构化的文字记录',
    siteName: 'PodFast',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get default Chinese messages for the root path
  const messages = (await import('@/locales/zh.json')).default;

  return (
    <html lang="zh" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale="zh" messages={messages}>
          <PostHogProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
