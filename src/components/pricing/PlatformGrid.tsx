'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

export const PlatformGrid: React.FC = () => {
  const t = useTranslations('Pricing');

  const platforms = t.raw('supported_platforms') as Array<{
    name: string;
    description: string;
  }>;

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text-main mb-4">
          {t('features_title')}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('features_description')}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {platforms.map((platform, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-4">
              <span className="text-primary font-semibold text-lg">
                {platform.name.slice(0, 2)}
              </span>
            </div>
            <h3 className="font-semibold text-text-main text-center mb-1">
              {platform.name}
            </h3>
            <p className="text-sm text-gray-500 text-center">
              {platform.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

PlatformGrid.displayName = 'PlatformGrid';
