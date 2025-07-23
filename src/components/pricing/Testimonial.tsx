'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

export const Testimonial: React.FC = () => {
  const t = useTranslations('Pricing');

  return (
    <div className="py-16 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <blockquote className="text-xl lg:text-2xl font-medium text-white mb-8">
          "
          {t('testimonial.quote')}
          "
        </blockquote>

        <div className="flex items-center justify-center space-x-4">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {t('testimonial.author').charAt(0)}
            </span>
          </div>
          <div className="text-left">
            <div className="text-white font-semibold">
              {t('testimonial.author')}
            </div>
            <div className="text-gray-300 text-sm">
              {t('testimonial.company')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Testimonial.displayName = 'Testimonial';
