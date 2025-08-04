'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

export const FeatureComparison: React.FC = () => {
  const t = useTranslations('Pricing');

  const plans = [
    { key: 'free', name: t('plans.free.name') },
    { key: 'essentials', name: t('plans.essentials.name') },
    { key: 'team', name: t('plans.team.name') },
  ];

  const featureData = [
    {
      category: t('comparison_categories.content_creation'),
      features: [
        { key: 'projects', free: '3', essentials: 'Unlimited', team: 'Unlimited' },
        { key: 'ai_generations', free: '10/month', essentials: 'Unlimited', team: 'Unlimited' },
        { key: 'templates', free: 'Basic', essentials: 'Advanced', team: 'Advanced' },
      ],
    },
    {
      category: t('comparison_categories.ai_features'),
      features: [
        { key: 'seo_tools', free: false, essentials: true, team: true },
        { key: 'content_analytics', free: false, essentials: true, team: true },
        { key: 'export_formats', free: 'Basic', essentials: 'All formats', team: 'All formats' },
      ],
    },
    {
      category: t('comparison_categories.collaboration'),
      features: [
        { key: 'users', free: '1', essentials: '1', team: 'Unlimited' },
        { key: 'collaboration', free: false, essentials: false, team: true },
        { key: 'approval_workflows', free: false, essentials: false, team: true },
        { key: 'custom_branding', free: false, essentials: false, team: true },
      ],
    },
    {
      category: t('comparison_categories.integrations'),
      features: [
        { key: 'integrations', free: 'Basic', essentials: 'All', team: 'All' },
        { key: 'api_access', free: false, essentials: true, team: true },
      ],
    },
    {
      category: t('comparison_categories.support'),
      features: [
        { key: 'support', free: 'Community', essentials: 'Email', team: 'Priority' },
        { key: 'sso', free: false, essentials: false, team: 'Coming soon' },
      ],
    },
  ];

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value
        ? (
            <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )
        : (
            <span className="text-gray-300 text-center block">—</span>
          );
    }
    return <span className="text-center block text-sm">{value}</span>;
  };

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-text-main mb-4">
          {t('comparison_title')}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Recommendation Row */}
          <thead>
            <tr>
              <th className="text-left p-4 w-1/3"></th>
              {plans.map(plan => (
                <th
                  key={plan.key}
                  className={`text-center p-2 w-1/6 ${
                    plan.key === 'essentials' ? 'bg-primary/5' : ''
                  }`}
                >
                  {plan.key === 'essentials'
                    ? (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-white">
                          {t('recommended')}
                        </div>
                      )
                    : (
                        <div className="h-6"></div>
                      )}
                </th>
              ))}
            </tr>

            {/* Plan Names Row */}
            <tr className="border-b border-gray-200">
              <th className="text-left p-4 font-medium text-gray-700">Features</th>
              {plans.map(plan => (
                <th
                  key={plan.key}
                  className={`text-center p-4 font-semibold text-text-main w-1/6 ${
                    plan.key === 'essentials' ? 'bg-primary/5' : ''
                  }`}
                >
                  {plan.name}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {featureData.map((category, categoryIndex) => (
              <React.Fragment key={categoryIndex}>
                {/* Category Header */}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="p-4 font-semibold text-text-main border-b border-gray-200">
                    {category.category}
                  </td>
                </tr>

                {/* Features */}
                {category.features.map((feature, featureIndex) => (
                  <tr key={featureIndex} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-gray-700">
                      {t(`comparison_features.${feature.key}`)}
                    </td>
                    <td className="p-4 text-center">
                      {renderFeatureValue(feature.free)}
                    </td>
                    <td className="p-4 text-center">
                      {renderFeatureValue(feature.essentials)}
                    </td>
                    <td className="p-4 text-center">
                      {renderFeatureValue(feature.team)}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

FeatureComparison.displayName = 'FeatureComparison';
