'use client';

import Link from 'next/link';
import React from 'react';

type ProfessionalAuthLayoutProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  brandSection?: React.ReactNode;
};

export function ProfessionalAuthLayout({
  children,
  title,
  subtitle,
  brandSection
}: ProfessionalAuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left brand section - Lovstudio Design System */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:items-center relative overflow-hidden" style={{ backgroundColor: '#D97757' }}>
        {/* Background decorations - Warm terracotta tones */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #D97757 0%, #CC785C 50%, #B49FD8 100%)' }}></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl animate-pulse" style={{ backgroundColor: '#F0EEE6' }}></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-20 blur-2xl animate-pulse delay-1000" style={{ backgroundColor: '#E8E6DC' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: '#F9F9F7' }}></div>
        </div>

        {/* Brand content */}
        <div className="relative z-10 text-center px-8 max-w-md">
          {/* Logo area */}
          <Link href="/" className="block mb-8 cursor-pointer transition-transform hover:scale-105 no-underline">
            <div className="w-16 h-16 mx-auto mb-4 backdrop-blur-sm rounded-xl flex items-center justify-center border"
                 style={{
                   backgroundColor: 'rgba(249, 249, 247, 0.2)',
                   borderColor: 'rgba(249, 249, 247, 0.3)',
                   borderRadius: '0.75rem'
                 }}>
              <svg className="w-8 h-8" fill="#F9F9F7" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#F9F9F7', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
              Lovweb
            </h1>
            <p className="text-lg" style={{ color: 'rgba(249, 249, 247, 0.8)' }}>
              Production-ready SaaS Starter
            </p>
          </Link>

          {/* Value propositions */}
          <div className="space-y-4">
            <div className="flex items-center" style={{ color: 'rgba(249, 249, 247, 0.9)' }}>
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#F0EEE6' }}></div>
              <span>Next.js 15 + App Router</span>
            </div>
            <div className="flex items-center" style={{ color: 'rgba(249, 249, 247, 0.9)' }}>
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#E8E6DC' }}></div>
              <span>Supabase Auth + DrizzleORM</span>
            </div>
            <div className="flex items-center" style={{ color: 'rgba(249, 249, 247, 0.9)' }}>
              <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#B49FD8' }}></div>
              <span>Tailwind CSS v4 + shadcn/ui</span>
            </div>
          </div>

          {/* Custom brand section */}
          {brandSection && (
            <div className="mt-8">
              {brandSection}
            </div>
          )}
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Right form section - Lovstudio Design System */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
           style={{ backgroundColor: '#F9F9F7' }}>
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden block text-center mb-8 transition-transform hover:scale-105 no-underline">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
                 style={{ backgroundColor: '#D97757' }}>
              <svg className="w-6 h-6" fill="#F9F9F7" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold"
                style={{
                  color: '#181818',
                  fontFamily: 'ui-sans-serif, system-ui, sans-serif'
                }}>
              Lovweb
            </h1>
          </Link>

          {/* Title area */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-3xl font-bold mb-2"
                style={{
                  color: '#181818',
                  fontFamily: 'ui-sans-serif, system-ui, sans-serif'
                }}>
              {title}
            </h2>
            <p className="text-lg" style={{ color: '#87867F' }}>
              {subtitle}
            </p>
          </div>

          {/* Form content */}
          <div className="rounded-2xl shadow-xl border p-8"
               style={{
                 backgroundColor: '#F9F9F7',
                 borderColor: '#E8E6DC',
                 borderRadius: '1.5rem',
                 boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
               }}>
            {children}
          </div>

          {/* Footer info */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: '#87867F' }}>
              © 2025 Lovweb by Lovstudio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
