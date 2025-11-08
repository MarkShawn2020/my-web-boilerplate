import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { NeuroraIcon } from '../NeuroraIcon';
import { SocialIcon } from '../SocialIcons';
import { Container } from './Container';

const Footer = () => {
  const t = useTranslations('Footer');
  
  const footerLinks = [
    { name: t('links.company.about'), href: '/about' },
    { name: t('links.product.pricing'), href: '/pricing' },
    { name: t('links.product.api_docs'), href: '/docs/api' },
    { name: t('links.support.help_center'), href: '/help' },
    { name: t('links.company.blog'), href: '/blog' },
    { name: t('links.support.contact'), href: '#contact' },
  ];

  const legalLinks = [
    { name: t('links.legal.terms'), href: '/terms' },
    { name: t('links.legal.privacy'), href: '/privacy' },
  ];

  return (
    <footer className="w-full border-t border-border/50">
      <Container>
        <div className="py-12 lg:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-2 no-underline mb-4">
                <NeuroraIcon className="h-8 w-8" />
                <span className="text-xl font-semibold text-text-main">Neurora</span>
              </Link>
              <p className="text-sm text-text-faded mb-4">
                为创作者而生的 AI 智能创作平台
              </p>
              <div className="flex space-x-4">
                <SocialIcon href="https://github.com/neurora-ai" icon="github" />
                <SocialIcon href="https://twitter.com/neurora_ai" icon="twitter" />
                <SocialIcon href="https://weixin.qq.com/r/nHGkUFf" icon="wechat" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {footerLinks.map(link => (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    className="text-sm text-text-faded hover:text-text-main transition-colors no-underline"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-text-faded">
                © 2025 Neurora Technology. {t('rights_reserved')}
              </p>
              <div className="flex gap-6">
                {legalLinks.map(link => (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    className="text-sm text-text-faded hover:text-text-main transition-colors no-underline"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export { Footer };