# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Neurora - An AI-powered intelligent creation platform built with Next.js 15, TypeScript, and Supabase. Default locale is Chinese (zh).

## Development Commands

**IMPORTANT**: Local dev is already running. Only use these commands:
- `pnpm check:types` - Type checking
- `pnpm lint:fix` - Fix linting issues

Other available commands (DO NOT RUN unless explicitly requested):
- `pnpm test` - Run unit tests
- `pnpm test:e2e` - Run E2E tests  
- `pnpm db:studio` - Open Drizzle Studio
- `pnpm db:push` - Push database schema changes
- `pnpm db:generate` - Generate database migrations

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database**: Supabase (PostgreSQL) with DrizzleORM
- **Auth**: Supabase Auth + Clerk integration
- **State**: Zustand
- **i18n**: next-intl (zh/en locales)
- **Monitoring**: Sentry, PostHog, Better Stack

### Directory Structure
```
src/
├── app/[locale]/
│   ├── (marketing)/     # Public pages
│   └── (auth)/          # Auth pages & dashboard
├── components/
│   ├── ui/              # shadcn/ui components
│   └── layout/          # Layout components
├── libs/                # Core services
│   ├── Auth.ts          # Authentication service
│   ├── DB.ts            # Database & migrations
│   └── Supabase.ts      # Supabase client
└── utils/
    └── AppConfig.ts     # App configuration
```

### Database Schema
- `counterSchema` - Example counter table
- `userProfiles` - User profile data
- `userPreferences` - User settings
- `userSubscriptions` - Billing management

### Key Patterns
1. **Routing**: App Router with locale-based routing (`/[locale]/...`)
2. **Auth**: Middleware-based protection in `src/libs/SupabaseMiddleware.ts`
3. **Styling**: Global styles in `src/styles/global.css`, Lovpen design system
4. **Environment**: Validated with T3 Env in `src/libs/Env.ts`
5. **Forms**: React Hook Form + Zod validation

## Development Guidelines

### Component Development
- Use shadcn/ui components from `src/components/ui/`
- Follow existing patterns in `src/components/`
- Maintain TypeScript strict mode compliance

### Database Operations
- Use DrizzleORM for all database queries
- Migrations handled automatically via `src/libs/DB.ts`
- Row Level Security (RLS) policies enforced

### Internationalization
- Translation files in `src/locales/`
- Use `useTranslations` hook for UI text
- Default locale is 'zh' (Chinese)

### Testing
- Unit tests with Vitest
- E2E tests with Playwright
- Component development with Storybook

## Important Notes

- **Local Storage**: For app data storage, use path `~/.neurora/$APP_ID`
- **No hardcoding**: Avoid hardcoded values
- **Type Safety**: Maintain TypeScript strict mode
- **Chinese First**: UI defaults to Chinese locale